from django.shortcuts import render
from .models import Capteur

def index(request):
    capteurs = Capteur.objects.all()
    return render(request, 'partie_web_app/index.html', {"capteurs": capteurs})
