# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0029_question_use_in_library'),
    ]

    operations = [
        migrations.AddField(
            model_name='theme',
            name='library_info_blurb',
            field=models.CharField(null=True, max_length=255, blank=True),
        ),
    ]
