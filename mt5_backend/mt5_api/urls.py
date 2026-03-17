"""
URL routes for the MT5 API app.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('connect/', views.connect, name='mt5-connect'),
    path('disconnect/', views.disconnect, name='mt5-disconnect'),
    path('account/', views.account_info, name='mt5-account'),
    path('positions/', views.positions, name='mt5-positions'),
    path('history/', views.history, name='mt5-history'),
    path('tick/', views.symbol_tick, name='mt5-tick'),
    path('trade/', views.trade_execute, name='mt5-trade'),
    path('close-position/', views.close_position_view, name='mt5-close-position'),
    path('close-all-positions/', views.close_all_positions_view, name='mt5-close-all-positions'),
    path('symbols/', views.symbols, name='mt5-symbols'),
    path('symbol-map/', views.symbol_map, name='mt5-symbol-map'),
    path('symbol-overrides/', views.symbol_overrides, name='mt5-symbol-overrides'),
    path('health/', views.health, name='mt5-health'),
    # Auto-trade & history
    path('auto-trades/', views.auto_trades_view, name='mt5-auto-trades'),
    path('trade-history/', views.trade_history_view, name='mt5-trade-history'),
    path('trade-history/add/', views.add_history_view, name='mt5-trade-history-add'),
    path('trade-history/clear/', views.clear_history_view, name='mt5-trade-history-clear'),
    # Provisioned accounts
    path('accounts/', views.accounts_list, name='mt5-accounts-list'),
]
