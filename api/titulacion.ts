import { BigQuery } from '@google-cloud/bigquery';

export default async function handler(req: any, res: any) {
  try {
    let bq;
    
    if (process.env.GCP_PRIVATE_KEY) {
        bq = new BigQuery({
          projectId: process.env.GCP_PROJECT_ID,
          credentials: {
            client_email: process.env.GCP_CLIENT_EMAIL,
            private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }
        });
    } else {
        bq = new BigQuery({
          keyFilename: './credentials/bq-key.json',
          projectId: 'clear-aurora-451516-c5'
        });
    }

    // Leer limit y offset de la URL para cargar en "chunks" y evitar el límite de 4.5MB de Vercel
    const limit = parseInt(req.query.limit) || 8000;
    const offset = parseInt(req.query.offset) || 0;

    const query = `
      SELECT 
        Facultad, Titulo, Anio, Autor, Materia, Categoria, Resumen, Descripcion, Palabras_Clave as PalabrasClave 
      FROM \`clear-aurora-451516-c5.espoch_db.tesis\` 
      ORDER BY Anio DESC
      LIMIT @limit OFFSET @offset
    `;

    const [rows] = await bq.query({
        query,
        params: { limit, offset }
    });
    
    res.status(200).json({ headers: rows.length > 0 ? Object.keys(rows[0]) : [], rows });
  } catch (error: any) {
    console.error("BigQuery Error:", error);
    res.status(500).json({ error: error.message });
  }
}