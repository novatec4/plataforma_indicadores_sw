import React from 'react';

interface MetricCardProps {
    title: string;
    value: string | number;
    prefix?: string;
    suffix?: string;
    icon?: React.ElementType;
    trendLabel?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, prefix = '', suffix = '', icon: Icon, trendLabel }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 flex flex-col relative overflow-hidden h-full">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
                {Icon && <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Icon size={20} /></div>}
            </div>
            <p className="text-3xl font-bold text-slate-800">{prefix}{value}{suffix}</p>
            {trendLabel && <p className="text-xs text-slate-400 font-medium mt-auto pt-2">{trendLabel}</p>}
        </div>
    );
};