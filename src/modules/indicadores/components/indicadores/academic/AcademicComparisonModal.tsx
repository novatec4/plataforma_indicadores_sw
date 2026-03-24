import React, { useState, useMemo } from 'react';
import { Modal } from '../Modal';
import { AcademicPeriod } from '@core/types';
import { Icon } from '../Icons';

const formatPeriodLabel = (label: string | undefined): string => {
    if (!label) return '';

    const monthMap: { [key: string]: string } = {
        ENERO: 'Ene', FEBRERO: 'Feb', MARZO: 'Mar', ABRIL: 'Abr', MAYO: 'May', JUNIO: 'Jun',
        JULIO: 'Jul', AGOSTO: 'Ago', SEPTIEMBRE: 'Sep', OCTUBRE: 'Oct', NOVIEMBRE: 'Nov', DICIEMBRE: 'Dic',
        ENE: 'Ene', FEB: 'Feb', MAR: 'Mar', ABR: 'Abr', MAY: 'May', JUN: 'Jun',
        JUL: 'Jul', AGO: 'Ago', SEP: 'Sep', OCT: 'Oct', NOV: 'Nov', DIC: 'Dic'
    };
    
    const monthRegex = new RegExp(`\\b(${Object.keys(monthMap).join('|')})\\b`, 'i');
    const yearRegex = /(\d{4}|'\d{2})/;

    const fallbackFormat = (str: string) => str.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

    const parts = label.split(' - ');
    if (parts.length < 2) {
        return fallbackFormat(label);
    }
    
    const endPart = parts[1];
    const endPartYearMatch = endPart.match(yearRegex);
    const endYear = endPartYearMatch ? endPartYearMatch[0] : null;

    const formattedParts = parts.map((part, index) => {
        const monthMatch = part.match(monthRegex);
        let yearMatch = part.match(yearRegex);

        if (index === 0 && !yearMatch && endYear) {
            yearMatch = [endYear]; // Inherit year from the second part
        }
        
        if (monthMatch && yearMatch) {
            const month = monthMatch[0].toUpperCase();
            let year = yearMatch[0];
            if (year.startsWith("'")) year = year.substring(1);
            else if (year.length === 4) year = year.slice(-2);
            
            const monthKey = Object.keys(monthMap).find(k => k === month) as keyof typeof monthMap;
            return `${monthMap[monthKey]} '${year}`;
        }
        
        return fallbackFormat(part); // Fallback for the part if it doesn't match
    });

    return formattedParts.join(' - ');
};

interface AcademicComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    periods: AcademicPeriod[];
}

const ComparisonRow: React.FC<{
    label: string;
    value1: number | string;
    value2: number | string;
    unit?: string;
    invertColors?: boolean;
}> = ({ label, value1, value2, unit = '', invertColors = false }) => {
    
    const val1 = typeof value1 === 'number' ? value1 : parseFloat(value1);
    const val2 = typeof value2 === 'number' ? value2 : parseFloat(value2);
    
    let trendIcon: React.ReactNode = null;
    let trendColor = 'text-slate-500 dark:text-slate-400';
    
    if (!isNaN(val1) && !isNaN(val2)) {
        if (val2 > val1) {
            trendIcon = <Icon name="check" className="w-4 h-4" />;
            trendColor = invertColors ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400';
        } else if (val2 < val1) {
            trendIcon = <Icon name="x" className="w-4 h-4" />;
            trendColor = invertColors ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';
        }
    }
    
    const formatValue = (v: number | string) => {
        if (v === 'N/A') return v;
        if (typeof v === 'number') {
            if (unit === '%') return v.toFixed(2) + unit;
            return v.toLocaleString();
        }
        return v + unit;
    };

    return (
        <tr className="border-b dark:border-slate-700 last:border-b-0">
            <td className="py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-300">{label}</td>
            <td className="py-3 px-4 text-sm text-center text-slate-800 dark:text-slate-100 font-semibold">{formatValue(value1)}</td>
            <td className="py-3 px-4 text-sm text-center text-slate-800 dark:text-slate-100 font-semibold">{formatValue(value2)}</td>
            <td className={`py-3 px-4 text-sm text-center ${trendColor}`}>
                <div className="flex items-center justify-center">
                    {trendIcon}
                </div>
            </td>
        </tr>
    );
};


export const AcademicComparisonModal: React.FC<AcademicComparisonModalProps> = ({ isOpen, onClose, periods }) => {
    const validPeriods = useMemo(() => periods.filter(p => p.descripcion), [periods]);
    const [period1, setPeriod1] = useState<string>(validPeriods[validPeriods.length - 2]?.codigoPeriodo || '');
    const [period2, setPeriod2] = useState<string>(validPeriods[validPeriods.length - 1]?.codigoPeriodo || '');

    const data1 = useMemo(() => validPeriods.find(p => p.codigoPeriodo === period1), [validPeriods, period1]);
    const data2 = useMemo(() => validPeriods.find(p => p.codigoPeriodo === period2), [validPeriods, period2]);

    if (!isOpen) return null;

    const periodOptions = validPeriods.map(p => ({ value: p.codigoPeriodo, label: p.descripcion }));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Comparar Periodos Académicos">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <div>
                        <label htmlFor="period1-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Periodo Base</label>
                        <select
                            id="period1-select"
                            value={period1}
                            onChange={e => setPeriod1(e.target.value)}
                            className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        >
                            {periodOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="period2-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Periodo de Comparación</label>
                        <select
                            id="period2-select"
                            value={period2}
                            onChange={e => setPeriod2(e.target.value)}
                            className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        >
                            {periodOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                </div>

                {data1 && data2 ? (
                     <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg">
                            <thead className="bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Indicador</th>
                                    <th className="py-3 px-4 text-center text-xs font-bold uppercase text-slate-600 dark:text-slate-300">{formatPeriodLabel(data1.descripcion)}</th>
                                    <th className="py-3 px-4 text-center text-xs font-bold uppercase text-slate-600 dark:text-slate-300">{formatPeriodLabel(data2.descripcion)}</th>
                                    <th className="py-3 px-4 text-center text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Tendencia</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-slate-700">
                                <ComparisonRow label="Tasa de Retención" value1={data1.valorRetencion ?? 'N/A'} value2={data2.valorRetencion ?? 'N/A'} unit="%" />
                                <ComparisonRow label="Tasa de Deserción" value1={data1.valorDesercion ?? 'N/A'} value2={data2.valorDesercion ?? 'N/A'} unit="%" invertColors />
                                <ComparisonRow label="Tasa de Titulación" value1={data1.valorTitulacion ?? 'N/A'} value2={data2.valorTitulacion ?? 'N/A'} unit="%" />
                                <ComparisonRow label="Admitidos" value1={data1.admitidos ?? 'N/A'} value2={data2.admitidos ?? 'N/A'} />
                                <ComparisonRow label="Matriculados" value1={data1.matriculados ?? 'N/A'} value2={data2.matriculados ?? 'N/A'} />
                            </tbody>
                        </table>
                     </div>
                ) : (
                    <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                        <p>Seleccione dos periodos para comparar los datos.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};