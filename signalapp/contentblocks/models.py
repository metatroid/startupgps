from django.db import models
from tinymce.models import HTMLField

class ContentBlock(models.Model):
  def __str__(self):
    return self.alias

  alias = models.CharField(max_length=80)
  url = models.CharField(max_length=200, blank=True, null=True)
  location = models.CharField(max_length=100, blank=True, null=True)
  content = HTMLField()