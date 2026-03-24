import React from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Legend,
    Cell
} from 'recharts';

interface HorizontalBarChartProps {
    data: any[];
    colors?: string[];
    dataLabel?: string;
    valueFormatter?: (value: number) => string;
    comparison?: boolean; // New prop to enable comparison mode
}

const CustomTooltip = ({ active, payload, label, valueFormatter }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-lg text-[11px]">
                <p className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">{label}</p>
                <div className="space-y-1.5">
                    {payload.map((pld: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.fill || pld.color }}></div>
                                <span className="text-slate-500 font-medium">{pld.name}:</span>
                            </div>
                            <span className="font-bold text-slate-800">
                                {valueFormatter ? valueFormatter(Number(pld.value)) : Number(pld.value).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ 
    data, 
    colors = ['#2563eb'], 
    dataLabel = 'Valor', 
    valueFormatter,
    comparison = false
}) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                        type="number" 
                        hide={true} 
                    />
                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={120}
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} cursor={{ fill: '#f8fafc' }} />
                    {comparison && <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold' }} />}
                    
                    {comparison ? (
                        <>
                            <Bar dataKey="planificado" name="Planificado" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={12} />
                            <Bar dataKey="ejecutado" name="Ejecutado" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={12} />
                        </>
                    ) : (
                        <Bar dataKey="value" name={dataLabel} radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    )}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};