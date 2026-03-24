import React, { useMemo } from 'react';
import { FilterPanel } from '@evaluacion_docente/components/filters/FilterPanel';
import { MultiSelectFilter } from '@evaluacion_docente/components/filters/MultiSelectFilter';
import { FinalComparisonChart } from '@evaluacion_docente/components/FinalComparisonChart';
import { useFinalComparisonData } from '@evaluacion_docente/hooks/useFinalComparisonData';
import { StatCard } from '@evaluacion_docente/components/ui/StatCard';
import { PageHeader } from '@core/components/PageHeader';
import { ChartCard } from '@core/components/ChartCard';
import type { SheetData } from '@core/types';
import { TrendingUp, BarChart3, GitCompare, Award, ClipboardCheck } from 'lucide-react';

interface FinalComparisonPageProps {
    data: SheetData | null;
    filters: { selectedCriteria: string[] };
    filterOptions: { finalComparisonCriteria: string[] };
    onFilterChange: (newFilters: Partial<{ selectedCriteria: string[] }>) => void;
    onResetFilters: () => void;
    onAnalyze: (data: any, title: string) => void;
}

export const FinalComparisonPage: React.FC<FinalComparisonPageProps> = ({ 
    data, 
    filters,
    filterOptions,
    onFilterChange,
    onResetFilters,
    onAnalyze
}) => {
    // Restore the correct hook for data processing
    const { chartData, seriesNames, kpis } = useFinalComparisonData(data ? data.rows : null, filters);

    if (!data) return null;

    const formatChange = (value: number) => {
        if (value === -Infinity || value === Infinity || isNaN(value)) return 'N/A';
        return `${value > 0 ? '+' : ''}${value.toFixed(2)} pts`;
    };

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            <PageHeader 
                title="Comparativa Final" 
                description="Resumen consolidado y comparativa de resultados finales entre periodos y promedios institucionales." 
                icon={ClipboardCheck} 
            />

            <FilterPanel
                title="Filtros de Comparación"
                onReset={onResetFilters}
            >
                <MultiSelectFilter
                    label="Componentes a Evaluar"
                    options={filterOptions.finalComparisonCriteria}
                    selectedOptions={filters.selectedCriteria}
                    onChange={(selected) => onFilterChange({ selectedCriteria: selected })}
                />
            </FilterPanel>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                <StatCard 
                    icon={<Award className="w-6 h-6" />}
                    title="Promedio Actual"
                    value={kpis ? kpis.currentPeriodAverage.toFixed(2) : '0.00'}
                    description="Todos los componentes"
                />
                <StatCard 
                    icon={<BarChart3 className="w-6 h-6" />}
                    title="Variación General"
                    value={kpis ? formatChange(kpis.overallChange) : 'N/A'}
                    description="vs. Período Anterior"
                />
                <StatCard 
                    icon={<TrendingUp className="w-6 h-6" />}
                    title="Mayor Mejora"
                    value={kpis ? formatChange(kpis.biggestImprovement.change) : 'N/A'}
                    description={kpis ? kpis.biggestImprovement.name : 'N/A'}
                />
                <StatCard 
                    icon={<GitCompare className="w-6 h-6" />}
                    title="Mayor Brecha"
                    value={kpis ? formatChange(kpis.biggestGap.actualGap) : 'N/A'}
                    description={kpis ? `${kpis.biggestGap.name} vs. Institucional` : 'N/A'}
                />
            </div>

            <ChartCard 
                title="Comparativa Final por Tipo de Evaluación"
                subtitle="Período Actual vs. Anterior vs. Promedio Institucional"
                tooltip="Muestra el rendimiento consolidado comparando los resultados de los componentes seleccionados frente al histórico y la media institucional."
            >
                {chartData && chartData.length > 0 ? (
                    <FinalComparisonChart chartData={chartData} seriesNames={seriesNames} />
                ) : (
                    <p className="text-center text-slate-500 py-10 font-medium italic">Seleccione al menos un componente en los filtros para visualizar la comparativa final.</p>
                )}
            </ChartCard>
        </div>
    );
};