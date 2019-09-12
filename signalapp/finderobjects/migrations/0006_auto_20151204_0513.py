# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('finderobjects', '0005_auto_20151204_0500'),
    ]

    operations = [
        migrations.AlterField(
            model_name='finderobject',
            name='data',
            field=jsonfield.fields.JSONField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='finderobject',
            name='resources',
            field=jsonfield.fields.JSONField(null=True, blank=True),
        ),
    ]
