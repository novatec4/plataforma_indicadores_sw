import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface PeriodOverPeriodChangeChartProps {
    data: {
      periodo: string;
      change: number;
    }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const color = value >= 0 ? '#16a34a' : '#dc2626';
      return (
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-slate-800 mb-2 truncate max-w-xs">{label}</p>
          <div className="font-medium flex items-center justify-between space-x-4">
              <span>Variación:</span>
              <span className="font-bold" style={{ color }}>{`${value.toFixed(2)}%`}</span>
          </div>
        </div>
      );
    }
    return null;
};

const CustomizedAxisTick = ({ x, y, payload }: any) => {
    const displayValue = payload.value.split(' -> ')[1] || payload.value;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#64748b" fontSize={10}>
          {displayValue}
        </text>
      </g>
    );
};

const DataLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    if (value === 0) return null;
    const isPositive = value > 0;
    const yPos = isPositive ? y - 5 : y + height + 15;
    const color = isPositive ? '#15803d' : '#b91c1c';

    return (
        <text x={x + width / 2} y={yPos} fill={color} textAnchor="middle" fontSize={11} fontWeight={600}>
            {`${value > 0 ? '+' : ''}${value.toFixed(1)}%`}
        </text>
    );
}

export const PeriodOverPeriodChangeChart: React.FC<PeriodOverPeriodChangeChartProps> = ({ data }) => {
    if (data.length === 0) {
        return <p className="text-center text-slate-500 py-10">No hay suficientes datos para calcular la variación.</p>;
    }

    return (
        <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    data={data} 
                    margin={{ top: 20, right: 10, left: -20, bottom: 40 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                        dataKey="periodo" 
                        tick={<CustomizedAxisTick />} 
                        height={50}
                        interval={0}
                        axisLine={{ stroke: '#cbd5e1' }} 
                        tickLine={false}
                    />
                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(tick) => `${tick}%`}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                    <Bar dataKey="change">
                        <LabelList dataKey="change" content={<DataLabel />} />
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.change >= 0 ? '#22c55e' : '#ef4444'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};