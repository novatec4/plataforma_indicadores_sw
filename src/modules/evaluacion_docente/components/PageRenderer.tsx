import React from 'react';
import type { Page } from '@core/components/Sidebar';
import type { SheetData } from '@core/types';
import { HistoricalEvolutionPage } from '@evaluacion_docente/pages/HistoricalEvolutionPage';
import { InstitutionalComparisonPage } from '@evaluacion_docente/pages/InstitutionalComparisonPage';
import { GeneralAnalysisPage } from '@evaluacion_docente/pages/GeneralAnalysisPage';
import { PeriodComparisonPage } from '@evaluacion_docente/pages/PeriodComparisonPage';
import { FinalComparisonPage } from '@evaluacion_docente/pages/FinalComparisonPage';
import { HistoricalComponentComparisonPage } from '@evaluacion_docente/pages/HistoricalComponentComparisonPage';
import { HistoricalPerformancePage } from '@evaluacion_docente/pages/HistoricalPerformancePage';
import { InfoIcon } from '@evaluacion_docente/components/ui/InfoIcon';

interface PageRendererProps {
    currentPage: Page;
    evaluationData: SheetData | null;
    comparisonData: SheetData | null;
    historicalData: SheetData | null;
    historicalComparisonData: SheetData | null;
    finalComparisonData: SheetData | null;
    filters: any;
    filterOptions: any;
    handleHistoricalFilterChange: (f: any) => void;
    resetHistoricalFilters: () => void;
    handleComparisonFilterChange: (f: any) => void;
    resetComparisonFilters: () => void;
    handleGeneralAnalysisFilterChange: (f: any) => void;
    resetGeneralAnalysisFilters: () => void;
    handlePeriodComparisonFilterChange: (f: any) => void;
    resetPeriodComparisonFilters: () => void;
    handleFinalComparisonFilterChange: (f: any) => void;
    resetFinalComparisonFilters: () => void;
    handleHistoricalComponentComparisonFilterChange: (f: any) => void;
    resetHistoricalComponentComparisonFilters: () => void;
    handleHistoricalPerformanceFilterChange: (f: any) => void;
    resetHistoricalPerformanceFilters: () => void;
    openAnalysisModal: (data: any, title: string) => void;
    handleCriterionClick: (data: any) => void;
}

export const PageRenderer: React.FC<PageRendererProps> = ({
    currentPage,
    evaluationData,
    comparisonData,
    historicalData,
    historicalComparisonData,
    finalComparisonData,
    filters,
    filterOptions,
    handleHistoricalFilterChange,
    resetHistoricalFilters,
    handleComparisonFilterChange,
    resetComparisonFilters,
    handleGeneralAnalysisFilterChange,
    resetGeneralAnalysisFilters,
    handlePeriodComparisonFilterChange,
    resetPeriodComparisonFilters,
    handleFinalComparisonFilterChange,
    resetFinalComparisonFilters,
    handleHistoricalComponentComparisonFilterChange,
    resetHistoricalComponentComparisonFilters,
    handleHistoricalPerformanceFilterChange,
    resetHistoricalPerformanceFilters,
    openAnalysisModal,
    handleCriterionClick,
}) => {
    if ((evaluationData && evaluationData.rows.length === 0) || (comparisonData && comparisonData.rows.length === 0)) {
        return (
            <div className="max-w-2xl mx-auto my-8 p-8 bg-sky-50 border border-sky-200 rounded-xl text-center">
                <div className="flex justify-center mb-4">
                    <InfoIcon className="h-12 w-12 text-sky-500" />
                </div>
                <h3 className="text-xl font-semibold text-sky-800">No se encontraron datos</h3>
                <p className="mt-2 text-sky-600">La hoja de cálculo de Google se cargó correctamente, pero parece estar vacía o no contener filas de datos para visualizar.</p>
            </div>
        );
    }

    switch (currentPage) {
        case 'historical-evolution':
            return <HistoricalEvolutionPage
                data={historicalData}
                filters={filters.historicalFilters}
                filterOptions={filterOptions}
                onFilterChange={handleHistoricalFilterChange}
                onResetFilters={resetHistoricalFilters}
                onAnalyze={openAnalysisModal}
            />;
        case 'institutional-comparison':
            return <InstitutionalComparisonPage
                data={comparisonData}
                filters={filters.comparisonFilters}
                filterOptions={filterOptions}
                onFilterChange={handleComparisonFilterChange}
                onResetFilters={resetComparisonFilters}
                onAnalyze={openAnalysisModal}
            />;
        case 'general-analysis':
            return <GeneralAnalysisPage
                data={evaluationData}
                filters={filters.generalAnalysisFilters}
                filterOptions={filterOptions}
                onFilterChange={handleGeneralAnalysisFilterChange}
                onResetFilters={resetGeneralAnalysisFilters}
                onAnalyze={openAnalysisModal}
                onCriterionClick={handleCriterionClick}
            />;
        case 'period-comparison':
            return <PeriodComparisonPage 
                data={historicalComparisonData} 
                onAnalyze={openAnalysisModal}
                filters={filters.periodComparisonFilters}
                filterOptions={filterOptions}
                onFilterChange={handlePeriodComparisonFilterChange}
                onResetFilters={resetPeriodComparisonFilters}
            />;
        case 'final-comparison':
            return <FinalComparisonPage 
                data={finalComparisonData} 
                onAnalyze={openAnalysisModal}
                filters={filters.finalComparisonFilters}
                filterOptions={filterOptions}
                onFilterChange={handleFinalComparisonFilterChange}
                onResetFilters={resetFinalComparisonFilters}
            />;
        case 'historical-component-comparison':
            return <HistoricalComponentComparisonPage 
                data={historicalComparisonData} 
                onAnalyze={openAnalysisModal}
                filters={filters.historicalComponentComparisonFilters}
                filterOptions={filterOptions}
                onFilterChange={handleHistoricalComponentComparisonFilterChange}
                onResetFilters={resetHistoricalComponentComparisonFilters}
            />;
        case 'historical-performance':
            return <HistoricalPerformancePage 
                data={historicalComparisonData} 
                onAnalyze={openAnalysisModal}
                filters={filters.historicalPerformanceFilters}
                filterOptions={filterOptions}
                onFilterChange={handleHistoricalPerformanceFilterChange}
                onResetFilters={resetHistoricalPerformanceFilters}
            />;
        default:
            return <p>Seleccione un gráfico del menú.</p>;
    }
};