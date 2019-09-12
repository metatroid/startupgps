# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0014_auto_20151128_0554'),
    ]

    operations = [
        migrations.AlterField(
            model_name='choice',
            name='theme',
            field=models.ForeignKey(blank=True, verbose_name='category to be scored', help_text='Use when the question itself is un-categorized.', related_name='theme_choices', null=True, to='questions.Theme'),
        ),
        migrations.AlterField(
            model_name='choice',
            name='topic',
            field=models.ForeignKey(blank=True, verbose_name='additional taxonomy', related_name='topic_choices', null=True, to='questions.Topic'),
        ),
        migrations.AlterField(
            model_name='question',
            name='theme',
            field=models.ForeignKey(blank=True, verbose_name='top-level categorization', related_name='theme_questions', null=True, to='questions.Theme'),
        ),
        migrations.AlterField(
            model_name='question',
            name='topic',
            field=models.ForeignKey(blank=True, verbose_name='secondary classification', related_name='topic_questions', null=True, to='questions.Topic'),
        ),
        migrations.AlterField(
            model_name='topic',
            name='theme',
            field=models.ForeignKey(blank=True, related_name='topics', null=True, to='questions.Theme'),
        ),
    ]
