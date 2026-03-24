import React from 'react';

interface EvaluationDataTableProps {
    data: Record<string, string | number>[];
}

const evaluationHeaders: Record<string, string> = {
    'Componente': 'Criterio',
    'heteroevaluacion': 'Hetero.',
    'autoevaluacion': 'Auto.',
    'coevaluacion directivo': 'Coev. Dir.',
    'coevaluacion pares academicos': 'Coev. Pares',
};

export const EvaluationDataTable: React.FC<EvaluationDataTableProps> = ({ data }) => {
    if (data.length === 0) {
        return <p className="text-center text-slate-500 py-4">No hay datos para mostrar en la tabla.</p>;
    }
    
    const headers = Object.keys(evaluationHeaders);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50">
                    <tr>
                        {headers.map(key => (
                            <th key={key} className="p-3 font-semibold text-slate-600 whitespace-nowrap">{evaluationHeaders[key]}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {data.map((row, index) => (
                        <tr key={String(row.Componente)} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50 hover:bg-slate-100'}>
                            {headers.map(key => (
                                <td key={key} className="p-3 text-slate-600 whitespace-nowrap">
                                    {key === 'Componente' ? String(row[key]) : Number(row[key] || 0).toFixed(2)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}