# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0001_initial'),
        ('questions', '0018_auto_20151128_0915'),
    ]

    operations = [
        migrations.AddField(
            model_name='choice',
            name='resource',
            field=models.ForeignKey(to='resources.Resource', verbose_name='associated resource', related_name='choice_resources', null=True, blank=True, help_text='Associate a resource with this choice to display immediately upon selecting'),
        ),
        migrations.AddField(
            model_name='question',
            name='resource',
            field=models.ForeignKey(to='resources.Resource', verbose_name='associated resource', related_name='question_resources', null=True, blank=True, help_text='Associate a resource with this question to display immediately upon answering'),
        ),
    ]
