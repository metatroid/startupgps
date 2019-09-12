# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0022_auto_20151203_2227'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='score_percentage',
            field=models.PositiveIntegerField(null=True, default=100, blank=True, help_text='Scoring will be calculated using this value.'),
        ),
    ]
