from django.test import TestCase

from api.serializers.patient_serializer import PatientSerializer


class TestPatientSerializer(TestCase):

    def setUp(self):
        self.serializer_fields = ['id', 'first_name', 'last_name', 'date_of_birth',
                                  'amka', 'phone_number', 'address', 'city',
                                  'postal_code', 'created_at', 'updated_at']

        self.attributes = {
            "first_name": "patient1",
            "last_name": "patient1",
            "date_of_birth": "1990-01-01",
            "amka": "12345678901",
            "phone_number": "1234567890",
            "address": "address1",
            "city": "city1",
            "postal_code": "12345",
        }

        self.serializer_data = {
            "first_name": "patient1",
            "last_name": "patient1",
            "date_of_birth": "1990-01-01",
            "amka": "12345678901",
            "phone_number": "1234567890",
            "address": "address1",
            "city": "city1",
            "postal_code": "12345",
        }

    def test_valid_patient_serializer(self):
        serializer = PatientSerializer(data=self.attributes)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(set(serializer.validated_data.keys()), set(self.attributes.keys()))
        serializer.save()
        self.serializer_data['id'] = serializer.instance.id
        self.assertCountEqual(serializer.data.keys(), self.serializer_fields)
        self.assertEqual(serializer.errors, {})

    def test_invalid_patient_serializer(self):
        del self.attributes['first_name']
        serializer = PatientSerializer(data=self.attributes)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(serializer.validated_data, {})
        self.assertEqual(serializer.data, self.attributes)
        self.assertEqual(str(serializer.errors['first_name'][0]), "This field is required.")
