# from django.db import models

# class FinderObject(models.Model):
#   def __str__(self):
#     return self.code

#   code = models.CharField(max_length=80, unique=True, blank=True, null=True)
#   data = models.TextField(blank=True, null=True)
#   resources = models.TextField(blank=True, null=True)

from django.db import models
from jsonfield import JSONField

class FinderObject(models.Model):
  def __str__(self):
    NoneType = type(None)
    if type(self.code) is not NoneType:
      return self.code
    else:
      return "null"

  code = models.CharField(max_length=80, unique=True, blank=True, null=True)
  data = JSONField(blank=True, null=True)
  resources = JSONField(blank=True, null=True)
  saved_resources = JSONField(blank=True, null=True)
  svg = models.TextField(blank=True, null=True)
  answers = JSONField(blank=True, null=True)
  created = models.DateTimeField(auto_now_add=True)

  def clean(self):
    self.code = self.code.lower()