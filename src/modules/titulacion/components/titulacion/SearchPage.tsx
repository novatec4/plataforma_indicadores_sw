import React, { useState, useMemo } from 'react';
import { PageHeader } from '@core/components/PageHeader';
import { Search, BookOpen, History, MapPin, Tag, Filter, RefreshCcw } from 'lucide-react';

interface SearchPageProps {
    allInstitutionData: any[];
    filterOptions: any;
}

export const SearchPage: React.FC<SearchPageProps> = ({ 
    allInstitutionData = [],
    filterOptions
}) => {
    // INDEPENDENT FILTERS FOR SEARCH
    const [localFilters, setLocalFilters] = useState({
        facultad: 'Todas',
        categoria: 'Todas',
        anio: 'Todos'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedThesis, setSelectedThesis] = useState<any | null>(null);

    const resetFilters = () => {
        setLocalFilters({ facultad: 'Todas', categoria: 'Todas', anio: 'Todos' });
        setSearchTerm('');
    };

    // HIGH PERFORMANCE SEARCH & FILTERING
    const results = useMemo(() => {
        let data = allInstitutionData;

        // 1. Apply Local Filters
        if (localFilters.facultad !== 'Todas') data = data.filter(r => String(r.Facultad) === localFilters.facultad);
        if (localFilters.categoria !== 'Todas') data = data.filter(r => String(r.Categoria).replace('info:eu-repo/semantics/', '') === localFilters.categoria);
        if (localFilters.anio !== 'Todos') data = data.filter(r => String(r.Anio) === localFilters.anio);

        // 2. Apply Text Search
        if (!searchTerm.trim() || searchTerm.length < 3) return data.slice(0, 50);
        
        const lowerSearch = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return data.filter((row: any) => {
            const title = String(row.Titulo || '').toLowerCase();
            const author = String(row.Autor || '').toLowerCase();
            return title.includes(lowerSearch) || author.includes(lowerSearch);
        }).slice(0, 100);
    }, [allInstitutionData, localFilters, searchTerm]);

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            <PageHeader title="Buscador de Tesis" description="Consulte el repositorio global de la ESPOCH con filtros independientes." icon={Search} />

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="relative flex-1 w-full">
                        <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                            placeholder="Buscar por título o autor (mín. 3 letras)..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={resetFilters} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"><RefreshCcw size={14}/>Limpiar</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select value={localFilters.facultad} onChange={e => setLocalFilters({...localFilters, facultad: e.target.value})} className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold">
                        <option value="Todas">Facultad: Todas</option>
                        {filterOptions.facultades.map((f:any) => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <select value={localFilters.categoria} onChange={e => setLocalFilters({...localFilters, categoria: e.target.value})} className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold">
                        <option value="Todas">Categoría: Todas</option>
                        {filterOptions.categorias.map((c:any) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={localFilters.anio} onChange={e => setLocalFilters({...localFilters, anio: e.target.value})} className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold">
                        <option value="Todos">Año: Todos</option>
                        {filterOptions.anios.map((a:any) => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden flex flex-col h-[650px]">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Resultados ({results.length})</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/10">
                        {results.map((thesis: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setSelectedThesis(thesis)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${
                                    selectedThesis === thesis 
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                        : 'bg-white border-slate-100 hover:border-blue-200 text-slate-700'
                                }`}
                            >
                                <div className="font-bold text-xs line-clamp-2 mb-2">{thesis.Titulo || 'Sin título'}</div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-70">
                                    <span>{thesis.Anio}</span>
                                    <span className="truncate max-w-[120px]">{thesis.Autor}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden flex flex-col h-[650px]">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <BookOpen size={16} className="text-blue-600" />
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Ficha de Tesis</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8">
                        {selectedThesis ? (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded mb-4 inline-block">{selectedThesis.Categoria || 'TESIS'}</span>
                                    <h4 className="text-2xl font-black text-slate-900 leading-tight">{selectedThesis.Titulo}</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Autor</p>
                                        <p className="text-sm font-bold text-slate-700">{selectedThesis.Autor}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Facultad</p>
                                        <p className="text-sm font-bold text-slate-700">{selectedThesis.Facultad}</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Resumen / Descripción</p>
                                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{selectedThesis.Resumen || selectedThesis.Descripcion || 'Sin resumen disponible.'}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                <Search size={48} className="mb-4 opacity-20" />
                                <p className="font-bold">Seleccione una tesis para ver detalles</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
