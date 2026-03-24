import React, { useState, useEffect } from 'react';
import { Header } from '@core/components/Header';
import { Sidebar } from '@core/components/Sidebar';
import type { Page } from '@core/components/Sidebar';
import { AppModule } from '@core/types';
import EvaluacionDocenteModule from '@evaluacion_docente/components/EvaluacionDocenteModule';
import TitulacionModule from '@titulacion/components/TitulacionModule';
import VinculacionModule from '@vinculacion/components/VinculacionModule';
import IndicadoresModule from '@indicadores/components/IndicadoresModule';

const App: React.FC = () => {
    const [currentModule, setCurrentModule] = useState<AppModule>(AppModule.EVALUACION_DOCENTE);
    const [currentPage, setCurrentPage] = useState<Page>('general-analysis');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        switch(currentModule) {
            case AppModule.EVALUACION_DOCENTE:
                setCurrentPage('general-analysis');
                break;
            case AppModule.INDICADORES_ACADEMICOS:
                setCurrentPage('indicadores-dashboard');
                break;
            case AppModule.VINCULACION:
                setCurrentPage('vinculacion-dashboard');
                break;
            case AppModule.TITULACION:
                setCurrentPage('titulacion-dashboard');
                break;
        }
    }, [currentModule]);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(prevState => !prevState);
    };

    const renderModule = () => {
        switch(currentModule) {
            case AppModule.EVALUACION_DOCENTE:
                return <EvaluacionDocenteModule currentPage={currentPage} />;
            case AppModule.INDICADORES_ACADEMICOS:
                return <IndicadoresModule currentPage={currentPage} />;
            case AppModule.VINCULACION:
                return <VinculacionModule currentPage={currentPage} />;
            case AppModule.TITULACION:
                return <TitulacionModule currentPage={currentPage} />;
            default:
                return null;
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col font-sans text-slate-900 overflow-hidden">
            <Header currentModule={currentModule} setCurrentModule={setCurrentModule} />
            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar
                    currentModule={currentModule}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={toggleSidebar}
                />
                <main className="flex-1 flex overflow-hidden bg-slate-50 relative">
                    {renderModule()}
                </main>
            </div>
        </div>
    );
};

export default App;
