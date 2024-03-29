"""
Django settings for signalapp project.

Generated by 'django-admin startproject' using Django 1.8.6.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
from configparser import RawConfigParser

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
config = RawConfigParser()
if(os.path.isfile(os.path.join(BASE_DIR, 'config.overrides.ini'))):
    config.readfp(open(os.path.join(BASE_DIR, 'config.overrides.ini')))
else:
    config.readfp(open(os.path.join(BASE_DIR, 'config.ini')))



# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config.get('global', 'SECRET')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'djangular',
    'tagging',
    'tinymce',
    'adminsortable',
    'multiselectfield',
    'signalapp',
    'signalapp.questions',
    'signalapp.contentblocks',
    'signalapp.resources',
    'signalapp.finderobjects',
    'signalapp.supporters',
    'signalapp.faqs'
)
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': []
}

# FORCE_LOWERCASE_TAGS = True
TINYMCE_DEFAULT_CONFIG = {
    'theme' : 'advanced',
    'theme_advanced_buttons1' : 'formatselect,separator,justifyleft,justifycenter,justifyright,separator,bold,italic,underline,separator,bullist,numlist,separator,link,unlink,separator,hr,separator,blockquote,separator,code',
    'theme_advanced_buttons2' : '',
    'theme_advanced_buttons3' : '',
    'height' : 300,
    'width' : 600,
    'theme_advanced_toolbar_location' : 'top',
    'theme_advanced_toolbar_align': 'left',
    'theme_advanced_blockformats' : "p,div,h1,h2,h3,h4,h5,h6,blockquote,code",
    'paste_text_sticky': True,
    'paste_text_sticky_default' : True,
    'plugins': "table,xhtmlxtras,paste,searchreplace,advlink",
    'cleanup_on_startup': True
}

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'signalapp.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'angular'), os.path.join(BASE_DIR, 'signalapp/templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.core.context_processors.i18n',
                'django.core.context_processors.media',
                'django.core.context_processors.static',
                'django.core.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
                "django.core.context_processors.static"
            ],
        },
    },
]

WSGI_APPLICATION = 'signalapp.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config.get('database', 'DATABASE_NAME'),
        'USER': config.get('database', 'DATABASE_USER'),
        'PASSWORD': config.get('database', 'DATABASE_PASSWORD'),
        'HOST': 'localhost',
        'PORT': ''
    }
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format' : "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
            'datefmt' : "%d/%b/%Y %H:%M:%S"
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'signalapp.log',
            'formatter': 'verbose'
        },
    },
    'loggers': {
        'django': {
            'handlers':['file'],
            'propagate': True,
            'level':'DEBUG',
        },
        'signalapp': {
            'handlers': ['file'],
            'level': 'DEBUG',
        },
    }
}


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, "static/")
STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(BASE_DIR, "static/uploads/")
MEDIA_URL = '/static/uploads/'

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'hello@startupgps.org'
EMAIL_HOST_PASSWORD = 'HKmVK~1WK6Vl'
EMAIL_PORT = 587
EMAIL_USE_TLS = True