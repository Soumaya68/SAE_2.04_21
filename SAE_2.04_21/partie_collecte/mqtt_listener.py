import paho.mqtt.client as mqtt
import mariadb
from datetime import datetime

def connexion_bdd():
    """Établit une connexion à la base de données MariaDB."""
    return mariadb.connect(user="root",password="toto",host="172.17.0.2", port=3306,database="maison")

def obtenir_ou_creer_capteur(connexion, nom, lieu, emplacement):
    """Récupère l'ID du capteur ou le crée s'il n'existe pas."""
    curseur = connexion.cursor()
    curseur.execute(f"SELECT capteur_id FROM capteur WHERE nom='{nom}' AND lieu='{lieu}' AND emplacement='{emplacement}'")
    ligne = curseur.fetchone()
    if ligne:
        return ligne[0]
    
    curseur.execute(f"INSERT INTO capteur (nom, lieu, emplacement) VALUES ('{nom}', '{lieu}', '{emplacement}')")
    connexion.commit()
    return curseur.lastrowid

def inserer_donnee(connexion, date_heure, temperature, capteur_id):
    """Insère une nouvelle donnée dans la table data."""
    curseur = connexion.cursor()
    curseur.execute(f"INSERT INTO data (datetime, temperature, capteur_id) VALUES ('{date_heure}', {temperature}, {capteur_id})")
    connexion.commit()

def gerer_message(_client, _userdata, message_mqtt):
    """Callback exécuté à la réception d'un message MQTT."""
    message = message_mqtt.payload.decode()
    print(f"Message reçu : {message}")

    data_du_mqtt = {}
    for item in message.split(","):
        if "=" in item:
            cle, valeur = item.split("=", 1)
            data_du_mqtt[cle] = valeur

    nom = data_du_mqtt["Id"]
    lieu = data_du_mqtt["piece"]
    date = data_du_mqtt["date"]
    heure = data_du_mqtt["time"]
    temperature = float(data_du_mqtt["temp"])
    date_heure = datetime.strptime(f"{date} {heure}", "%d/%m/%Y %H:%M:%S")

    emplacement = message_mqtt.topic.split("/")[-1]

    connexion = connexion_bdd()
    capteur_id = obtenir_ou_creer_capteur(connexion, nom, lieu, emplacement)
    inserer_donnee(connexion, date_heure, temperature, capteur_id)
    connexion.close()
    print("-> Donnee dans la bdd")

client = mqtt.Client()
client.on_message = gerer_message

client.connect("test.mosquitto.org", 1883, 60)
client.subscribe("IUT/Colmar2025/SAE2.04/Maison1")
client.subscribe("IUT/Colmar2025/SAE2.04/Maison2")

print("Attente des messages...")
client.loop_forever()
