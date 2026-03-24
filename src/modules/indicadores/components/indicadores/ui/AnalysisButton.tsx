import React from 'react';
import { Icon } from '../Icons';

export const AnalysisButton: React.FC<{onClick: () => void}> = ({ onClick }) => (
    <button 
        onClick={onClick}
        className="bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-200 flex items-center justify-center shrink-0 w-full sm:w-auto shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
    >
        <Icon name="lightbulb" className="w-5 h-5 mr-2" />
        Generar Análisis con IA
    </button>
);