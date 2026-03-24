import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 w-full">
      <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-start gap-4">
        <img src="./FIE_HORIZONTAL.svg" alt="FIE Logo" className="h-12" />
        <div>
            <h1 className="text-xl font-bold text-slate-800">Dashboard de Proyectos de Vinculación Institucional</h1>
            <p className="text-sm text-slate-500">Escuela Superior Politécnica de Chimborazo - Facultad de Informática y Electrónica - Ing. de Software</p>
        </div>
      </div>
    </header>
  );
};