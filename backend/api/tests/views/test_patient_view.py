from django.urls import reverse
from rest_framework import status

from api.models.patient import Patient
from authentication.models import User
from rest_framework.test import APITestCase


class TestPatientView(APITestCase):

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

        self.patient_serializer_keys = ['id', 'first_name', 'last_name', 'date_of_birth',
                                        'amka', 'phone_number', 'address', 'city',
                                        'postal_code', 'created_at', 'updated_at']

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

        self.sample_patient = {
            "first_name": "sample patient first name",
            "last_name": "sample patient last name",
            "date_of_birth": "1990-01-01",
            "amka": "12345678903",
            "phone_number": "1234567890",
            "address": "address3",
            "city": "city3",
            "postal_code": "12345",
        }

        self.patient_list_create = reverse('patient_list_create')
        self.patient_manipulate = reverse('patient_manipulate', kwargs={'pk': self.patient1.id})

    def test_patient_access_only_if_authenticated(self):
        response = self.client.get(self.patient_list_create)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post(self.patient_list_create, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.get(self.patient_manipulate)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.put(self.patient_manipulate, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.delete(self.patient_manipulate, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patient_list(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.user1_jwt_token))
        response = self.client.get(self.patient_list_create)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 2)

        patient_new = Patient.objects.create(
            first_name="patient new first name",
            last_name="patient new last name",
            date_of_birth="1991-01-01",
            amka="12345678904",
        )

        response = self.client.get(self.patient_list_create, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        self.assertCountEqual(response.data[0], self.patient_serializer_keys)
        self.assertEqual(response.data[0]['first_name'], patient_new.first_name)
        self.assertEqual(response.data[0]['last_name'], patient_new.last_name)
        self.assertEqual(response.data[0]['date_of_birth'], patient_new.date_of_birth.strftime("%Y-%m-%d"))
        self.assertEqual(response.data[0]['amka'], patient_new.amka)
        self.assertEqual(response.data[1]['first_name'], self.patient2.first_name)
        self.assertEqual(response.data[1]['last_name'], self.patient2.last_name)
        self.assertEqual(response.data[1]['date_of_birth'], self.patient2.date_of_birth.strftime("%Y-%m-%d"))
        self.assertEqual(response.data[1]['amka'], self.patient2.amka)
        self.assertEqual(response.data[2]['first_name'], self.patient1.first_name)
        self.assertEqual(response.data[2]['last_name'], self.patient1.last_name)
        self.assertEqual(response.data[2]['date_of_birth'], self.patient1.date_of_birth.strftime("%Y-%m-%d"))
        self.assertEqual(response.data[2]['amka'], self.patient1.amka)

    def test_patient_create_admin(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.user1_jwt_token))

        response = self.client.post(self.patient_list_create, self.sample_patient, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertCountEqual(response.data, self.patient_serializer_keys)

        self.assertEqual(response.data['first_name'], self.sample_patient['first_name'])
        self.assertEqual(response.data['last_name'], self.sample_patient['last_name'])
        self.assertEqual(response.data['date_of_birth'], self.sample_patient['date_of_birth'])
        self.assertEqual(response.data['amka'], self.sample_patient['amka'])
        self.assertEqual(response.data['phone_number'], self.sample_patient['phone_number'])
        self.assertEqual(response.data['address'], self.sample_patient['address'])
        self.assertEqual(response.data['city'], self.sample_patient['city'])
        self.assertEqual(response.data['postal_code'], self.sample_patient['postal_code'])

    def test_patient_create_error_400(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.user1_jwt_token))
        del self.sample_patient['first_name']

        response = self.client.post(self.patient_list_create, self.sample_patient, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['first_name'][0], "This field is required.")

    def test_patient_retrieve(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.user1_jwt_token))

        response = self.client.get(self.patient_manipulate, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertCountEqual(response.data, self.patient_serializer_keys)
        self.assertEqual(response.data['first_name'], self.patient1.first_name)
        self.assertEqual(response.data['last_name'], self.patient1.last_name)
        self.assertEqual(response.data['date_of_birth'], self.patient1.date_of_birth.strftime("%Y-%m-%d"))
        self.assertEqual(response.data['amka'], self.patient1.amka)
        self.assertEqual(response.data['phone_number'], self.patient1.phone_number)
        self.assertEqual(response.data['address'], self.patient1.address)
        self.assertEqual(response.data['city'], self.patient1.city)
        self.assertEqual(response.data['postal_code'], self.patient1.postal_code)

    def test_patient_update(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.user1_jwt_token))
        self.sample_patient['first_name'] = "new first name"

        response = self.client.put(self.patient_manipulate, self.sample_patient, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertCountEqual(response.data, self.patient_serializer_keys)

        self.assertEqual(response.data['first_name'], self.sample_patient['first_name'])
        self.assertEqual(response.data['last_name'], self.sample_patient['last_name'])
        self.assertEqual(response.data['date_of_birth'], self.sample_patient['date_of_birth'])
        self.assertEqual(response.data['amka'], self.sample_patient['amka'])
        self.assertEqual(response.data['phone_number'], self.sample_patient['phone_number'])
        self.assertEqual(response.data['address'], self.sample_patient['address'])
        self.assertEqual(response.data['city'], self.sample_patient['city'])
        self.assertEqual(response.data['postal_code'], self.sample_patient['postal_code'])

    def test_patient_update_no_data(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.user1_jwt_token))

        response = self.client.put(self.patient_manipulate, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['first_name'][0], "This field is required.")

    def test_patient_delete(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.user1_jwt_token))

        self.assertEqual(Patient.objects.count(), 2)

        response = self.client.delete(self.patient_manipulate, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], "Object deleted successfully.")
        self.assertEqual(Patient.objects.count(), 1)
