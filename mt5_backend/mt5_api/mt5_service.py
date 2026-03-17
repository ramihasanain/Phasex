"""
MT5 Service Layer — wraps MetaTrader5 Python package calls.
Auto-finds and launches MT5 terminal if not running.
"""
import MetaTrader5 as mt5
from django.conf import settings
from datetime import datetime, timedelta
import threading
import glob
import os
import time
import subprocess

# Thread lock for MT5 operations (MT5 lib is not thread-safe)
_mt5_lock = threading.Lock()
_initialized = False
_current_login = None
_symbol_map = {}  # Maps dashboard names (AUDCAD) → broker names (AUDCADm)
_custom_overrides = {}  # User-defined overrides: dashboard name → broker name
_OVERRIDES_FILE = os.path.join(os.path.dirname(__file__), 'symbol_overrides.json')


def _load_custom_overrides():
    """Load custom symbol overrides from JSON file."""
    global _custom_overrides
    try:
        if os.path.isfile(_OVERRIDES_FILE):
            import json
            with open(_OVERRIDES_FILE, 'r') as f:
                _custom_overrides = json.load(f)
            print(f"[PhaseX] Loaded {len(_custom_overrides)} custom symbol overrides")
    except Exception as e:
        print(f"[PhaseX] Error loading overrides: {e}")


def _save_custom_overrides():
    """Save custom symbol overrides to JSON file."""
    try:
        import json
        with open(_OVERRIDES_FILE, 'w') as f:
            json.dump(_custom_overrides, f, indent=2)
    except Exception as e:
        print(f"[PhaseX] Error saving overrides: {e}")


# Load overrides on module import
_load_custom_overrides()


def _find_mt5_terminal():
    """Auto-find the MetaTrader 5 terminal64.exe on the system."""
    search_paths = [
        os.path.expandvars(r"%ProgramFiles%\MetaTrader 5\terminal64.exe"),
        os.path.expandvars(r"%ProgramFiles(x86)%\MetaTrader 5\terminal64.exe"),
        os.path.expandvars(r"%ProgramFiles%\Equiti Group MetaTrader 5\terminal64.exe"),
        os.path.expandvars(r"%ProgramFiles(x86)%\Equiti Group MetaTrader 5\terminal64.exe"),
        os.path.expandvars(r"%LOCALAPPDATA%\Programs\MetaTrader 5\terminal64.exe"),
    ]
    
    for path in search_paths:
        if os.path.isfile(path):
            return path
    
    # Search Program Files for any terminal64.exe
    for base in [os.environ.get("ProgramFiles", ""), os.environ.get("ProgramFiles(x86)", ""), os.environ.get("LOCALAPPDATA", "")]:
        if not base:
            continue
        pattern = os.path.join(base, "*", "terminal64.exe")
        results = glob.glob(pattern)
        if results:
            return results[0]
    
    return None


def _ensure_terminal_running(terminal_path):
    """Make sure the MT5 terminal process is running."""
    import psutil
    
    # Check if terminal64.exe is already running
    for proc in psutil.process_iter(['name']):
        try:
            if proc.info['name'] and 'terminal64' in proc.info['name'].lower():
                return True  # Already running
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    
    # Not running — launch it minimized
    try:
        subprocess.Popen(
            [terminal_path, "/portable"],
            creationflags=subprocess.CREATE_NO_WINDOW if hasattr(subprocess, 'CREATE_NO_WINDOW') else 0x08000000,
        )
        # Wait for it to start
        time.sleep(5)
        return True
    except Exception as e:
        print(f"Failed to launch terminal: {e}")
        return False


def initialize_mt5(login=None, password=None, server=None):
    """Initialize MT5 terminal and login with given or default credentials."""
    global _initialized, _current_login
    
    login = int(login) if login else settings.MT5_LOGIN
    password = password or settings.MT5_PASSWORD
    server = server or settings.MT5_SERVER
    
    with _mt5_lock:
        terminal_path = _find_mt5_terminal()
        
        # Try to initialize with retries
        init_ok = False
        last_error = None
        
        for attempt in range(3):
            if terminal_path:
                init_ok = mt5.initialize(terminal_path)
            else:
                init_ok = mt5.initialize()
            
            if init_ok:
                break
            
            last_error = mt5.last_error()
            print(f"MT5 init attempt {attempt+1}/3 failed: {last_error}")
            
            # If terminal not responding, try to launch it
            if terminal_path and attempt < 2:
                try:
                    _ensure_terminal_running_simple(terminal_path)
                except:
                    pass
                time.sleep(3)
        
        if not init_ok:
            return False, f"MT5 initialize failed after 3 attempts: {last_error}. Terminal path: {terminal_path or 'not found'}"
        
        # Login to the account
        authorized = mt5.login(
            login=login,
            password=password,
            server=server
        )
        
        if not authorized:
            error = mt5.last_error()
            mt5.shutdown()
            return False, f"MT5 login failed for account {login}: {error}"
        
        _initialized = True
        _current_login = login
        
        # Auto-build symbol map on successful connect
        try:
            _build_symbol_map_internal()
        except Exception as e:
            print(f"[PhaseX] Warning: Failed to build symbol map: {e}")
        
        return True, "Connected successfully"


def ensure_connected():
    """Check if MT5 is initialized; if not, try to auto-connect with default credentials."""
    global _initialized
    if _initialized:
        # Quick check if still alive
        try:
            info = mt5.account_info()
            if info is not None:
                return True, "Already connected"
        except:
            pass
        _initialized = False

    # Try to auto-connect with default credentials
    try:
        return initialize_mt5()
    except Exception as e:
        return False, f"Auto-connect failed: {e}"


def _ensure_terminal_running_simple(terminal_path):
    """Launch the MT5 terminal and wait for it to be ready."""
    try:
        subprocess.Popen(
            [terminal_path],
            creationflags=0x08000000,  # CREATE_NO_WINDOW
        )
        time.sleep(5)
    except Exception as e:
        print(f"Failed to launch terminal: {e}")


def ensure_connected():
    """Ensure MT5 is connected, reconnect if needed."""
    global _initialized
    
    with _mt5_lock:
        if _initialized:
            info = mt5.terminal_info()
            if info is not None:
                return True, "Already connected"
        
    return initialize_mt5()


def _build_symbol_map_internal():
    """Build symbol map while already holding the lock. Called from initialize_mt5."""
    global _symbol_map
    all_symbols = mt5.symbols_get()
    if not all_symbols:
        return
    
    new_map = {}
    for s in all_symbols:
        name = s.name
        # Strip common suffixes to get base name
        base = name
        for suffix in ['.p', '.sd', '.lv', 'm', 'micro', '.', '_']:
            if base.endswith(suffix):
                base = base[:-len(suffix)]
                break
        
        # Map base → broker symbol (prefer shorter/exact names)
        if base not in new_map or len(name) < len(new_map[base]):
            new_map[base] = name
        # Also map exact name to itself
        new_map[name] = name
    
    _symbol_map = new_map
    print(f"[PhaseX] Symbol map built: {len(new_map)} entries")


def get_all_symbols():
    """Get all available trading symbols from MT5."""
    ok, msg = ensure_connected()
    if not ok:
        return None, msg
    
    with _mt5_lock:
        all_symbols = mt5.symbols_get()
        if all_symbols is None:
            return None, f"Failed to get symbols: {mt5.last_error()}"
        
        result = []
        for s in all_symbols:
            if not s.visible:
                continue
            result.append({
                "name": s.name,
                "description": s.description,
                "currency_base": s.currency_base,
                "currency_profit": s.currency_profit,
                "spread": s.spread,
                "trade_mode": s.trade_mode,
                "volume_min": s.volume_min,
                "volume_max": s.volume_max,
                "volume_step": s.volume_step,
            })
        
        return result, None


def get_symbol_map():
    """Return the current symbol map."""
    return dict(_symbol_map)


def resolve_symbol(dashboard_name):
    """Resolve a dashboard symbol name to the broker symbol name.
    Priority: custom overrides > auto-map > case-insensitive.
    """
    # 1. Check custom overrides first (case-insensitive)
    for key, val in _custom_overrides.items():
        if key.upper() == dashboard_name.upper():
            return val
    # 2. Direct match in auto-map
    if dashboard_name in _symbol_map:
        return _symbol_map[dashboard_name]
    # 3. Case-insensitive match in auto-map
    for key, val in _symbol_map.items():
        if key.upper() == dashboard_name.upper():
            return val
    return None


def get_custom_overrides():
    """Return all custom symbol overrides."""
    return dict(_custom_overrides)


def set_custom_override(dashboard_name, broker_name):
    """Set a custom symbol override."""
    _custom_overrides[dashboard_name.upper()] = broker_name
    _save_custom_overrides()
    print(f"[PhaseX] Custom override set: {dashboard_name} → {broker_name}")
    return True


def delete_custom_override(dashboard_name):
    """Delete a custom symbol override."""
    key = dashboard_name.upper()
    if key in _custom_overrides:
        del _custom_overrides[key]
        _save_custom_overrides()
        return True
    return False


def get_account_info():
    """Get full account information."""
    ok, msg = ensure_connected()
    if not ok:
        return None, msg
    
    with _mt5_lock:
        info = mt5.account_info()
        if info is None:
            return None, f"Failed to get account info: {mt5.last_error()}"
        
        return {
            "login": info.login,
            "name": info.name,
            "server": info.server,
            "balance": round(info.balance, 2),
            "equity": round(info.equity, 2),
            "margin": round(info.margin, 2),
            "free_margin": round(info.margin_free, 2),
            "profit": round(info.profit, 2),
            "leverage": info.leverage,
            "currency": info.currency,
            "trade_mode": info.trade_mode,
            "limit_orders": info.limit_orders,
            "margin_so_mode": info.margin_so_mode,
            "margin_level": round(info.margin_level, 2) if info.margin_level else 0,
        }, None


def get_positions():
    """Get all currently open positions."""
    ok, msg = ensure_connected()
    if not ok:
        return None, msg
    
    with _mt5_lock:
        positions = mt5.positions_get()
        if positions is None:
            error = mt5.last_error()
            if error[0] == 0:
                return [], None
            return None, f"Failed to get positions: {error}"
        
        result = []
        for pos in positions:
            try:
                result.append({
                    "ticket": pos.ticket,
                    "symbol": pos.symbol,
                    "type": "BUY" if pos.type == mt5.ORDER_TYPE_BUY else "SELL",
                    "volume": pos.volume,
                    "open_price": round(pos.price_open, 5),
                    "current_price": round(pos.price_current, 5),
                    "sl": round(pos.sl, 5) if pos.sl and pos.sl > 0 else None,
                    "tp": round(pos.tp, 5) if pos.tp and pos.tp > 0 else None,
                    "profit": round(pos.profit, 2),
                    "swap": round(pos.swap, 2),
                    "commission": round(pos.commission, 2) if hasattr(pos, 'commission') else 0,
                    "magic": pos.magic,
                    "comment": pos.comment if hasattr(pos, 'comment') else "",
                    "time_open": datetime.fromtimestamp(pos.time).isoformat() if pos.time else None,
                    "time_update": datetime.fromtimestamp(pos.time_update).isoformat() if pos.time_update and pos.time_update > 0 else None,
                })
            except Exception as e:
                print(f"[PhaseX] Error serializing position {pos.ticket}: {e}")
                continue
        
        return result, None


def get_history_orders(days=30):
    """Get closed orders history for the last N days."""
    ok, msg = ensure_connected()
    if not ok:
        return None, msg
    
    with _mt5_lock:
        from_date = datetime.now() - timedelta(days=days)
        to_date = datetime.now()
        
        deals = mt5.history_deals_get(from_date, to_date)
        if deals is None:
            error = mt5.last_error()
            if error[0] == 0:
                return [], None
            return None, f"Failed to get history: {error}"
        
        result = []
        for deal in deals:
            deal_type = "BUY" if deal.type == mt5.DEAL_TYPE_BUY else "SELL" if deal.type == mt5.DEAL_TYPE_SELL else "OTHER"
            result.append({
                "ticket": deal.ticket,
                "order": deal.order,
                "symbol": deal.symbol,
                "type": deal_type,
                "volume": deal.volume,
                "price": round(deal.price, 5),
                "profit": round(deal.profit, 2),
                "swap": round(deal.swap, 2),
                "commission": round(deal.commission, 2),
                "fee": round(deal.fee, 2) if hasattr(deal, 'fee') else 0,
                "comment": deal.comment,
                "magic": deal.magic,
                "time": datetime.fromtimestamp(deal.time).isoformat(),
                "entry": deal.entry,
            })
        
        return result, None


def get_symbol_tick(symbol):
    """Get latest tick data for a symbol."""
    ok, msg = ensure_connected()
    if not ok:
        return None, msg
    
    with _mt5_lock:
        tick = mt5.symbol_info_tick(symbol)
        if tick is None:
            return None, f"Failed to get tick for {symbol}: {mt5.last_error()}"
        
        return {
            "symbol": symbol,
            "bid": round(tick.bid, 5),
            "ask": round(tick.ask, 5),
            "last": round(tick.last, 5),
            "volume": tick.volume,
            "time": datetime.fromtimestamp(tick.time).isoformat(),
            "spread": round(tick.ask - tick.bid, 5),
        }, None


def close_position(ticket):
    """Close an open position by ticket number."""
    ok, msg = ensure_connected()
    if not ok:
        return None, msg
    
    with _mt5_lock:
        # Find the position
        position = mt5.positions_get(ticket=int(ticket))
        if not position or len(position) == 0:
            return None, f"Position {ticket} not found"
        
        pos = position[0]
        
        # Determine close order type (opposite of position)
        if pos.type == mt5.ORDER_TYPE_BUY:
            close_type = mt5.ORDER_TYPE_SELL
            price = mt5.symbol_info_tick(pos.symbol).bid
        else:
            close_type = mt5.ORDER_TYPE_BUY
            price = mt5.symbol_info_tick(pos.symbol).ask
        
        # Auto-detect filling mode
        sym_info = mt5.symbol_info(pos.symbol)
        filling_mode = sym_info.filling_mode if sym_info else 0
        if filling_mode & 1:
            type_filling = mt5.ORDER_FILLING_FOK
        elif filling_mode & 2:
            type_filling = mt5.ORDER_FILLING_IOC
        else:
            type_filling = mt5.ORDER_FILLING_RETURN
        
        request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": pos.symbol,
            "volume": pos.volume,
            "type": close_type,
            "position": pos.ticket,
            "price": price,
            "deviation": 50,
            "magic": 234000,
            "comment": "PhaseX Close",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": type_filling,
        }
        
        print(f"[PhaseX] Closing position {ticket}: {request}")
        result = mt5.order_send(request)
        
        if result is None:
            return None, f"Close failed: {mt5.last_error()}"
        
        if result.retcode != mt5.TRADE_RETCODE_DONE:
            return None, f"Close rejected: {result.retcode} - {result.comment}"
        
        return {
            "ticket": ticket,
            "closed": True,
            "close_price": result.price,
            "profit": pos.profit,
        }, None


def place_order(symbol, action, volume, sl=None, tp=None, comment="PhaseX"):
    """Place a market order on MT5.
    
    Args:
        symbol: Trading symbol (e.g. 'EURUSD', 'XAUUSD')
        action: 'BUY' or 'SELL'
        volume: Lot size (e.g. 0.01)
        sl: Stop loss price (optional)
        tp: Take profit price (optional)
        comment: Order comment
    
    Returns:
        (result_dict, error_string)
    """
    ok, msg = ensure_connected()
    if not ok:
        return None, msg
    
    with _mt5_lock:
        # Resolve symbol: custom overrides first, then auto-map
        actual_symbol = None
        # Strip incoming symbol for lookup (remove broker suffixes like .lv, .sd, .p)
        import re
        base_symbol = re.sub(r'\.(lv|sd|p|raw|ecn)$', '', symbol, flags=re.IGNORECASE)
        print(f"[PhaseX] Resolving symbol: incoming='{symbol}', base='{base_symbol}'")
        
        # 1. Custom overrides (highest priority) — check both raw and base
        for key, val in _custom_overrides.items():
            if key.upper() == symbol.upper() or key.upper() == base_symbol.upper():
                actual_symbol = val
                print(f"[PhaseX] Custom override match: {key} -> {val}")
                break
        # 2. Auto-map (check both raw and base)
        if not actual_symbol:
            actual_symbol = _symbol_map.get(symbol) or _symbol_map.get(symbol.upper()) or _symbol_map.get(base_symbol) or _symbol_map.get(base_symbol.upper())
            if actual_symbol:
                print(f"[PhaseX] Auto-map match: -> {actual_symbol}")
        
        if not actual_symbol:
            # Try case-insensitive search in map
            for key, val in _symbol_map.items():
                if key.upper() == symbol.upper() or key.upper() == base_symbol.upper():
                    actual_symbol = val
                    print(f"[PhaseX] Case-insensitive map match: {key} -> {val}")
                    break
        
        if not actual_symbol:
            # Fallback: direct MT5 lookup with variations
            sym_info = mt5.symbol_info(symbol)
            if sym_info:
                actual_symbol = symbol
                print(f"[PhaseX] Direct MT5 lookup match: {symbol}")
            else:
                # Try base symbol
                sym_info = mt5.symbol_info(base_symbol)
                if sym_info:
                    actual_symbol = base_symbol
                    print(f"[PhaseX] Direct MT5 lookup match (base): {base_symbol}")
                else:
                    for suffix in ['.p', '.sd', '.lv', 'm', 'micro']:
                        sym_info = mt5.symbol_info(f"{base_symbol}{suffix}")
                        if sym_info:
                            actual_symbol = f"{base_symbol}{suffix}"
                            print(f"[PhaseX] Suffix match: {actual_symbol}")
                            break
            
            if not actual_symbol:
                # Last resort: search all symbols
                all_symbols = mt5.symbols_get()
                if all_symbols:
                    for s in all_symbols:
                        if base_symbol.upper() in s.name.upper():
                            actual_symbol = s.name
                            print(f"[PhaseX] Fuzzy match: {actual_symbol}")
                            break
                
                if not actual_symbol:
                    print(f"[PhaseX] FAILED to resolve symbol: {symbol} (base: {base_symbol})")
                    return None, f"Symbol {symbol} not found on this broker. Available map has {len(_symbol_map)} symbols."
        
        print(f"[PhaseX] Final resolved symbol: {actual_symbol}")
        sym_info = mt5.symbol_info(actual_symbol)
        
        if sym_info is None:
            print(f"[PhaseX] symbol_info returned None for: {actual_symbol}")
            return None, f"Symbol {actual_symbol} found but symbol_info returned None"
        
        if not sym_info.visible:
            mt5.symbol_select(actual_symbol, True)
            import time as _time
            _time.sleep(0.5)
            sym_info = mt5.symbol_info(actual_symbol)
        
        # Get current price
        tick = mt5.symbol_info_tick(actual_symbol)
        if tick is None:
            return None, f"Failed to get tick for {actual_symbol}: {mt5.last_error()}"
        
        # Determine order type and price
        if action.upper() == "BUY":
            order_type = mt5.ORDER_TYPE_BUY
            price = tick.ask
        elif action.upper() == "SELL":
            order_type = mt5.ORDER_TYPE_SELL
            price = tick.bid
        else:
            return None, f"Invalid action: {action}. Must be BUY or SELL"
        
        # Auto-detect correct filling mode from symbol info
        filling_mode = sym_info.filling_mode
        if filling_mode & 1:  # ORDER_FILLING_FOK supported
            type_filling = mt5.ORDER_FILLING_FOK
        elif filling_mode & 2:  # ORDER_FILLING_IOC supported
            type_filling = mt5.ORDER_FILLING_IOC
        else:
            type_filling = mt5.ORDER_FILLING_RETURN
        
        # Validate and adjust volume to symbol's constraints
        vol = float(volume)
        vol_min = sym_info.volume_min
        vol_max = sym_info.volume_max
        vol_step = sym_info.volume_step
        
        if vol < vol_min:
            print(f"[PhaseX] Volume {vol} below min {vol_min}, adjusting to min")
            vol = vol_min
        elif vol > vol_max:
            print(f"[PhaseX] Volume {vol} above max {vol_max}, adjusting to max")
            vol = vol_max
        
        # Round to nearest step
        if vol_step > 0:
            vol = round(round(vol / vol_step) * vol_step, 8)
        
        print(f"[PhaseX] Volume: requested={volume}, adjusted={vol} (min={vol_min}, max={vol_max}, step={vol_step})")
        
        # Build the order request (no SL/TP initially for reliability)
        request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": actual_symbol,
            "volume": vol,
            "type": order_type,
            "price": price,
            "deviation": 50,
            "magic": 234000,
            "comment": comment,
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": type_filling,
        }
        
        # Only add SL/TP if they make sense directionally
        if sl and float(sl) > 0:
            sl_val = float(sl)
            if action.upper() == "BUY" and sl_val < price:
                request["sl"] = sl_val
            elif action.upper() == "SELL" and sl_val > price:
                request["sl"] = sl_val
            # else: skip invalid SL direction
        
        if tp and float(tp) > 0:
            tp_val = float(tp)
            if action.upper() == "BUY" and tp_val > price:
                request["tp"] = tp_val
            elif action.upper() == "SELL" and tp_val < price:
                request["tp"] = tp_val
            # else: skip invalid TP direction
        
        print(f"[PhaseX] Sending order: {request}")
        
        # Send order directly (skip order_check — it uses different retcodes)
        result = mt5.order_send(request)
        
        if result is None:
            err = mt5.last_error()
            print(f"[PhaseX] Order send returned None: {err}")
            return None, f"Order send failed: {err}"
        
        print(f"[PhaseX] Order result: retcode={result.retcode}, deal={result.deal}, "
              f"order={result.order}, price={result.price}, comment={result.comment}")
        
        if result.retcode != mt5.TRADE_RETCODE_DONE:
            # Try alternative filling modes if the issue is filling
            if result.retcode in (10030, 10016, 10015):
                for alt_fill in [mt5.ORDER_FILLING_FOK, mt5.ORDER_FILLING_IOC, mt5.ORDER_FILLING_RETURN]:
                    if alt_fill == type_filling:
                        continue
                    request["type_filling"] = alt_fill
                    # Update price in case it moved
                    tick2 = mt5.symbol_info_tick(actual_symbol)
                    if tick2:
                        request["price"] = tick2.ask if action.upper() == "BUY" else tick2.bid
                    result = mt5.order_send(request)
                    if result and result.retcode == mt5.TRADE_RETCODE_DONE:
                        print(f"[PhaseX] Succeeded with filling mode {alt_fill}")
                        break
                else:
                    return None, f"Order rejected: {result.retcode} - {result.comment}"
            else:
                return None, f"Order rejected: {result.retcode} - {result.comment}"
        
        return {
            "ticket": result.order,
            "deal": result.deal,
            "symbol": actual_symbol,
            "action": action.upper(),
            "volume": float(volume),
            "price": result.price,
            "sl": float(sl) if sl else None,
            "tp": float(tp) if tp else None,
            "comment": comment,
            "retcode": result.retcode,
            "retcode_description": "TRADE_RETCODE_DONE",
        }, None


def shutdown_mt5():
    """Cleanly shutdown MT5 connection."""
    global _initialized, _current_login
    with _mt5_lock:
        mt5.shutdown()
        _initialized = False
        _current_login = None
    return True, "MT5 disconnected"
