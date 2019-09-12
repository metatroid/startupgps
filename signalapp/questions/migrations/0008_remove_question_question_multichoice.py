# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0007_auto_20151122_0949'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='question_multichoice',
        ),
    ]
