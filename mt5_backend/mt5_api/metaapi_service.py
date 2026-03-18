"""
MetaAPI Cloud Service Layer
Replaces local MetaTrader5 library with MetaAPI.cloud REST API.
Supports multi-user accounts — each user provisions their own MT5 account.
"""
import asyncio
import json
import os
import threading
import time
from django.conf import settings

# ─── MetaAPI SDK ───
from metaapi_cloud_sdk import MetaApi

# ─── File paths ───
_DIR = os.path.dirname(__file__)
ACCOUNTS_FILE = os.path.join(_DIR, 'metaapi_accounts.json')

# ─── In-memory state ───
_accounts = {}   # login_key → { metaapi_account_id, login, server, name }
_symbol_cache = {}  # "account_id:BTCUSD" → "BTCUSD.raw" (resolved broker name)
_api = None
_lock = threading.Lock()


# ═══════════ Event Loop Management ═══════════
# MetaAPI SDK is async, so we need a dedicated event loop for sync Django views

_loop = None
_loop_thread = None


def _get_loop():
    """Get or create a dedicated event loop for async MetaAPI calls."""
    global _loop, _loop_thread
    if _loop is not None and _loop.is_running():
        return _loop

    _loop = asyncio.new_event_loop()

    def _run():
        asyncio.set_event_loop(_loop)
        _loop.run_forever()

    _loop_thread = threading.Thread(target=_run, daemon=True, name="MetaApiLoop")
    _loop_thread.start()
    return _loop


def _run_async(coro):
    """Run an async coroutine from synchronous code and return the result."""
    loop = _get_loop()
    future = asyncio.run_coroutine_threadsafe(coro, loop)
    return future.result(timeout=60)


# ═══════════ Initialization ═══════════

def _get_api():
    """Get or create the MetaApi instance."""
    global _api
    if _api is not None:
        return _api

    token = settings.METAAPI_TOKEN
    if not token:
        raise ValueError("METAAPI_TOKEN not set in environment. Get it from https://app.metaapi.cloud/token")

    _api = MetaApi(token=token)
    return _api


# ═══════════ Account Persistence ═══════════

def _load_accounts():
    global _accounts
    try:
        if os.path.isfile(ACCOUNTS_FILE):
            with open(ACCOUNTS_FILE, 'r') as f:
                _accounts = json.load(f)
            print(f"[MetaAPI] Loaded {len(_accounts)} provisioned accounts")
    except Exception as e:
        print(f"[MetaAPI] Error loading accounts: {e}")
        _accounts = {}


def _save_accounts():
    try:
        with open(ACCOUNTS_FILE, 'w') as f:
            json.dump(_accounts, f, indent=2)
    except Exception as e:
        print(f"[MetaAPI] Error saving accounts: {e}")


# Load on module import
_load_accounts()


# ═══════════ Account Provisioning ═══════════

def _account_key(login, server):
    """Create a unique key for an account."""
    return f"{login}@{server}"


async def _provision_account_async(login, password, server, name="PhaseX User"):
    """Provision a MetaTrader account on MetaAPI cloud."""
    api = _get_api()

    key = _account_key(login, server)

    # Check if already provisioned
    if key in _accounts:
        account_id = _accounts[key]['metaapi_account_id']
        try:
            account = await api.metatrader_account_api.get_account(account_id)
            if account:
                # Ensure deployed
                if account.state != 'DEPLOYED':
                    await account.deploy()
                    await account.wait_deployed()
                return {
                    'success': True,
                    'account_id': account_id,
                    'message': 'Account already provisioned',
                    'state': account.state,
                }
        except Exception:
            # Account may have been deleted, re-provision
            pass

    # Create new account on MetaAPI
    account = await api.metatrader_account_api.create_account({
        'name': name,
        'type': 'cloud',
        'login': str(login),
        'password': password,
        'server': server,
        'platform': 'mt5',
        'magic': 0,
    })

    # Deploy and wait
    await account.deploy()
    await account.wait_deployed()

    # Save
    with _lock:
        _accounts[key] = {
            'metaapi_account_id': account.id,
            'login': str(login),
            'server': server,
            'name': name,
        }
        _save_accounts()

    print(f"[MetaAPI] ✓ Provisioned account {login}@{server} → {account.id}")

    return {
        'success': True,
        'account_id': account.id,
        'message': 'Account provisioned successfully',
        'state': account.state,
    }


def provision_account(login, password, server, name="PhaseX User"):
    """Synchronous wrapper for provisioning."""
    return _run_async(_provision_account_async(login, password, server, name))


# ═══════════ Connection Management ═══════════

_connections = {}
_connection_accounts = {}  # account_id → account object (for reconnect)

async def _get_connection_async(account_id, force_new=False):
    """Get or create an RPC connection for an account. Reuses cached connections for speed."""
    global _connections, _connection_accounts

    # Return cached connection immediately (no health check = fast)
    if not force_new and account_id in _connections:
        return _connections[account_id]

    # Create or re-create connection
    api = _get_api()
    account = await api.metatrader_account_api.get_account(account_id)

    if account.state != 'DEPLOYED':
        await account.deploy()
        await account.wait_deployed()

    connection = account.get_rpc_connection()
    await connection.connect()
    await connection.wait_synchronized()

    _connections[account_id] = connection
    _connection_accounts[account_id] = account
    print(f"[MetaAPI] ✓ Connection established for {account_id}")
    return connection


async def _safe_call(account_id, async_fn):
    """Call async_fn(connection). If it fails, reconnect and retry once."""
    connection = await _get_connection_async(account_id)
    try:
        return await async_fn(connection)
    except Exception as e:
        print(f"[MetaAPI] Call failed, reconnecting... ({e})")
        connection = await _get_connection_async(account_id, force_new=True)
        return await async_fn(connection)


# ═══════════ Account Info ═══════════

async def _get_account_info_async(account_id):
    connection = await _get_connection_async(account_id)
    info = await connection.get_account_information()
    return info


def get_account_info(account_id):
    """Get account balance, equity, margin, etc."""
    try:
        info = _run_async(_get_account_info_async(account_id))
        balance = info.get('balance', 0)
        equity = info.get('equity', 0)
        profit = info.get('profit', equity - balance)
        
        return {
            'balance': balance,
            'equity': equity,
            'margin': info.get('margin', 0),
            'free_margin': info.get('freeMargin', 0),
            'profit': profit,
            'leverage': info.get('leverage', 0),
            'currency': info.get('currency', 'USD'),
            'name': info.get('name', ''),
            'login': info.get('login', ''),
            'server': info.get('server', ''),
        }, None
    except Exception as e:
        return None, str(e)



# ═══════════ Positions ═══════════

async def _get_positions_async(account_id):
    connection = await _get_connection_async(account_id)
    positions = await connection.get_positions()
    return positions or []


def get_positions(account_id):
    """Get open positions for an account."""
    try:
        positions = _run_async(_get_positions_async(account_id))
        result = []
        for pos in positions:
            result.append({
                'ticket': pos.get('id', ''),
                'symbol': pos.get('symbol', ''),
                'type': 'BUY' if pos.get('type') == 'POSITION_TYPE_BUY' else 'SELL',
                'volume': pos.get('volume', 0),
                'open_price': pos.get('openPrice', 0),
                'current_price': pos.get('currentPrice', 0),
                'sl': pos.get('stopLoss', 0),
                'tp': pos.get('takeProfit', 0),
                'profit': pos.get('profit', 0),
                'swap': pos.get('swap', 0),
                'time_open': pos.get('time', ''),
                'magic': pos.get('magic', 0),
                'comment': pos.get('comment', ''),
            })
        return result, None
    except Exception as e:
        return None, str(e)


# ═══════════ Trade Execution ═══════════

async def _place_order_async(account_id, symbol, action, volume, sl=None, tp=None, comment=''):
    connection = await _get_connection_async(account_id)

    options = {}
    if comment:
        options['comment'] = comment

    # ── Symbol Resolution with Cache ──
    cache_key = f"{account_id}:{symbol}"
    resolved_symbol = _symbol_cache.get(cache_key)

    if not resolved_symbol:
        suffixes_to_try = ['', '.raw', 'm', '.p', '.sd', '.lv', 'micro', '.', '_']
        for suffix in suffixes_to_try:
            candidate = f"{symbol}{suffix}" if suffix else symbol
            try:
                spec = await connection.get_symbol_specification(candidate)
                if spec:
                    resolved_symbol = candidate
                    _symbol_cache[cache_key] = resolved_symbol
                    if suffix:
                        print(f"[MetaAPI] Symbol resolved & cached: {symbol} → {resolved_symbol}")
                    break
            except Exception:
                continue

        if not resolved_symbol:
            raise ValueError(f"Invalid symbol '{symbol}'. Could not find it on this broker.")

    # Get spec for min volume (use cached symbol)
    spec = await connection.get_symbol_specification(resolved_symbol)
    min_vol = spec.get('minVolume', 0.01)
    clean_volume = round(float(volume), 2)
    if clean_volume < min_vol:
        clean_volume = min_vol

    if action.upper() == 'BUY':
        result = await connection.create_market_buy_order(
            symbol=resolved_symbol,
            volume=clean_volume,
            stop_loss=sl if sl else None,
            take_profit=tp if tp else None,
            options=options if options else None,
        )
    elif action.upper() == 'SELL':
        result = await connection.create_market_sell_order(
            symbol=resolved_symbol,
            volume=clean_volume,
            stop_loss=sl if sl else None,
            take_profit=tp if tp else None,
            options=options if options else None,
        )
    else:
        raise ValueError(f"Invalid action: {action}")

    return result


def place_order(account_id, symbol, action, volume, sl=None, tp=None, comment=''):
    """Execute a market order. Returns (result_dict, error_string)."""
    try:
        result = _run_async(_place_order_async(account_id, symbol, action, volume, sl, tp, comment))

        if result and result.get('stringCode') == 'TRADE_RETCODE_DONE':
            return {
                'ticket': result.get('orderId', ''),
                'price': result.get('openPrice', 0) or result.get('price', 0),
                'volume': volume,
                'symbol': symbol,
                'action': action,
            }, None
        else:
            code = result.get('stringCode', 'UNKNOWN') if result else 'UNKNOWN'
            msg = result.get('message', '') if result else ''
            return None, f"Order rejected: {code} - {msg}"

    except Exception as e:
        return None, str(e)


# ═══════════ Close Position ═══════════

async def _close_position_async(account_id, position_id):
    connection = await _get_connection_async(account_id)

    result = await connection.close_position(position_id=str(position_id))
    return result


def close_position(account_id, position_id):
    """Close an open position. Returns (success_bool, error_string)."""
    try:
        result = _run_async(_close_position_async(account_id, position_id))
        if result and result.get('stringCode') == 'TRADE_RETCODE_DONE':
            return True, None
        else:
            code = result.get('stringCode', 'UNKNOWN') if result else 'UNKNOWN'
            return False, f"Close rejected: {code}"
    except Exception as e:
        return False, str(e)


# ═══════════ Symbol Price ═══════════

async def _get_symbol_price_async(account_id, symbol):
    connection = await _get_connection_async(account_id)

    price = await connection.get_symbol_price(symbol=symbol)
    return price


def get_symbol_price(account_id, symbol):
    """Get current bid/ask for a symbol."""
    try:
        price = _run_async(_get_symbol_price_async(account_id, symbol))
        if price:
            return {
                'bid': price.get('bid', 0),
                'ask': price.get('ask', 0),
                'mid': (price.get('bid', 0) + price.get('ask', 0)) / 2,
            }, None
        return None, "No price data"
    except Exception as e:
        return None, str(e)


# ═══════════ Symbols List ═══════════

async def _get_symbols_async(account_id):
    connection = await _get_connection_async(account_id)

    symbols = await connection.get_symbols()
    return symbols or []


def get_symbols(account_id):
    """Get list of available symbols."""
    try:
        symbols = _run_async(_get_symbols_async(account_id))
        return symbols, None
    except Exception as e:
        return None, str(e)


# ═══════════ History (Deals) ═══════════

async def _get_deals_async(account_id, days=7):
    from datetime import datetime, timedelta
    connection = await _get_connection_async(account_id)

    start = datetime.utcnow() - timedelta(days=days)
    end = datetime.utcnow()
    deals_data = await connection.get_deals_by_time_range(start_time=start, end_time=end)
    return deals_data.get('deals', []) if deals_data else []


def get_deals(account_id, days=7):
    """Get trade history (deals) for the last N days."""
    try:
        deals = _run_async(_get_deals_async(account_id, days))
        result = []
        for deal in deals:
            result.append({
                'ticket': deal.get('id', ''),
                'order': deal.get('orderId', ''),
                'time': deal.get('time', ''),
                'type': deal.get('type', ''),
                'entry': deal.get('entryType', ''),
                'symbol': deal.get('symbol', ''),
                'volume': deal.get('volume', 0),
                'price': deal.get('price', 0),
                'profit': deal.get('profit', 0),
                'swap': deal.get('swap', 0),
                'commission': deal.get('commission', 0),
                'comment': deal.get('comment', ''),
            })
        return result, None
    except Exception as e:
        return None, str(e)


# ═══════════ Lookup Helpers ═══════════

def get_account_id_by_login(login, server):
    """Look up the MetaAPI account_id for a given login/server pair."""
    key = _account_key(login, server)
    entry = _accounts.get(key)
    if entry:
        return entry.get('metaapi_account_id')
    return None


def get_all_accounts():
    """Return all provisioned accounts."""
    with _lock:
        return dict(_accounts)
