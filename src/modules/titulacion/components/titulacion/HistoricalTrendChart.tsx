
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import type { SheetData } from '@core/types';

interface HistoricalTrendChartProps {
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

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.filter((pld: any) => !pld.dataKey.includes('_trend')).slice().reverse().map((pld: any) => (
            <div key={pld.dataKey} style={{ color: pld.stroke }} className="font-medium flex items-center justify-between space-x-4">
              <span>{pld.name}:</span>
              <span className="font-bold">{Number(pld.value).toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
};

export const HistoricalTrendChart: React.FC<HistoricalTrendChartProps> = ({ data, colors }) => {
    const { chartData, criteria } = useMemo(() => {
        if (!data || !data.rows || data.rows.length === 0) {
            return { chartData: [], criteria: [] };
        }

        const firstRow = data.rows[0];
        const ordenKey = findKey(firstRow, 'orden');
        const paoKey = findKey(firstRow, 'pao');
        const criterioKey = findKey(firstRow, 'criterio');
        const puntuacionKey = findKey(firstRow, 'puntuacion');

        if (!ordenKey || !paoKey || !criterioKey || !puntuacionKey) {
            return { chartData: [], criteria: [] };
        }

        const pivotedData = new Map<string, any>();
        const criteriaSet = new Set<string>();

        data.rows.forEach(row => {
            const pao = String(row[paoKey]);
            const criterio = String(row[criterioKey]);
            const puntuacion = safeToNumber(row[puntuacionKey]);
            const orden = safeToNumber(row[ordenKey]);

            if (!pivotedData.has(pao)) {
                pivotedData.set(pao, { pao, orden });
            }
            pivotedData.get(pao)[criterio] = puntuacion;
            criteriaSet.add(criterio);
        });
        
        const uniqueCriteria = Array.from(criteriaSet);
        const unsortedChartData = Array.from(pivotedData.values());
        const sortedChartData = unsortedChartData.sort((a, b) => a.orden - b.orden);

        // Calculate trend line for each criterion
        uniqueCriteria.forEach(criterio => {
            const series = sortedChartData.map(d => d[criterio]).filter(v => v !== undefined);
            const n = series.length;
            if (n < 2) return;

            let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
            let seriesIndex = 0;
            sortedChartData.forEach((d) => {
                const y = d[criterio];
                if (y !== undefined) {
                    sumX += seriesIndex;
                    sumY += y;
                    sumXY += seriesIndex * y;
                    sumX2 += seriesIndex * seriesIndex;
                    seriesIndex++;
                }
            });

            const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;

            seriesIndex = 0;
            sortedChartData.forEach((d) => {
                if (d[criterio] !== undefined) {
                     d[`${criterio}_trend`] = slope * seriesIndex + intercept;
                     seriesIndex++;
                }
            });
        });

        return { chartData: sortedChartData, criteria: uniqueCriteria };
    }, [data]);

    if (chartData.length === 0) {
        return <p className="text-center text-slate-500 py-10">No hay datos suficientes para mostrar el gráfico de tendencias.</p>;
    }

    return (
        <div className="w-full">
            <div className="w-full h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 40, left: 10, bottom: 100 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="pao" tick={{ fill: '#64748b', fontSize: 11 }} angle={-35} textAnchor="end" height={80} interval={0} axisLine={{ stroke: '#cbd5e1' }} tickLine={{ stroke: '#cbd5e1' }}/>
                        <YAxis 
                            domain={[84, 98]} 
                            tickCount={8} 
                            tick={{ fill: '#64748b', fontSize: 12 }} 
                            axisLine={{ stroke: '#cbd5e1' }} 
                            tickLine={{ stroke: '#cbd5e1' }}
                            label={{ value: 'Puntuación', angle: -90, position: 'insideLeft', fill: '#64748b', style: { textAnchor: 'middle' } }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ bottom: 0, left: 20, paddingTop: '20px', fontSize: '12px' }} />
                        {criteria.map((criterio, index) => {
                            const color = colors[index % colors.length];
                            return (
                                <React.Fragment key={criterio}>
                                    <Line
                                        type="monotone"
                                        dataKey={criterio}
                                        stroke={color}
                                        strokeWidth={2.5}
                                        activeDot={{ r: 8 }}
                                        dot={{ r: 5 }}
                                        name={criterio}
                                    >
                                        <LabelList
                                            dataKey={criterio}
                                            position="top"
                                            offset={8}
                                            style={{ fill: color, fontSize: '11px', fontWeight: '600' }}
                                            formatter={(value: number) => value > 0 ? value.toFixed(2).replace('.', ',') : ''}
                                        />
                                    </Line>
                                    <Line
                                        dataKey={`${criterio}_trend`}
                                        stroke={color}
                                        strokeWidth={1.5}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        name={`Lineal (${criterio})`}
                                    />
                                </React.Fragment>
                            )
                        })}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
