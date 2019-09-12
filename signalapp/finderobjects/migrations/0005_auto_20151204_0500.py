# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finderobjects', '0004_auto_20151204_0406'),
    ]

    operations = [
        migrations.AlterField(
            model_name='finderobject',
            name='code',
            field=models.CharField(blank=True, unique=True, max_length=80, null=True),
        ),
    ]
