from django.urls import path
from authentication.views.login_view import LoginAPIView

urlpatterns = [
    path('login', LoginAPIView.as_view(), name="login"),
]
