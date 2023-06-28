from django.db import models
from django.utils import timezone


class PatientReport(models.Model):
    id = models.BigAutoField(primary_key=True)
    patient = models.ForeignKey('Patient', related_name="reports", on_delete=models.CASCADE)

    symptoms = models.TextField()
    medication = models.TextField(blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    diagnosis = models.TextField(blank=True, null=True)
    treatment = models.TextField(blank=True, null=True)

    created_by = models.ForeignKey('authentication.User', blank=True, null=True,
                                   related_name="created_reports",
                                   on_delete=models.CASCADE)
    updated_by = models.ForeignKey('authentication.User', blank=True, null=True,
                                   related_name="updated_reports",
                                   on_delete=models.CASCADE)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return "{} {} - {}".format(self.patient.first_name, self.patient.last_name, self.created_at)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
