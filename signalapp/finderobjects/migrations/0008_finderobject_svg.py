# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finderobjects', '0007_finderobject_saved_resources'),
    ]

    operations = [
        migrations.AddField(
            model_name='finderobject',
            name='svg',
            field=models.TextField(blank=True, null=True),
        ),
    ]
