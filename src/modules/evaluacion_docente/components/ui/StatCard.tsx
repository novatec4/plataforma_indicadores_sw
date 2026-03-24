import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, title, value, description }) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-md flex items-start gap-4 h-full">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600">
                {icon}
            </div>
            <div className="flex flex-col w-full min-w-0 h-full">
                <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
                <p className="mt-1 text-3xl font-bold text-slate-800">{value}</p>
                {description && <p className="text-xs text-slate-400 mt-auto pt-2 leading-snug">{description}</p>}
            </div>
        </div>
    );
};