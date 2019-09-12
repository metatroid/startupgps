# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('supporters', '0004_auto_20160209_0611'),
    ]

    operations = [
        migrations.AlterField(
            model_name='supporter',
            name='supporter_type',
            field=models.CharField(default='supporter', choices=[('supporter', 'Supporter'), ('collaborator', 'Manager'), ('partner', 'Partner')], max_length=20),
        ),
    ]
