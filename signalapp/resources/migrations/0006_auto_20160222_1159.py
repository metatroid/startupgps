# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0005_auto_20151213_0438'),
    ]

    operations = [
        migrations.AddField(
            model_name='resource',
            name='resource_action',
            field=models.CharField(default='', null=True, blank=True, max_length=10, choices=[('Read', 'read'), ('Watch', 'watch'), ('Listen', 'listen'), ('Do', 'do')]),
        ),
        migrations.AddField(
            model_name='resource',
            name='sponsored',
            field=models.BooleanField(default=True),
        ),
    ]
