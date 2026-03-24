import React from 'react';

export const ChartCardHeader: React.FC<{title: string; subtitle?: string;}> = ({ title, subtitle }) => (
    <div className="mb-6">
        <div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
    </div>
);