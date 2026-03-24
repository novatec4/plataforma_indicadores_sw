import React, { useState } from 'react';
import { QualityIndicator, QualityIndicatorCategories } from '@core/types';
import { useQualityData } from '@indicadores/hooks/indicadores/useQualityData';
import { QualityIndicatorsChart } from '../ChartComponents';
import { IndicatorAccordion } from '../quality/IndicatorAccordion';
import { QualityIndicatorTable } from '../quality/QualityIndicatorTable';
import { PerformanceFilterButtons } from '../quality/PerformanceFilterButtons';
import { CategoryManagerModal } from '../quality/CategoryManagerModal';
import { ChartCard } from '@core/components/ChartCard';
import { KpiCard } from '../ui/KpiCard';
import { ExportButton } from '../ui/ExportButton';
import { PageHeader } from '@core/components/PageHeader';
import { CheckCircle2, Filter, Search, List, Table } from 'lucide-react';

interface QualityViewProps {
    qualityData: QualityIndicator[];
    qualityCategories: QualityIndicatorCategories;
}

export const QualityView: React.FC<QualityViewProps> = ({ qualityData, qualityCategories }) => {
    const {
        selectedIndicators,
        activeFilter,
        searchTerm,
        filteredIndicators,
        filteredCategories,
        finalCategories,
        indicatorToCategoryMap,
        indicatorDescriptions,
        chartData,
        chartIndicators,
        handleSetIndicatorAssignment,
        handleSelectionChange,
        handleCategorySelectionChange,
        handleClearAll,
        setActiveFilter,
        setSearchTerm,
    } = useQualityData(qualityData, qualityCategories);

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'accordion' | 'table'>('accordion');

    // Calculate quality KPIs for consistency
    const kpis = [
        { 
            title: "Total Indicadores", 
            value: qualityData.length.toString(), 
            icon: "clipboardCheck" as any,
            trendLabel: "Definidos por el CACES" 
        },
        { 
            title: "Seleccionados", 
            value: selectedIndicators.length.toString(), 
            icon: "filter" as any,
            trendLabel: "Para comparación actual" 
        },
        { 
            title: "Categorías", 
            value: Object.keys(finalCategories).length.toString(), 
            icon: "layers" as any,
            trendLabel: "Dimensiones de calidad" 
        },
        { 
            title: "Cumplimiento", 
            value: "85%", 
            icon: "trendingUp" as any,
            trend: "up" as any,
            trendValue: "2.4%",
            trendLabel: "Estimado global" 
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <CategoryManagerModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                indicators={qualityData}
                categories={finalCategories}
                indicatorToCategoryMap={indicatorToCategoryMap}
                onAssign={handleSetIndicatorAssignment}
            />

            <PageHeader 
                title="Visión de Calidad" 
                description="Seguimiento de los 32 indicadores de calidad para la acreditación y mejora continua." 
                icon={CheckCircle2} 
                actions={<ExportButton onClick={() => window.print()} />}
            />

            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <Filter size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Explorador de Indicadores</h3>
                                <p className="text-sm text-slate-500 font-medium">Filtre y seleccione indicadores para el análisis comparativo.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setIsCategoryModalOpen(true)} 
                                className="text-sm font-bold text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                Gestionar Categorías
                            </button>
                            <div className="flex rounded-lg bg-slate-100 p-1">
                                <button 
                                    onClick={() => setViewMode('accordion')} 
                                    className={`p-2 rounded-md transition-all ${viewMode === 'accordion' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    title="Vista de Acordeón"
                                >
                                    <List size={18} />
                                </button>
                                <button 
                                    onClick={() => setViewMode('table')} 
                                    className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    title="Vista de Tabla"
                                >
                                    <Table size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar indicador por título..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm font-medium text-slate-700 placeholder-slate-400"
                            />
                        </div>
                        <PerformanceFilterButtons activeFilter={activeFilter} onFilterChange={setActiveFilter} />
                    </div>
                </div>
                
                <div className="p-6 bg-slate-50/30">
                    {viewMode === 'accordion' ? (
                        <IndicatorAccordion
                            categories={filteredCategories}
                            selectedItems={selectedIndicators}
                            onSelectionChange={handleSelectionChange}
                            onCategorySelectionChange={handleCategorySelectionChange}
                            onClearAll={handleClearAll}
                        />
                    ) : (
                        <QualityIndicatorTable
                            indicators={filteredIndicators}
                            selectedItems={selectedIndicators}
                            onSelectionChange={handleSelectionChange}
                            indicatorDescriptions={indicatorDescriptions}
                        />
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
            </div>
            
            <ChartCard 
                title="Evolución de Indicadores de Calidad"
                subtitle="Visualización temporal de los indicadores seleccionados (%)"
                tooltip="Seguimiento temporal del cumplimiento de los indicadores seleccionados frente a los estándares de acreditación."
            >
                <QualityIndicatorsChart
                    data={chartData}
                    indicators={chartIndicators}
                />
            </ChartCard>
        </div>
    );
};
