import React from 'react';

interface SelectFilterProps {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
}

export const SelectFilter: React.FC<SelectFilterProps> = ({ label, value, onChange, options }) => {
    return (
        <div>
            <label htmlFor={label} className="block text-sm font-medium text-slate-600 mb-1">
                {label}
            </label>
            <select
                id={label}
                name={label}
                value={value}
                onChange={onChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
            >
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};
