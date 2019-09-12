# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0002_auto_20151121_0717'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='question_multichoice',
            field=models.BooleanField(default=False),
        ),
    ]
