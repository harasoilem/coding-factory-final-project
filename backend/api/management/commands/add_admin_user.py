from django.core.management import BaseCommand
from authentication.models import User


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('-u', '--username', type=str, help='Define a username', )
        parser.add_argument('-e', '--email', type=str, help='Define a email', )
        parser.add_argument('-p', '--password', type=str, help='Define a password', )

    def handle(self, *args, **options):
        username = options['username']
        if not username:
            print("username is required")
            return

        email = options['email']
        if not email:
            print("email is required")
            return

        password = options['password']
        if not password:
            print("password is required")
            return

        new_admin_user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )
        # new_admin_user.set_password('123456')
        new_admin_user.is_admin = True
        new_admin_user.first_name = username
        new_admin_user.save()
