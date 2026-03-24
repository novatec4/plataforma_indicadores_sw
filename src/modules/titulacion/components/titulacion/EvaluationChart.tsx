
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EvaluationChartProps {
  data: { name: string; value: number }[];
  colors: string[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((pld: any) => (
            <div key={pld.dataKey} style={{ color: pld.fill }} className="font-medium flex items-center justify-between space-x-4">
              <span>Cantidad:</span>
              <span className="font-bold">{Number(pld.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
};

const CustomizedAxisTick = ({ x, y, payload }: any) => {
  // Truncate long labels
  const label = payload.value.length > 25 ? payload.value.substring(0, 25) + '...' : payload.value;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#64748b" transform="rotate(-35)" fontSize={11} fontWeight={500}>
        {label}
      </text>
    </g>
  );
};

export const EvaluationChart: React.FC<EvaluationChartProps> = ({ data, colors }) => {
    const axisColor = '#cbd5e1';
    const gridColor = '#e2e8f0';
    const mainColor = colors[0] || '#3b82f6';

  return (
    <div style={{ width: '100%', height: 500 }}>
        <ResponsiveContainer width="100%" height="100%">
             <BarChart 
                data={data} 
                margin={{ top: 5, right: 10, left: 10, bottom: 120 }}
                barCategoryGap="10%"
            >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis 
                    dataKey="name" 
                    height={100}
                    tick={<CustomizedAxisTick />}
                    interval={0} 
                    axisLine={{ stroke: axisColor }}
                    tickLine={{ stroke: axisColor }}
                />
                <YAxis 
                    allowDecimals={false}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                    axisLine={{ stroke: axisColor }}
                    tickLine={{ stroke: axisColor }}
                    label={{ value: 'Cantidad', angle: -90, position: 'insideLeft', fill: '#64748b', style: { textAnchor: 'middle' } }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(241, 245, 249, 0.6)'}} />
                <Bar dataKey="value" name="Cantidad" fill={mainColor} radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};
