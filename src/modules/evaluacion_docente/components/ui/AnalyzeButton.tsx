import React from 'react';
import { Sparkles } from 'lucide-react';

export const AnalyzeButton: React.FC<{ onClick: () => void; 'aria-label': string }> = ({ onClick, 'aria-label': ariaLabel }) => (
    <button 
        onClick={onClick}
        aria-label={ariaLabel}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95"
    >
        <Sparkles className="w-4 h-4" />
        <span>Analizar con IA</span>
    </button>
);