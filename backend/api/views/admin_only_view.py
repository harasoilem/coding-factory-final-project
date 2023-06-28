from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from api.permissions.is_admin_permission import IsAdminPermission


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminPermission])
def admin_only_view(request):
    return JsonResponse({"msg": 'this view is only accessible to admin users'})
