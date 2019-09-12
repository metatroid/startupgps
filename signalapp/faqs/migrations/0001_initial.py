# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import tinymce.models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Faq',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('question', models.CharField(max_length=80)),
                ('answer', tinymce.models.HTMLField()),
                ('faq_order', models.PositiveIntegerField(default=0, editable=False, db_index=True)),
            ],
            options={
                'ordering': ['faq_order'],
            },
        ),
    ]
