# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0016_auto_20151128_0829'),
    ]

    operations = [
        migrations.AddField(
            model_name='choice',
            name='choice_feedback',
            field=models.TextField(null=True, blank=True, help_text='This field will be shown as immediate feedback to the user once the choice is selected. Leave blank to indicate no feedback should be shown.'),
        ),
    ]
