
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import type { SheetData } from '@core/types';

interface HistoricalComparisonChartProps {
  data: SheetData;
  colors: string[];
}

const normalizeKey = (str: string | undefined | null): string => {
    if (typeof str !== 'string') return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
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

const CustomTooltipContent = ({ active, payload, label }: any) => {
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

const CustomizedBarLabel = (props: any) => {
    const { x, y, width, value } = props;
    if (value === 0) return null;
    return (
      <text x={x + width / 2} y={y} dy={-4} fill="#475569" fontSize={10} textAnchor="middle">
        {safeToNumber(value).toFixed(2).replace('.', ',')}
      </text>
    );
};


export const HistoricalComparisonChart: React.FC<HistoricalComparisonChartProps> = ({ data, colors }) => {
    const { chartData, periods } = useMemo(() => {
        if (!data || !data.rows || data.rows.length === 0) {
            return { chartData: [], periods: [] };
        }

        const pivotedData = data.rows.reduce((acc, row) => {
            const criterioKey = findKey(row, 'criterio');
            const paoKey = findKey(row, 'pao');
            const puntuacionKey = findKey(row, 'puntuacion');

            if (!criterioKey || !paoKey || !puntuacionKey) return acc;
            
            const criterio = String(row[criterioKey]);
            const pao = String(row[paoKey]);
            const puntuacion = safeToNumber(row[puntuacionKey]);

            if (!criterio || !pao) return acc;

            if (!acc[criterio]) {
                acc[criterio] = { criterio };
            }

            acc[criterio][pao] = puntuacion;
            return acc;
        }, {} as Record<string, any>);

        const finalChartData = Object.values(pivotedData);
        
        const periodOrderMap = new Map<string, number>();
        data.rows.forEach(row => {
            const paoKey = findKey(row, 'pao');
            const ordenKey = findKey(row, 'orden');
            if (paoKey && ordenKey && row[paoKey] && row[ordenKey]) {
                const paoValue = String(row[paoKey]);
                if (!periodOrderMap.has(paoValue)) {
                    periodOrderMap.set(paoValue, Number(row[ordenKey]));
                }
            }
        });

        const allPeriods = Array.from(periodOrderMap.keys()).sort((a, b) => (periodOrderMap.get(a) ?? 0) - (periodOrderMap.get(b) ?? 0));
        
        return { chartData: finalChartData, periods: allPeriods };
    }, [data]);

    if (chartData.length === 0) {
        return <p className="text-center text-slate-500 py-10">No hay datos suficientes para mostrar la comparación histórica.</p>;
    }
    
    // Generate palette from theme colors, recycling if needed
    const palette = periods.map((_, i) => colors[i % colors.length]);

    return (
        <div className="w-full">
            <div className="w-full h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="criterio" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} interval={0} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                        <YAxis 
                            domain={[84, 98]} 
                            tickCount={8} 
                            tick={{ fill: '#64748b', fontSize: 12 }} 
                            axisLine={{ stroke: '#cbd5e1' }} 
                            tickLine={{ stroke: '#cbd5e1' }}
                            label={{ value: 'Puntuación', angle: -90, position: 'insideLeft', fill: '#64748b', style: { textAnchor: 'middle' } }}
                         />
                        <Tooltip content={<CustomTooltipContent />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                        <Legend
                            iconSize={10}
                            wrapperStyle={{ bottom: 0, left: 20, paddingTop: '20px', fontSize: '11px' }}
                            formatter={(value) => value.replace(/_/g, ' ')}
                        />
                        {periods.map((period, index) => (
                            <Bar key={period} dataKey={period} fill={palette[index]} name={period}>
                                <LabelList dataKey={period} content={<CustomizedBarLabel />} />
                            </Bar>
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
