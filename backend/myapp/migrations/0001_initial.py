# Generated by Django 4.2.1 on 2023-05-27 02:20

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DailyStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('idKey', models.CharField(default='', max_length=16)),
                ('posStat', models.IntegerField(default=0)),
                ('negStat', models.IntegerField(default=0)),
            ],
        ),
    ]
