import React from 'react';
import {
    ResponsiveContainer,
    LineChart,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
    Bar,
    Area,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string | number; }) => {
    if (active && payload && payload.length) {
        const visiblePayload = payload.filter(pld => 
            !pld.dataKey?.toString().endsWith('_area') && 
            !pld.dataKey?.toString().startsWith('Tendencia')
        );

        if (visiblePayload.length === 0) return null;

        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-sm">
                <p className="font-bold text-slate-800 mb-2">{label}</p>
                <div className="space-y-1">
                    {visiblePayload.map((pld, index) => {
                        const isInt = ['Admitidos', 'Matriculados', 'Graduados'].includes(pld.name as string);
                        let valueDisplay: string;
                        if (pld.value === null || pld.value === undefined) {
                            valueDisplay = 'N/A';
                        } else if (isInt) {
                            valueDisplay = (pld.value as number).toLocaleString();
                        } else {
                            valueDisplay = `${(pld.value as number).toFixed(2)}%`;
                        }
                        return (
                            <div key={index} className="flex items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <span style={{ backgroundColor: pld.color || pld.fill }} className="w-2.5 h-2.5 rounded-full mr-2"></span>
                                    <span className="text-slate-600 font-medium">{pld.name}:</span>
                                </div>
                                <span className="font-bold text-slate-800">{valueDisplay}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
    return null;
};

const AXIS_COLOR = '#64748b';
const GRID_COLOR = '#e2e8f0';

const commonChartProps = {
    cartesianGrid: {
        strokeDasharray: "3 3",
        stroke: GRID_COLOR
    },
    xAxis: {
        tick: { fill: AXIS_COLOR, fontSize: 12, fontWeight: 500 },
        axisLine: { stroke: '#cbd5e1' },
        tickLine: { stroke: '#cbd5e1' }
    },
    yAxis: {
        tick: { fill: AXIS_COLOR, fontSize: 12, fontWeight: 500 },
        axisLine: { stroke: '#cbd5e1' },
        tickLine: { stroke: '#cbd5e1' }
    }
};

interface AcademicTrendsChartProps {
    data: any[];
    visibleTrends: { [key: string]: boolean };
}

export const AcademicTrendsChart: React.FC<AcademicTrendsChartProps> = ({ data, visibleTrends }) => {
    const trendColors: { [key: string]: string } = {
        'Retención': '#1e40af', // blue-800
        'Deserción': '#ef4444', // red-500
        'Titulación': '#10b981', // green-500
    };

    return (
        <div className="w-full h-80">
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid {...commonChartProps.cartesianGrid} />
                    <XAxis dataKey="name" {...commonChartProps.xAxis} />
                    <YAxis {...commonChartProps.yAxis} unit="%" domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1 }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                    {Object.entries(visibleTrends).map(([key, value]) =>
                        value && <Line 
                            key={key} 
                            type="monotone" 
                            dataKey={key} 
                            stroke={trendColors[key]} 
                            strokeWidth={3} 
                            dot={{ r: 4, fill: trendColors[key], strokeWidth: 2, stroke: '#fff' }} 
                            activeDot={{ r: 6, strokeWidth: 0 }} 
                            animationDuration={1000} 
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

interface GraduatesBarChartProps {
    data: any[];
}

export const GraduatesBarChart: React.FC<GraduatesBarChartProps> = ({ data }) => {
    const barColor = "#2563eb"; // blue-600
    return (
        <div className="w-full h-80">
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }} barSize={40}>
                    <CartesianGrid {...commonChartProps.cartesianGrid} vertical={false} />
                    <XAxis dataKey="name" {...commonChartProps.xAxis} />
                    <YAxis {...commonChartProps.yAxis} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                    <Legend iconType="rect" wrapperStyle={{ paddingTop: 20 }} />
                    <Bar 
                        dataKey="Graduados" 
                        fill={barColor} 
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000} 
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

interface CohortChartProps {
    data: any[];
}

export const CohortChart: React.FC<CohortChartProps> = ({ data }) => {
    const admitidosColor = "#1e40af"; // blue-800
    const matriculadosColor = "#60a5fa"; // blue-400
    
    return (
        <div className="w-full h-96">
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }} barGap={8}>
                    <CartesianGrid {...commonChartProps.cartesianGrid} vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        {...commonChartProps.xAxis} 
                        interval={0} 
                        angle={-35} 
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis {...commonChartProps.yAxis} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 20 }}/>
                    <Bar 
                        dataKey="Admitidos" 
                        fill={admitidosColor} 
                        radius={[2, 2, 0, 0]}
                        animationDuration={1000} 
                    />
                    <Bar 
                        dataKey="Matriculados" 
                        fill={matriculadosColor} 
                        radius={[2, 2, 0, 0]}
                        animationDuration={1000} 
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

interface QualityIndicatorsChartProps {
    data: any[];
    indicators: { key: string; color: string }[];
}

export const QualityIndicatorsChart: React.FC<QualityIndicatorsChartProps> = ({ data, indicators }) => {
    if (indicators.length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px] text-center text-slate-500 p-4">
                <p>Seleccione uno o más indicadores en el panel de arriba para visualizar su evolución en el tiempo.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid {...commonChartProps.cartesianGrid} />
                    <XAxis dataKey="name" {...commonChartProps.xAxis} />
                    <YAxis {...commonChartProps.yAxis} unit="%" domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1 }} />
                    <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{
                            paddingTop: 40,
                            maxHeight: '100px',
                            overflowY: 'auto'
                        }}
                    />
                    {indicators.map(indicator => (
                        <Line
                            key={indicator.key}
                            type="monotone"
                            dataKey={indicator.key}
                            stroke={indicator.color}
                            strokeWidth={3}
                            dot={{ r: 4, fill: indicator.color, strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            connectNulls
                            animationDuration={1000}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};