import React from 'react';
import { FilterPanel } from '@evaluacion_docente/components/filters/FilterPanel';
import { MultiSelectFilter } from '@evaluacion_docente/components/filters/MultiSelectFilter';
import { AnalyzeButton } from '@evaluacion_docente/components/ui/AnalyzeButton';
import { HistoricalTrendChart } from '@evaluacion_docente/components/HistoricalTrendChart';
import { PageHeader } from '@core/components/PageHeader';
import { ChartCard } from '@core/components/ChartCard';
import { useHistoricalPerformanceData } from '@evaluacion_docente/hooks/useHistoricalPerformanceData';
import type { SheetData } from '@core/types';
import { Activity } from 'lucide-react';

interface HistoricalPerformancePageProps {
    data: SheetData | null;
    onAnalyze: (data: any, title: string) => void;
    filters: { selectedCriteria: string[], selectedPeriods: string[] };
    filterOptions: { historicalComponentComparisonCriteria: string[], historicalComponentComparisonPeriods: string[] };
    onFilterChange: (newFilters: Partial<{ selectedCriteria: string[], selectedPeriods: string[] }>) => void;
    onResetFilters: () => void;
}

export const HistoricalPerformancePage: React.FC<HistoricalPerformancePageProps> = ({ 
    data, 
    onAnalyze,
    filters,
    filterOptions,
    onFilterChange,
    onResetFilters
}) => {
    const { chartData, criteria } = useHistoricalPerformanceData(data, filters);

    if (!data) return null;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Rendimiento Histórico"
                description="Visualización de la consistencia del desempeño en el tiempo."
                icon={Activity}
            />

            <FilterPanel
                title="Filtros de Rendimiento Histórico"
                onReset={onResetFilters}
                actions={
                    <AnalyzeButton
                        onClick={() => onAnalyze({ chartData, criteria }, 'Rendimiento Histórico por Componente')}
                        aria-label="Analizar Rendimiento Histórico por Componente con IA"
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
                title="Tendencia de Rendimiento"
                tooltip="Muestra la consistencia del desempeño docente agregando todos los criterios evaluados."
            >
                <HistoricalTrendChart chartData={chartData} criteria={criteria} />
            </ChartCard>
        </div>
    );
};
