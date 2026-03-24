import React, { useState, useMemo } from 'react';
import { PageHeader } from '@core/components/PageHeader';
import { ChartCard } from '@core/components/ChartCard';
import { KpiCard } from '@indicadores/components/indicadores/ui/KpiCard';
import { HorizontalBarChart } from '@vinculacion/components/vinculacion/HorizontalBarChart';
import { HistoricalChart } from './HistoricalChart';
import { GitCompare, Filter, Target, Award, Users, History } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface InstitutionalComparisonPageProps {
    allData: any[];
    filterOptions: any;
}

export const InstitutionalComparisonPage: React.FC<InstitutionalComparisonPageProps> = ({ 
    allData,
    filterOptions
}) => {
    const [anio, setAnio] = useState('Todos');

    // NORMALIZE TEXT FOR COMPARISONS
    const normalize = (str: string) => String(str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // CAREER INFERENCE UTILITY
    const getInferredCareer = (row: any): string => {
        const m = String(row['Materia'] || '').toLowerCase();
        const d = String(row['Descripcion'] || '').toLowerCase();
        if (m.includes('software') || d.includes('software')) return 'Ingeniería de Software';
        if (m.includes('sistemas') || d.includes('sistemas')) return 'Ingeniería en Sistemas';
        if (m.includes('computacion')) return 'Ciencias de la Computación';
        if (m.includes('electronica') || d.includes('electronica')) return 'Electrónica';
        if (m.includes('telecomunicaciones')) return 'Telecomunicaciones';
        return 'Otras';
    };

    const stats = useMemo(() => {
        const dataForYear = anio === 'Todos' ? allData : allData.filter(r => String(r.Anio) === anio);
        
        // 1. Career Grouping
        const careerMap: Record<string, number> = {};
        dataForYear.forEach(r => {
            const c = getInferredCareer(r);
            careerMap[c] = (careerMap[c] || 0) + 1;
        });

        const softwareVolume = careerMap['Ingeniería de Software'] || 0;
        const allCareerEntries = Object.entries(careerMap).filter(([name]) => name !== 'Otras');
        const avgInstitutionalVolume = allCareerEntries.length > 0 
            ? allCareerEntries.reduce((sum, [_, v]) => sum + v, 0) / allCareerEntries.length 
            : 0;

        const sortedCareers = [...allCareerEntries].sort((a,b) => b[1] - a[1]);
        const softwareRank = sortedCareers.findIndex(([name]) => name === 'Ingeniería de Software') + 1;

        // 2. FIE Filter (Robust)
        const fieData = dataForYear.filter(r => normalize(r.Facultad).includes('informatica') || normalize(r.Facultad).includes('electronica'));
        const fieCareerMap: Record<string, number> = {};
        fieData.forEach(r => {
            const c = getInferredCareer(r);
            fieCareerMap[c] = (fieCareerMap[c] || 0) + 1;
        });
        const facultyComparison = Object.entries(fieCareerMap)
            .filter(([name]) => name !== 'Otras')
            .map(([name, value]) => ({ name, value }))
            .sort((a,b) => b.value - a.value);

        // 3. Historical Comparison Data
        const years = filterOptions.anios.slice(0, 10).sort(); // Last 10 years
        const historicalComparison = years.map((y: string) => {
            const yearRows = allData.filter(r => String(r.Anio) === y);
            const swCount = yearRows.filter(r => getInferredCareer(r) === 'Ingeniería de Software').length;
            
            const careersInYear = new Set<string>();
            yearRows.forEach(r => {
                const c = getInferredCareer(r);
                if (c !== 'Otras') careersInYear.add(c);
            });
            
            const instAvg = careersInYear.size > 0 ? (yearRows.length / careersInYear.size) : 0;

            return {
                periodo: y,
                'Software': swCount,
                'Promedio Institucional': Math.round(instAvg)
            };
        });

        return { 
            softwareVolume, 
            avgInstitutionalVolume, 
            softwareRank, 
            totalCareers: allCareerEntries.length,
            topCareersComparison: sortedCareers.slice(0, 10).map(([name, value]) => ({ name, value })),
            facultyComparison,
            historicalComparison
        };
    }, [allData, anio, filterOptions.anios]);

    const performanceVsAvg = stats.avgInstitutionalVolume > 0 
        ? ((stats.softwareVolume / stats.avgInstitutionalVolume) * 100).toFixed(1)
        : '0';

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            <PageHeader title="Comparativa Institucional: Software" description="Posicionamiento de la Carrera de Software frente al contexto institucional." icon={GitCompare} />

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Filter size={20} /></div>
                    <div className="flex-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Periodo Global</label>
                        <select value={anio} onChange={e => setAnio(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold w-full max-w-xs outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="Todos">Todo el Histórico</option>
                            {filterOptions.anios.map((a:any) => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                <KpiCard title="Volumen Software" value={stats.softwareVolume.toLocaleString()} icon="award" as any trendLabel="Tesis registradas" />
                <KpiCard title="vs. Promedio" value={`${performanceVsAvg}%`} icon="trendingUp" as any trend={Number(performanceVsAvg) >= 100 ? 'up' : 'down'} trendValue={`${Math.abs(Number(performanceVsAvg) - 100).toFixed(1)}%`} />
                <KpiCard title="Ranking Global" value={`#${stats.softwareRank}`} icon="target" as any trendLabel={`De ${stats.totalCareers} carreras`} />
                <KpiCard title="Media Institucional" value={Math.round(stats.avgInstitutionalVolume).toLocaleString()} icon="users" as any trendLabel="Tesis por carrera" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <ChartCard title="Liderazgo en la Facultad (FIE)" subtitle="Comparativa de producción en la unidad académica" tooltip="Muestra el volumen de Software frente a Sistemas, Electrónica, etc.">
                    <div className="h-[400px] w-full">
                        <HorizontalBarChart data={stats.facultyComparison} colors={['#1e40af']} dataLabel="Tesis" />
                    </div>
                </ChartCard>

                <ChartCard title="Evolución: Software vs. Promedio ESPOCH" subtitle="Tendencia de producción anual comparada" tooltip="Compara el volumen de Software contra la media de producción de las carreras de la institución.">
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.historicalComparison} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="periodo" tick={{fill: '#64748b', fontSize: 11}} axisLine={false} />
                                <YAxis tick={{fill: '#64748b', fontSize: 11}} axisLine={false} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Software" stroke="#2563eb" strokeWidth={3} dot={{r: 4}} />
                                <Line type="monotone" dataKey="Promedio Institucional" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                <div className="lg:col-span-2">
                    <ChartCard title="Posicionamiento Global (Top 10 Carreras)" subtitle="Ranking por volumen de titulación" tooltip="Ranking de las 10 carreras con mayor producción en el periodo seleccionado.">
                        <div className="h-[450px] w-full">
                            <HorizontalBarChart data={stats.topCareersComparison} colors={['#3b82f6']} dataLabel="Tesis" />
                        </div>
                    </ChartCard>
                </div>
            </div>
        </div>
    );
};
