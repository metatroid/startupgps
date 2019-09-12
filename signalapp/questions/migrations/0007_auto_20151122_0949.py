# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0006_auto_20151122_0902'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='question_category',
            field=models.CharField(default='team', choices=[('team', 'Team'), ('product', 'Product'), ('market', 'Market'), ('operations', 'Operations')], max_length=20),
        ),
        migrations.AlterField(
            model_name='question',
            name='question_type',
            field=models.CharField(default='single', choices=[('single', 'single'), ('multi', 'multi'), ('range', 'range')], max_length=20),
        ),
    ]
