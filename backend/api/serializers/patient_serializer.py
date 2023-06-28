from rest_framework import serializers
from api.models.patient import Patient


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'first_name', 'last_name', 'date_of_birth', 'amka', 'phone_number', 'address', 'city',
                  'postal_code', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
