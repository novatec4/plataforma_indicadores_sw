
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { SheetData } from '@core/types';

interface FinalComparisonChartProps {
  data: SheetData;
  colors: string[];
}

const normalizeKey = (str: string | undefined | null): string => {
    if (typeof str !== 'string') return '';
    return str.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const findKey = (obj: Record<string, any>, targetKey: string): string | undefined => {
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

export const FinalComparisonChart: React.FC<FinalComparisonChartProps> = ({ data, colors }) => {
    const { chartData, seriesNames } = useMemo(() => {
        if (!data || !data.rows || data.rows.length === 0) {
            return { chartData: [], seriesNames: [] };
        }

        const firstRow = data.rows[0];
        const componenteKey = findKey(firstRow, 'componente');
        const paoKey = findKey(firstRow, 'pao');
        const puntuacionKey = findKey(firstRow, 'puntuacion');
        
        if (!componenteKey || !paoKey || !puntuacionKey) {
             return { chartData: [], seriesNames: [] };
        }
        
        const pivotedData = data.rows.reduce((acc, row) => {
            const componente = String(row[componenteKey]);
            const pao = String(row[paoKey]);
            const puntuacion = safeToNumber(row[puntuacionKey]);
            
            if (!acc[componente]) {
                acc[componente] = { name: componente };
            }
            acc[componente][pao] = puntuacion;
            return acc;
        }, {} as Record<string, any>);

        const finalChartData = Object.values(pivotedData);
        const uniquePaos = Array.from(new Set(data.rows.map(row => String(row[paoKey]))));

        return { chartData: finalChartData, seriesNames: uniquePaos };
    }, [data]);
    
    if (chartData.length === 0) {
        return <p className="text-center text-slate-500">No hay datos suficientes para mostrar el gráfico de comparación final.</p>;
    }

    return (
        <div className="w-full">
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                        <YAxis 
                            domain={[84, 102]}
                            tickCount={10}
                            axisLine={{ stroke: '#cbd5e1' }} 
                            tickLine={{ stroke: '#cbd5e1' }} 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            label={{ value: 'Puntuación', angle: -90, position: 'insideLeft', fill: '#64748b', style: { textAnchor: 'middle' }, offset: 0 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                        <Legend wrapperStyle={{ paddingLeft: '40px' }} />
                        {seriesNames.map((series, index) => (
                             <Bar key={series} dataKey={series} name={series.replace(/_/g, ' ')} fill={colors[index % colors.length]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
