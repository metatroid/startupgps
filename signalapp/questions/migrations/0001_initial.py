# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import tagging.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Choice',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('choice_text', models.CharField(max_length=255)),
                ('choice_value', models.IntegerField(default=0)),
                ('choice_tags', tagging.fields.TagField(blank=True, max_length=255)),
                ('choice_feedback', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('question_text', models.CharField(max_length=255)),
                ('question_subtext', models.CharField(max_length=255)),
                ('question_type', models.CharField(default='team', max_length=20, choices=[('team', 'Team'), ('product', 'Product'), ('market', 'Market'), ('operations', 'Operations')])),
                ('question_total_value', models.IntegerField(default=0)),
                ('question_tags', tagging.fields.TagField(blank=True, max_length=255)),
                ('question_feedback', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.AddField(
            model_name='choice',
            name='question',
            field=models.ForeignKey(to='questions.Question'),
        ),
    ]
