# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0004_auto_20151121_1033'),
    ]

    operations = [
        migrations.AddField(
            model_name='choice',
            name='choice_order',
            field=models.PositiveIntegerField(default=0, db_index=True, editable=False),
        ),
        migrations.AddField(
            model_name='question',
            name='question_order',
            field=models.PositiveIntegerField(default=0, db_index=True, editable=False),
        ),
    ]
