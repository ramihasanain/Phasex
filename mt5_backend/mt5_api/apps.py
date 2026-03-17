from django.apps import AppConfig


class Mt5ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mt5_api'
    verbose_name = 'MetaTrader 5 API'

    def ready(self):
        """Start the auto-trader background worker when Django starts."""
        import os
        # Only start in the main process (not in the reloader child)
        if os.environ.get('RUN_MAIN') == 'true':
            from . import auto_trader
            auto_trader.start_worker()
