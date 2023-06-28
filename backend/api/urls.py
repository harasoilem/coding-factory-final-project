from django.urls import path
from api.views.health_view import health_view
from api.views.admin_only_view import admin_only_view
from api.views.auth_only_view import auth_only_view
from api.views.patient_report_view import PatientReportListCreateAPIView, PatientReportRetrieveUpdateDestroyAPIView
from api.views.patient_view import PatientListCreateAPIView, PatientRetrieveUpdateDestroyAPIView

urlpatterns = [
    path('health', health_view, name='health_view'),
    path('admin_only', admin_only_view, name='admin_only_view'),
    path('auth_only', auth_only_view, name='auth_only_view'),
    path('patient', PatientListCreateAPIView.as_view(), name='patient_list_create'),
    path('patient/<int:pk>', PatientRetrieveUpdateDestroyAPIView.as_view(), name='patient_manipulate'),
    path('patient_report', PatientReportListCreateAPIView.as_view(), name='patient_report_list_create'),
    path('patient_report/<int:pk>', PatientReportRetrieveUpdateDestroyAPIView.as_view(),
         name='patient_report_manipulate'),
]
