import React from 'react';
import { FilterPanel } from '@evaluacion_docente/components/filters/FilterPanel';
import { MultiSelectFilter } from '@evaluacion_docente/components/filters/MultiSelectFilter';
import { AnalyzeButton } from '@evaluacion_docente/components/ui/AnalyzeButton';
import { ComparisonChart } from '@evaluacion_docente/components/ComparisonChart';
import { ComparisonDataTable } from '@evaluacion_docente/components/ComparisonDataTable';
import { ScoreGapChart } from '@evaluacion_docente/components/ScoreGapChart';
import { PageHeader } from '@core/components/PageHeader';
import { ChartCard } from '@core/components/ChartCard';
import { useComparisonData } from '@evaluacion_docente/hooks/useComparisonData';
import type { SheetData } from '@core/types';
import { GitCompare } from 'lucide-react';

interface InstitutionalComparisonPageProps {
    data: SheetData | null;
    filters: { selectedCriteria: string[] };
    filterOptions: { comparisonCriteria: string[] };
    onFilterChange: (newFilters: Partial<{ selectedCriteria: string[] }>) => void;
    onResetFilters: () => void;
    onAnalyze: (data: any, title: string) => void;
}

export const InstitutionalComparisonPage: React.FC<InstitutionalComparisonPageProps> = ({
    data,
    filters,
    filterOptions,
    onFilterChange,
    onResetFilters,
    onAnalyze
}) => {
    const { comparisonChartData, scoreGapData } = useComparisonData(data, filters);

    if (!data) return null;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Comparativa Institucional"
                description="Comparación del desempeño docente frente a los promedios de la facultad e institución."
                icon={GitCompare}
            />

            <FilterPanel
                title="Filtros de Comparación"
                onReset={onResetFilters}
                actions={
                    <AnalyzeButton
                        onClick={() => onAnalyze(scoreGapData, 'Heteroevaluación Carrera vs. Institucional')}
                        aria-label="Analizar Heteroevaluación Carrera vs. Institucional con IA"
                    />
                }
            >
                <MultiSelectFilter
                    label="Criterios"
                    options={filterOptions.comparisonCriteria}
                    selectedOptions={filters.selectedCriteria}
                    onChange={(selected) => onFilterChange({ selectedCriteria: selected })}
                />
            </FilterPanel>
            <ChartCard
                title="Comparativa Institucional"
                subtitle="Período: MARZO 2025 - JULIO 2025"
                tooltip="Comparación directa entre el puntaje promedio de la carrera y el promedio general de la facultad e institución."
            >
                {comparisonChartData.length > 0 ? (
                    <ComparisonChart data={comparisonChartData} />
                ) : (
                    <p className="text-center text-slate-500 py-10">Seleccione al menos un criterio para mostrar el gráfico de comparación.</p>
                )}
            </ChartCard>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                <ChartCard title="Datos Comparativos Detallados" className="lg:col-span-3">
                    {scoreGapData.length > 0 ? (
                        <ComparisonDataTable data={scoreGapData} />
                    ) : (
                        <p className="text-center text-slate-500 py-4">No hay datos para mostrar en la tabla. Por favor, seleccione al menos un criterio.</p>
                    )}
                </ChartCard>
                <ChartCard title="Análisis de Brecha de Puntuación" className="lg:col-span-2">
                    {scoreGapData.length > 0 ? (
                        <ScoreGapChart data={scoreGapData} />
                    ) : (
                        <p className="text-center text-slate-500 py-4">No hay datos para calcular la brecha de puntuación.</p>
                    )}
                </ChartCard>
            </div>
        </div>
    );
};
