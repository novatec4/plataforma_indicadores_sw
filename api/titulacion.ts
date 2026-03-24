import { BigQuery } from '@google-cloud/bigquery';

export default async function handler(req: any, res: any) {
  try {
    let bq;
    
    // 1. Si estamos en Vercel, usamos las Variables de Entorno
    if (process.env.GCP_PRIVATE_KEY) {
        bq = new BigQuery({
          projectId: process.env.GCP_PROJECT_ID,
          credentials: {
            client_email: process.env.GCP_CLIENT_EMAIL,
            // Vercel escapa los saltos de línea al pegar la llave, esto lo restaura
            private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }
        });
    } else {
        // 2. Fallback para entorno local si se llama directamente
        bq = new BigQuery({
          keyFilename: './credentials/bq-key.json',
          projectId: 'clear-aurora-451516-c5'
        });
    }

    // IMPORTANTE: Vercel tiene un límite estricto de 4.5MB por respuesta en funciones Serverless.
    // Descargar 40,000 tesis excede este límite (error 500 Payload Too Large). 
    // Por eso ajustamos el límite a 8000 para producción.
    const query = `
      SELECT 
        Facultad, Titulo, Anio, Autor, Materia, Categoria, Resumen, Descripcion, Palabras_Clave as PalabrasClave 
      FROM \`clear-aurora-451516-c5.espoch_db.tesis\` 
      ORDER BY Anio DESC
      LIMIT 8000
    `;

    const [rows] = await bq.query({ query });
    res.status(200).json({ headers: rows.length > 0 ? Object.keys(rows[0]) : [], rows });
  } catch (error: any) {
    console.error("BigQuery Error:", error);
    res.status(500).json({ error: error.message });
  }
}