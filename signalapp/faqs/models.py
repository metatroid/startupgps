from django.db import models
from tinymce.models import HTMLField
from adminsortable.models import Sortable, SortableMixin

class Faq(SortableMixin):
  def __str__(self):
    return self.question
  class Meta:
    ordering = ['faq_order']

  question = models.CharField(max_length=80)
  answer = HTMLField()
  faq_order = models.PositiveIntegerField(default=0, editable=False, db_index=True)
  order_field_name = 'faq_order'