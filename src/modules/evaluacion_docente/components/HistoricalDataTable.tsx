import React from 'react';

interface HistoricalDataTableProps {
    chartData: {
      periodo: string;
      promedio: number;
    }[];
}

export const HistoricalDataTable: React.FC<HistoricalDataTableProps> = ({ chartData }) => {
    if (chartData.length === 0) {
        return <p className="text-center text-slate-500 py-4">No hay datos para mostrar en la tabla.</p>;
    }
    
    return (
        <div className="overflow-y-auto max-h-96">
            <table className="w-full text-sm text-left">
                <thead className="sticky top-0 bg-slate-50 z-10">
                    <tr>
                        <th className="p-3 font-semibold text-slate-600">Período Académico</th>
                        <th className="p-3 font-semibold text-slate-600 text-right">Promedio General</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {chartData.map((d, index) => (
                        <tr key={d.periodo} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50 hover:bg-slate-100'}>
                            <td className="p-3 font-medium text-slate-700">{d.periodo}</td>
                            <td className="p-3 text-slate-600 text-right font-mono">{d.promedio.toFixed(2).replace('.',',')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}