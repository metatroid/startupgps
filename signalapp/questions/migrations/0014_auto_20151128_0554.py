# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0013_theme_secondary_taxonomy'),
    ]

    operations = [
        migrations.AlterField(
            model_name='choice',
            name='customer_type',
            field=models.CharField(verbose_name='additional taxonomy', max_length=20, default='', choices=[('buildings', 'buildings'), ('municipalities', 'cities'), ('utilities', 'utilities'), ('', 'not applicable')], blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='choice',
            name='product_category',
            field=models.CharField(verbose_name='additional taxonomy', max_length=255, default='', choices=[('hardware', 'hardware'), ('software', 'software'), ('service', 'service'), ('', 'not applicable')], blank=True, null=True),
        ),
    ]
