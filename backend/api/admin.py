from django.contrib import admin
from api.models.patient import Patient
from api.models.patient_report import PatientReport

admin.site.register(Patient)
admin.site.register(PatientReport)
