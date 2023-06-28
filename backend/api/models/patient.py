from django.db import models
from django.db.models import DateField
from django.utils import timezone


class Patient(models.Model):
    id = models.BigAutoField(primary_key=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    date_of_birth = DateField()
    amka = models.CharField(max_length=11, unique=True)
    phone_number = models.CharField(max_length=10, blank=True, null=True)
    address = models.CharField(max_length=150, blank=True, null=True)
    city = models.CharField(max_length=150, blank=True, null=True)
    postal_code = models.CharField(max_length=150, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return "{} {}".format(self.first_name, self.last_name)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
