import React, { useState, useEffect } from 'react';
import { Loader } from '@core/components/Loader';
import { ErrorDisplay } from '@core/components/ErrorDisplay';
import { DetailModal } from '@evaluacion_docente/components/DetailModal';
import { PageRenderer } from '@evaluacion_docente/components/PageRenderer';
import type { Page } from '@core/components/Sidebar';
import { useDashboardData } from '@evaluacion_docente/hooks/useDashboardData';
import { useFilters } from '@evaluacion_docente/hooks/useFilters';

interface EvaluacionDocenteModuleProps {
    currentPage: Page;
}

const EvaluacionDocenteModule: React.FC<EvaluacionDocenteModuleProps> = ({ currentPage }) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedCriterion, setSelectedCriterion] = useState<Record<string, any> | null>(null);

  const {
    isLoading: isLoadingData,
    error: dataError,
    evaluationData,
    comparisonData,
    historicalData,
    historicalComparisonData,
    finalComparisonData,
    loadData,
  } = useDashboardData();

  const {
    historicalFilters,
    comparisonFilters,
    generalAnalysisFilters,
    periodComparisonFilters,
    finalComparisonFilters,
    historicalComponentComparisonFilters,
    historicalPerformanceFilters,
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
  } = useFilters(historicalData, comparisonData, evaluationData, historicalComparisonData, finalComparisonData);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCriterionClick = (criterionData: Record<string, any>) => {
    setSelectedCriterion(criterionData);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCriterion(null);
  };

  if (isLoadingData) {
    return <div className="flex-1 flex items-center justify-center p-8"><Loader message={'Cargando datos de evaluación...'} /></div>;
  }
  if (dataError) {
    return <div className="flex-1 flex items-center justify-center p-8"><ErrorDisplay message={dataError} onRetry={loadData} /></div>;
  }

  return (
    <div className="flex-1 flex flex-col relative w-full h-full overflow-y-auto p-4 md:p-8">
      { (evaluationData || comparisonData || historicalData || historicalComparisonData || finalComparisonData) ? (
        <PageRenderer
          currentPage={currentPage}
          evaluationData={evaluationData}
          comparisonData={comparisonData}
          historicalData={historicalData}
          historicalComparisonData={historicalComparisonData}
          finalComparisonData={finalComparisonData}
          filters={{ 
              historicalFilters, 
              comparisonFilters, 
              generalAnalysisFilters, 
              periodComparisonFilters, 
              finalComparisonFilters,
              historicalComponentComparisonFilters,
              historicalPerformanceFilters
          }}
          filterOptions={filterOptions}
          handleHistoricalFilterChange={handleHistoricalFilterChange}
          resetHistoricalFilters={resetHistoricalFilters}
          handleComparisonFilterChange={handleComparisonFilterChange}
          resetComparisonFilters={resetComparisonFilters}
          handleGeneralAnalysisFilterChange={handleGeneralAnalysisFilterChange}
          resetGeneralAnalysisFilters={resetGeneralAnalysisFilters}
          handlePeriodComparisonFilterChange={handlePeriodComparisonFilterChange}
          resetPeriodComparisonFilters={resetPeriodComparisonFilters}
          handleFinalComparisonFilterChange={handleFinalComparisonFilterChange}
          resetFinalComparisonFilters={resetFinalComparisonFilters}
          handleHistoricalComponentComparisonFilterChange={handleHistoricalComponentComparisonFilterChange}
          resetHistoricalComponentComparisonFilters={resetHistoricalComponentComparisonFilters}
          handleHistoricalPerformanceFilterChange={handleHistoricalPerformanceFilterChange}
          resetHistoricalPerformanceFilters={resetHistoricalPerformanceFilters}
          openAnalysisModal={() => {}}
          handleCriterionClick={handleCriterionClick}
        />
      ) : null }

      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        criterionData={selectedCriterion}
      />
    </div>
  );
};

export default EvaluacionDocenteModule;