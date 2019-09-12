# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0003_resource_top_priority_resource'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resource',
            name='top_priority_resource',
            field=models.CharField(help_text='Show this resource in results if top priority matches', null=True, max_length=255, blank=True, choices=[('customers', 'Getting customers'), ('money', 'Raising money'), ('product', 'Developing a product'), ('team', 'Building your team')], default=''),
        ),
    ]
