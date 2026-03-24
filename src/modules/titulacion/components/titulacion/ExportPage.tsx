import React, { useState, useMemo } from 'react';
import { PageHeader } from '@core/components/PageHeader';
import { Download, Filter, RefreshCcw, FileText, Table, Search } from 'lucide-react';

interface ExportPageProps {
    allData: any[];
    filterOptions: any;
}

export const ExportPage: React.FC<ExportPageProps> = ({ 
    allData = [], 
    filterOptions 
}) => {
    // LOCAL INDEPENDENT FILTERS
    const [filters, setFilters] = useState({
        facultad: 'Todas',
        categoria: 'Todas',
        anio: 'Todos',
        search: ''
    });

    const resetFilters = () => setFilters({ facultad: 'Todas', categoria: 'Todas', anio: 'Todos', search: '' });

    // FAST LOCAL FILTERING
    const filteredData = useMemo(() => {
        const lowerSearch = filters.search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        return allData.filter(row => {
            const fac = String(row['Facultad'] || '').trim();
            const cat = String(row['Categoria'] || '').replace('info:eu-repo/semantics/', '');
            const anio = String(row['Anio'] || '');
            const combinedText = (String(row['Titulo'] || '') + ' ' + String(row['Autor'] || '')).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            const matchFacultad = filters.facultad === 'Todas' || fac === filters.facultad;
            const matchCategoria = filters.categoria === 'Todas' || cat === filters.categoria;
            const matchAnio = filters.anio === 'Todos' || anio === filters.anio;
            const matchSearch = !filters.search || combinedText.includes(lowerSearch);
            
            return matchFacultad && matchCategoria && matchAnio && matchSearch;
        });
    }, [allData, filters]);

    const downloadCSV = () => {
        if (!filteredData.length) return;
        try {
            const headers = Object.keys(filteredData[0]).filter(k => k !== '_rowIndex');
            const csvRows = [
                headers.join(','),
                ...filteredData.map(row => headers.map(h => {
                    const cell = String(row[h] || '').replace(/"/g, '""');
                    return `"${cell}"`;
                }).join(','))
            ];
            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `reporte_titulacion_${filters.facultad.replace(/\s+/g, '_')}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Export Error:', error);
            alert('Error al generar el archivo CSV.');
        }
    };

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            <PageHeader 
                title="Exportación de Datos"
                description="Genere reportes institucionales personalizados y descargue los registros en formato estructurado."
                icon={Download}
            />

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Filter size={20} /></div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Criterios de Exportación</h3>
                            <p className="text-sm text-slate-500 font-medium">Defina el alcance del reporte antes de la descarga.</p>
                        </div>
                    </div>
                    <button onClick={resetFilters} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2"><RefreshCcw size={16}/>Reiniciar</button>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Filtrar por texto (título, autor)..."
                            value={filters.search}
                            onChange={e => setFilters({...filters, search: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select value={filters.facultad} onChange={e => setFilters({...filters, facultad: e.target.value})} className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold">
                            <option value="Todas">Facultad: Todas</option>
                            {filterOptions.facultades.map((f:any) => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <select value={filters.categoria} onChange={e => setFilters({...filters, categoria: e.target.value})} className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold">
                            <option value="Todas">Categoría: Todas</option>
                            {filterOptions.categorias.map((c:any) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select value={filters.anio} onChange={e => setFilters({...filters, anio: e.target.value})} className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold">
                            <option value="Todos">Año: Todos</option>
                            {filterOptions.anios.map((a:any) => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="p-4 bg-blue-50 rounded-full mb-6">
                        <FileText size={48} className="text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Reporte Preparado</h3>
                    <p className="text-slate-500 max-w-md mb-8 font-medium">
                        Se han consolidado <span className="text-blue-600 font-black">{filteredData.length.toLocaleString()}</span> registros.
                    </p>
                    
                    <button
                        onClick={downloadCSV}
                        disabled={filteredData.length === 0}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg shadow-lg transition-all ${
                            filteredData.length > 0 
                                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1' 
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        <Download size={24} />
                        Descargar CSV
                    </button>
                </div>

                {filteredData.length > 0 && (
                    <div className="bg-slate-50 p-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                            <Table size={16} />
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Vista Previa (5 registros)</h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase">Título</th>
                                        <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase">Facultad</th>
                                        <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase text-center">Año</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredData.slice(0, 5).map((row, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-3 text-xs font-bold text-slate-700 max-w-xs truncate">{row.Titulo}</td>
                                            <td className="px-4 py-3 text-[10px] text-slate-500 font-bold uppercase">{row.Facultad}</td>
                                            <td className="px-4 py-3 text-xs text-blue-600 font-black text-center">{row.Anio}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
