# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0004_auto_20151213_0354'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resource',
            name='top_priority_resource',
            field=models.CharField(max_length=255, default='', blank=True, null=True, help_text='Show this resource in results if top priority matches', choices=[('Market', 'Getting customers'), ('Funding', 'Raising money'), ('Product', 'Developing a product'), ('Team', 'Building your team')]),
        ),
    ]
