from django.urls import path, include

urlpatterns = [
    path('api/v1/', include('api.urls')),
    path('auth/', include('authentication.urls')),
]