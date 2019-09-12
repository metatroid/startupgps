# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import tinymce.models


class Migration(migrations.Migration):

    dependencies = [
        ('supporters', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='supporter',
            name='organization',
            field=models.BooleanField(default=False, help_text='Select for organization, leave empty for person', verbose_name='Organization or Person'),
        ),
        migrations.AlterField(
            model_name='supporter',
            name='description',
            field=tinymce.models.HTMLField(null=True, verbose_name='Description/Position', blank=True),
        ),
    ]
