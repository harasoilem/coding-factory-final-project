from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auth_only_view(request):
    return JsonResponse({"msg": 'this view is only accessible to authenticated users'})
