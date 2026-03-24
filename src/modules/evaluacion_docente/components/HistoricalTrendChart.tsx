import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';

interface HistoricalTrendChartProps {
  chartData: any[];
  criteria: string[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.filter(pld => !pld.dataKey.includes('_trend')).slice().reverse().map((pld: any) => (
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

const CRITERIA_COLORS: Record<string, string> = {
    'B: PERTINENCIA Y COMPROMISO CON LA INSTITUCIÓN': '#1d4ed8', // blue-700
    'C: DISCIPLINAR Y PROFESIONAL': '#0d9488', // teal-600
    'D: HUMANA Y SOCIAL': '#6d28d9', // violet-700
    'E: PEDAGOGÍA Y DIDÁCTICA': '#64748b', // slate-500
};

export const HistoricalTrendChart: React.FC<HistoricalTrendChartProps> = ({ chartData, criteria }) => {
    if (chartData.length === 0) {
        return <p className="text-center text-slate-500 py-10">Seleccione al menos un criterio y un período para mostrar el gráfico.</p>;
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
                        {criteria.map(criterio => (
                            <React.Fragment key={criterio}>
                                <Line
                                    type="monotone"
                                    dataKey={criterio}
                                    stroke={CRITERIA_COLORS[criterio] || '#333'}
                                    strokeWidth={2.5}
                                    activeDot={{ r: 8 }}
                                    dot={{ r: 5 }}
                                    name={criterio}
                                >
                                    <LabelList
                                        dataKey={criterio}
                                        position="top"
                                        offset={8}
                                        style={{ fill: CRITERIA_COLORS[criterio] || '#333', fontSize: '11px', fontWeight: '600' }}
                                        formatter={(value: number) => value > 0 ? value.toFixed(2).replace('.', ',') : ''}
                                    />
                                </Line>
                                <Line
                                    dataKey={`${criterio}_trend`}
                                    stroke={CRITERIA_COLORS[criterio] || '#333'}
                                    strokeWidth={1.5}
                                    strokeDasharray="5 5"
                                    dot={false}
                                    name={`Lineal (${criterio})`}
                                />
                            </React.Fragment>
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};