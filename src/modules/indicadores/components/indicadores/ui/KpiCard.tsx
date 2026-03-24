import React from 'react';
import { Kpi } from '@core/types';
import { Icon } from '../Icons';

export const KpiCard: React.FC<Kpi> = ({ title, value, icon, trend, trendValue, trendLabel, onClick }) => {
    
    const cardContent = (
        <div className={`bg-white p-5 rounded-xl shadow-md flex items-start gap-4 h-full transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''}`}>
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-50 rounded-lg text-blue-600">
                 <Icon name={icon} className="w-6 h-6" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 h-full">
                <p className="text-sm font-medium text-slate-500 truncate uppercase tracking-wider">{title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold text-slate-800">{value}</p>
                    {trend && (
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                            {trend === 'up' ? '↑' : '↓'} {trendValue}
                        </span>
                    )}
                </div>
                {trendLabel && <p className="text-xs text-slate-400 mt-auto pt-2">{trendLabel}</p>}
            </div>
        </div>
    );

    return onClick ? <button onClick={onClick} className="text-left w-full h-full block focus:outline-none">{cardContent}</button> : cardContent;
};