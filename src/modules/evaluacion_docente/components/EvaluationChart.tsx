import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EvaluationChartProps {
  chartData: Record<string, string | number>[];
  onCriterionClick: (criterionData: Record<string, any>) => void;
}

const evaluationKeys: Record<string, string> = {
    'heteroevaluacion': 'HETEROEVALUACIÓN',
    'autoevaluacion': 'AUTOEVALUACIÓN',
    'coevaluacion directivo': 'COEVALUACIÓN DIRECTIVO',
    'coevaluacion pares academicos': 'COEVALUACIÓN PARES ACADÉMICOS',
};
const normalizedDataKeys = Object.keys(evaluationKeys);

const COLORS: Record<string, string> = {
    'heteroevaluacion': '#1e40af', // blue-800
    'autoevaluacion': '#2563eb', // blue-600
    'coevaluacion directivo': '#60a5fa', // blue-400
    'coevaluacion pares academicos': '#bfdbfe', // blue-200
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((pld: any) => (
            <div key={pld.dataKey} style={{ color: COLORS[pld.dataKey] }} className="font-medium flex items-center justify-between space-x-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[pld.dataKey] }}></div>
                <span>{evaluationKeys[pld.dataKey]}:</span>
              </div>
              <span className="font-bold">{Number(pld.value).toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
};

const CustomizedAxisTick = ({ x, y, payload }: any) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} textAnchor="end" fill="#64748b" transform="rotate(-30)" fontSize={10} fontWeight={600}>
        {payload.value.length > 40 ? `${payload.value.substring(0, 40)}...` : payload.value}
      </text>
    </g>
  );
};

export const EvaluationChart: React.FC<EvaluationChartProps> = ({ chartData, onCriterionClick }) => {
    const handleChartClick = (data: any) => {
        if (data && data.activeLabel) {
            const criterionData = chartData.find((d: any) => d.Componente === data.activeLabel);
            if (criterionData) {
                onCriterionClick(criterionData);
            }
        }
    };
    
    const axisColor = '#cbd5e1';
    const gridColor = '#f1f5f9';

    // Calculate height based on chartData length to avoid empty space
    const chartHeight = Math.max(450, chartData.length * 40 + 200);

  return (
    <div className="w-full" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
             <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                onClick={handleChartClick}
                barGap={4}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                    dataKey="Componente" 
                    height={80}
                    tick={<CustomizedAxisTick />}
                    interval={0} 
                    axisLine={{ stroke: axisColor }}
                    tickLine={{ stroke: axisColor }}
                />
                <YAxis 
                    domain={[0, 110]} 
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} 
                    axisLine={{ stroke: axisColor }}
                    tickLine={{ stroke: axisColor }}
                    label={{ value: 'Puntaje (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8', style: { textAnchor: 'middle', fontSize: '10px', fontWeight: 'bold' } }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '0px', paddingBottom: '40px', fontSize: '11px', fontWeight: 'bold' }} 
                />
                {normalizedDataKeys.map(key => (
                    <Bar key={key} dataKey={key} name={evaluationKeys[key]} fill={COLORS[key]} radius={[4, 4, 0, 0]} cursor="pointer" />
                ))}
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};