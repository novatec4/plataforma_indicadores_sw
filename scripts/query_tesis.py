import os
from google.cloud import bigquery

# Configurar el cliente de BigQuery
# Asegúrate de haber configurado GOOGLE_APPLICATION_CREDENTIALS
client = bigquery.Client()

def consultar_tesis_recientes():
    query = """
        SELECT Titulo, Autor, Anio, Facultad 
        FROM `clear-aurora-451516-c5.espoch_db.tesis` 
        WHERE Facultad != 'No especificada'
        ORDER BY Anio DESC 
        LIMIT 5
    """
    
    print("Consultando tesis recientes de la ESPOCH...")
    query_job = client.query(query)
    
    results = query_job.result()
    
    for row in results:
        print(f"---")
        print(f"Título: {row.Titulo}")
        print(f"Autor: {row.Autor}")
        print(f"Año: {row.Anio}")
        print(f"Facultad: {row.Facultad}")

if __name__ == "__main__":
    consultar_tesis_recientes()
