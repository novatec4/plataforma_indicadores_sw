# Repositorio de Consumo de Datos de Tesis ESPOCH (BigQuery)

Este repositorio contiene la configuración y ejemplos necesarios para consumir los datos de tesis de la ESPOCH almacenados en Google BigQuery.

## 🚀 Configuración Inicial

### 1. Requisitos
- **Google Cloud SDK (gcloud):** Instalado y configurado con tu cuenta.
- **Python** (v3.7+) o **Node.js** (v14+).

### 2. Autenticación
Tu archivo de credenciales se encuentra en: `./credentials/bq-key.json`.
**⚠️ IMPORTANTE:** Nunca subas este archivo a repositorios públicos como GitHub o GitLab.

Para usarlo en tu servidor o local, configura la variable de entorno:
```bash
# Linux / macOS
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/credentials/bq-key.json"

# Windows (PowerShell)
$env:GOOGLE_APPLICATION_CREDENTIALS = "$(Get-Location)\credentials\bq-key.json"
```

## 📊 Información de la Tabla
- **Proyecto:** `clear-aurora-451516-c5`
- **Dataset:** `espoch_db`
- **Tabla:** `tesis`

## 🛠 Ejemplos de Código

### Python
Instala la librería: `pip install google-cloud-bigquery`
Ejecuta el script: `python3 examples/query_tesis.py`

### Node.js
Instala la librería: `npm install @google-cloud/bigquery`
Ejecuta el script: `node examples/query_tesis.js`

## 📝 Consulta SQL Recomendada
Para obtener las tesis más recientes por facultad:
```sql
SELECT Titulo, Autor, Anio, Facultad 
FROM `clear-aurora-451516-c5.espoch_db.tesis` 
WHERE Facultad != 'No especificada'
ORDER BY Anio DESC 
LIMIT 10
```
