# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0019_auto_20151129_1624'),
    ]

    operations = [
        migrations.AlterField(
            model_name='choice',
            name='resource',
            field=models.ForeignKey(null=True, help_text='Associate a resource with this choice to display immediately upon selecting', verbose_name='associated resource', related_name='resources', blank=True, to='resources.Resource'),
        ),
        migrations.AlterField(
            model_name='question',
            name='resource',
            field=models.ForeignKey(null=True, help_text='Associate a resource with this question to display immediately upon answering', verbose_name='associated resource', related_name='resource', blank=True, to='resources.Resource'),
        ),
    ]
