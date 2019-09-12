# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0002_resource_intro_text'),
    ]

    operations = [
        migrations.AddField(
            model_name='resource',
            name='top_priority_resource',
            field=models.CharField(choices=[('customers', 'Getting customers'), ('money', 'Raising money'), ('product', 'Developing a product'), ('team', 'Building your team')], blank=True, null=True, max_length=255, verbose_name='additional taxonomy', default=''),
        ),
    ]
