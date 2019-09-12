# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('supporters', '0003_auto_20160209_0607'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='supporter',
            name='organization',
        ),
        migrations.AddField(
            model_name='supporter',
            name='supporter_type',
            field=models.CharField(choices=[('supporter', 'Supporter'), ('collaborator', 'Collaborator'), ('partner', 'Partner')], default='supporter', max_length=20),
        ),
    ]
