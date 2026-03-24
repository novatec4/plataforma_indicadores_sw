import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ComparisonChartProps {
  data: {
    name: string;
    value: number;
  }[];
  colors: string[];
  valueFormatter?: (value: number) => string;
  dataLabel?: string;
}

const CustomTooltip = ({ active, payload, label, valueFormatter }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((pld: any) => (
            <div key={pld.dataKey} style={{ color: pld.fill }} className="font-medium flex items-center justify-between space-x-4">
              <span>{pld.name}:</span>
              <span className="font-bold">{valueFormatter ? valueFormatter(Number(pld.value)) : Number(pld.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
};

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, colors, valueFormatter, dataLabel }) => {
    const primaryColor = colors[0] || '#3b82f6';

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: '#cbd5e1' }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tickFormatter={(value) => value.length > 25 ? `${value.substring(0, 25)}...` : value}
                    />
                    <YAxis 
                        axisLine={{ stroke: '#cbd5e1' }} 
                        tickLine={{ stroke: '#cbd5e1' }} 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickFormatter={valueFormatter}
                        width={80}
                    />
                    <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                    <Bar dataKey="value" fill={primaryColor} name={dataLabel || "Proyectos de Vinculación"} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
