# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0008_remove_question_question_multichoice'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='question_type',
            field=models.CharField(default='single', choices=[('text', 'text'), ('single', 'single'), ('multi', 'multi'), ('range', 'range')], max_length=20),
        ),
    ]
