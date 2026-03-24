import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    subtitle?: string;
    tooltip?: string;
    className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children, actions, subtitle, tooltip, className = '' }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className={`bg-white rounded-xl shadow-md p-6 border border-slate-100 flex flex-col ${className}`}>
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
                        {tooltip && (
                            <div className="relative inline-block">
                                <button 
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                    className="text-slate-300 hover:text-blue-500 transition-colors focus:outline-none"
                                    aria-label={`Información sobre ${title}`}
                                >
                                    <Info size={18} />
                                </button>
                                {showTooltip && (
                                    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-[11px] leading-relaxed font-medium rounded-lg shadow-xl animate-fade-in pointer-events-none">
                                        {tooltip}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {subtitle && <p className="text-sm text-slate-500 mt-1 font-medium">{subtitle}</p>}
                </div>
                {actions && <div className="flex items-center space-x-2">{actions}</div>}
            </div>
            <div className="w-full flex-1">
                {children}
            </div>
        </div>
    );
};
