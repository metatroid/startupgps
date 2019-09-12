# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('finderobjects', '0008_finderobject_svg'),
    ]

    operations = [
        migrations.AddField(
            model_name='finderobject',
            name='answers',
            field=jsonfield.fields.JSONField(null=True, blank=True),
        ),
    ]
