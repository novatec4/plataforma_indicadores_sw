import React from 'react';

type PerformanceFilter = 'all' | 'optimal' | 'acceptable' | 'critical';

interface Props {
    activeFilter: PerformanceFilter;
    onFilterChange: (filter: PerformanceFilter) => void;
}

const filters: { id: PerformanceFilter; label: string; color: string }[] = [
    { id: 'all', label: 'Todos', color: 'bg-slate-400' },
    { id: 'optimal', label: 'Óptimo (≥80%)', color: 'bg-green-500' },
    { id: 'acceptable', label: 'Aceptable (50-79%)', color: 'bg-amber-400' },
    { id: 'critical', label: 'Crítico (<50%)', color: 'bg-red-500' },
];

export const PerformanceFilterButtons: React.FC<Props> = ({ activeFilter, onFilterChange }) => {
    return (
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {filters.map(filter => (
                <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap
                        ${activeFilter === filter.id 
                            ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                        }`}
                >
                    <span className={`w-2 h-2 rounded-full ${filter.color} shadow-sm`}></span>
                    {filter.label}
                </button>
            ))}
        </div>
    );
};