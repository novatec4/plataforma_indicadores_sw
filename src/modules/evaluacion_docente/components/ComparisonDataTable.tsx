import React from 'react';

interface ComparisonDataTableProps {
    data: {
      criterio: string;
      SOFTWARE: number;
      ESPOCH: number;
      diferencia: number;
    }[];
}

export const ComparisonDataTable: React.FC<ComparisonDataTableProps> = ({ data }) => {
    if (data.length === 0) {
        return <p className="text-center text-slate-500 py-4">No hay datos para mostrar en la tabla.</p>;
    }
    
    return (
        <div className="overflow-y-auto max-h-96">
            <table className="w-full text-sm text-left">
                <thead className="sticky top-0 bg-slate-50 z-10">
                    <tr>
                        <th className="p-3 font-semibold text-slate-600">Criterio</th>
                        <th className="p-3 font-semibold text-slate-600 text-center">SOFTWARE</th>
                        <th className="p-3 font-semibold text-slate-600 text-center">ESPOCH</th>
                        <th className="p-3 font-semibold text-slate-600 text-center">Diferencia</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {data.map((d, index) => (
                        <tr key={d.criterio} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50 hover:bg-slate-100'}>
                            <td className="p-3 font-medium text-slate-700">{d.criterio}</td>
                            <td className="p-3 text-slate-600 text-center font-mono">{d.SOFTWARE.toFixed(2)}</td>
                            <td className="p-3 text-slate-600 text-center font-mono">{d.ESPOCH.toFixed(2)}</td>
                            <td className={`p-3 text-center font-mono font-bold ${d.diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {d.diferencia.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}