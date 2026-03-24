import React from 'react';
import { Icon } from '../Icons';

export const CompareButton: React.FC<{ onClick: () => void; disabled?: boolean }> = ({ onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed px-3 py-1.5 rounded-md flex items-center transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
        >
            <Icon name="compare" className="w-4 h-4 mr-1.5" />
            Comparar
        </button>
    );
};