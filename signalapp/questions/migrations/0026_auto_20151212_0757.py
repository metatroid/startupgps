# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0025_auto_20151212_0756'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='total_possible_score',
            field=models.PositiveIntegerField(help_text='If scoring is weighted, the total possible score for this question is needed', blank=True, null=True),
        ),
    ]
