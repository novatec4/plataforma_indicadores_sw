import React from 'react';
import { FilterPanel } from '@evaluacion_docente/components/filters/FilterPanel';
import { AnalyzeButton } from '@evaluacion_docente/components/ui/AnalyzeButton';
import { PeriodComparisonChart } from '@evaluacion_docente/components/PeriodComparisonChart';
import { PageHeader } from '@core/components/PageHeader';
import { ChartCard } from '@core/components/ChartCard';
import { usePeriodComparisonData } from '@evaluacion_docente/hooks/usePeriodComparisonData';
import type { SheetData } from '@core/types';
import { StatCard } from '@evaluacion_docente/components/ui/StatCard';
import { TrendingUp, TrendingDown, ArrowRight, History, CalendarRange } from 'lucide-react';
import { SelectFilter } from '@evaluacion_docente/components/filters/SelectFilter';

interface PeriodComparisonPageProps {
    data: SheetData | null;
    onAnalyze: (data: any, title: string) => void;
    filters: { periodA: string; periodB: string; };
    filterOptions: { periodComparisonPeriods: string[] };
    onFilterChange: (newFilters: Partial<{ periodA: string; periodB: string; }>) => void;
    onResetFilters: () => void;
}

export const PeriodComparisonPage: React.FC<PeriodComparisonPageProps> = ({ 
    data, 
    onAnalyze,
    filters,
    filterOptions,
    onFilterChange,
    onResetFilters
}) => {
    const { 
        chartData, 
        tableData, 
        criteria, 
        previousPeriodName, 
        currentPeriodName,
        kpis
    } = usePeriodComparisonData(data, filters);

    if (!data || !kpis) return null;

    const formatChange = (value: number) => {
        if (value === -Infinity || value === Infinity) return 'N/A';
        return `${value > 0 ? '+' : ''}${value.toFixed(2)} pts`;
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Comparativa entre Períodos"
                description="Análisis detallado de variaciones en los resultados entre dos periodos específicos."
                icon={CalendarRange}
            />

            <FilterPanel
                title="Filtros de Comparación"
                onReset={onResetFilters}
                actions={
                    <AnalyzeButton
                        onClick={() => onAnalyze({ chartData, tableData, kpis }, 'Comparativa Período Actual vs. Anterior')}
                        aria-label="Analizar Comparativa Período Actual vs. Anterior con IA"
                    />
                }
            >
                <SelectFilter
                    label="Período A"
                    value={filters.periodA}
                    onChange={(e) => onFilterChange({ periodA: e.target.value })}
                    options={filterOptions.periodComparisonPeriods}
                />
                <SelectFilter
                    label="Período B"
                    value={filters.periodB}
                    onChange={(e) => onFilterChange({ periodB: e.target.value })}
                    options={filterOptions.periodComparisonPeriods}
                />
            </FilterPanel>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                <StatCard 
                    icon={<History className="w-6 h-6" />}
                    title="Promedio Período Anterior"
                    value={kpis.previousPeriodAverage.toFixed(2)}
                    description={previousPeriodName.replace(/_/g,' ')}
                />
                <StatCard 
                    icon={<ArrowRight className="w-6 h-6" />}
                    title="Promedio Período Actual"
                    value={kpis.currentPeriodAverage.toFixed(2)}
                    description={currentPeriodName.replace(/_/g,' ')}
                />
                <StatCard 
                    icon={<TrendingUp className="w-6 h-6" />}
                    title="Mayor Mejora"
                    value={formatChange(kpis.biggestImprovement.change)}
                    description={kpis.biggestImprovement.name}
                />
                <StatCard 
                    icon={<TrendingDown className="w-6 h-6" />}
                    title="Mayor Descenso"
                    value={formatChange(kpis.biggestDecline.change)}
                    description={kpis.biggestDecline.name}
                />
            </div>

            <ChartCard
                title="Diferencia de Puntajes entre Periodos"
                tooltip="Análisis de variaciones específicas (gap) entre los dos periodos seleccionados por cada criterio."
            >
                <PeriodComparisonChart 
                    chartData={chartData}
                    tableData={tableData}
                    criteria={criteria}
                    previousPeriodName={previousPeriodName}
                    currentPeriodName={currentPeriodName}
                />
            </ChartCard>
        </div>
    );
};