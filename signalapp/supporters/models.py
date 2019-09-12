from django.db import models
from tinymce.models import HTMLField
from adminsortable.models import Sortable, SortableMixin

class Supporter(SortableMixin):
  def __str__(self):
    return self.name
  class Meta:
    ordering = ['supporter_order']

  SUPPORTER_TYPES = (('supporter','Supporter'),('collaborator','Manager'),('partner','Partner'))

  name = models.CharField(blank=True, null=True, max_length=80)
  supporter_type = models.CharField(max_length=20, choices=SUPPORTER_TYPES, default='supporter')
  link = models.CharField(blank=True, null=True, max_length=100)
  image = models.ImageField(blank=True, null=True)
  description = HTMLField(verbose_name="Description/Position", blank=True, null=True)
  supporter_order = models.PositiveIntegerField(default=0, editable=False, db_index=True)
  order_field_name = 'supporter_order'