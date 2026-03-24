
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EvaluationChartProps {
  data: Record<string, string | number>[];
  onCriterionClick: (criterionData: Record<string, any>) => void;
  colors: string[];
}

const normalizeKey = (str: string | undefined | null): string => {
    if (typeof str !== 'string') return '';
    return str.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const safeToNumber = (value: any): number => {
    if (value === null || value === undefined || value === 'N/A') return 0;
    if (typeof value === 'number') return isNaN(value) ? 0 : value;
    if (typeof value === 'string') {
      const cleanedValue = value.replace(',', '.').trim();
      const num = parseFloat(cleanedValue);
      return isNaN(num) ? 0 : num;
    }
    return 0;
};

const evaluationKeys: Record<string, string> = {
    'heteroevaluacion': 'HETEROEVALUACIÓN',
    'autoevaluacion': 'AUTOEVALUACIÓN',
    'coevaluacion directivo': 'COEVALUACIÓN DIRECTIVO',
    'coevaluacion pares academicos': 'COEVALUACIÓN PARES ACADÉMICOS',
};
const normalizedDataKeys = Object.keys(evaluationKeys);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((pld: any) => (
            <div key={pld.dataKey} style={{ color: pld.fill }} className="font-medium flex items-center justify-between space-x-4">
              <span>{evaluationKeys[pld.dataKey]}:</span>
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
      <text x={0} y={0} dy={16} textAnchor="end" fill="#64748b" transform="rotate(-35)" fontSize={12} fontWeight={500}>
        {payload.value}
      </text>
    </g>
  );
};

export const EvaluationChart: React.FC<EvaluationChartProps> = ({ data, onCriterionClick, colors }) => {
    const pivotedData = data.reduce((acc, row) => {
        const getRowValue = (keyName: string) => {
            const actualKey = Object.keys(row).find(k => normalizeKey(k) === keyName);
            return actualKey ? row[actualKey] : undefined;
        };

        const criterio = getRowValue('criterio');
        const tip_eva = getRowValue('tip_eva');
        const puntuacion = getRowValue('puntuacion');

        if (typeof criterio !== 'string' || typeof tip_eva !== 'string' || criterio.trim() === '') {
          return acc;
        }

        const componentName = criterio.trim();
        if (!acc[componentName]) {
          acc[componentName] = { 'Componente': componentName };
        }
        
        const normalizedTipEva = normalizeKey(String(tip_eva));
        if (evaluationKeys[normalizedTipEva]) {
          acc[componentName][normalizedTipEva] = safeToNumber(puntuacion);
        }
        return acc;
      }, {} as Record<string, Record<string, any>>);
    
    const chartData = Object.values(pivotedData);
    chartData.forEach(item => {
        normalizedDataKeys.forEach(key => {
            if (item[key] === undefined) {
                item[key] = 0;
            }
        });
    });

    const handleChartClick = (data: any) => {
        if (data && data.activeLabel) {
            const criterionData = chartData.find((d: any) => d.Componente === data.activeLabel);
            if (criterionData) {
                onCriterionClick(criterionData);
            }
        }
    };
    
    const axisColor = '#cbd5e1';
    const gridColor = '#e2e8f0';

  return (
    <div style={{ width: '100%', height: 500 }}>
        <ResponsiveContainer width="100%" height="100%">
             <BarChart 
                data={chartData} 
                margin={{ top: 5, right: 10, left: 10, bottom: 120 }}
                onClick={handleChartClick}
                barCategoryGap="10%"
            >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis 
                    dataKey="Componente" 
                    height={50}
                    tick={<CustomizedAxisTick />}
                    interval={0} 
                    axisLine={{ stroke: axisColor }}
                    tickLine={{ stroke: axisColor }}
                />
                <YAxis 
                    domain={[0, 120]} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                    axisLine={{ stroke: axisColor }}
                    tickLine={{ stroke: axisColor }}
                    label={{ value: 'Puntuación', angle: -90, position: 'insideLeft', fill: '#64748b', style: { textAnchor: 'middle' } }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(241, 245, 249, 0.6)'}} />
                <Legend iconSize={10} wrapperStyle={{ bottom: 40, left: 20, fontSize: '12px' }} />
                {normalizedDataKeys.map((key, index) => (
                    <Bar key={key} dataKey={key} name={evaluationKeys[key]} fill={colors[index % colors.length]} cursor="pointer" />
                ))}
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};
