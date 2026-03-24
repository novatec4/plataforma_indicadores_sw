import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PeriodComparisonChartProps {
  chartData: any[];
  tableData: Record<string, any>;
  criteria: string[];
  previousPeriodName: string;
  currentPeriodName: string;
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

const COLORS = {
    previous: '#1d4ed8', // blue-700
    current: '#60a5fa',   // blue-400
};

const CustomTooltip = ({ active, payload, label }: any) => {
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

export const PeriodComparisonChart: React.FC<PeriodComparisonChartProps> = ({ 
    chartData, 
    tableData, 
    criteria, 
    previousPeriodName, 
    currentPeriodName 
}) => {
    
    if (!chartData.length || !previousPeriodName || !currentPeriodName) {
        return <p className="text-center text-slate-500">No hay datos suficientes para la comparación de períodos.</p>;
    }

    return (
        <div className="w-full">
            <div className="w-full overflow-x-auto overflow-y-hidden">
                <div className="h-72 min-w-[600px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} barGap={8}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="criterio" tick={false} axisLine={false} tickLine={false} />
                            <YAxis 
                                domain={[87, 97]}
                                tickCount={11}
                                axisLine={{ stroke: '#cbd5e1' }} 
                                tickLine={{ stroke: '#cbd5e1' }} 
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                label={{ value: 'Puntuación', angle: -90, position: 'insideLeft', fill: '#64748b', style: { textAnchor: 'middle' }, offset: 10 }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                            <Bar dataKey={previousPeriodName} fill={COLORS.previous} name={previousPeriodName.replace(/_/g,' ')} />
                            <Bar dataKey={currentPeriodName} fill={COLORS.current} name={currentPeriodName.replace(/_/g,' ')} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="mt-6 overflow-x-auto pb-4">
                <table className="border-collapse text-sm text-left min-w-[600px] w-full">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="p-3 border-b border-slate-200 font-semibold text-slate-600 w-[250px]">Período</th>
                            {criteria.map(c => <th key={c} className="p-3 border-b border-slate-200 min-w-[150px] text-center font-semibold text-slate-600">{c}</th>)}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 border-b border-slate-200 font-medium text-slate-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS.previous }}></div>
                                    <span className="truncate">{previousPeriodName.replace(/_/g,' ')}</span>
                                </div>
                            </td>
                            {criteria.map(c => <td key={c} className="p-3 border-b border-slate-200 text-center text-slate-600">{tableData[previousPeriodName]?.[c] != null ? safeToNumber(tableData[previousPeriodName][c]).toFixed(2).replace('.',',') : 'N/A'}</td>)}
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 border-b border-slate-200 font-medium text-slate-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS.current }}></div>
                                    <span className="truncate">{currentPeriodName.replace(/_/g,' ')}</span>
                                </div>
                            </td>
                            {criteria.map(c => <td key={c} className="p-3 border-b border-slate-200 text-center text-slate-600">{tableData[currentPeriodName]?.[c] != null ? safeToNumber(tableData[currentPeriodName][c]).toFixed(2).replace('.',',') : 'N/A'}</td>)}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};