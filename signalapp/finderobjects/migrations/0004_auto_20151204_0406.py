# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finderobjects', '0003_auto_20151204_0319'),
    ]

    operations = [
        migrations.AlterField(
            model_name='finderobject',
            name='data',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='finderobject',
            name='resources',
            field=models.TextField(null=True, blank=True),
        ),
    ]
