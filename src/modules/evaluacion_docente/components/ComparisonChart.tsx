import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ComparisonChartProps {
  data: {
    name: string;
    SOFTWARE: number;
    ESPOCH: number;
  }[];
}

const COLORS = {
    SOFTWARE: '#1d4ed8', // blue-700
    ESPOCH: '#60a5fa',   // blue-400
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((pld: any) => (
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


export const ComparisonChart: React.FC<ComparisonChartProps> = ({ data }) => {
    return (
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" tick={false} axisLine={false} tickLine={false} />
                    <YAxis 
                        domain={[85, 'auto']} 
                        axisLine={{ stroke: '#cbd5e1' }} 
                        tickLine={{ stroke: '#cbd5e1' }} 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        label={{ value: 'Puntuación', angle: -90, position: 'insideLeft', fill: '#64748b', style: { textAnchor: 'middle' }, offset: 10 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                    <Bar dataKey="SOFTWARE" fill={COLORS.SOFTWARE} name="SOFTWARE" />
                    <Bar dataKey="ESPOCH" fill={COLORS.ESPOCH} name="ESPOCH" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};