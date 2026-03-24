import React from 'react';
import { Icon } from '../Icons';

interface TabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    icon: string;
}

export const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick, icon }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-semibold transition-colors duration-200
                ${isActive
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                }`}
        >
            <Icon name={icon} className="w-5 h-5" />
            <span>{label}</span>
        </button>
    );
};