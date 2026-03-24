import React, { useState, useMemo } from 'react';
import { HistoricalChart } from './HistoricalChart';
import { DonutChart } from '@vinculacion/components/vinculacion/DonutChart';
import { HorizontalBarChart } from '@vinculacion/components/vinculacion/HorizontalBarChart';
import { PageHeader } from '@core/components/PageHeader';
import { KpiCard } from '@indicadores/components/indicadores/ui/KpiCard';
import { ChartCard } from '@core/components/ChartCard';
import { Globe, Filter, RefreshCcw } from 'lucide-react';
import type { Kpi } from '@core/types';

interface OverviewPageProps {
    allData: any[];
    filterOptions: any;
    currentTheme: any;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
    allData,
    filterOptions,
    currentTheme
}) => {
    // LOCAL INDEPENDENT FILTERS
    const [filters, setFilters] = useState({
        facultad: 'Todas',
        carrera: 'Todas',
        categoria: 'Todas',
        anioInicio: 'Todos',
        anioFin: 'Todos'
    });

    const resetFilters = () => setFilters({ facultad: 'Todas', carrera: 'Todas', categoria: 'Todas', anioInicio: 'Todos', anioFin: 'Todos' });

    // CAREER INFERENCE UTILITY (Reused for filtering)
    const getInferredCareer = (row: any): string => {
        const m = String(row['Materia'] || '').toLowerCase();
        const d = String(row['Descripcion'] || '').toLowerCase();
        if (m.includes('software') || d.includes('software')) return 'Ingeniería de Software';
        if (m.includes('sistemas') || d.includes('sistemas')) return 'Ingeniería en Sistemas';
        if (m.includes('computacion')) return 'Ciencias de la Computación';
        if (m.includes('electronica') || d.includes('electronica')) return 'Electrónica';
        if (m.includes('mecanica') || d.includes('mecanica')) return 'Mecánica';
        if (m.includes('industrial')) return 'Industrial';
        if (m.includes('medicina')) return 'Medicina';
        if (m.includes('contabilidad')) return 'Contabilidad';
        if (m.includes('administracion')) return 'Admin. Empresas';
        if (m.includes('agroindustrial')) return 'Agroindustria';
        if (m.includes('ambiental')) return 'Ambiental';
        if (m.includes('turismo')) return 'Turismo';
        if (m.includes('gastronomia')) return 'Gastronomía';
        if (m.includes('diseño')) return 'Diseño';
        return 'Otras Carreras';
    };

    // GENERATE CAREER OPTIONS FROM DATA
    const careerOptions = useMemo(() => {
        const rowsForCareers = filters.facultad === 'Todas' ? allData : allData.filter(r => String(r.Facultad) === filters.facultad);
        const careers = new Set<string>();
        rowsForCareers.forEach(r => careers.add(getInferredCareer(r)));
        return Array.from(careers).sort();
    }, [allData, filters.facultad]);

    // FAST LOCAL FILTERING
    const filteredRows = useMemo(() => {
        return allData.filter(row => {
            const fac = String(row['Facultad'] || '').trim();
            const cat = String(row['Categoria'] || '').replace('info:eu-repo/semantics/', '');
            const anio = Number(row['Anio']);
            const carrera = getInferredCareer(row);
            
            const matchFacultad = filters.facultad === 'Todas' || fac === filters.facultad;
            const matchCarrera = filters.carrera === 'Todas' || carrera === filters.carrera;
            const matchCategoria = filters.categoria === 'Todas' || cat === filters.categoria;
            const matchAnio = (filters.anioInicio === 'Todos' || anio >= Number(filters.anioInicio)) && 
                             (filters.anioFin === 'Todos' || anio <= Number(filters.anioFin));
            
            return matchFacultad && matchCarrera && matchCategoria && matchAnio;
        });
    }, [allData, filters]);

    // METRICS CALCULATION
    const metrics = useMemo(() => {
        const totalSegment = filteredRows.length;
        const totalInstitution = allData.length;
        
        const modalityMap: Record<string, number> = {};
        const facultyMap: Record<string, number> = {};
        const careerMap: Record<string, number> = {};
        const historicalCounts: Record<string, number> = {};

        filteredRows.forEach(r => {
            const cat = String(r['Categoria'] || '').replace('info:eu-repo/semantics/', '').toUpperCase();
            if (cat) modalityMap[cat] = (modalityMap[cat] || 0) + 1;

            const facName = String(r['Facultad'] || '').trim();
            if (facName && facName !== 'No especificada') {
                facultyMap[facName] = (facultyMap[facName] || 0) + 1;
            }

            const c = getInferredCareer(r);
            careerMap[c] = (careerMap[c] || 0) + 1;

            const year = String(r['Anio'] || '');
            if (year.length === 4) historicalCounts[year] = (historicalCounts[year] || 0) + 1;
        });

        return { 
            totalSegment, 
            totalInstitution,
            weight: ((totalSegment / totalInstitution) * 100).toFixed(1),
            modalityData: Object.entries(modalityMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value),
            facultyData: Object.entries(facultyMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value),
            careerData: Object.entries(careerMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 10),
            historicalChartData: Object.entries(historicalCounts).map(([periodo, cantidad]) => ({ periodo, cantidad })).sort((a,b) => a.periodo.localeCompare(b.periodo))
        };
    }, [filteredRows, allData]);

    const kpis: Kpi[] = [
        { title: "Total Institución", value: metrics.totalInstitution.toLocaleString(), icon: "globe", color: "blue", trendLabel: "Acumulado ESPOCH" },
        { title: "Tesis en Segmento", value: metrics.totalSegment.toLocaleString(), icon: "bookOpen", color: "green", trendLabel: "Selección actual" },
        { title: "Participación", value: `${metrics.weight}%`, icon: "award", color: "amber", trendLabel: "Del peso institucional" },
        { title: "Modalidad Top", value: metrics.modalityData[0]?.name || 'N/A', icon: "trophy", color: "indigo", trendLabel: "Tendencia de titulación" }
    ];

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            <PageHeader title="Resumen Institucional de Titulación" description="Panorama global de la producción académica de la ESPOCH." icon={Globe} />

            {/* Enhanced Independent Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-6 border-b border-slate-50 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Filter size={20} /></div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Filtros de Segmentación</h3>
                            <p className="text-sm text-slate-500 font-medium">Análisis detallado por unidad académica y periodo.</p>
                        </div>
                    </div>
                    <button onClick={resetFilters} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2"><RefreshCcw size={16}/>Reiniciar Dashboard</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Facultad</label>
                        <select value={filters.facultad} onChange={e => setFilters({...filters, facultad: e.target.value, carrera: 'Todas'})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="Todas">Todas las Facultades</option>
                            {filterOptions.facultades.map((f:any) => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Carrera (Inferencia)</label>
                        <select value={filters.carrera} onChange={e => setFilters({...filters, carrera: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="Todas">Todas las Carreras</option>
                            {careerOptions.map((c:any) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Periodo (Desde)</label>
                        <select value={filters.anioInicio} onChange={e => setFilters({...filters, anioInicio: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="Todos">Inicio</option>
                            {filterOptions.anios.map((a:any) => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Periodo (Hasta)</label>
                        <select value={filters.anioFin} onChange={e => setFilters({...filters, anioFin: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="Todos">Hoy</option>
                            {filterOptions.anios.map((a:any) => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {kpis.map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <ChartCard title="Producción por Facultad" subtitle="Volumen acumulado por unidad" tooltip="Ranking de facultades según la cantidad de tesis registradas.">
                    <div className="h-[400px] w-full"><HorizontalBarChart data={metrics.facultyData} colors={['#1e3a8a', '#2563eb', '#3b82f6']} dataLabel="Tesis" /></div>
                </ChartCard>
                <ChartCard title="Modalidades de Titulación" subtitle="Distribución por tipo de trabajo" tooltip="Muestra las diferentes formas de graduación elegidas.">
                    <div className="h-[400px] w-full"><DonutChart data={metrics.modalityData} colors={currentTheme.colors} /></div>
                </ChartCard>
                <div className="lg:col-span-2">
                    <ChartCard title="Top 10 Carreras con Mayor Producción" subtitle="Escuelas líderes en investigación" tooltip="Identifica las carreras con mayor dinamismo.">
                        <div className="h-[450px] w-full"><HorizontalBarChart data={metrics.careerData} colors={['#059669']} dataLabel="Tesis" /></div>
                    </ChartCard>
                </div>
                <div className="lg:col-span-2">
                    <ChartCard title="Evolución Histórica de Titulación" subtitle="Crecimiento anual registrado" tooltip="Visualiza la tendencia temporal de graduados.">
                        <div className="h-[350px] w-full"><HistoricalChart chartData={metrics.historicalChartData} colors={currentTheme.colors} /></div>
                    </ChartCard>
                </div>
            </div>
        </div>
    );
};