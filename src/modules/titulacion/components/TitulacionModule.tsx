import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Loader } from '@core/components/Loader';
import { ErrorDisplay } from '@core/components/ErrorDisplay';
import { OverviewPage } from './titulacion/OverviewPage';
import { SearchPage } from './titulacion/SearchPage';
import { ExportPage } from './titulacion/ExportPage';
import { InstitutionalComparisonPage } from './titulacion/InstitutionalComparisonPage';
import { fetchSheetData } from '@titulacion/services/titulacion/googleSheetsService';
import type { SheetData } from '@core/types';
import type { Theme } from '@titulacion/types';
import type { Page } from '@core/components/Sidebar';

interface TitulacionModuleProps {
    currentPage: Page;
}

const TitulacionModule: React.FC<TitulacionModuleProps> = ({ currentPage }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allData, setAllData] = useState<SheetData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentTheme: Theme = { 
      id: 'blue',
      name: 'Azul Institucional',
      colors: ['#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd']
  };

  // LOAD ALL DATA ONCE FROM BIGQUERY (Instant local filtering after this)
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // The API is now configured in vite.config.ts to talk to BigQuery
      const res = await fetch('/api/titulacion');
      if (!res.ok) throw new Error('Error al conectar con BigQuery');
      const data = await res.json();
      setAllData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Derived Options for Filters (calculated once from full dataset)
  const filterOptions = useMemo(() => {
      if (!allData || !allData.rows) return { facultades: [], categorias: [], anios: [] };
      const facultades = new Set<string>();
      const categorias = new Set<string>();
      const anios = new Set<string>();
      allData.rows.forEach(row => {
          const fac = String(row['Facultad'] || '').trim();
          if (fac && fac !== 'No especificada') facultades.add(fac);
          let cat = String(row['Categoria'] || '').replace('info:eu-repo/semantics/', '');
          if (cat) categorias.add(cat);
          const anio = String(row['Anio'] || '').trim();
          if (anio.length === 4) anios.add(anio);
      });
      return {
          facultades: Array.from(facultades).sort(),
          categorias: Array.from(categorias).sort(),
          anios: Array.from(anios).sort((a, b) => b.localeCompare(a))
      };
  }, [allData]);

  if (isLoading) return <div className="flex-1 flex items-center justify-center p-8 bg-slate-50"><Loader message="Cargando base de datos institucional..." /></div>;
  if (error || !allData) return <div className="flex-1 flex items-center justify-center p-8"><ErrorDisplay message={error || 'No se pudieron cargar los datos'} onRetry={loadInitialData} /></div>;

  const renderCurrentPage = () => {
    switch (currentPage) {
        case 'titulacion-dashboard':
        case 'overview':
            return (
                <OverviewPage 
                    allData={allData.rows}
                    filterOptions={filterOptions}
                    currentTheme={currentTheme}
                />
            );
        case 'titulacion-search':
        case 'search':
            return (
                <SearchPage 
                    allInstitutionData={allData.rows} 
                    filterOptions={filterOptions}
                />
            );
        case 'titulacion-comparison':
            return (
                <InstitutionalComparisonPage 
                    allData={allData.rows}
                    filterOptions={filterOptions}
                />
            );
        case 'titulacion-export':
        case 'export':
            return (
                <ExportPage 
                    allData={allData.rows} 
                    filterOptions={filterOptions}
                />
            );
        default:
            return <p>Seleccione una opción del menú.</p>;
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full h-full overflow-y-auto p-4 md:p-8 bg-slate-50">
      {renderCurrentPage()}
    </div>
  );
};

export default TitulacionModule;
