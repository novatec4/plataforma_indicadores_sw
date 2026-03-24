import React, { useState } from 'react';
import { QualityIndicator, QualityIndicatorCategories } from '@core/types';
import { Modal } from '../Modal';

interface CategoryManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    indicators: QualityIndicator[];
    categories: QualityIndicatorCategories;
    indicatorToCategoryMap: Record<string, string>;
    onAssign: (indicatorTitle: string, category: string) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({ isOpen, onClose, indicators, categories, indicatorToCategoryMap, onAssign }) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const categoryOptions = Object.keys(categories).sort();
    const filteredIndicators = indicators.filter(ind => ind.titulo.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCreateCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName && !categoryOptions.includes(newCategoryName)) {
            // The assignment of an indicator to a new category will effectively create it in the main view
            // This component just needs to make it an option
            categoryOptions.push(newCategoryName);
            setNewCategoryName('');
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gestionar Categorías de Indicadores">
            <div className="space-y-6">
                <div>
                    <input
                        type="text"
                        placeholder="Buscar indicador..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                </div>
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                    <ul className="space-y-4">
                        {filteredIndicators.map(indicator => (
                            <li key={indicator.idIndicador} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
                                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm mb-2 sm:mb-0">{indicator.titulo}</span>
                                <select
                                    value={indicatorToCategoryMap[indicator.titulo] || ''}
                                    onChange={(e) => onAssign(indicator.titulo, e.target.value)}
                                    className="p-2 border rounded-md text-sm dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                >
                                    {categoryOptions.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <form onSubmit={handleCreateCategory} className="flex items-center gap-2 mt-4">
                        <input
                            type="text"
                            placeholder="Nuevo nombre de categoría..."
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="flex-grow p-2 border rounded-md text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700">
                           Añadir Opción
                        </button>
                    </form>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Nota: Los cambios se guardan localmente en su navegador.</p>
                </div>
            </div>
        </Modal>
    );
};