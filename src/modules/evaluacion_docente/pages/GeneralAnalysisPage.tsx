import React from 'react';
import { FilterPanel } from '@evaluacion_docente/components/filters/FilterPanel';
import { MultiSelectFilter } from '@evaluacion_docente/components/filters/MultiSelectFilter';
import { AnalyzeButton } from '@evaluacion_docente/components/ui/AnalyzeButton';
import { EvaluationChart } from '@evaluacion_docente/components/EvaluationChart';
import { EvaluationDataTable } from '@evaluacion_docente/components/EvaluationDataTable';
import { StatCard } from '@evaluacion_docente/components/ui/StatCard';
import { PageHeader } from '@core/components/PageHeader';
import { ChartCard } from '@core/components/ChartCard';
import { useEvaluationData } from '@evaluacion_docente/hooks/useEvaluationData';
import type { SheetData } from '@core/types';
import { TrendingUp, TrendingDown, Star, ClipboardList, BarChart3 } from 'lucide-react';

interface GeneralAnalysisPageProps {
    data: SheetData | null;
    filters: { selectedCriteria: string[] };
    filterOptions: { generalAnalysisCriteria: string[] };
    onFilterChange: (newFilters: Partial<{ selectedCriteria: string[] }>) => void;
    onResetFilters: () => void;
    onAnalyze: (data: any, title: string) => void;
    onCriterionClick: (criterionData: Record<string, any>) => void;
}

export const GeneralAnalysisPage: React.FC<GeneralAnalysisPageProps> = ({ 
    data, 
    filters,
    filterOptions,
    onFilterChange,
    onResetFilters,
    onAnalyze, 
    onCriterionClick 
}) => {
    const { chartData, kpis } = useEvaluationData(data ? data.rows : null, filters);

    if (!data) return null;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Análisis General"
                description="Resultados globales de la evaluación docente por criterios y componentes."
                icon={BarChart3}
            />
            
            <FilterPanel
                title="Filtros de Análisis General"
                onReset={onResetFilters}
                actions={
                    <AnalyzeButton
                        onClick={() => onAnalyze(chartData, 'Análisis General de Resultados por Criterio')}
                        aria-label="Analizar Análisis General de Resultados por Criterio con IA"
                    />
                }
            >
                <MultiSelectFilter
                    label="Criterios"
                    options={filterOptions.generalAnalysisCriteria}
                    selectedOptions={filters.selectedCriteria}
                    onChange={(selected) => onFilterChange({ selectedCriteria: selected })}
                />
            </FilterPanel>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                <StatCard 
                    icon={<Star className="w-6 h-6" />}
                    title="Promedio General"
                    value={kpis.overallAverage.toFixed(2)}
                    description="Todas las evaluaciones"
                />
                <StatCard 
                    icon={<ClipboardList className="w-6 h-6" />}
                    title="Promedio Heteroevaluación"
                    value={kpis.heteroAverage.toFixed(2)}
                    description="Evaluación principal"
                />
                <StatCard 
                    icon={<TrendingUp className="w-6 h-6" />}
                    title="Criterio con Mayor Puntaje"
                    value={kpis.highestCriterion.score.toFixed(2)}
                    description={kpis.highestCriterion.name}
                />
                <StatCard 
                    icon={<TrendingDown className="w-6 h-6" />}
                    title="Criterio con Menor Puntaje"
                    value={kpis.lowestCriterion.score.toFixed(2)}
                    description={kpis.lowestCriterion.name}
                />
            </div>

            <div className="flex flex-col gap-8">
                <ChartCard
                    title="Análisis General de Resultados por Criterio"
                    subtitle="Evaluación Docente - Período MARZO 2025 - JULIO 2025"
                    tooltip="Desglose de puntajes obtenidos en cada uno de los criterios evaluados, comparando los diferentes componentes (Hetero, Auto, Coev)."
                >
                    {chartData.length > 0 ? (
                        <EvaluationChart chartData={chartData} onCriterionClick={onCriterionClick} />
                    ) : (
                        <p className="text-center text-slate-500 py-10">Seleccione al menos un criterio para mostrar el gráfico.</p>
                    )}
                </ChartCard>

                <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Datos Detallados por Criterio</h3>
                    <EvaluationDataTable data={chartData} />
                </div>
            </div>
        </div>
    );
};