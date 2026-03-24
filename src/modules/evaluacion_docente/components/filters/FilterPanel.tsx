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
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-slate-100">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full xl:w-auto">
                    <h3 className="text-base font-bold text-slate-800 shrink-0">{title}</h3>
                    {hasFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-4 w-full">
                            {children}
                        </div>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 mt-2 xl:mt-0">
                    {hasFilters && onReset && (
                        <button
                            onClick={onReset}
                            className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100 border border-transparent"
                            aria-label="Limpiar filtros"
                        >
                            <XCircleIcon className="h-4 w-4" />
                            <span>Limpiar</span>
                        </button>
                    )}
                    {actions && <div className="w-full sm:w-auto">{actions}</div>}
                </div>
            </div>
        </div>
    );
};