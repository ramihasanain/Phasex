"""
Django settings for mt5_backend project.
Production-ready for DigitalOcean App Platform.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root (only used locally)
env_path = Path(__file__).resolve().parent.parent / '.env'
if env_path.exists():
    load_dotenv(env_path)

BASE_DIR = Path(__file__).resolve().parent.parent

# ─── Security ───
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-phasex-mt5-dev-key-change-in-production')
DEBUG = os.getenv('DEBUG', 'False').lower() in ('true', '1', 'yes')

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')

INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'mt5_api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'mt5_backend.urls'

# ─── CORS ───
CORS_ALLOWED_ORIGINS = [
    origin.strip() for origin in
    os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000').split(',')
    if origin.strip()
]
CORS_ALLOW_ALL_ORIGINS = DEBUG  # permissive only in dev

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'UNAUTHENTICATED_USER': None,
}

# ─── MT5 credentials (legacy, kept for reference) ───
MT5_LOGIN = int(os.getenv('MT5_LOGIN', '0'))
MT5_PASSWORD = os.getenv('MT5_PASSWORD', '')
MT5_SERVER = os.getenv('MT5_SERVER', '')

# ─── MetaAPI.cloud ───
METAAPI_TOKEN = os.getenv('METAAPI_TOKEN', '')

# ─── Static files ───
TEMPLATES = []
DATABASES = {}
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
