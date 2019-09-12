from django.contrib import admin
from signalapp.contentblocks.models import ContentBlock

administerableModels = [ContentBlock]
admin.site.register(administerableModels)
