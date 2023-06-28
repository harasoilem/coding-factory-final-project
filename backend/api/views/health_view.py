from django.http import JsonResponse
from rest_framework.decorators import api_view


@api_view(['GET'])
def health_view(request):
    return JsonResponse({"health": 'ok'})
