from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests

OPENWEATHER_API_KEY = '8791889ed8485e664c2cb55036e49f57'  # Replace with your API key

@api_view(['GET'])
def get_weather(request):
    city = request.GET.get('city')
    lat = request.GET.get('lat')
    lon = request.GET.get('lon')

    if city:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
    elif lat and lon:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
    else:
        return Response({"error": "City or latitude/longitude parameters required."}, status=400)
    
    response = requests.get(url)
    data = response.json()
    return Response(data)

