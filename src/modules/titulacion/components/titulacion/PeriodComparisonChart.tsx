
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SheetData } from '@core/types';

interface PeriodComparisonChartProps {
  data: SheetData;
  colors: string[];
}

const normalizeKey = (str: string | undefined | null): string => {
    if (typeof str !== 'string') return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
};

const findKey = (obj: Record<string, any>, targetKey: string): string | undefined => {
    if (!obj) return undefined;
    const normalizedTarget = normalizeKey(targetKey);
    for (const key in obj) {
        if (normalizeKey(key) === normalizedTarget) {
            return key;
        }
    }
    return undefined;
};

const safeToNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return isNaN(value) ? 0 : value;
    if (typeof value === 'string') {
      const cleanedValue = value.replace(',', '.').trim();
      const num = parseFloat(cleanedValue);
      return isNaN(num) ? 0 : num;
    }
    return 0;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.slice().reverse().map((pld: any) => (
            <div key={pld.dataKey} style={{ color: pld.fill }} className="font-medium flex items-center justify-between space-x-4">
              <span>{pld.name}:</span>
              <span className="font-bold">{Number(pld.value).toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
};

export const PeriodComparisonChart: React.FC<PeriodComparisonChartProps> = ({ data, colors }) => {
    const { chartData, tableData, criteria, previousPeriodName, currentPeriodName } = useMemo(() => {
        if (!data || !data.rows || data.rows.length < 2) {
            return { chartData: [], tableData: {}, criteria: [], previousPeriodName: '', currentPeriodName: '' };
        }
        
        const firstRow = data.rows[0];
        const ordenKey = findKey(firstRow, 'orden');
        const paoKey = findKey(firstRow, 'pao');
        const criterioKey = findKey(firstRow, 'criterio');
        const puntuacionKey = findKey(firstRow, 'puntuacion');

        if (!ordenKey || !paoKey || !criterioKey || !puntuacionKey) {
             return { chartData: [], tableData: {}, criteria: [], previousPeriodName: '', currentPeriodName: '' };
        }

        const periodMap = new Map<number, string>();
        data.rows.forEach(row => {
            const orden = safeToNumber(row[ordenKey]);
            const pao = String(row[paoKey]);
            if (orden && pao && !periodMap.has(orden)) {
                periodMap.set(orden, pao);
            }
        });

        const sortedOrders = Array.from(periodMap.keys()).sort((a, b) => b - a);
        if (sortedOrders.length < 2) {
            return { chartData: [], tableData: {}, criteria: [], previousPeriodName: '', currentPeriodName: '' };
        }
        
        const [currentOrder, previousOrder] = sortedOrders;
        const currentPeriod = periodMap.get(currentOrder) || '';
        const previousPeriod = periodMap.get(previousOrder) || '';

        const pivotedData = data.rows.reduce((acc, row) => {
            const orden = safeToNumber(row[ordenKey]);
            if (orden !== currentOrder && orden !== previousOrder) return acc;

            const criterio = String(row[criterioKey]);
            const puntuacion = safeToNumber(row[puntuacionKey]);
            
            if (!acc[criterio]) {
                acc[criterio] = { criterio };
            }
            
            if (orden === currentOrder) {
                acc[criterio][currentPeriod] = puntuacion;
            } else {
                acc[criterio][previousPeriod] = puntuacion;
            }
            return acc;
        }, {} as Record<string, any>);
        
        const finalChartData = Object.values(pivotedData);
        const criteriaHeaders = Object.keys(pivotedData);

        const finalTableData = {
            [previousPeriod]: {} as Record<string, any>,
            [currentPeriod]: {} as Record<string, any>,
        };

        finalChartData.forEach((item: any) => {
            finalTableData[previousPeriod][item.criterio] = item[previousPeriod];
            finalTableData[currentPeriod][item.criterio] = item[currentPeriod];
        });

        return {
            chartData: finalChartData,
            tableData: finalTableData,
            criteria: criteriaHeaders,
            previousPeriodName: previousPeriod,
            currentPeriodName: currentPeriod,
        };
    }, [data]);
    
    const previousColor = colors[0];
    const currentColor = colors[2] || colors[1];

    if (!chartData.length || !previousPeriodName || !currentPeriodName) {
        return <p className="text-center text-slate-500">No hay datos suficientes para la comparación de períodos.</p>;
    }

    return (
        <div className="w-full">
            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="criterio" tick={false} axisLine={false} tickLine={false} />
                        <YAxis 
                            domain={[87, 97]}
                            tickCount={11}
                            axisLine={{ stroke: '#cbd5e1' }} 
                            tickLine={{ stroke: '#cbd5e1' }} 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            label={{ value: 'Puntuación', angle: -90, position: 'insideLeft', fill: '#64748b', style: { textAnchor: 'middle' }, offset: 10 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                        <Bar dataKey={previousPeriodName} fill={previousColor} name={previousPeriodName.replace(/_/g,' ')} />
                        <Bar dataKey={currentPeriodName} fill={currentColor} name={currentPeriodName.replace(/_/g,' ')} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse text-sm text-left">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="p-3 border-b border-slate-200 font-semibold text-slate-600 w-[250px]">Período</th>
                            {criteria.map(c => <th key={c} className="p-3 border-b border-slate-200 min-w-[200px] text-center font-semibold text-slate-600">{c}</th>)}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 border-b border-slate-200 font-medium text-slate-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: previousColor }}></div>
                                    <span>{previousPeriodName.replace(/_/g,' ')}</span>
                                </div>
                            </td>
                            {criteria.map(c => <td key={c} className="p-3 border-b border-slate-200 text-center text-slate-600">{tableData[previousPeriodName]?.[c] != null ? safeToNumber(tableData[previousPeriodName][c]).toFixed(2).replace('.',',') : 'N/A'}</td>)}
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 border-b border-slate-200 font-medium text-slate-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentColor }}></div>
                                    <span>{currentPeriodName.replace(/_/g,' ')}</span>
                                </div>
                            </td>
                            {criteria.map(c => <td key={c} className="p-3 border-b border-slate-200 text-center text-slate-600">{tableData[currentPeriodName]?.[c] != null ? safeToNumber(tableData[currentPeriodName][c]).toFixed(2).replace('.',',') : 'N/A'}</td>)}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
