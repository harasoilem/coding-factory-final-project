from django.contrib import auth
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from authentication.models import User
from authentication.serializers.login_serializer import LoginSerializer
from django.utils import timezone


class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = request.data['username']
            password = request.data['password']

            user_to_login = User.objects.filter(Q(username=username) | Q(email=username)).first()
            if user_to_login is not None:
                user = auth.authenticate(username=user_to_login.username, password=password)
                if not user:
                    return Response({"error": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
                if not user.is_active:
                    return Response({"error": "Account is disabled, please contact the administrator."},
                                    status=status.HTTP_400_BAD_REQUEST)
                user_to_login.last_login = timezone.now()
                user_to_login.save(update_fields=['last_login'])
                response_data = {
                    'id': user.id,
                    'username': user.username,
                    'is_admin': user.is_admin,
                    'tokens': user.tokens(),
                }

                return Response(response_data, status=status.HTTP_200_OK)

            return Response({"error": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
