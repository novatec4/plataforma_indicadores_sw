import React, { useState, useEffect } from 'react';
import { QualityIndicatorCategories } from '@core/types';
import { Icon } from '../Icons';
import { ChevronDown, CheckCircle2, Circle } from 'lucide-react';

export const IndicatorAccordion: React.FC<{
    categories: QualityIndicatorCategories;
    selectedItems: string[];
    onSelectionChange: (item: string) => void;
    onCategorySelectionChange: (items: string[], select: boolean) => void;
    onClearAll: () => void;
}> = ({ categories, selectedItems, onSelectionChange, onCategorySelectionChange, onClearAll }) => {
    const [openCategories, setOpenCategories] = useState<string[]>([]);

    useEffect(() => {
        const categoryKeys = Object.keys(categories);
        if (categoryKeys.length > 0) {
            setOpenCategories(prevOpen => {
                const stillExistingOpen = prevOpen.filter(c => categoryKeys.includes(c));
                return stillExistingOpen.length > 0 ? stillExistingOpen : [categoryKeys[0]];
            });
        } else {
            setOpenCategories([]);
        }
    }, [categories]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Estructura de Indicadores</h4>
                <button
                    onClick={onClearAll}
                    className="text-xs font-bold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                >
                    Limpiar Selección
                </button>
            </div>
            <div className="divide-y divide-slate-100">
                {Object.entries(categories).map(([category, rawIndicators]) => {
                    const indicators = rawIndicators as string[];
                    const selectedInCategory = indicators.filter(ind => selectedItems.includes(ind)).length;
                    const allSelected = selectedInCategory === indicators.length;
                    const isOpen = openCategories.includes(category);

                    return (
                        <div key={category} className="group overflow-hidden">
                            <div className={`flex justify-between items-center p-4 hover:bg-slate-50 transition-all duration-300 ${isOpen ? 'bg-slate-50/30' : ''}`}>
                                <button
                                    onClick={() => setOpenCategories(p => p.includes(category) ? p.filter(c => c !== category) : [...p, category])}
                                    className="flex-grow flex items-center text-left"
                                >
                                    <ChevronDown className={`w-5 h-5 mr-4 text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                                    <div>
                                        <p className={`text-sm font-bold tracking-tight ${isOpen ? 'text-blue-900' : 'text-slate-700'}`}>{category}</p>
                                        <p className="text-xs font-medium text-slate-400 mt-0.5">
                                            {selectedInCategory === indicators.length 
                                                ? 'Todos seleccionados' 
                                                : `${selectedInCategory} de ${indicators.length} seleccionados`}
                                        </p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => onCategorySelectionChange(indicators, !allSelected)}
                                    className={`text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-lg border transition-all ${
                                        allSelected 
                                            ? 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100' 
                                            : 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100'
                                    }`}
                                >
                                    {allSelected ? 'Deseleccionar' : 'Seleccionar Todo'}
                                </button>
                            </div>
                            
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] border-t border-slate-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-white">
                                    {indicators.map(indicatorTitle => (
                                        <button 
                                            key={indicatorTitle}
                                            onClick={() => onSelectionChange(indicatorTitle)}
                                            className={`flex items-start p-3 rounded-xl border text-left transition-all group/item ${
                                                selectedItems.includes(indicatorTitle)
                                                    ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-100 shadow-sm'
                                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                                                selectedItems.includes(indicatorTitle) 
                                                    ? 'bg-blue-600 border-blue-600 shadow-sm' 
                                                    : 'bg-white border-slate-300 group-hover/item:border-blue-400'
                                            }`}>
                                                {selectedItems.includes(indicatorTitle) && <CheckCircle2 size={10} className="text-white" />}
                                            </div>
                                            <span className={`ml-3 text-xs leading-relaxed font-bold ${
                                                selectedItems.includes(indicatorTitle) ? 'text-blue-900' : 'text-slate-600 group-hover/item:text-blue-700'
                                            }`}>
                                                {indicatorTitle}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};