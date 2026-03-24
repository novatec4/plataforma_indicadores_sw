import React from 'react';
import { FilterPanel } from '@evaluacion_docente/components/filters/FilterPanel';
import { MultiSelectFilter } from '@evaluacion_docente/components/filters/MultiSelectFilter';
import { AnalyzeButton } from '@evaluacion_docente/components/ui/AnalyzeButton';
import { HistoricalComparisonChart } from '@evaluacion_docente/components/HistoricalComparisonChart';
import { PageHeader } from '@core/components/PageHeader';
import { ChartCard } from '@core/components/ChartCard';
import { useHistoricalComponentComparisonData } from '@evaluacion_docente/hooks/useHistoricalComponentComparisonData';
import type { SheetData } from '@core/types';
import { Layers } from 'lucide-react';

interface HistoricalComponentComparisonPageProps {
    data: SheetData | null;
    onAnalyze: (data: any, title: string) => void;
    filters: { selectedCriteria: string[], selectedPeriods: string[] };
    filterOptions: { historicalComponentComparisonCriteria: string[], historicalComponentComparisonPeriods: string[] };
    onFilterChange: (newFilters: Partial<{ selectedCriteria: string[], selectedPeriods: string[] }>) => void;
    onResetFilters: () => void;
}

export const HistoricalComponentComparisonPage: React.FC<HistoricalComponentComparisonPageProps> = ({ 
    data, 
    onAnalyze,
    filters,
    filterOptions,
    onFilterChange,
    onResetFilters
}) => {
    const { chartData, periods } = useHistoricalComponentComparisonData(data, filters);

    if (!data) return null;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Histórico por Componente"
                description="Análisis evolutivo segmentado por cada componente de la evaluación."
                icon={Layers}
            />

            <FilterPanel
                title="Filtros de Comparación Histórica"
                onReset={onResetFilters}
                actions={
                    <AnalyzeButton
                        onClick={() => onAnalyze({ chartData, periods }, 'Comparación Histórica por Componente')}
                        aria-label="Analizar Comparación Histórica por Componente con IA"
                    />
                }
            >
                <MultiSelectFilter
                    label="Componentes"
                    options={filterOptions.historicalComponentComparisonCriteria}
                    selectedOptions={filters.selectedCriteria}
                    onChange={(selected) => onFilterChange({ selectedCriteria: selected })}
                />
                <MultiSelectFilter
                    label="Períodos"
                    options={filterOptions.historicalComponentComparisonPeriods}
                    selectedOptions={filters.selectedPeriods}
                    onChange={(selected) => onFilterChange({ selectedPeriods: selected })}
                />
            </FilterPanel>
            <ChartCard
                title="Comparativa de Componentes"
                subtitle="Resultados de los períodos académicos seleccionados"
                tooltip="Análisis del desempeño segregado por Heteroevaluación, Autoevaluación y Coevaluación en el tiempo."
            >
                <HistoricalComparisonChart chartData={chartData} periods={periods} />
            </ChartCard>
        </div>
    );
};
