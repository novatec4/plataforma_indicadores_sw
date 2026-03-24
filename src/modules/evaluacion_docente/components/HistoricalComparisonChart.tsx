import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';

interface HistoricalComparisonChartProps {
  chartData: any[];
  periods: string[];
}

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

const PALETTE = [
    '#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', 
    '#065f46', '#059669', '#10b981', '#34d399', '#6ee7b7',
    '#6b21a8', '#7e22ce', '#9333ea', '#a855f7', '#c084fc',
];

export const HistoricalComparisonChart: React.FC<HistoricalComparisonChartProps> = ({ chartData, periods }) => {
    if (chartData.length === 0 || periods.length === 0) {
        return <p className="text-center text-slate-500 py-10">Seleccione al menos un componente y un período para mostrar el gráfico.</p>;
    }
    
    return (
        <div className="w-full">
            <div className="w-full overflow-x-auto overflow-y-hidden">
                <div className="h-[500px] min-w-[700px]">
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
                                <Bar key={period} dataKey={period} fill={PALETTE[index % PALETTE.length]} name={period}>
                                    <LabelList dataKey={period} content={<CustomizedBarLabel />} />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};