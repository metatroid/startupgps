# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0012_auto_20151128_0536'),
    ]

    operations = [
        migrations.AddField(
            model_name='theme',
            name='secondary_taxonomy',
            field=models.BooleanField(default=False),
        ),
    ]
