from django.contrib import admin
from adminsortable.admin import SortableAdmin
from signalapp.supporters.models import Supporter

admin.site.register(Supporter, SortableAdmin)