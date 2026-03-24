import React from 'react';
import { FilterPanel } from '@evaluacion_docente/components/filters/FilterPanel';
import { SelectFilter } from '@evaluacion_docente/components/filters/SelectFilter';
import { AnalyzeButton } from '@evaluacion_docente/components/ui/AnalyzeButton';
import { HistoricalChart } from '@evaluacion_docente/components/HistoricalChart';
import { HistoricalDataTable } from '@evaluacion_docente/components/HistoricalDataTable';
import { PeriodOverPeriodChangeChart } from '@evaluacion_docente/components/PeriodOverPeriodChangeChart';
import { PageHeader } from '@core/components/PageHeader';
import { ChartCard } from '@core/components/ChartCard';
import { useHistoricalData } from '@evaluacion_docente/hooks/useHistoricalData';
import type { SheetData } from '@core/types';
import { TrendingUp } from 'lucide-react';

interface HistoricalEvolutionPageProps {
    data: SheetData | null;
    filters: { startPeriod: string; endPeriod: string; };
    filterOptions: { historicalPeriods: string[] };
    onFilterChange: (newFilters: Partial<{ startPeriod: string; endPeriod: string; }>) => void;
    onResetFilters: () => void;
    onAnalyze: (data: any, title: string) => void;
}

export const HistoricalEvolutionPage: React.FC<HistoricalEvolutionPageProps> = ({
    data,
    filters,
    filterOptions,
    onFilterChange,
    onResetFilters,
    onAnalyze
}) => {
    const { historicalChartData, periodOverPeriodChangeData } = useHistoricalData(data, filters);

    if (!data) return null;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Evolución Histórica"
                description="Tendencia del desempeño docente a lo largo de los últimos periodos académicos."
                icon={TrendingUp}
            />

            <FilterPanel
                title="Filtros de Evolución Histórica"
                onReset={onResetFilters}
                actions={
                    <AnalyzeButton
                        onClick={() => onAnalyze(historicalChartData, 'Evolución Histórica de Promedios Globales')}
                        aria-label="Analizar Evolución Histórica de Promedios Globales con IA"
                    />
                }
            >
                <SelectFilter
                    label="Período Inicial"
                    value={filters.startPeriod}
                    onChange={(e) => onFilterChange({ startPeriod: e.target.value })}
                    options={filterOptions.historicalPeriods}
                />
                <SelectFilter
                    label="Período Final"
                    value={filters.endPeriod}
                    onChange={(e) => onFilterChange({ endPeriod: e.target.value })}
                    options={filterOptions.historicalPeriods}
                />
            </FilterPanel>
            <ChartCard
                title="Evolución de Puntajes"
                subtitle="Componente Heteroevaluación"
                tooltip="Seguimiento temporal del desempeño docente para identificar tendencias de mejora o áreas de atención."
            >
                <HistoricalChart chartData={historicalChartData} />
            </ChartCard>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                <ChartCard title="Datos Detallados" className="lg:col-span-2">
                    <HistoricalDataTable chartData={historicalChartData} />
                </ChartCard>
                <ChartCard title="Análisis de Variación Interperíodo" className="lg:col-span-3">
                    <PeriodOverPeriodChangeChart data={periodOverPeriodChangeData} />
                </ChartCard>
            </div>
        </div>
    );
};
