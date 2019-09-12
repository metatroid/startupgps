from django.db import models
from tagging.fields import TagField
from multiselectfield import MultiSelectField
from adminsortable.models import Sortable, SortableMixin
from adminsortable.fields import SortableForeignKey
from signalapp.resources.models import Resource

class Theme(models.Model):
  def __str__(self):
    return self.name
  name = models.CharField(max_length=255)
  secondary_taxonomy = models.BooleanField(default=False, blank=True)
  library_info_blurb = models.CharField(max_length=255, null=True, blank=True)

class Topic(models.Model):
  def __str__(self):
    return self.name
  name = models.CharField(max_length=255)
  theme = models.ForeignKey(Theme, related_name='topics', on_delete=models.CASCADE, null=True, blank=True)
  secondary_taxonomy = models.BooleanField(default=False, blank=True)

class Question(SortableMixin):
  def __str__(self):
    return self.question_text
  class Meta:
    ordering = ['question_order']

  # CUSTOMER_TYPE = (('buildings', 'buildings'),('municipalities', 'cities'),('utilities', 'utilities'),('','not applicable'))
  # PRODUCT_CATEGORY = (('hardware', 'hardware'),('software', 'software'),('','not applicable'))
  QUESTION_TYPES = (('text', 'text'),('single', 'single'),('multi', 'multi'),('range', 'range'),('inline-range','inline range'))

  question_text = models.CharField(max_length=255)
  question_subtext = models.CharField(max_length=255, blank=True, null=True, help_text="Optional subtext below the question's label")
  required = models.BooleanField(default=True, blank=True)
  theme = models.ForeignKey(Theme, related_name='theme_questions', on_delete=models.CASCADE, null=True, blank=True, verbose_name='top-level categorization')
  topic = models.ForeignKey(Topic, related_name='topic_questions', on_delete=models.CASCADE, null=True, blank=True, verbose_name='secondary classification', limit_choices_to={'secondary_taxonomy': False})
  other_topic = models.ForeignKey(Topic, related_name='othertopic_questions', on_delete=models.CASCADE, null=True, blank=True, verbose_name='tertiary classification', limit_choices_to={'secondary_taxonomy': False})

  use_in_library = models.BooleanField(default=False, blank=True)
  
  score_percentage = models.PositiveIntegerField(default=100, blank=True, null=True, help_text='Use this value to weight questions\' score.')
  possible_score = models.PositiveIntegerField(blank=True, null=True, help_text='If scoring is weighted, the possible score for this question is needed')
  total_possible_score = models.PositiveIntegerField(blank=True, null=True, help_text='If scoring is weighted, the total possible score for this topic is also needed')
  # customer_type = models.CharField(max_length=20, choices=CUSTOMER_TYPE, default='', verbose_name='additional question taxonomy')
  # product_category = models.CharField(max_length=60, choices=PRODUCT_CATEGORY, default='', verbose_name='additional question taxonomy')
  question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='single', help_text="Controls how the question and choices will be displayed. e.g. 'text' renders a text input, 'single'/'multi' determines radio buttons or checkboxes, 'range' denotes a horizontal scale, and 'inline range' displays the scale in line with the question.")

  # question_tags = TagField()
  question_feedback = models.TextField(blank=True, null=True, help_text='This field will be shown as immediate feedback to the user once the question is answered. Leave blank to indicate no feedback should be shown.')

  resource = models.ForeignKey(Resource, related_name='question_resources', on_delete=models.CASCADE, null=True, blank=True, verbose_name='associated resource', help_text='Associate a resource with this question to display immediately upon answering')

  question_order = models.PositiveIntegerField(default=0, editable=False, db_index=True)
  order_field_name = 'question_order'

class Choice(SortableMixin):
  def __str__(self):
    return self.choice_text
  class Meta:
    ordering = ['choice_order']

  CUSTOMER_TYPE = (('buildings', 'buildings'),('municipalities', 'cities'),('utilities', 'utilities'),('','not applicable'))
  PRODUCT_CATEGORY = (('hardware', 'hardware'),('software', 'software'),('service', 'service'),('','not applicable'))

  question = SortableForeignKey(Question, related_name='choices', on_delete=models.CASCADE, null=True, blank=True)
  theme = models.ForeignKey(Theme, related_name='theme_choices', on_delete=models.CASCADE, null=True, blank=True, verbose_name='category to be scored', help_text='Use when the question itself is un-categorized.')
  topic = models.ForeignKey(Topic, related_name='topic_choices', on_delete=models.CASCADE, null=True, blank=True, verbose_name='additional taxonomy', limit_choices_to={'secondary_taxonomy': True})

  choice_text = models.CharField(max_length=255, null=True, blank=True)
  choice_value = models.IntegerField(null=True, blank=True)

  customer_type = MultiSelectField(max_length=255, choices=CUSTOMER_TYPE, default='', verbose_name='additional taxonomy', null=True, blank=True)
  product_category = MultiSelectField(max_length=255, choices=PRODUCT_CATEGORY, default='', verbose_name='additional taxonomy', null=True, blank=True)

  # sub_choice = models.CharField(max_length=255, null=True, blank=True,)
  # choice_subtext = models.CharField(max_length=255, blank=True, null=True, help_text="")
  # sub_choice_value = models.IntegerField(null=True, blank=True)

  include_text_field = models.BooleanField(default=False, verbose_name='include text field?', help_text="For use with 'other' choices. Will display a text field for user entry when selected.")

  choice_tags = TagField()
  choice_feedback = models.CharField(max_length=255, blank=True, null=True, help_text='This field will be shown as immediate feedback to the user once the choice is selected. Leave blank to indicate no feedback should be shown.')

  resource = models.ForeignKey(Resource, related_name='choice_resources', on_delete=models.CASCADE, null=True, blank=True, verbose_name='associated resource', help_text='Associate a resource with this choice to display immediately upon selecting')
  
  choice_order = models.PositiveIntegerField(default=0, editable=False, db_index=True)
  order_field_name = 'choice_order'