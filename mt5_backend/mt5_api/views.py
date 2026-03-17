"""
MT5 API Views — Function-Based Views using MetaAPI.cloud.
All endpoints accept account_id for multi-user support.
Falls back to legacy mt5_service if account_id is not provided.
"""
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from . import metaapi_service

# Keep legacy mt5_service for backward compat (symbol overrides, etc.)
try:
    from . import mt5_service
except Exception:
    mt5_service = None


@api_view(['POST'])
def connect(request):
    """
    POST /api/mt5/connect/
    Body: { "login": 1110835, "password": "xxx", "server": "EquitiBrokerageSC-Demo" }
    Provisions the account on MetaAPI.cloud and returns account_id.
    """
    try:
        body = request.data
        login = body.get('login')
        password = body.get('password')
        server = body.get('server')
        name = body.get('name', 'PhaseX User')

        if not login or not password or not server:
            return Response({
                "connected": False,
                "error": "Missing required fields: login, password, server",
            }, status=status.HTTP_400_BAD_REQUEST)

        # Provision on MetaAPI
        result = metaapi_service.provision_account(
            login=login,
            password=password,
            server=server,
            name=name,
        )

        if not result.get('success'):
            return Response({
                "connected": False,
                "error": result.get('message', 'Provisioning failed'),
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        account_id = result['account_id']

        # Fetch account info
        account_info, err = metaapi_service.get_account_info(account_id)

        return Response({
            "connected": True,
            "message": result.get('message', 'Connected'),
            "account_id": account_id,
            "account": account_info,
        })
    except Exception as e:
        return Response({
            "connected": False,
            "error": str(e),
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def disconnect(request):
    """
    GET /api/mt5/disconnect/
    No-op for MetaAPI (accounts stay deployed on cloud).
    """
    return Response({
        "connected": False,
        "message": "Disconnected (account remains on MetaAPI cloud)",
    })


@api_view(['GET'])
def account_info(request):
    """
    GET /api/mt5/account/?account_id=xxx
    Returns full account details.
    """
    account_id = request.query_params.get('account_id', '')
    if not account_id:
        return Response({"error": "account_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    account, err = metaapi_service.get_account_info(account_id)
    if err:
        return Response({"error": err}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    return Response({"account": account})


@api_view(['GET'])
def positions(request):
    """
    GET /api/mt5/positions/?account_id=xxx
    Returns all currently open positions.
    """
    account_id = request.query_params.get('account_id', '')
    if not account_id:
        return Response({"error": "account_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        pos, err = metaapi_service.get_positions(account_id)
        if err:
            return Response({"error": err}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response({
            "positions": pos,
            "count": len(pos),
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def history(request):
    """
    GET /api/mt5/history/?account_id=xxx&days=30
    Returns recent trade history (deals).
    """
    account_id = request.query_params.get('account_id', '')
    if not account_id:
        return Response({"error": "account_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    days = int(request.query_params.get('days', 30))
    deals, err = metaapi_service.get_deals(account_id, days=days)

    if err:
        return Response({"error": err}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    return Response({
        "deals": deals,
        "count": len(deals),
        "days": days,
    })


@api_view(['GET'])
def symbol_tick(request):
    """
    GET /api/mt5/tick/?account_id=xxx&symbol=XAUUSD
    Returns latest price for a symbol.
    """
    account_id = request.query_params.get('account_id', '')
    symbol = request.query_params.get('symbol', '')

    if not account_id:
        return Response({"error": "account_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    if not symbol:
        return Response({"error": "symbol is required"}, status=status.HTTP_400_BAD_REQUEST)

    price, err = metaapi_service.get_symbol_price(account_id, symbol)
    if err:
        return Response({"error": err}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    return Response({"tick": price})


@api_view(['POST'])
def trade_execute(request):
    """
    POST /api/mt5/trade/
    Body: { "account_id": "xxx", "symbol": "EURUSD", "action": "BUY", "volume": 0.01, "sl": ..., "tp": ... }
    Execute a market order.
    """
    try:
        body = request.data
        account_id = body.get('account_id', '')
        symbol = body.get('symbol', '')
        action = body.get('action', '')
        volume = float(body.get('volume', 0.01))
        sl = body.get('sl')
        tp = body.get('tp')
        comment = body.get('comment', 'PhaseX')

        if not account_id:
            return Response({"success": False, "error": "account_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not symbol or not action:
            return Response({"success": False, "error": "symbol and action are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Convert sl/tp to float if provided
        sl_val = float(sl) if sl else None
        tp_val = float(tp) if tp else None

        result, err = metaapi_service.place_order(
            account_id=account_id,
            symbol=symbol,
            action=action,
            volume=volume,
            sl=sl_val,
            tp=tp_val,
            comment=comment,
        )

        if err:
            return Response({"success": False, "error": err}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response({"success": True, "order": result})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def close_position_view(request):
    """
    POST /api/mt5/close-position/
    Body: { "account_id": "xxx", "ticket": "12345678" }
    Close an open position.
    """
    try:
        account_id = request.data.get('account_id', '')
        ticket = request.data.get('ticket')

        if not account_id:
            return Response({"success": False, "error": "account_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not ticket:
            return Response({"success": False, "error": "Missing ticket"}, status=status.HTTP_400_BAD_REQUEST)

        ok, err = metaapi_service.close_position(account_id, str(ticket))
        if err:
            return Response({"success": False, "error": err}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response({"success": True})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def close_all_positions_view(request):
    """
    POST /api/mt5/close-all-positions/
    Body: { "account_id": "xxx" }
    Close all open positions.
    """
    try:
        account_id = request.data.get('account_id', '')
        if not account_id:
            return Response({"success": False, "error": "account_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        positions, err = metaapi_service.get_positions(account_id)
        if err:
            return Response({"success": False, "error": err}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        if not positions:
            return Response({"success": True, "closed_count": 0, "total": 0})

        success_count = 0
        errors = []

        for pos in positions:
            ticket = pos.get('ticket')
            if ticket:
                ok, cerr = metaapi_service.close_position(account_id, str(ticket))
                if ok:
                    success_count += 1
                else:
                    errors.append(f"Ticket {ticket}: {cerr}")

        return Response({
            "success": True,
            "closed_count": success_count,
            "total": len(positions),
            "errors": errors
        })
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def health(request):
    """
    GET /api/mt5/health/
    Quick health check.
    """
    from django.conf import settings as django_settings
    has_token = bool(django_settings.METAAPI_TOKEN)
    accounts = metaapi_service.get_all_accounts()
    return Response({
        "status": "ok" if has_token else "no_token",
        "metaapi_configured": has_token,
        "accounts_provisioned": len(accounts),
    })


@api_view(['GET'])
def symbols(request):
    """
    GET /api/mt5/symbols/?account_id=xxx
    Returns all available trading symbols.
    """
    account_id = request.query_params.get('account_id', '')
    if not account_id:
        return Response({"error": "account_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    data, err = metaapi_service.get_symbols(account_id)
    if err:
        return Response({"error": err}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    return Response({
        "symbols": data,
        "count": len(data),
    })


@api_view(['GET'])
def symbol_map(request):
    """
    GET /api/mt5/symbol-map/
    Returns the auto-built mapping (legacy — uses mt5_service if available).
    """
    if mt5_service:
        mapping = mt5_service.get_symbol_map()
    else:
        mapping = {}
    return Response({"map": mapping, "count": len(mapping)})


@api_view(['GET', 'POST'])
def symbol_overrides(request):
    """
    GET/POST /api/mt5/symbol-overrides/
    Symbol override management (legacy — uses mt5_service).
    """
    if not mt5_service:
        return Response({"overrides": {}, "count": 0})

    if request.method == 'GET':
        overrides = mt5_service.get_custom_overrides()
        return Response({"overrides": overrides, "count": len(overrides)})

    # POST
    body = request.data
    dashboard_name = body.get('dashboard_name')
    broker_name = body.get('broker_name')
    delete = body.get('delete', False)

    if not dashboard_name:
        return Response({"error": "dashboard_name is required"}, status=status.HTTP_400_BAD_REQUEST)

    if delete:
        mt5_service.delete_custom_override(dashboard_name)
        return Response({"success": True, "message": f"Override for {dashboard_name} deleted"})

    if not broker_name:
        return Response({"error": "broker_name is required"}, status=status.HTTP_400_BAD_REQUEST)

    mt5_service.set_custom_override(dashboard_name, broker_name)
    return Response({
        "success": True,
        "message": f"{dashboard_name} → {broker_name}",
        "overrides": mt5_service.get_custom_overrides(),
    })


# ═══════════ Auto-Trade Management ═══════════

@api_view(['GET', 'POST', 'DELETE'])
def auto_trades_view(request):
    """
    GET  /api/mt5/auto-trades/ — list all active auto-trades
    POST /api/mt5/auto-trades/ — add/update an auto-trade
         Body: { key, symbol, tf, lot, direction, signal_price, sl, tp, account_id }
    DELETE /api/mt5/auto-trades/ — remove an auto-trade
         Body: { key }
    """
    from . import auto_trader

    if request.method == 'GET':
        return Response({
            "success": True,
            "auto_trades": auto_trader.get_auto_trades(),
        })

    if request.method == 'POST':
        body = request.data
        key = body.get('key', '')
        if not key:
            return Response({"success": False, "error": "key is required"}, status=status.HTTP_400_BAD_REQUEST)

        config = {
            'symbol': body.get('symbol', ''),
            'tf': body.get('tf', ''),
            'lot': float(body.get('lot', 0.01)),
            'direction': body.get('direction', ''),
            'signal_price': float(body.get('signal_price', 0)),
            'sl': float(body['sl']) if body.get('sl') else None,
            'tp': float(body['tp']) if body.get('tp') else None,
            'account_id': body.get('account_id', ''),
        }

        auto_trader.set_auto_trade(key, config)
        return Response({"success": True, "auto_trades": auto_trader.get_auto_trades()})

    if request.method == 'DELETE':
        key = request.data.get('key', '')
        if not key:
            return Response({"success": False, "error": "key is required"}, status=status.HTTP_400_BAD_REQUEST)

        removed = auto_trader.remove_auto_trade(key)
        return Response({"success": True, "removed": removed, "auto_trades": auto_trader.get_auto_trades()})


# ═══════════ Trade History ═══════════

@api_view(['GET'])
def trade_history_view(request):
    from . import auto_trader
    return Response({"success": True, "history": auto_trader.get_trade_history()})


@api_view(['POST'])
def add_history_view(request):
    from . import auto_trader
    entry = request.data
    if not entry:
        return Response({"success": False, "error": "Empty body"}, status=status.HTTP_400_BAD_REQUEST)
    auto_trader.add_trade_history(dict(entry))
    return Response({"success": True})


@api_view(['POST'])
def clear_history_view(request):
    from . import auto_trader
    auto_trader.clear_trade_history()
    return Response({"success": True})


# ═══════════ Provisioned Accounts List ═══════════

@api_view(['GET'])
def accounts_list(request):
    """
    GET /api/mt5/accounts/
    Returns all provisioned MetaAPI accounts.
    """
    accounts = metaapi_service.get_all_accounts()
    return Response({"success": True, "accounts": accounts, "count": len(accounts)})
