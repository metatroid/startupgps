# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('finderobjects', '0006_auto_20151204_0513'),
    ]

    operations = [
        migrations.AddField(
            model_name='finderobject',
            name='saved_resources',
            field=jsonfield.fields.JSONField(null=True, blank=True),
        ),
    ]
