# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0028_question_other_topic'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='use_in_library',
            field=models.BooleanField(default=False),
        ),
    ]
