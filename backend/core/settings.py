"""
Django settings for Martial Arts Academy project.
"""

from pathlib import Path
import os
import sys
from datetime import timedelta
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file
load_dotenv(BASE_DIR / '.env')

# Quick-start development settings - unsuitable for production
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-martial-arts-academy-dev-key-change-in-prod-778899!')

DEBUG = os.environ.get('DEBUG', 'True').lower() in ('true', '1', 'yes')

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '*').split(',')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',

    # Local apps
    'academy.apps.AcademyConfig',
    'erp.apps.ErpConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database Configuration
# Full PostgreSQL DB Structure with discrete parameters, DATABASE_URL, and SQLite fallback
from urllib.parse import urlparse

DATABASE_URL = os.environ.get('DATABASE_URL')
DB_ENGINE = os.environ.get('DB_ENGINE', 'django.db.backends.postgresql')
DB_NAME = os.environ.get('DB_NAME')
DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_PORT = os.environ.get('DB_PORT', '5432')

# Individual database settings take precedence, with DATABASE_URL fallback
if DATABASE_URL and not DB_PASSWORD:
    try:
        parsed_url = urlparse(DATABASE_URL)
        if parsed_url.path:
            DB_NAME = parsed_url.path.lstrip('/')
        if parsed_url.username:
            DB_USER = parsed_url.username
        if parsed_url.password:
            from urllib.parse import unquote
            DB_PASSWORD = unquote(parsed_url.password)
        if parsed_url.hostname:
            DB_HOST = parsed_url.hostname
        if parsed_url.port:
            DB_PORT = str(parsed_url.port)
    except Exception as parse_err:
        print(f"[Notice] Could not parse DATABASE_URL: {parse_err}")

use_postgres = False
if DB_NAME and DB_USER:
    try:
        import psycopg2
        # Quick ping check before locking in PostgreSQL
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD or '',
            host=DB_HOST,
            port=DB_PORT,
            connect_timeout=2
        )
        conn.close()
        use_postgres = True
    except Exception as e:
        print(f"[Notice] PostgreSQL configured ({DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}) but connection failed: {e}. Falling back to SQLite for safe operation.")
        use_postgres = False

if use_postgres:
    DATABASES = {
        'default': {
            'ENGINE': DB_ENGINE,
            'NAME': DB_NAME,
            'USER': DB_USER,
            'PASSWORD': DB_PASSWORD,
            'HOST': DB_HOST,
            'PORT': DB_PORT,
        }
    }
    print(f"[Database] Using PostgreSQL Database: {DB_NAME} on {DB_HOST}:{DB_PORT}")
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
    print("[Database] Using SQLite Database at:", BASE_DIR / 'db.sqlite3')

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files (User uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# Simple JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS = True  # Allows frontend in dev & prod
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^http://localhost:[0-9]+$",
    r"^http://127.0.0.1:[0-9]+$",
]
