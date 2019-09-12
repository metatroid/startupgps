# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ContentBlock',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', primary_key=True, auto_created=True)),
                ('alias', models.CharField(max_length=80)),
                ('url', models.CharField(null=True, max_length=200, blank=True)),
                ('location', models.CharField(null=True, max_length=100, blank=True)),
                ('content', models.TextField()),
            ],
        ),
    ]
