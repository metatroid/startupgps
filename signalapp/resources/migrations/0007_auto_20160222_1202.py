# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0006_auto_20160222_1159'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='resource',
            name='resource_action',
        ),
        migrations.RemoveField(
            model_name='resource',
            name='sponsored',
        ),
    ]
