from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Weather API!")

urlpatterns = [
    path('', home, name='home'),  # This maps the root URL to the home view.
    path('admin/', admin.site.urls),
    path('api/', include('weather.urls')),  # Include your weather app's URLs.
]