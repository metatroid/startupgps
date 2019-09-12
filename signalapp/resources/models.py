from django.db import models
from tinymce.models import HTMLField
# from signalapp.questions.models import Question, Choice

class Resource(models.Model):
  def __str__(self):
    return self.title
  title = models.CharField(max_length=255)
  url = models.CharField(max_length=255)
  description = models.CharField(max_length=255)
  # sponsored = models.BooleanField(default=True, blank=True)
  # ACTIONS = (('Read','read'),('Watch','watch'),('Listen','listen'),('Do','do'))
  # resource_action = models.CharField(max_length=10, choices=ACTIONS, default='', null=True, blank=True)
  TOP_PRIORITIES = (('Market','Getting customers'),('Funding','Raising money'),('Product','Developing a product'),('Team','Building your team'))
  top_priority_resource = models.CharField(max_length=255, choices=TOP_PRIORITIES, default='', help_text='Show this resource in results if top priority matches', null=True, blank=True)
  intro_text = HTMLField(blank=True, null=True, help_text='Text to display when sharing this resource during questionaire.')
  # choice = models.ForeignKey(Choice, related_name='choice_resource', on_delete=models.CASCADE, null=True, blank=True, verbose_name='associated resource', help_text='Associate a resource with this question to display immediately upon answering')
  # question = models.ForeignKey(Question, related_name='question_resource', on_delete=models.CASCADE, null=True, blank=True, verbose_name='associated resource', help_text='Associate a resource with this choice to display immediately upon selecting')
  