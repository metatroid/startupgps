# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0023_question_score_percentage'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='total_possible_Score',
            field=models.PositiveIntegerField(blank=True, null=True, help_text='If scoring is weighted, the total possible score is needed'),
        ),
        migrations.AlterField(
            model_name='question',
            name='score_percentage',
            field=models.PositiveIntegerField(blank=True, null=True, help_text="Use this value to weight questions' score."),
        ),
    ]
