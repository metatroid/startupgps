# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0020_auto_20151129_1634'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='question_tags',
        ),
        migrations.AlterField(
            model_name='choice',
            name='resource',
            field=models.ForeignKey(blank=True, related_name='choice_resources', verbose_name='associated resource', null=True, help_text='Associate a resource with this choice to display immediately upon selecting', to='resources.Resource'),
        ),
        migrations.AlterField(
            model_name='question',
            name='resource',
            field=models.ForeignKey(blank=True, related_name='question_resources', verbose_name='associated resource', null=True, help_text='Associate a resource with this question to display immediately upon answering', to='resources.Resource'),
        ),
    ]
