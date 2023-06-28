from rest_framework import generics, status, filters
from rest_framework.exceptions import ParseError, NotAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from api.models.patient import Patient
from api.serializers.patient_serializer import PatientSerializer


class PatientListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PatientSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['id', 'created_at', 'first_name', 'last_name']
    ordering = ['-created_at']
    search_fields = ['id', 'first_name', 'last_name']
    filterset_fields = {
        'id': ['exact'],
        'first_name': ['in'],
        'last_name': ['in'],
    }

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise NotAuthenticated("You are not authenticated to perform this action.")

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(self.get_serializer(instance).data, status=status.HTTP_201_CREATED)
        raise ParseError(serializer.errors)

    def get_queryset(self):
        queryset = Patient.objects.all()
        return queryset


class PatientRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def update(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise NotAuthenticated("You are not authenticated to perform this action.")
        instance = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            updated_instance = serializer.update(instance, serializer.validated_data)
            updated_instance.updated_at = timezone.now()
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
