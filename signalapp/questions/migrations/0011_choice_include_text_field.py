# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0010_auto_20151125_1011'),
    ]

    operations = [
        migrations.AddField(
            model_name='choice',
            name='include_text_field',
            field=models.BooleanField(default=False),
        ),
    ]
