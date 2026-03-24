import React from 'react';

interface FilterPanelProps {
    title: string;
    children?: React.ReactNode;
    onReset?: () => void;
    actions?: React.ReactNode;
}

const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );

export const FilterPanel: React.FC<FilterPanelProps> = ({ title, children, onReset, actions }) => {
    const hasFilters = React.Children.count(children) > 0;
    
    return (
        <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <h3 className="text-md font-semibold text-slate-700 shrink-0">{title}</h3>
                    {hasFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {children}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    {actions}
                    {hasFilters && onReset && (
                        <button
                            onClick={onReset}
                            className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                            aria-label="Limpiar filtros"
                        >
                            <XCircleIcon className="h-4 w-4" />
                            <span>Limpiar Filtros</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};