import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    criterionData: Record<string, any> | null;
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

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-slate-800 mb-2">{payload[0].payload.name}</p>
          <div style={{ color: payload[0].payload.fill }} className="font-medium flex items-center justify-between space-x-4">
              <span>Puntuación:</span>
              <span className="font-bold">{Number(payload[0].value).toFixed(2)}</span>
          </div>
        </div>
      );
    }
    return null;
};

export const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, criterionData }) => {
    if (!isOpen || !criterionData) return null;

    const chartData = normalizedDataKeys.map(key => ({
        name: evaluationKeys[key],
        puntuacion: criterionData[key] || 0,
        fill: COLORS[key],
    }));

    const axisColor = '#cbd5e1';
    const gridColor = '#e2e8f0';

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-70 transition-opacity duration-300" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="detail-modal-title"
        >
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col m-4 transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h3 id="detail-modal-title" className="text-lg font-bold text-slate-800 truncate pr-4">
                        Detalle: {criterionData.Componente}
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors flex-shrink-0"
                        aria-label="Cerrar modal"
                    >
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                   <ResponsiveContainer width="100%" height={300}>
                         <BarChart 
                            data={chartData} 
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis 
                                dataKey="name"
                                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                                interval={0} 
                                axisLine={{ stroke: axisColor }}
                                tickLine={false}
                            />
                            <YAxis 
                                domain={[0, 120]} 
                                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
                                axisLine={{ stroke: axisColor }}
                                label={{ value: 'Puntuación', angle: -90, position: 'insideLeft', fill: '#64748b', style: { textAnchor: 'middle', fontSize: '12px' }, offset: 10 }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(241, 245, 249, 0.6)'}} />
                            <Bar dataKey="puntuacion">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <style>{`
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};