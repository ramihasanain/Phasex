"""
Auto-Trader Background Worker
Runs as a daemon thread inside the Django process.
Monitors signal conditions and executes trades automatically via MetaAPI.cloud.
"""
import threading
import time
import json
import os
import requests
from datetime import datetime

from . import metaapi_service

# ─── File paths ───
_DIR = os.path.dirname(__file__)
AUTO_TRADES_FILE = os.path.join(_DIR, 'auto_trades.json')
TRADE_HISTORY_FILE = os.path.join(_DIR, 'trade_history.json')

# ─── Signal API ───
SIGNAL_API_URL = "https://phase-x-qc8dy.ondigitalocean.app/api/v1/structural-dynamics/fast"

# ─── In-memory state ───
_auto_trades = {}      # key → config dict (includes account_id)
_trade_history = []    # list of history entries
_lock = threading.Lock()
_worker_thread = None
_worker_running = False


# ═══════════ Persistence ═══════════

def _load_auto_trades():
    global _auto_trades
    try:
        if os.path.isfile(AUTO_TRADES_FILE):
            with open(AUTO_TRADES_FILE, 'r') as f:
                _auto_trades = json.load(f)
            print(f"[AutoTrader] Loaded {len(_auto_trades)} auto-trade configs")
    except Exception as e:
        print(f"[AutoTrader] Error loading auto_trades: {e}")
        _auto_trades = {}


def _save_auto_trades():
    try:
        with open(AUTO_TRADES_FILE, 'w') as f:
            json.dump(_auto_trades, f, indent=2)
    except Exception as e:
        print(f"[AutoTrader] Error saving auto_trades: {e}")


def _load_trade_history():
    global _trade_history
    try:
        if os.path.isfile(TRADE_HISTORY_FILE):
            with open(TRADE_HISTORY_FILE, 'r') as f:
                _trade_history = json.load(f)
            print(f"[AutoTrader] Loaded {len(_trade_history)} history entries")
    except Exception as e:
        print(f"[AutoTrader] Error loading trade_history: {e}")
        _trade_history = []


def _save_trade_history():
    try:
        with open(TRADE_HISTORY_FILE, 'w') as f:
            json.dump(_trade_history[:500], f, indent=2)
    except Exception as e:
        print(f"[AutoTrader] Error saving trade_history: {e}")


# ═══════════ Public API (called by views) ═══════════

def get_auto_trades():
    with _lock:
        return dict(_auto_trades)


def set_auto_trade(key, config):
    """Add or update an auto-trade config.
    key: "SYMBOL-TF" e.g. "ADAUSD-5M"
    config: { symbol, tf, lot, direction, signal_price, sl, tp, account_id }
    """
    with _lock:
        config['created_at'] = config.get('created_at', datetime.utcnow().isoformat())
        config['status'] = 'waiting'
        _auto_trades[key] = config
        _save_auto_trades()
    print(f"[AutoTrader] Added/updated auto-trade: {key}")
    return True


def remove_auto_trade(key):
    with _lock:
        if key in _auto_trades:
            del _auto_trades[key]
            _save_auto_trades()
            print(f"[AutoTrader] Removed auto-trade: {key}")
            return True
    return False


def get_trade_history():
    with _lock:
        return list(_trade_history)


def add_trade_history(entry):
    with _lock:
        _trade_history.insert(0, entry)
        _save_trade_history()


def clear_trade_history():
    with _lock:
        _trade_history.clear()
        _save_trade_history()


# ═══════════ Signal Fetching ═══════════

def _normalize_tf(tf_str):
    if not tf_str: return ""
    t = str(tf_str).upper()
    if t.startswith('M') and len(t) > 1 and t[1].isdigit():
        return t[1:] + 'M'
    if t.startswith('H') and len(t) > 1 and t[1].isdigit():
        return t[1:] + 'H'
    return t

def _fetch_signals():
    try:
        resp = requests.get(SIGNAL_API_URL, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            signals = []
            files = data.get('files', [])
            for f in files:
                if f.get('name') == 'envelop_state':
                    payload = f.get('payload', {})
                    if not isinstance(payload, dict): continue
                    for key, tfs in payload.items():
                        if key == 'exported_at': continue
                        parts = key.split(" - ")
                        symbol = parts[0].strip()
                        if not isinstance(tfs, dict): continue
                        for tf_key, entry in tfs.items():
                            if not isinstance(entry, dict): continue
                            
                            display_tf = entry.get('tf_candle')
                            if not display_tf:
                                display_tf = tf_key.split("_")[-1].upper() if "_" in tf_key else tf_key
                            
                            signals.append({
                                'symbol': symbol,
                                'tf': _normalize_tf(display_tf),
                                'action': entry.get('net_signal', ''),
                                'entry': entry.get('close', 0),
                                'sl': entry.get('stop_loss'),
                                'tp': entry.get('take_profit')
                            })
            return signals
    except Exception as e:
        print(f"[AutoTrader] Signal fetch error: {e}")
    return None


# ═══════════ Price via MetaAPI ═══════════

def _get_price(account_id, symbol):
    """Get current mid price from MetaAPI for a symbol."""
    if not account_id:
        return None
    try:
        price_data, err = metaapi_service.get_symbol_price(account_id, symbol)
        if price_data:
            return price_data.get('mid', 0)
    except Exception as e:
        print(f"[AutoTrader] Price fetch error for {symbol}: {e}")
    return None


# ═══════════ Position Close Monitoring ═══════════

_prev_positions_by_account = {}  # account_id → list of positions

def _monitor_position_closes():
    """Check if any tracked positions have closed, update history."""
    global _prev_positions_by_account

    # Get all unique account_ids from auto_trades and trade_history
    account_ids = set()
    with _lock:
        for config in _auto_trades.values():
            aid = config.get('account_id', '')
            if aid:
                account_ids.add(aid)
        for entry in _trade_history[:50]:  # Check recent history
            aid = entry.get('account_id', '')
            if aid:
                account_ids.add(aid)

    for account_id in account_ids:
        try:
            current_positions, err = metaapi_service.get_positions(account_id)
            if err or current_positions is None:
                continue

            current_tickets = {str(p.get('ticket', '')) for p in current_positions}
            prev_positions = _prev_positions_by_account.get(account_id, [])
            prev_tickets = {str(p.get('ticket', '')) for p in prev_positions}

            closed_tickets = prev_tickets - current_tickets

            if closed_tickets:
                with _lock:
                    for prev_pos in prev_positions:
                        if str(prev_pos.get('ticket', '')) not in closed_tickets:
                            continue

                        ticket = prev_pos.get('ticket', '')
                        # Find matching history entry
                        for entry in _trade_history:
                            if str(entry.get('ticket', '')) == str(ticket) and entry.get('status') == 'filled':
                                entry['status'] = 'closed'
                                entry['profit'] = prev_pos.get('profit', 0)
                                entry['closePrice'] = prev_pos.get('current_price', 0)
                                entry['closedAt'] = datetime.utcnow().isoformat()
                                entry['signalFulfilled'] = prev_pos.get('profit', 0) > 0
                                print(f"[AutoTrader] Position {ticket} closed: profit={prev_pos.get('profit')}")
                                break
                        else:
                            # Not in history — add new entry
                            _trade_history.insert(0, {
                                'id': f"close-{int(time.time())}-{ticket}",
                                'symbol': prev_pos.get('symbol', ''),
                                'tf': '-',
                                'action': prev_pos.get('type', 'Buy'),
                                'volume': prev_pos.get('volume', 0),
                                'entryPrice': prev_pos.get('open_price', 0),
                                'sl': prev_pos.get('sl') if prev_pos.get('sl') else None,
                                'tp': prev_pos.get('tp') if prev_pos.get('tp') else None,
                                'ticket': ticket,
                                'status': 'closed',
                                'executedAt': datetime.utcnow().isoformat(),
                                'signalPrice': prev_pos.get('open_price', 0),
                                'profit': prev_pos.get('profit', 0),
                                'closePrice': prev_pos.get('current_price', 0),
                                'closedAt': datetime.utcnow().isoformat(),
                                'signalFulfilled': prev_pos.get('profit', 0) > 0,
                                'account_id': account_id,
                            })

                    _save_trade_history()

            _prev_positions_by_account[account_id] = current_positions

        except Exception as e:
            print(f"[AutoTrader] Position monitor error for {account_id}: {e}")


# ═══════════ Combined Worker ═══════════

def _combined_worker():
    """Runs both auto-trade checking and position monitoring."""
    global _worker_running
    _worker_running = True
    print("[AutoTrader] Combined worker started (MetaAPI mode)")

    cached_signals = None
    last_signal_fetch = 0
    SIGNAL_CACHE_TTL = 30

    while _worker_running:
        try:
            time.sleep(5)

            # 1. Monitor position closes
            _monitor_position_closes()

            # 2. Check auto-trades
            with _lock:
                active_trades = dict(_auto_trades)

            if not active_trades:
                continue

            now = time.time()
            if now - last_signal_fetch > SIGNAL_CACHE_TTL:
                new_signals = _fetch_signals()
                if new_signals:
                    cached_signals = new_signals
                    last_signal_fetch = now

            for key, config in active_trades.items():
                symbol = config.get('symbol', '')
                tf = config.get('tf', '1H')
                account_id = config.get('account_id', '')

                if not symbol or not account_id:
                    continue

                # The symbol in config may be mapped (.raw), but signal JSON uses the base name (e.g. AUDCAD)
                base_symbol = key.split('-')[0]

                # SYNC WITH LIVE SIGNAL
                latest_signal = None
                if cached_signals and isinstance(cached_signals, list):
                    for sig in cached_signals:
                        if sig.get('symbol') == base_symbol and _normalize_tf(sig.get('tf')) == _normalize_tf(tf):
                            latest_signal = sig
                            break

                if latest_signal:
                    sig_id = f"{latest_signal.get('action')}_{latest_signal.get('entry')}"
                    if config.get('last_signal_id') != sig_id:
                        # Signal has changed, update config and reset status
                        with _lock:
                            if key in _auto_trades:
                                _auto_trades[key]['status'] = 'pending'
                                _auto_trades[key]['direction'] = latest_signal.get('action')
                                _auto_trades[key]['signal_price'] = latest_signal.get('entry')
                                _auto_trades[key]['sl'] = latest_signal.get('sl')
                                _auto_trades[key]['tp'] = latest_signal.get('tp')
                                _auto_trades[key]['last_signal_id'] = sig_id
                                _save_auto_trades()
                        # Update local config reference for next steps
                        config = _auto_trades.get(key, config)

                if config.get('status') == 'executed':
                    continue

                direction = config.get('direction', '')
                signal_price = config.get('signal_price', 0)
                lot = config.get('lot', 0.01)

                if not direction:
                    continue

                # DUPLICATE & REVERSAL CHECK
                current_positions, err = metaapi_service.get_positions(account_id)
                has_duplicate = False
                opposite_tickets = []

                if not err and current_positions is not None:
                    expected_comment = f"Auto {tf}"
                    for pos in current_positions:
                        if pos['symbol'] == symbol and expected_comment in pos.get('comment', ''):
                            if pos['type'].upper() == direction.upper():
                                has_duplicate = True
                            else:
                                opposite_tickets.append(pos['ticket'])

                if opposite_tickets:
                    for tkt in opposite_tickets:
                        print(f"[AutoTrader] Signal reversed for {symbol}. Closing opposite position {tkt}")
                        metaapi_service.close_position(account_id, tkt)

                if has_duplicate:
                    if config.get('status') != 'executed':
                        with _lock:
                            if key in _auto_trades:
                                _auto_trades[key]['status'] = 'executed'
                                _save_auto_trades()
                    continue

                # Get live price via MetaAPI
                current_price = _get_price(account_id, symbol)
                if current_price is None:
                    continue

                # User requested IMMEDIATE Execution when Auto is clicked or signal reverses.
                # Do not wait for current price to cross signal price. Execute at market now.
                condition_met = True

                if condition_met:
                    print(f"[AutoTrader] ✓ Executing at market: {key} {direction} @ {current_price} (target: {signal_price})")

                    result, err = metaapi_service.place_order(
                        account_id=account_id,
                        symbol=symbol,
                        action=direction.upper(),
                        volume=lot,
                        sl=config.get('sl'),
                        tp=config.get('tp'),
                        comment=f"PhaseX Auto {tf}",
                    )

                    history_entry = {
                        'id': f"auto-{int(time.time())}-{key}",
                        'symbol': symbol,
                        'tf': tf,
                        'action': direction,
                        'volume': lot,
                        'signalPrice': signal_price,
                        'entryPrice': 0,
                        'sl': config.get('sl'),
                        'tp': config.get('tp'),
                        'ticket': None,
                        'status': 'failed',
                        'error': None,
                        'executedAt': datetime.utcnow().isoformat(),
                        'autoExecuted': True,
                        'account_id': account_id,
                    }

                    if result and not err:
                        history_entry['status'] = 'filled'
                        history_entry['ticket'] = result.get('ticket')
                        history_entry['entryPrice'] = result.get('price', 0)
                        print(f"[AutoTrader] ✓ Executed: {key} → ticket {result.get('ticket')}")
                    else:
                        history_entry['error'] = err or 'Unknown error'
                        print(f"[AutoTrader] ✗ Failed: {key} → {err}")

                    with _lock:
                        _trade_history.insert(0, history_entry)
                        _save_trade_history()
                        # INSTEAD OF DELETING, LEAVE AS EXECUTED TO PREVENT DUPLICATES
                        if key in _auto_trades:
                            _auto_trades[key]['status'] = 'executed'
                            _save_auto_trades()

        except Exception as e:
            print(f"[AutoTrader] Worker error: {e}")
            import traceback
            traceback.print_exc()
            time.sleep(10)

    print("[AutoTrader] Combined worker stopped")


# ═══════════ Start / Stop ═══════════

def start_worker():
    """Start the background auto-trader. Called from apps.py ready()."""
    global _worker_thread, _worker_running

    if _worker_thread and _worker_thread.is_alive():
        print("[AutoTrader] Worker already running")
        return

    _load_auto_trades()
    _load_trade_history()

    _worker_running = True
    _worker_thread = threading.Thread(target=_combined_worker, daemon=True, name="AutoTrader")
    _worker_thread.start()
    print("[AutoTrader] ✓ Worker thread started (MetaAPI mode)")


def stop_worker():
    global _worker_running
    _worker_running = False
    print("[AutoTrader] Worker stop requested")
