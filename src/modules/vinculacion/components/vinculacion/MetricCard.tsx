import React from 'react';

interface MetricCardProps {
    title: string;
    value: string | number;
    prefix?: string;
    suffix?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, prefix = '', suffix = '' }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 flex flex-col justify-center">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</h3>
            <p className="text-3xl font-bold text-slate-800">{prefix}{value}{suffix}</p>
        </div>
    );
};
