# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0015_auto_20151128_0819'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='question_type',
            field=models.CharField(choices=[('text', 'text'), ('single', 'single'), ('multi', 'multi'), ('range', 'range'), ('inline-range', 'inline range')], max_length=20, default='single', help_text="Controls how the question and choices will be displayed. e.g. 'text' renders a text input, 'single'/'multi' determines radio buttons or checkboxes, 'range' denotes a horizontal scale, and 'inline range' displays the scale in line with the question."),
        ),
    ]
