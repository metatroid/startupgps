# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import tinymce.models


class Migration(migrations.Migration):

    dependencies = [
        ('contentblocks', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contentblock',
            name='content',
            field=tinymce.models.HTMLField(),
        ),
    ]
