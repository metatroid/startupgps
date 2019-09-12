# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import adminsortable.fields


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0005_auto_20151122_0856'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='choice',
            options={'ordering': ['choice_order']},
        ),
        migrations.AlterModelOptions(
            name='question',
            options={'ordering': ['question_order']},
        ),
        migrations.AlterField(
            model_name='choice',
            name='question',
            field=adminsortable.fields.SortableForeignKey(null=True, blank=True, to='questions.Question', related_name='choices'),
        ),
    ]
