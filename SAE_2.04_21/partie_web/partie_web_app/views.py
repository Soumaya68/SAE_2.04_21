from django.shortcuts import render
from .models import Capteur, Data
from django.db.models import Count, Avg
from django.utils import timezone


def index(request):
    capteurs = Capteur.objects.all()

    # Statistiques
    total_capteurs = capteurs.count()
    total_mesures = Data.objects.count()
    temp_moyenne = Data.objects.aggregate(
        moyenne=Avg('temperature')
    )['moyenne']

    derniere_mesure = Data.objects.latest('datetime').datetime if Data.objects.exists() else None

    context = {
        'capteurs': capteurs,
        'total_capteurs': total_capteurs,
        'total_mesures': total_mesures,
        'temp_moyenne': round(temp_moyenne, 1) if temp_moyenne else None,
        'derniere_mesure': derniere_mesure,
        'donnees': Data.objects.all()[:100]  # Limiter pour les performances
    }

    return render(request, 'partie_web_app/index.html', context)