import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FinalComparisonChartProps {
  chartData: any[];
  seriesNames: string[];
}

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

const COLORS = ['#1d4ed8', '#60a5fa', '#a5b4fc'];

export const FinalComparisonChart: React.FC<FinalComparisonChartProps> = ({ chartData, seriesNames }) => {
    if (chartData.length === 0) {
        return <p className="text-center text-slate-500">No hay datos suficientes para mostrar el gráfico de comparación final.</p>;
    }

    return (
        <div className="w-full">
            <div className="w-full overflow-x-auto overflow-y-hidden">
                <div className="h-80 min-w-[700px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="criterio" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
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
                                 <Bar key={series} dataKey={series} name={series.replace(/_/g, ' ')} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};