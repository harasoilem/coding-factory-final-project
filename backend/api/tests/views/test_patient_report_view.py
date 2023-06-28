from django.urls import reverse
from rest_framework import status
from api.models.patient import Patient
from api.models.patient_report import PatientReport
from authentication.models import User
from rest_framework.test import APITestCase


class TestPatientReportView(APITestCase):

    def setUp(self):
        self.user1 = User.objects.create_user(username='test_user1', email='test1@test.com', password="test")
        self.user1.is_admin = True
        self.user1.save()

        self.user2 = User.objects.create_user(username='test_user2', email='test2@test.com', password="test")
        self.user2.is_admin = True
        self.user2.save()

        self.user3 = User.objects.create_user(username='test_user3', email='test3@test.com', password="test")
        self.user3.is_admin = True
        self.user3.save()

        self.user1_jwt_token = self.user1.tokens().get('access')
        self.user2_jwt_token = self.user2.tokens().get('access')
        self.user3_jwt_token = self.user3.tokens().get('access')

        self.patient_report_serializer_keys = ['id', 'patient', 'symptoms', 'medication',
                                               'allergies', 'diagnosis', 'treatment', 'created_by',
                                               'updated_by', 'created_at', 'updated_at']

        self.patient1 = Patient.objects.create(
            first_name="patient 1 first name",
            last_name="patient 1 last name",
            date_of_birth="1990-01-01",
            amka="12345678901",
            phone_number="1234567890",
            address="address1",
            city="city1",
            postal_code="12345",
        )

        self.patient2 = Patient.objects.create(
            first_name="patient 2 first name",
            last_name="patient 2 last name",
            date_of_birth="1990-01-01",
            amka="12345678902",
            phone_number="1234567890",
            address="address2",
            city="city2",
            postal_code="12345",
        )

        self.patient_report1 = PatientReport.objects.create(
            patient=self.patient1,
            symptoms="symptoms1",
            medication="medication1",
            allergies="allergies1",
            diagnosis="diagnosis1",
            treatment="treatment1",
            created_by=self.user1,
            updated_by=self.user1,
        )

        self.patient_report2 = PatientReport.objects.create(
            patient=self.patient2,
            symptoms="symptoms2",
            medication="medication2",
            allergies="allergies2",
            diagnosis="diagnosis2",
            treatment="treatment2",
            created_by=self.user1,
            updated_by=self.user1,
        )

        self.patient_report3 = PatientReport.objects.create(
            patient=self.patient1,
            symptoms="symptoms3",
            medication="medication3",
            allergies="allergies3",
            diagnosis="diagnosis3",
            treatment="treatment3",
            created_by=self.user1,
            updated_by=self.user1,
        )

        self.sample_patient_report = {
            "patient": self.patient1.id,
            "symptoms": "sample symptoms",
            "medication": "sample medication",
            "allergies": "sample allergies",
            "diagnosis": "sample diagnosis",
        }

        self.patient_report_list_create = reverse('patient_report_list_create')
        self.patient_report_manipulate = reverse('patient_report_manipulate', kwargs={'pk': self.patient_report1.id})

    def test_patient_report_access_only_if_authenticated(self):
        response = self.client.get(self.patient_report_list_create)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post(self.patient_report_list_create, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.get(self.patient_report_manipulate)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.put(self.patient_report_manipulate, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.delete(self.patient_report_manipulate, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patient_report_list(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.user1_jwt_token))
        response = self.client.get(self.patient_report_list_create)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 3)

        patient_report_new = PatientReport.objects.create(
            patient=self.patient1,
            symptoms="symptoms new",
            medication="medication new",
            allergies="allergies new",
            diagnosis="diagnosis new",
        )

        response = self.client.get(self.patient_report_list_create, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)
        self.assertCountEqual(response.data[0], self.patient_report_serializer_keys)
        self.assertEqual(response.data[0]['patient'], patient_report_new.patient.id)
        self.assertEqual(response.data[0]['symptoms'], patient_report_new.symptoms)
        self.assertEqual(response.data[0]['medication'], patient_report_new.medication)
        self.assertEqual(response.data[0]['allergies'], patient_report_new.allergies)
        self.assertEqual(response.data[0]['diagnosis'], patient_report_new.diagnosis)

        self.assertEqual(response.data[1]['patient'], self.patient_report3.patient.id)
        self.assertEqual(response.data[1]['symptoms'], self.patient_report3.symptoms)
        self.assertEqual(response.data[1]['medication'], self.patient_report3.medication)
        self.assertEqual(response.data[1]['allergies'], self.patient_report3.allergies)
        self.assertEqual(response.data[1]['diagnosis'], self.patient_report3.diagnosis)

        self.assertEqual(response.data[2]['patient'], self.patient_report2.patient.id)
        self.assertEqual(response.data[2]['symptoms'], self.patient_report2.symptoms)
        self.assertEqual(response.data[2]['medication'], self.patient_report2.medication)
        self.assertEqual(response.data[2]['allergies'], self.patient_report2.allergies)
        self.assertEqual(response.data[2]['diagnosis'], self.patient_report2.diagnosis)

        self.assertEqual(response.data[3]['patient'], self.patient_report1.patient.id)
        self.assertEqual(response.data[3]['symptoms'], self.patient_report1.symptoms)
        self.assertEqual(response.data[3]['medication'], self.patient_report1.medication)
        self.assertEqual(response.data[3]['allergies'], self.patient_report1.allergies)
        self.assertEqual(response.data[3]['diagnosis'], self.patient_report1.diagnosis)

    def test_patient_report_create_admin(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.user3_jwt_token))

        response = self.client.post(self.patient_report_list_create, self.sample_patient_report, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertCountEqual(response.data, self.patient_report_serializer_keys)

        self.assertEqual(response.data['patient'], self.sample_patient_report['patient'])
        self.assertEqual(response.data['symptoms'], self.sample_patient_report['symptoms'])
        self.assertEqual(response.data['medication'], self.sample_patient_report['medication'])
        self.assertEqual(response.data['allergies'], self.sample_patient_report['allergies'])
        self.assertEqual(response.data['diagnosis'], self.sample_patient_report['diagnosis'])
        self.assertEqual(response.data['created_by'], self.user3.id)
        self.assertEqual(response.data['updated_by'], self.user3.id)

    def test_patient_report_create_error_400(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.user1_jwt_token))
        del self.sample_patient_report['patient']

        response = self.client.post(self.patient_report_list_create, self.sample_patient_report, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['patient'][0], "This field is required.")

    def test_patient_report_retrieve(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.user2_jwt_token))

        patient_report_manipulate = reverse('patient_report_manipulate', kwargs={'pk': self.patient_report3.id})

        response = self.client.get(patient_report_manipulate, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertCountEqual(response.data, self.patient_report_serializer_keys)
        self.assertEqual(response.data['patient'], self.patient_report3.patient.id)
        self.assertEqual(response.data['symptoms'], self.patient_report3.symptoms)
        self.assertEqual(response.data['medication'], self.patient_report3.medication)
        self.assertEqual(response.data['allergies'], self.patient_report3.allergies)
        self.assertEqual(response.data['diagnosis'], self.patient_report3.diagnosis)
        self.assertEqual(response.data['created_by'], self.user1.id)
        self.assertEqual(response.data['updated_by'], self.user1.id)

    def test_patient_report_update(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.user2_jwt_token))

        patient_report_manipulate = reverse('patient_report_manipulate', kwargs={'pk': self.patient_report3.id})

        self.sample_patient_report['symptoms'] = 'symptoms updated'

        response = self.client.put(patient_report_manipulate, self.sample_patient_report, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.patient_report3.refresh_from_db()

        self.assertCountEqual(response.data, self.patient_report_serializer_keys)

        self.assertEqual(response.data['patient'], self.patient_report3.patient.id)
        self.assertEqual(response.data['symptoms'], self.patient_report3.symptoms)
        self.assertEqual(response.data['medication'], self.patient_report3.medication)
        self.assertEqual(response.data['allergies'], self.patient_report3.allergies)
        self.assertEqual(response.data['diagnosis'], self.patient_report3.diagnosis)
        self.assertEqual(response.data['created_by'], self.user1.id)
        self.assertEqual(response.data['updated_by'], self.user2.id)

    def test_patient_report_update_no_data(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.user1_jwt_token))

        response = self.client.put(self.patient_report_manipulate, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['patient'][0], "This field is required.")

    def test_patient_report_delete(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.user1_jwt_token))

        self.assertEqual(PatientReport.objects.count(), 3)

        response = self.client.delete(self.patient_report_manipulate, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], "Object deleted successfully.")
        self.assertEqual(PatientReport.objects.count(), 2)
