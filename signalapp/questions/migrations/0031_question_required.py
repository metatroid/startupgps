# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0030_theme_library_info_blurb'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='required',
            field=models.BooleanField(default=True),
        ),
    ]
