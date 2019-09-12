from django.contrib import admin
from signalapp.finderobjects.models import FinderObject

administerableModels = [FinderObject]
admin.site.register(administerableModels)
