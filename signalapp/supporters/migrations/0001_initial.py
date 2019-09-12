# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import tinymce.models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Supporter',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80)),
                ('link', models.CharField(null=True, blank=True, max_length=100)),
                ('image', models.ImageField(null=True, upload_to='', blank=True)),
                ('description', tinymce.models.HTMLField(default='Description/Position', null=True, blank=True)),
            ],
        ),
    ]
