import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    description: string;
    icon: LucideIcon;
    actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, icon: Icon, actions }) => {
    return (
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 border-b border-slate-200 pb-6 mb-8">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-600 rounded-lg text-white shadow-sm">
                        <Icon size={24} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
                </div>
                <p className="text-slate-500 text-lg max-w-3xl leading-relaxed">{description}</p>
            </div>
            {actions && (
                <div className="flex items-center gap-3">
                    {actions}
                </div>
            )}
        </div>
    );
};
