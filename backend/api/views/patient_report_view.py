from rest_framework import generics, status, filters
from rest_framework.exceptions import ParseError, NotAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from api.models.patient_report import PatientReport
from api.serializers.patient_report_serializer import PatientReportSerializer


class PatientReportListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PatientReportSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['id', 'created_at', 'patient']
    ordering = ['-created_at']
    search_fields = ['id', 'symptoms', 'diagnosis', 'treatment']
    filterset_fields = {
        'id': ['exact'],
        'patient': ['exact'],
    }

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise NotAuthenticated("You are not authenticated to perform this action.")

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            instance.created_by = request.user
            instance.updated_by = request.user
            instance.save()

            return Response(self.get_serializer(instance).data, status=status.HTTP_201_CREATED)
        raise ParseError(serializer.errors)

    def get_queryset(self):
        queryset = PatientReport.objects.all()
        return queryset


class PatientReportRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PatientReport.objects.all()
    serializer_class = PatientReportSerializer

    def update(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise NotAuthenticated("You are not authenticated to perform this action.")
        instance = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            updated_instance = serializer.update(instance, serializer.validated_data)
            updated_instance.updated_at = timezone.now()
            updated_instance.updated_by = request.user
            updated_instance.save()
            serializer = self.get_serializer(updated_instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        raise ParseError(serializer.errors)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise NotAuthenticated("You are not authenticated to perform this action.")
        instance = self.get_object()
        instance.delete()
        return Response({"detail": "Object deleted successfully."}, status=status.HTTP_200_OK)
