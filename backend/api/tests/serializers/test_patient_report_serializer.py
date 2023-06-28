from django.test import TestCase

from api.models.patient import Patient
from api.serializers.patient_report_serializer import PatientReportSerializer


class TestPatientReportSerializer(TestCase):

    def setUp(self):
        self.serializer_fields = ['id', 'patient', 'symptoms', 'medication',
                                  'allergies', 'diagnosis', 'treatment', 'created_by',
                                  'updated_by', 'created_at', 'updated_at']

        patient = Patient.objects.create(
            first_name="patient1",
            last_name="patient1",
            date_of_birth="1990-01-01",
            amka="12345678901",
            phone_number="1234567890",
            address="address1",
            city="city1",
            postal_code="12345",
        )

        self.attributes = {
            "patient": patient.id,
            "symptoms": "symptoms1",
            "medication": "medication1",
            "allergies": "allergies1",
            "diagnosis": "diagnosis1",
            "treatment": "treatment1",
        }

        self.serializer_data = {
            "patient": patient.id,
            "symptoms": "symptoms1",
            "medication": "medication1",
            "allergies": "allergies1",
            "diagnosis": "diagnosis1",
            "treatment": "treatment1",
        }

    def test_valid_patient_report_serializer(self):
        serializer = PatientReportSerializer(data=self.attributes)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(set(serializer.validated_data.keys()), set(self.attributes.keys()))
        serializer.save()
        self.serializer_data['id'] = serializer.instance.id
        self.assertCountEqual(serializer.data.keys(), self.serializer_fields)
        self.assertEqual(serializer.errors, {})

    def test_invalid_patient_report_serializer(self):
        del self.attributes['patient']
        serializer = PatientReportSerializer(data=self.attributes)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(serializer.validated_data, {})
        self.assertEqual(serializer.data, self.attributes)
        self.assertEqual(str(serializer.errors['patient'][0]), "This field is required.")
