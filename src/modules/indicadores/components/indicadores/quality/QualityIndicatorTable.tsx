import React from 'react';
import { QualityIndicator } from '@core/types';
import { CheckCircle2 } from 'lucide-react';

const getPerformanceInfo = (value: number | null) => {
    if (value === null || value === undefined) return { color: 'bg-slate-100', text: 'text-slate-500', label: 'Sin Datos' };
    if (value >= 80) return { color: 'bg-green-50', text: 'text-green-700', label: 'Óptimo' };
    if (value >= 50) return { color: 'bg-amber-50', text: 'text-amber-700', label: 'Aceptable' };
    return { color: 'bg-red-50', text: 'text-red-700', label: 'Crítico' };
};

export const QualityIndicatorTable: React.FC<{
    indicators: QualityIndicator[];
    selectedItems: string[];
    onSelectionChange: (item: string) => void;
    indicatorDescriptions: Map<string, string>;
}> = ({ indicators, selectedItems, onSelectionChange }) => {
    
    const getLatestValue = (indicator: QualityIndicator): number | null => {
        if (!indicator.periodos || indicator.periodos.length === 0) return null;
        return indicator.periodos[indicator.periodos.length - 1]?.valor ?? null;
    };
    
    return (
        <div className="overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="p-4 w-12 text-center">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Sel.</span>
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                Indicador de Calidad
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                Último Valor
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                Estado de Rendimiento
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {indicators.map(indicator => {
                            const latestValue = getLatestValue(indicator);
                            const performance = getPerformanceInfo(latestValue);
                            const isSelected = selectedItems.includes(indicator.titulo);
                            
                            return (
                                <tr 
                                    key={indicator.idIndicador} 
                                    onClick={() => onSelectionChange(indicator.titulo)}
                                    className={`group cursor-pointer transition-all duration-200 ${isSelected ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}
                                >
                                    <td className="p-4 text-center">
                                        <div className={`mx-auto w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                            isSelected 
                                                ? 'bg-blue-600 border-blue-600 shadow-sm' 
                                                : 'bg-white border-slate-300 group-hover:border-blue-400'
                                        }`}>
                                            {isSelected && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-normal max-w-lg">
                                        <p className={`text-sm font-bold leading-snug ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                                            {indicator.titulo}
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 font-medium">
                                            {indicator.descripcion}
                                        </p>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-center">
                                        <span className={`text-sm font-extrabold ${latestValue !== null ? 'text-slate-700' : 'text-slate-300'}`}>
                                            {latestValue !== null ? `${latestValue.toFixed(2)}%` : '—'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-center">
                                        <span className={`px-3 py-1 text-[10px] font-extrabold uppercase rounded-full border ${performance.color} ${performance.text} border-transparent`}>
                                            {performance.label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {indicators.length === 0 && (
                <div className="p-12 text-center">
                    <p className="text-sm font-bold text-slate-400">No se encontraron indicadores con los filtros aplicados.</p>
                </div>
            )}
        </div>
    );
};