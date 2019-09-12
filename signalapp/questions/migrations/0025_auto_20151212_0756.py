# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0024_auto_20151212_0755'),
    ]

    operations = [
        migrations.RenameField(
            model_name='question',
            old_name='total_possible_Score',
            new_name='total_possible_score',
        ),
        migrations.AlterField(
            model_name='question',
            name='score_percentage',
            field=models.PositiveIntegerField(default=100, help_text="Use this value to weight questions' score.", null=True, blank=True),
        ),
    ]
