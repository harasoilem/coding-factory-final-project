from rest_framework import serializers
from api.models.patient_report import PatientReport


class PatientReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientReport
        fields = ['id', 'patient', 'symptoms', 'medication', 'allergies', 'diagnosis', 'treatment', 'created_by',
                  'updated_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'updated_by', 'created_at', 'updated_at']
