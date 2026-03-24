import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { BigQuery } from '@google-cloud/bigquery';

// Custom plugin to handle BigQuery API requests with maximum data range
const bigQueryPlugin = () => ({
  name: 'bigquery-api',
  configureServer(server) {
    const bq = new BigQuery({
      keyFilename: path.resolve(__dirname, './credentials/bq-key.json'),
      projectId: 'clear-aurora-451516-c5'
    });
    server.middlewares.use(async (req, res, next) => {
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      
      if (url.pathname === '/api/titulacion') {
        try {
          const limit = parseInt(url.searchParams.get('limit') || '8000', 10);
          const offset = parseInt(url.searchParams.get('offset') || '0', 10);

          const query = `
            SELECT 
              Facultad, Titulo, Anio, Autor, Materia, Categoria, Resumen, Descripcion, Palabras_Clave as PalabrasClave 
            FROM \`clear-aurora-451516-c5.espoch_db.tesis\` 
            ORDER BY Anio DESC
            LIMIT ${limit} OFFSET ${offset}
          `;

          const [rows] = await bq.query({ query });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ headers: rows.length > 0 ? Object.keys(rows[0]) : [], rows }));
        } catch (error: any) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
        return;
      }

      if (url.pathname === '/api/titulacion/options') {
        try {
          const queries = {
            facultades: "SELECT DISTINCT Facultad FROM `clear-aurora-451516-c5.espoch_db.tesis` WHERE Facultad IS NOT NULL ORDER BY Facultad",
            categorias: "SELECT DISTINCT Categoria FROM `clear-aurora-451516-c5.espoch_db.tesis` WHERE Categoria IS NOT NULL ORDER BY Categoria",
            anios: "SELECT DISTINCT Anio FROM `clear-aurora-451516-c5.espoch_db.tesis` WHERE Anio IS NOT NULL ORDER BY Anio DESC"
          };
          const [fRows] = await bq.query({ query: queries.facultades });
          const [cRows] = await bq.query({ query: queries.categorias });
          const [aRows] = await bq.query({ query: queries.anios });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            facultades: fRows.map(r => r.Facultad).filter(f => f !== 'No especificada'),
            categorias: cRows.map(r => r.Categoria).map(c => c.replace('info:eu-repo/semantics/', '')),
            anios: aRows.map(r => r.Anio).filter(a => a && a.length === 4)
          }));
        } catch (error: any) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
        return;
      }
      next();
    });
  }
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: { port: 3000, host: '0.0.0.0', strictPort: true },
      plugins: [react(), bigQueryPlugin()],
      define: { 'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY || '') },
      resolve: {
        alias: {
          '@core': path.resolve(__dirname, './src/core'),
          '@evaluacion_docente': path.resolve(__dirname, './src/modules/evaluacion_docente'),
          '@titulacion': path.resolve(__dirname, './src/modules/titulacion'),
          '@vinculacion': path.resolve(__dirname, './src/modules/vinculacion'),
          '@indicadores': path.resolve(__dirname, './src/modules/indicadores'),
        }
      }
    };
});