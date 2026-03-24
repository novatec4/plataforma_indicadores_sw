import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface ScoreGapChartProps {
    data: {
      criterio: string;
      diferencia: number;
    }[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { criterio, diferencia } = payload[0].payload;
      const color = diferencia >= 0 ? '#16a34a' : '#dc2626';
      return (
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-slate-800 mb-2 truncate max-w-xs">{criterio}</p>
          <div className="font-medium flex items-center justify-between space-x-4">
              <span>Diferencia:</span>
              <span className="font-bold" style={{ color }}>{`${diferencia.toFixed(2)} pts`}</span>
          </div>
        </div>
      );
    }
    return null;
};

const DataLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    if (value === 0) return null;
    const isPositive = value > 0;
    const xPos = isPositive ? x + width + 5 : x - 5;
    const textAnchor = isPositive ? 'start' : 'end';
    const color = isPositive ? '#15803d' : '#b91c1c';

    return (
        <text x={xPos} y={y + height / 2} dy={4} fill={color} textAnchor={textAnchor} fontSize={11} fontWeight={600}>
            {`${value > 0 ? '+' : ''}${value.toFixed(2)}`}
        </text>
    );
}

export const ScoreGapChart: React.FC<ScoreGapChartProps> = ({ data }) => {
    if (data.length === 0) {
        return <p className="text-center text-slate-500 py-10">No hay datos para mostrar la brecha de puntuación.</p>;
    }
    
    const domainBuffer = Math.max(...data.map(d => Math.abs(d.diferencia))) * 0.2;
    const domain = [
        Math.min(...data.map(d => d.diferencia)) - domainBuffer, 
        Math.max(...data.map(d => d.diferencia)) + domainBuffer
    ];

    return (
        <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    data={data} 
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis 
                        type="number" 
                        domain={domain}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        axisLine={{ stroke: '#cbd5e1' }} 
                        tickLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis 
                        type="category"
                        dataKey="criterio"
                        width={120}
                        tick={{ fill: '#64748b', fontSize: 10, width: 110 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                    <Bar dataKey="diferencia">
                        <LabelList dataKey="diferencia" content={<DataLabel />} />
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.diferencia >= 0 ? '#22c55e' : '#ef4444'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};