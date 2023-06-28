from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from authentication.models import User


class TestLoginView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('login')
        self.health_url = reverse('health_view')
        self.admin_only_url = reverse('admin_only_view')
        self.auth_only_url = reverse('auth_only_view')

        self.admin_user = User.objects.create_user(username='admin', email='admin@test.com',
                                                   password="123456")
        self.admin_user.is_admin = True
        self.admin_user.save()

        self.admin_user_jwt_token = self.admin_user.tokens().get('access')

        self.simple_user = User.objects.create_user(username='simple_user', email='user@test.com',
                                                    password="123456")
        self.simple_user.is_admin = False
        self.simple_user.save()

        self.simple_user_jwt_token = self.simple_user.tokens().get('access')

    def test_user_cannot_login_with_no_data(self):
        res = self.client.post(self.login_url)
        self.assertEqual(res.status_code, 400)


    def test_login_admin_user_with_email(self):
        login_data = {
            "username": "admin@test.com",
            "password": "123456",
        }

        response = self.client.post(self.login_url, login_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertCountEqual(response.data,
                              ['id', "is_admin", 'tokens', 'username'])
        self.assertCountEqual(response.data['tokens'], ['access', 'refresh'])
        self.assertEqual(response.data['username'], 'admin')
        self.assertEqual(response.data['is_admin'], True)


    def test_login_admin_user(self):
        login_data = {
            "username": "admin",
            "password": "123456",
        }

        response = self.client.post(self.login_url, login_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertCountEqual(response.data,
                              ['id', "is_admin", 'tokens', 'username'])
        self.assertCountEqual(response.data['tokens'], ['access', 'refresh'])
        self.assertEqual(response.data['username'], 'admin')
        self.assertEqual(response.data['is_admin'], True)

    def test_login_simple_user(self):
        login_data = {
            "username": "simple_user",
            "password": "123456",
        }

        response = self.client.post(self.login_url, login_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertCountEqual(response.data,
                              ['id', "is_admin", 'tokens', 'username'])
        self.assertCountEqual(response.data['tokens'], ['access', 'refresh'])
        self.assertEqual(response.data['username'], 'simple_user')
        self.assertEqual(response.data['is_admin'], False)

    def test_unregistered_user_can_access_only_health(self):
        response = self.client.get(self.health_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(self.auth_only_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.get(self.admin_only_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_simple_user_can_not_access_admin_only_view(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.simple_user_jwt_token))

        response = self.client.get(self.health_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(self.auth_only_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(self.admin_only_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_registered_user_can_access_all_views(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.admin_user_jwt_token))

        response = self.client.get(self.health_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(self.auth_only_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(self.admin_only_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
