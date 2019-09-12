# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0027_auto_20151212_0806'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='other_topic',
            field=models.ForeignKey(related_name='othertopic_questions', null=True, verbose_name='tertiary classification', to='questions.Topic', blank=True),
        ),
    ]
