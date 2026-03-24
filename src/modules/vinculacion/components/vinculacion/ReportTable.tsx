import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ListFilter } from 'lucide-react';

interface ReportTableProps {
    data: any[];
}

export const ReportTable: React.FC<ReportTableProps> = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    const totalPages = Math.ceil(data.length / pageSize);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }, [data, currentPage]);

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-slate-100">
                <ListFilter className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No hay datos para mostrar con los filtros actuales.</p>
            </div>
        );
    }

    const headers = Object.keys(data[0]).filter(key => key !== '_rowIndex');

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-slate-100">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 w-12 text-center text-[10px] font-black text-slate-400 uppercase">#</th>
                            {headers.map(header => (
                                <th key={header} className="p-4 font-bold text-slate-600 uppercase tracking-tight text-[11px]">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedData.map((row, index) => {
                            const globalIndex = (currentPage - 1) * pageSize + index + 1;
                            return (
                                <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="p-4 text-center text-slate-400 font-mono text-xs">{globalIndex}</td>
                                    {headers.map(header => (
                                        <td key={`${index}-${header}`} className="p-4 text-slate-700 max-w-xs truncate font-medium group-hover:text-blue-900" title={String(row[header] || '')}>
                                            {String(row[header] || '')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="text-sm text-slate-500 font-medium">
                    Mostrando <span className="text-slate-900 font-bold">{(currentPage - 1) * pageSize + 1}</span> a <span className="text-slate-900 font-bold">{Math.min(currentPage * pageSize, data.length)}</span> de <span className="text-blue-600 font-extrabold">{data.length}</span> registros
                </div>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border transition-all ${currentPage === 1 ? 'text-slate-300 border-slate-100 cursor-not-allowed' : 'text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-blue-300'}`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    <div className="flex items-center gap-1">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            // Simple logic to show pages around current page
                            let pageNum = currentPage;
                            if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;
                            
                            if (pageNum <= 0 || pageNum > totalPages) return null;

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => goToPage(pageNum)}
                                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === pageNum ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border transition-all ${currentPage === totalPages ? 'text-slate-300 border-slate-100 cursor-not-allowed' : 'text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-blue-300'}`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
