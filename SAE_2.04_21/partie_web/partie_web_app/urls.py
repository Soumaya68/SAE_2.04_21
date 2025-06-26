from .views import index
from django.urls import path
from django.conf import settings


urlpatterns = [
    path('', index, name='index'),
]
