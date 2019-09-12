from django.contrib import admin
from signalapp.resources.models import Resource

administerableModels = [Resource]
admin.site.register(administerableModels)