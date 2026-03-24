import React from 'react';
import { useDashboardData } from '@indicadores/hooks/indicadores/useDashboardData';
import { AcademicView } from './indicadores/views/AcademicView';
import { QualityView } from './indicadores/views/QualityView';
import { Icon } from './indicadores/Icons';
import { Loader } from '@core/components/Loader';
import type { Page } from '@core/components/Sidebar';

interface IndicadoresModuleProps {
    currentPage: Page;
}

const IndicadoresModule: React.FC<IndicadoresModuleProps> = ({ currentPage }) => {
    const { data, isLoading, fetchError } = useDashboardData();

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
                <Loader message="Cargando datos del dashboard..." />
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-red-50 text-red-700 p-8">
                <Icon name="alertTriangle" className="w-12 h-12 mb-4 text-red-500" />
                <h1 className="text-xl font-bold mb-2">Error al cargar los datos</h1>
                <p className="text-center max-w-md">No se pudieron obtener los datos necesarios para mostrar el dashboard.</p>
                <p className="text-sm mt-4 text-red-600 bg-red-100 p-3 rounded-md">Detalle del error: {fetchError}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 text-slate-600">
                <Icon name="search" className="w-10 h-10 mr-4" />
                <span className="text-lg font-semibold">No se encontraron datos.</span>
            </div>
        );
    }

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'indicadores-dashboard':
                return (
                    <AcademicView 
                        academicData={data.combinedAcademicData} 
                        graduatesData={data.annualGraduatesData} 
                    />
                );
            case 'indicadores-trends':
                return (
                    <QualityView 
                        qualityData={data.qualityIndicatorsData} 
                        qualityCategories={data.qualityIndicatorCategories} 
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex-1 flex flex-col relative w-full h-full overflow-y-auto p-4 md:p-8 bg-slate-50">
            {renderCurrentPage()}
        </div>
    );
};

export default IndicadoresModule;