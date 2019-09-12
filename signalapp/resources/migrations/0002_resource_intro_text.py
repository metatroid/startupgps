# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import tinymce.models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='resource',
            name='intro_text',
            field=tinymce.models.HTMLField(blank=True, help_text='Text to display when sharing this resource during questionaire.', null=True),
        ),
    ]
