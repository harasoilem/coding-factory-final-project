# Generated by Django 4.2.2 on 2023-06-12 14:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='patientreport',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_reports', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='patientreport',
            name='patient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reports', to='api.patient'),
        ),
        migrations.AddField(
            model_name='patientreport',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='updated_reports', to=settings.AUTH_USER_MODEL),
        ),
    ]