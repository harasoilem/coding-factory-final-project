from django.test import TestCase
from authentication.serializers.login_serializer import LoginSerializer


class TestLoginSerializer(TestCase):
    def setUp(self):
        self.attributes = {
            "username": "user 1",
            "password": "icsd12189",
        }

        self.serializer_data = {
            "username": "user 1",
            "password": "icsd12189",
        }

    def test_valid_login_serializer(self):
        serializer = LoginSerializer(data=self.attributes)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(set(serializer.validated_data.keys()), set(self.attributes.keys()))

    def test_invalid_login_serializer(self):
        del self.attributes['password']
        serializer = LoginSerializer(data=self.attributes)
        self.assertFalse(serializer.is_valid())

