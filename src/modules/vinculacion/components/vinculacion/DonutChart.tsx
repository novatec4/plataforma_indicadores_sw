import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DonutChartProps {
    data: { name: string; value: number }[];
    colors: string[];
    valueFormatter?: (value: number) => string;
}

const CustomTooltip = ({ active, payload, valueFormatter }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-lg text-[11px]">
                <p className="font-bold text-slate-800 mb-1">{data.name}</p>
                <p className="text-blue-600 font-extrabold">
                    {valueFormatter ? valueFormatter(Number(data.value)) : Number(data.value)}
                </p>
            </div>
        );
    }
    return null;
};

export const DonutChart: React.FC<DonutChartProps> = ({ data, colors, valueFormatter }) => {
    if (!data || data.length === 0 || data.every(item => item.value === 0)) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm italic py-12">
                <p>Sin datos financieros disponibles</p>
                <p className="text-[10px] mt-1">(Verifique los montos de ejecución)</p>
            </div>
        );
    }
    
    return (
        <div className="w-full h-full min-h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="40%"
                        innerRadius={65}
                        outerRadius={105}
                        paddingAngle={4}
                        dataKey="value"
                        nameKey="name"
                        isAnimationActive={true}
                        animationBegin={0}
                        animationDuration={1000}
                    >
                        {data.map((_, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={colors[index % colors.length]} 
                                stroke="#fff" 
                                strokeWidth={2} 
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
                    <Legend 
                        verticalAlign="bottom" 
                        align="center"
                        iconType="circle" 
                        layout="horizontal"
                        wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};