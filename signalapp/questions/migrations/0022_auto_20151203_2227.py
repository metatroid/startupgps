# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0021_auto_20151203_1603'),
    ]

    operations = [
        migrations.AlterField(
            model_name='choice',
            name='customer_type',
            field=multiselectfield.db.fields.MultiSelectField(max_length=255, null=True, choices=[('buildings', 'buildings'), ('municipalities', 'cities'), ('utilities', 'utilities'), ('', 'not applicable')], verbose_name='additional taxonomy', blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='choice',
            name='product_category',
            field=multiselectfield.db.fields.MultiSelectField(max_length=255, null=True, choices=[('hardware', 'hardware'), ('software', 'software'), ('service', 'service'), ('', 'not applicable')], verbose_name='additional taxonomy', blank=True, default=''),
        ),
    ]
