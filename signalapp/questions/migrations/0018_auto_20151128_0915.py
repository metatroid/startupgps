# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0017_choice_choice_feedback'),
    ]

    operations = [
        migrations.AlterField(
            model_name='choice',
            name='choice_feedback',
            field=models.CharField(help_text='This field will be shown as immediate feedback to the user once the choice is selected. Leave blank to indicate no feedback should be shown.', null=True, blank=True, max_length=255),
        ),
    ]
