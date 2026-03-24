import React from 'react';
import { Icon } from '../Icons';

export const ExportButton: React.FC<{ onClick: () => void; }> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md flex items-center transition-all duration-200 transform hover:-translate-y-0.5 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
        >
            <Icon name="download" className="w-4 h-4 mr-1.5" />
            Exportar
        </button>
    );
};