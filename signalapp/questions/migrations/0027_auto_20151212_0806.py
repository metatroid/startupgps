# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0026_auto_20151212_0757'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='possible_score',
            field=models.PositiveIntegerField(blank=True, null=True, help_text='If scoring is weighted, the possible score for this question is needed'),
        ),
        migrations.AlterField(
            model_name='question',
            name='total_possible_score',
            field=models.PositiveIntegerField(blank=True, null=True, help_text='If scoring is weighted, the total possible score for this topic is also needed'),
        ),
    ]
