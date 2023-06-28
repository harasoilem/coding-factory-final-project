from django.core.management import BaseCommand
from api.models.patient import Patient
from api.models.patient_report import PatientReport
from authentication.models import User


class Command(BaseCommand):
    def handle(self, *args, **options):
        print("start init_test_data")
        init_test_data()
        print("end init_test_data")


def init_test_data():
    test_user = User.objects.create_user(username='demo', email='demo@test.com')
    test_user.set_password('123456')
    test_user.is_admin = True
    test_user.first_name = 'demo'
    test_user.last_name = 'user'
    test_user.save()

    patient1 = Patient.objects.create(
        first_name='John',
        last_name='Doe',
        date_of_birth='1990-01-01',
        amka='12345678901',
        phone_number='1234567890',
        address='123 Main St',
        city='Athens',
        postal_code='12345',
    )

    patient2 = Patient.objects.create(
        first_name='Jane',
        last_name='Anderson',
        date_of_birth='1980-01-01',
        amka='12345678902',
        phone_number='1234567890',
        address='123 Main St',
        city='Athens',
        postal_code='12345',
    )

    patient_report1 = PatientReport.objects.create(
        patient=patient1,
        symptoms='Fever, Cough',
        medication='Tylenol',
        allergies=None,
        diagnosis='Flu',
        treatment='Rest',
        created_by=test_user,
        updated_by=test_user,
    )

    patient_report2 = PatientReport.objects.create(
        patient=patient2,
        symptoms='Stomach Ache',
        medication='Pepto Bismol',
        allergies=None,
        diagnosis='Indigestion',
        treatment='Rest',
        created_by=test_user,
        updated_by=test_user,
    )

    patient_report3 = PatientReport.objects.create(
        patient=patient1,
        symptoms='Foot Pain',
        medication='Ibuprofen',
        allergies=None,
        diagnosis='Sprain',
        treatment='Rest',
        created_by=test_user,
        updated_by=test_user,
    )
