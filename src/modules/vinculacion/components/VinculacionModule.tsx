import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Loader } from '@core/components/Loader';
import { ErrorDisplay } from '@core/components/ErrorDisplay';
import { HistoricalChart } from './vinculacion/HistoricalChart';
import { DonutChart } from './vinculacion/DonutChart';
import { HorizontalBarChart } from './vinculacion/HorizontalBarChart';
import { fetchProjectsData } from '@vinculacion/services/vinculacion/googleSheetsService';
import type { SheetData } from '@core/types';
import type { Page } from '@core/components/Sidebar';
import { FilterPanel } from './vinculacion/filters/FilterPanel';
import { SelectFilter } from './vinculacion/filters/SelectFilter';
import { MetricCard } from './vinculacion/MetricCard';
import { ReportTable } from './vinculacion/ReportTable';
import { PageHeader } from '@core/components/PageHeader';
import { ChartCard } from '@core/components/ChartCard';
import { Briefcase, History, FileText, Zap, Wallet, Search, LayoutGrid, Layers } from 'lucide-react';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1AQTSZImeNcSRtMadrVpb1FMxFqeuJC4DqbyvsY17gT8/edit?usp=sharing';
const THEME_COLORS = ['#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#1d4ed8'];

const getTopNData = (data: any[], n: number) => {
    if (!data || data.length <= n) return data;
    return data.slice(0, n);
};

const safeToNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return isNaN(value) ? 0 : value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^\d,.-]/g, '').trim();
      if (cleaned.includes(',') && cleaned.includes('.')) {
          const firstComma = cleaned.indexOf(',');
          const firstDot = cleaned.indexOf('.');
          return firstComma < firstDot ? parseFloat(cleaned.replace(/,/g, '')) : parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
      }
      if (cleaned.includes(',')) {
          const parts = cleaned.split(',');
          return parts[parts.length - 1].length === 2 ? parseFloat(cleaned.replace(',', '.')) : parseFloat(cleaned.replace(/,/g, ''));
      }
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
};

interface VinculacionModuleProps {
    currentPage: Page;
}

const VinculacionModule: React.FC<VinculacionModuleProps> = ({ currentPage }) => {
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [projectsData, setProjectsData] = useState<SheetData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [globalFilters, setGlobalFilters] = useState({
      facultad: 'Todas',
      carrera: 'Todas',
      programa: 'Todos',
      estado: 'Todos',
      alcance: 'Todos'
  });

  const loadDashboard = useCallback(async () => {
    setIsLoadingData(true);
    setError(null);
    try {
      const data = await fetchProjectsData(SHEET_URL);
      setProjectsData(data);
    } catch (err) {
      setError(`Error al cargar datos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Dynamic Filter Options
  const filterOptions = useMemo(() => {
      if (!projectsData || !projectsData.rows) return { facultades: [], carreras: [], programas: [], estados: [], alcances: [] };
      const rows = projectsData.rows;
      const facultades = Array.from(new Set(rows.map(r => r['Facultad'] as string).filter(Boolean))).sort();
      const rowsByFacultad = globalFilters.facultad === 'Todas' ? rows : rows.filter(r => r['Facultad'] === globalFilters.facultad);
      const carreras = Array.from(new Set(rowsByFacultad.map(r => r['Carrera'] as string).filter(Boolean))).sort();
      const rowsByCarrera = globalFilters.carrera === 'Todas' ? rowsByFacultad : rowsByFacultad.filter(r => r['Carrera'] === globalFilters.carrera);
      const programas = Array.from(new Set(rowsByCarrera.map(r => r['Programa'] as string).filter(Boolean))).sort();
      const estados = Array.from(new Set(rows.map(r => r['Estado Situacional'] as string).filter(Boolean))).sort();
      const alcances = Array.from(new Set(rows.map(r => r['Alcance Territorial'] as string).filter(Boolean))).sort();
      return { facultades, carreras, programas, alcances, estados };
  }, [projectsData, globalFilters.facultad, globalFilters.carrera]);

  // Auto-reset filters
  useEffect(() => {
      if (globalFilters.facultad !== 'Todas' && !filterOptions.carreras.includes(globalFilters.carrera) && globalFilters.carrera !== 'Todas') {
          setGlobalFilters(prev => ({ ...prev, carrera: 'Todas' }));
      }
  }, [globalFilters.facultad, filterOptions.carreras]);

  const filteredRows = useMemo(() => {
      if (!projectsData || !projectsData.rows) return [];
      return projectsData.rows.filter(row => {
          const matchFacultad = globalFilters.facultad === 'Todas' || row['Facultad'] === globalFilters.facultad;
          const matchCarrera = globalFilters.carrera === 'Todas' || row['Carrera'] === globalFilters.carrera;
          const matchPrograma = globalFilters.programa === 'Todos' || row['Programa'] === globalFilters.programa;
          const matchEstado = globalFilters.estado === 'Todos' || row['Estado Situacional'] === globalFilters.estado;
          const matchAlcance = globalFilters.alcance === 'Todos' || row['Alcance Territorial'] === globalFilters.alcance;
          return matchFacultad && matchCarrera && matchPrograma && matchEstado && matchAlcance;
      });
  }, [projectsData, globalFilters]);

  // KPIs
  const metrics = useMemo(() => {
      const total = filteredRows.length;
      const totalProgramas = new Set(filteredRows.map(r => r['Programa']).filter(Boolean)).size;
      const presupuestoPlanificado = filteredRows.reduce((sum, r) => sum + safeToNumber(r['Presupuesto planificado']), 0);
      return { total, totalProgramas, presupuestoPlanificado };
  }, [filteredRows]);

  // Aggregation
  const aggregate = (key: string, valueCol?: string) => {
      const map: Record<string, number> = {};
      filteredRows.forEach(r => {
          const name = (r[key] as string) || 'Desconocido';
          const val = valueCol ? safeToNumber(r[valueCol]) : 1;
          map[name] = (map[name] || 0) + val;
      });
      return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  };

  const proyFacultad = useMemo(() => aggregate('Facultad'), [filteredRows]);
  const presuFacultad = useMemo(() => aggregate('Facultad', 'Presupuesto planificado'), [filteredRows]);
  const proyCarrera = useMemo(() => aggregate('Carrera'), [filteredRows]);
  const presuCarrera = useMemo(() => aggregate('Carrera', 'Presupuesto planificado'), [filteredRows]);
  const proyPrograma = useMemo(() => aggregate('Programa'), [filteredRows]);
  const presuPrograma = useMemo(() => aggregate('Programa', 'Presupuesto planificado'), [filteredRows]);

  const historicalChartData = useMemo(() => {
    const yearCounts: Record<string, number> = {};
    filteredRows.forEach(row => {
        const dateStr = (row['Fecha de inicio'] as string) || '';
        const match = dateStr.match(/\b(20\d{2})\b/);
        const year = match ? match[1] : 'Desconocido';
        if (year !== 'Desconocido') yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    return Object.keys(yearCounts).sort().map(year => ({ periodo: year, promedio: yearCounts[year], trend: yearCounts[year] }));
  }, [filteredRows]);

  const handleFilterChange = (newFilters: Partial<typeof globalFilters>) => setGlobalFilters(prev => ({ ...prev, ...newFilters }));
  const resetFilters = () => setGlobalFilters({ facultad: 'Todas', carrera: 'Todas', programa: 'Todos', estado: 'Todos', alcance: 'Todos' });

  const downloadCSV = () => {
      if (!filteredRows.length) return;
      const headers = Object.keys(filteredRows[0]).filter(k => k !== '_rowIndex');
      const csvContent = [headers.join(','), ...filteredRows.map(row => headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'reporte_vinculacion.csv';
      link.click();
  };

  if (isLoadingData) return <div className="flex-1 flex items-center justify-center p-8"><Loader message="Generando reporte detallado..." /></div>;
  if (error && !projectsData) return <div className="flex-1 flex items-center justify-center p-8"><ErrorDisplay message={error} onRetry={loadDashboard} /></div>;

  const renderCurrentPage = () => {
    switch (currentPage) {
        case 'vinculacion-dashboard':
            return (
                <div className="space-y-8 pb-12 animate-fade-in">
                    <PageHeader 
                        title="Visión Estratégica" 
                        description="Panorama consolidado de proyectos, programas e inversión planificada de vinculación institucional." 
                        icon={Briefcase} 
                    />

                    <FilterPanel title="Filtros Analíticos" onReset={resetFilters}>
                        <SelectFilter label="Facultad" value={globalFilters.facultad} onChange={(e) => handleFilterChange({ facultad: e.target.value })} options={['Todas', ...filterOptions.facultades]} />
                        <SelectFilter label="Carrera" value={globalFilters.carrera} onChange={(e) => handleFilterChange({ carrera: e.target.value })} options={['Todas', ...filterOptions.carreras]} />
                        <SelectFilter label="Programa" value={globalFilters.programa} onChange={(e) => handleFilterChange({ programa: e.target.value })} options={['Todos', ...filterOptions.programas]} />
                        <SelectFilter label="Estado" value={globalFilters.estado} onChange={(e) => handleFilterChange({ estado: e.target.value })} options={['Todos', ...filterOptions.estados]} />
                    </FilterPanel>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MetricCard title="Total de Proyectos" value={metrics.total.toString()} icon={Briefcase} trendLabel="Iniciativas registradas" />
                        <MetricCard title="Total de Programas" value={metrics.totalProgramas.toString()} icon={Layers} trendLabel="Ejes estratégicos" />
                        <MetricCard title="Presupuesto Planificado" value={formatCurrency(metrics.presupuestoPlanificado)} icon={Wallet} trendLabel="Inversión proyectada" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ChartCard title="Total Proyectos por Facultad" subtitle="Volumen de gestión académica" tooltip="Muestra la cantidad de proyectos activos y finalizados por cada facultad.">
                            <div className="h-80 w-full"><HorizontalBarChart data={proyFacultad.slice(0, 10)} colors={THEME_COLORS} dataLabel="Proyectos" /></div>
                        </ChartCard>
                        <ChartCard title="Presupuesto Planificado por Facultad" subtitle="Distribución de la inversión proyectada" tooltip="Visualiza cómo se reparte el presupuesto total entre las facultades.">
                            <DonutChart data={presuFacultad.slice(0, 6)} colors={THEME_COLORS} valueFormatter={formatCurrency} />
                        </ChartCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ChartCard title="Total Proyectos por Carrera" subtitle="Participación disciplinaria (Top 10)" tooltip="Identifica las carreras con mayor dinamismo en proyectos de vinculación.">
                            <div className="h-80 w-full"><HorizontalBarChart data={proyCarrera.slice(0, 10)} colors={['#3b82f6']} dataLabel="Proyectos" /></div>
                        </ChartCard>
                        <ChartCard title="Presupuesto por Carrera" subtitle="Inversión planificada por disciplina" tooltip="Muestra los recursos asignados a los proyectos de cada carrera.">
                            <DonutChart data={presuCarrera.slice(0, 6)} colors={THEME_COLORS} valueFormatter={formatCurrency} />
                        </ChartCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ChartCard title="Total Proyectos por Programa" subtitle="Alineación con ejes estratégicos" tooltip="Conteo de iniciativas según el programa institucional al que pertenecen.">
                            <div className="h-80 w-full"><HorizontalBarChart data={proyPrograma.slice(0, 10)} colors={['#10b981']} dataLabel="Proyectos" /></div>
                        </ChartCard>
                        <ChartCard title="Presupuesto por Programa" subtitle="Inversión según eje de impacto" tooltip="Distribución financiera basada en los programas de vinculación.">
                            <DonutChart data={presuPrograma.slice(0, 6)} colors={['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd']} valueFormatter={formatCurrency} />
                        </ChartCard>
                    </div>
                </div>
            );
        case 'vinculacion-historico':
            return (
                <div className="space-y-8 pb-12 animate-fade-in">
                    <PageHeader 
                        title="Evolución de Vinculación" 
                        description="Tendencias históricas de participación y crecimiento de la inversión social." 
                        icon={History} 
                    />

                    <FilterPanel title="Filtros de Tendencia" onReset={resetFilters}>
                        <SelectFilter label="Facultad" value={globalFilters.facultad} onChange={(e) => handleFilterChange({ facultad: e.target.value })} options={['Todas', ...filterOptions.facultades]} />
                        <SelectFilter label="Carrera" value={globalFilters.carrera} onChange={(e) => handleFilterChange({ carrera: e.target.value })} options={['Todas', ...filterOptions.carreras]} />
                        <SelectFilter label="Programa" value={globalFilters.programa} onChange={(e) => handleFilterChange({ programa: e.target.value })} options={['Todos', ...filterOptions.programas]} />
                    </FilterPanel>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MetricCard title="Total Proyectos" value={metrics.total.toString()} icon={Briefcase} trendLabel="En el segmento seleccionado" />
                        <MetricCard title="Programas Activos" value={metrics.totalProgramas.toString()} icon={Layers} trendLabel="Ejes involucrados" />
                        <MetricCard title="Inversión Proyectada" value={formatCurrency(metrics.presupuestoPlanificado)} icon={Wallet} trendLabel="Presupuesto total del segmento" />
                    </div>

                    <ChartCard 
                        title="Crecimiento Histórico del Segmento" 
                        subtitle="Proyectos iniciados por año según filtros aplicados" 
                        tooltip="Visualiza cómo ha evolucionado la cantidad de proyectos para la facultad o carrera seleccionada."
                    >
                        <div className="h-96 w-full"><HistoricalChart chartData={historicalChartData} colors={THEME_COLORS} /></div>
                    </ChartCard>
                </div>
            );
        case 'vinculacion-reporte':
            return (
                <div className="space-y-6 pb-12 animate-fade-in">
                    <PageHeader 
                        title="Reporte de Proyectos" 
                        description="Detalle técnico granular de las iniciativas para auditoría y control." 
                        icon={FileText} 
                        actions={<button onClick={downloadCSV} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition-colors">Exportar CSV</button>} 
                    />
                    
                    <FilterPanel title="Filtros de Reporte" onReset={resetFilters}>
                        <SelectFilter label="Facultad" value={globalFilters.facultad} onChange={(e) => handleFilterChange({ facultad: e.target.value })} options={['Todas', ...filterOptions.facultades]} />
                        <SelectFilter label="Carrera" value={globalFilters.carrera} onChange={(e) => handleFilterChange({ carrera: e.target.value })} options={['Todas', ...filterOptions.carreras]} />
                    </FilterPanel>

                    <ReportTable data={filteredRows} />
                </div>
            );
        default: return null;
    }
  };

  return <div className="flex-1 flex flex-col relative w-full h-full overflow-y-auto p-4 md:p-8 bg-slate-50">{renderCurrentPage()}</div>;
};

export default VinculacionModule;