import mariadb

def connect_db():
    """Connexion à la base de données 'maison'."""
    try:
        conn = mariadb.connect(
            user="root",
            password="toto",
            host="172.17.0.2",
            port=3306,
            database="maison"
        )
        print("Connexion réussie à la base 'maison'")
        return conn
    except mariadb.Error as erreur:
        print(f"Erreur de connexion à la base : {erreur}")
        return None

def create_tables(conn):
    cursor = conn.cursor()

    # Création de la table capteur
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS capteur (
            capteur_id INT AUTO_INCREMENT PRIMARY KEY,
            nom VARCHAR(100),
            lieu VARCHAR(100),
            emplacement VARCHAR(100)
        )
    """)

    # Création de la table data
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS data (
            data_id INT AUTO_INCREMENT PRIMARY KEY,
            datetime DATETIME,
            temperature FLOAT,
            capteur_id INT,
            FOREIGN KEY (capteur_id) REFERENCES capteur(capteur_id)
        )
    """)

    conn.commit()
    print("Tables 'capteur' et 'data' créées avec succès")

# Point d'entrée
if __name__ == "__main__":
    conn = connect_db()
    if conn:
        create_tables(conn)
        conn.close()
