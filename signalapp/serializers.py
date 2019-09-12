from rest_framework import serializers
from django.contrib.auth.models import User
from signalapp.questions.models import Question, Choice, Theme, Topic
from signalapp.contentblocks.models import ContentBlock
from signalapp.resources.models import Resource
from signalapp.finderobjects.models import FinderObject
from signalapp.supporters.models import Supporter
from signalapp.faqs.models import Faq

class BlockSerializer(serializers.ModelSerializer):
  class Meta:
    model = ContentBlock
    fields = (
      "id",
      "alias",
      "url",
      "location",
      "content"
    )

class SupportSerializer(serializers.ModelSerializer):
  class Meta:
    model = Supporter
    fields = (
      "id",
      "name",
      "supporter_type",
      "link",
      "image",
      "description",
      "supporter_order"
    )

class FaqSerializer(serializers.ModelSerializer):
  class Meta:
    model = Faq
    fields = (
      "id",
      "question",
      "answer",
      "faq_order"
    )

class ResourceSerializer(serializers.ModelSerializer):
  class Meta:
    model = Resource
    fields = (
      "id",
      "title",
      "url",
      "description",
      "intro_text",
      "top_priority_resource"
    )

class TopicBasicSerializer(serializers.ModelSerializer):
  class Meta:
    model = Topic
    fields = (
      "id",
      "name"
    )

class ThemeBasicSerializer(serializers.ModelSerializer):
  class Meta:
    model = Theme
    fields = (
      "id",
      "name",
      "library_info_blurb"
    )

class ChoiceSerializer(serializers.ModelSerializer):
  choice_resources = ResourceSerializer(read_only=True, source="resource")
  theme = ThemeBasicSerializer()
  topic = TopicBasicSerializer()
  class Meta:
    model = Choice
    fields = (
      "id",
      "question",
      "choice_resources",
      "theme",
      "topic",
      "choice_text",
      "choice_value",
      "customer_type",
      "product_category",
      "include_text_field",
      "choice_tags",
      "choice_feedback",
      "choice_order"
    )

class QuestionSerializer(serializers.ModelSerializer):
  choices = ChoiceSerializer(many=True, read_only=True)
  question_resources = ResourceSerializer(read_only=True, source="resource")
  theme = ThemeBasicSerializer()
  topic = TopicBasicSerializer()
  other_topic = TopicBasicSerializer()
  class Meta:
    model = Question
    fields = (
      "id",
      "topic",
      "other_topic",
      "theme",
      "use_in_library",
      "required",
      "score_percentage",
      "possible_score",
      "total_possible_score",
      "question_text",
      "question_subtext",
      "question_type",
      "question_feedback",
      "question_order",
      "question_resources",
      "choices"
    )

class TopicSerializer(serializers.ModelSerializer):
  topic_questions = QuestionSerializer(many=True, read_only=True)
  othertopic_questions = QuestionSerializer(many=True, read_only=True)
  theme = ThemeBasicSerializer()
  class Meta:
    model = Topic
    fields = (
      "id",
      "name",
      "theme",
      "topic_questions",
      "othertopic_questions"
    )

class ThemeSerializer(serializers.ModelSerializer):
  theme_questions = QuestionSerializer(many=True, read_only=True)
  topics = TopicSerializer(many=True, read_only=True)
  class Meta:
    model = Theme
    fields = (
      "id",
      "name",
      "topics",
      "theme_questions",
      "library_info_blurb"
    )

class AssessmentSerializer(serializers.ModelSerializer):
  class Meta:
    model = FinderObject
    fields = (
      "id",
      "code",
      "data",
      "resources",
      "saved_resources",
      "svg",
      "answers",
      "created"
    )