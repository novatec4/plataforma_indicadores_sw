import React from 'react';
import { Loader } from '@core/components/Loader';
import { AnalysisReport } from './AnalysisReport';
import { ErrorDisplay } from '@core/components/ErrorDisplay';

// FIX: Corrected the SVG definition for CloseIcon which had multiple syntax errors.
const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

interface AnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    analysis: string | null;
    error: string | null;
    onRetry: () => void;
    title: string;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, isLoading, analysis, error, onRetry, title }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-70 transition-opacity duration-300" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="analysis-modal-title"
        >
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col m-4 transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h3 id="analysis-modal-title" className="text-xl font-bold text-slate-800">
                        Análisis con IA: <span className="text-blue-600 font-semibold">{title}</span>
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                        aria-label="Cerrar modal"
                    >
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {isLoading && <Loader message="La IA está analizando los resultados..." />}
                    {error && !isLoading && <ErrorDisplay message={error} onRetry={onRetry} />}
                    {analysis && !isLoading && !error && <AnalysisReport analysis={analysis} />}
                </div>
            </div>
            <style>{`
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};