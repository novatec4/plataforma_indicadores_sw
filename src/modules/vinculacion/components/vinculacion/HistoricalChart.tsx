
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

interface HistoricalChartProps {
  chartData: {
    periodo: string;
    promedio: number;
    trend: number;
  }[];
  colors: string[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} className="font-medium flex items-center justify-between space-x-4" style={{ color: pld.stroke }}>
                <span>{pld.name}:</span>
                <span className="font-bold">{Number(pld.value).toFixed(0)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
};

const CustomizedXAxisTick = ({ x, y, payload }: any) => {
    const parts = payload.value.split(' - ');
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#64748b" fontSize={11} fontWeight={500}>
            <tspan x="0" dy="0">{parts[0]}</tspan>
            {parts[1] && <tspan x="0" dy="15">{`- ${parts[1]}`}</tspan>}
        </text>
      </g>
    );
  };

export const HistoricalChart: React.FC<HistoricalChartProps> = ({ chartData, colors }) => {
    const mainColor = colors[1] || colors[0];
    const trendColor = colors[3] || colors[2];
    const labelColor = colors[0];

    if (chartData.length === 0) {
        return <p className="text-center text-slate-500 py-10">No hay datos suficientes para el período seleccionado.</p>;
    }

    return (
        <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                        dataKey="periodo" 
                        interval="preserveStartEnd"
                        tick={<CustomizedXAxisTick />} 
                        height={50}
                        axisLine={{ stroke: '#cbd5e1' }} 
                        tickLine={{ stroke: '#cbd5e1' }}
                    />
                        <YAxis 
                            domain={['dataMin - 1', 'dataMax + 1']}
                            allowDecimals={false}
                            axisLine={{ stroke: '#cbd5e1' }} 
                            tickLine={{ stroke: '#cbd5e1' }} 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            label={{ value: 'Cantidad de Proyectos', angle: -90, position: 'insideLeft', fill: '#64748b', style: { textAnchor: 'middle' }, offset: -5 }}
                            />
                    <Tooltip content={<CustomTooltip />} animationDuration={200} />
                    <Line 
                        type="monotone" 
                        dataKey="promedio" 
                        stroke={mainColor} 
                        strokeWidth={2.5} 
                        activeDot={{ r: 8, strokeWidth: 2, fill: '#fff', stroke: mainColor }}
                        dot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: mainColor }}
                        name="Cantidad de Proyectos"
                    >
                        <LabelList 
                            dataKey="promedio" 
                            position="top" 
                            offset={10}
                            style={{ fill: labelColor, fontSize: '12px', fontWeight: 'bold' }}
                            formatter={(value: number) => value}
                        />
                    </Line>
                        <Line 
                        dataKey="trend" 
                        stroke={trendColor} 
                        strokeWidth={2} 
                        strokeDasharray="5 5"
                        dot={false}
                        name="Tendencia"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
