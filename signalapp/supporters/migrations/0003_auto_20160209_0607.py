# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('supporters', '0002_auto_20160209_0600'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='supporter',
            options={'ordering': ['supporter_order']},
        ),
        migrations.AddField(
            model_name='supporter',
            name='supporter_order',
            field=models.PositiveIntegerField(db_index=True, editable=False, default=0),
        ),
    ]
