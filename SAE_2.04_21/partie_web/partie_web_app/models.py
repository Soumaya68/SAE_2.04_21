# partie_web_app/models.py
from django.db import models

class Capteur(models.Model):
    capteur_id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    lieu = models.CharField(max_length=100)
    emplacement = models.CharField(max_length=100)

    class Meta:
        db_table = 'capteur'

    def __str__(self):
        return f"{self.nom} ({self.lieu}, {self.emplacement})"
    
class Data(models.Model):
    data_id = models.AutoField(primary_key=True)
    datetime = models.DateTimeField()
    temperature = models.FloatField()
    capteur = models.ForeignKey(Capteur, on_delete=models.DO_NOTHING, db_column='capteur_id')

    class Meta:
        db_table = 'data'

    def __str__(self):
        return f"{self.datetime} - {self.temperature}°C - {self.capteur.nom} ({self.capteur.lieu}, {self.capteur.emplacement})"