from django.contrib import admin
from adminsortable.admin import SortableAdmin, SortableTabularInline
from signalapp.questions.models import Theme, Topic, Question, Choice

class ChoiceSortableInline(SortableTabularInline):
  model = Choice
class QuestionSortable(SortableAdmin):
  inlines = [
    ChoiceSortableInline
  ]
admin.site.register(Question, QuestionSortable)
administerableModels = [Theme, Topic]
admin.site.register(administerableModels)