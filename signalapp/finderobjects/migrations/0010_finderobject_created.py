# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.utils.timezone import utc
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('finderobjects', '0009_finderobject_answers'),
    ]

    operations = [
        migrations.AddField(
            model_name='finderobject',
            name='created',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2016, 6, 7, 22, 6, 31, 92092, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
