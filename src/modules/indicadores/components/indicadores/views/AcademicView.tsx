import React, { useState } from 'react';
import { AcademicPeriod } from '@core/types';
import { useAcademicData } from '@indicadores/hooks/indicadores/useAcademicData';
import { AcademicTrendsChart, GraduatesBarChart, CohortChart } from '../ChartComponents';
import { KpiCard } from '../ui/KpiCard';
import { ChartCard } from '@core/components/ChartCard';
import { CompareButton } from '../ui/CompareButton';
import { ExportButton } from '../ui/ExportButton';
import { PageHeader } from '@core/components/PageHeader';
import { AcademicComparisonModal } from '../academic/AcademicComparisonModal';
import { LayoutGrid, Filter } from 'lucide-react';

interface AcademicViewProps {
    academicData: AcademicPeriod[];
    graduatesData: { anio: number; numeroGraduados: number; }[];
}

export const AcademicView: React.FC<AcademicViewProps> = ({ academicData, graduatesData }) => {
    const {
        selectedPeriod,
        setSelectedPeriod,
        kpis,
        trendsData,
        annualGraduatesData,
        cohortData,
        periodOptions,
    } = useAcademicData(academicData, graduatesData);

    const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
    const [visibleTrends, setVisibleTrends] = useState({
        'Retención': true,
        'Deserción': true,
        'Titulación': true,
    });

    const toggleTrend = (trend: string) => {
        setVisibleTrends(prev => ({...prev, [trend]: !prev[trend as keyof typeof prev]}));
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <AcademicComparisonModal 
                isOpen={isComparisonModalOpen}
                onClose={() => setIsComparisonModalOpen(false)}
                periods={academicData}
            />

            <PageHeader 
                title="Visión Académica" 
                description="Análisis detallado de rendimiento, retención y graduación de la Carrera de Ingeniería de Software." 
                icon={LayoutGrid} 
                actions={
                    <>
                        <CompareButton onClick={() => setIsComparisonModalOpen(true)} />
                        <ExportButton onClick={() => window.print()} />
                    </>
                }
            />

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                            <Filter size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Filtros de Análisis</h3>
                            <p className="text-sm text-slate-500 font-medium">Filtre por periodo académico para profundizar en los datos.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <label htmlFor="period-select" className="text-sm font-bold text-slate-700 px-2">Periodo:</label>
                        <select
                            id="period-select"
                            key={periodOptions.length}
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="bg-white border border-slate-300 rounded-md shadow-sm py-1.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-semibold text-slate-700"
                        >
                            <option value="all">Todos los Periodos</option>
                            {periodOptions.map(p => (
                                <option key={p.codigoPeriodo} value={p.codigoPeriodo}>{p.descripcion}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <ChartCard 
                    title="Tendencias Académicas"
                    subtitle="Evolución de Retención, Deserción y Titulación por periodo"
                    tooltip="Muestra la evolución porcentual de retención, deserción y titulación a lo largo de los periodos seleccionados."
                    actions={
                        <div className="flex items-center gap-2">
                            {Object.keys(visibleTrends).map(trend => (
                                <button key={trend} onClick={() => toggleTrend(trend)}
                                    className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${visibleTrends[trend as keyof typeof visibleTrends] ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                >{trend}</button>
                            ))}
                        </div>
                    }
                >
                    <div className="flex-1 min-h-[320px]">
                        <AcademicTrendsChart data={trendsData} visibleTrends={visibleTrends} />
                    </div>
                </ChartCard>

                <ChartCard 
                    title="Graduados por Año"
                    subtitle="Número total de estudiantes que completaron su titulación"
                    tooltip="Cantidad total de estudiantes que obtuvieron su título en cada año calendario."
                >
                    <div className="flex-1 min-h-[320px]">
                        <GraduatesBarChart data={annualGraduatesData} />
                    </div>
                </ChartCard>

                <div className="lg:col-span-2">
                    <ChartCard 
                        title="Cohorte de Estudiantes"
                        subtitle="Comparativa entre estudiantes admitidos y matriculados por periodo"
                        tooltip="Comparativa directa entre el número de estudiantes admitidos y los que efectivamente se matricularon."
                    >
                        <div className="flex-1 min-h-[380px]">
                            <CohortChart data={cohortData} />
                        </div>
                    </ChartCard>
                </div>
            </div>
        </div>
    );
};