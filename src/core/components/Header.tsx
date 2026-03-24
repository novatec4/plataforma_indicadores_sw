import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { AppModule } from '@core/types';

interface HeaderProps {
    currentModule: AppModule;
    setCurrentModule: (module: AppModule) => void;
}

const moduleNames: Record<AppModule, string> = {
    [AppModule.EVALUACION_DOCENTE]: 'Evaluación Docente',
    [AppModule.INDICADORES_ACADEMICOS]: 'Indicadores Académicos',
    [AppModule.VINCULACION]: 'Proyectos de Vinculación',
    [AppModule.TITULACION]: 'Titulación',
};

export const Header: React.FC<HeaderProps> = ({ currentModule, setCurrentModule }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 w-full">
      <div className="container mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center justify-start gap-4">
            <img src="/FIE_HORIZONTAL.svg" alt="FIE Logo" className="h-12" />
            <div>
                <h1 className="text-xl font-bold text-slate-800">Plataforma de Información</h1>
                <p className="text-sm text-slate-500">Escuela Superior Politécnica de Chimborazo - Facultad de Informática y Electrónica - Ing. de Software</p>
            </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
            <LayoutGrid className="w-5 h-5 text-slate-500 ml-2" />
            <select 
                value={currentModule}
                onChange={(e) => setCurrentModule(e.target.value as AppModule)}
                className="bg-transparent border-none text-sm font-semibold text-slate-700 outline-none cursor-pointer py-1 pr-6"
            >
                {Object.values(AppModule).map((mod) => (
                    <option key={mod} value={mod}>
                        Módulo: {moduleNames[mod as AppModule]}
                    </option>
                ))}
            </select>
        </div>
      </div>
    </header>
  );
};