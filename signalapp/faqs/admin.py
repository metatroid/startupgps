from django.contrib import admin
from adminsortable.admin import SortableAdmin
from signalapp.faqs.models import Faq

admin.site.register(Faq, SortableAdmin)