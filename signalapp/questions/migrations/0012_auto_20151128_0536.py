# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0011_choice_include_text_field'),
    ]

    operations = [
        migrations.CreateModel(
            name='Theme',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('secondary_taxonomy', models.BooleanField(default=False)),
                ('theme', models.ForeignKey(blank=True, null=True, related_name='themes', to='questions.Theme')),
            ],
        ),
        migrations.RemoveField(
            model_name='choice',
            name='choice_feedback',
        ),
        migrations.RemoveField(
            model_name='question',
            name='question_category',
        ),
        migrations.RemoveField(
            model_name='question',
            name='question_total_value',
        ),
        migrations.AddField(
            model_name='choice',
            name='customer_type',
            field=models.CharField(verbose_name='additional taxonomy', max_length=20, default='', choices=[('buildings', 'buildings'), ('municipalities', 'cities'), ('utilities', 'utilities'), ('', 'not applicable')]),
        ),
        migrations.AddField(
            model_name='choice',
            name='product_category',
            field=models.CharField(verbose_name='additional taxonomy', max_length=255, default='', choices=[('hardware', 'hardware'), ('software', 'software'), ('service', 'service'), ('', 'not applicable')]),
        ),
        migrations.AlterField(
            model_name='choice',
            name='choice_value',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='choice',
            name='include_text_field',
            field=models.BooleanField(verbose_name='include text field?', help_text="For use with 'other' choices. Will display a text field for user entry when selected.", default=False),
        ),
        migrations.AlterField(
            model_name='question',
            name='question_feedback',
            field=models.TextField(help_text='This field will be shown as immediate feedback to the user once the question is answered. Leave blank to indicate no feedback should be shown.', null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='question_subtext',
            field=models.CharField(max_length=255, help_text="Optional subtext below the question's label", null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='question_type',
            field=models.CharField(default='single', max_length=20, choices=[('text', 'text'), ('single', 'single'), ('multi', 'multi'), ('range', 'range')], help_text="Controls how the question and choices will be displayed. e.g. 'text' renders a text input, 'single'/'multi' determines radio buttons or checkboxes, and 'range' denotes a horizontal scale."),
        ),
        migrations.AddField(
            model_name='choice',
            name='theme',
            field=models.ForeignKey(verbose_name='category to be scored', blank=True, null=True, related_name='choice_theme', help_text='Use when the question itself is un-categorized.', to='questions.Theme'),
        ),
        migrations.AddField(
            model_name='choice',
            name='topic',
            field=models.ForeignKey(verbose_name='additional taxonomy', blank=True, null=True, related_name='choice_topic', to='questions.Topic'),
        ),
        migrations.AddField(
            model_name='question',
            name='theme',
            field=models.ForeignKey(verbose_name='top-level categorization', blank=True, null=True, related_name='question_theme', to='questions.Theme'),
        ),
        migrations.AddField(
            model_name='question',
            name='topic',
            field=models.ForeignKey(verbose_name='secondary classification', blank=True, null=True, related_name='question_topic', to='questions.Topic'),
        ),
    ]
