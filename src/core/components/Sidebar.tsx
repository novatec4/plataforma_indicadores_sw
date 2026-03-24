import React from 'react';
import {
    History,
    Scale,
    LayoutDashboard,
    GitCompareArrows,
    Award,
    BarChart3,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    Users,
    BookOpen,
    GraduationCap,
    FileText,
    Activity,
    Target
} from 'lucide-react';
import { AppModule } from '@core/types';

export type Page = 
    // Evaluación Docente
    | 'general-analysis' 
    | 'institutional-comparison' 
    | 'historical-evolution' 
    | 'period-comparison' 
    | 'historical-component-comparison'
    | 'historical-performance'
    | 'final-comparison'
    // Indicadores Académicos
    | 'indicadores-dashboard'
    | 'indicadores-trends'
    // Proyectos Vinculación
    | 'vinculacion-dashboard'
    | 'vinculacion-historico'
    | 'vinculacion-reporte'
    // Titulación
    | 'titulacion-dashboard'
    | 'titulacion-search'
    | 'titulacion-export';

interface NavItem {
    id: Page;
    title: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const moduleNavItems: Record<AppModule, NavItem[]> = {
    [AppModule.EVALUACION_DOCENTE]: [
        { id: 'general-analysis', title: 'Análisis General', icon: LayoutDashboard },
        { id: 'institutional-comparison', title: 'Comparativa Institucional', icon: Scale },
        { id: 'historical-evolution', title: 'Evolución Histórica', icon: TrendingUp },
        { id: 'period-comparison', title: 'Comparativa entre Períodos', icon: GitCompareArrows },
        { id: 'historical-component-comparison', title: 'Histórico por Componente', icon: BarChart3 },
        { id: 'historical-performance', title: 'Rendimiento Histórico', icon: Activity },
        { id: 'final-comparison', title: 'Comparativa Final', icon: Award },
    ],
    [AppModule.INDICADORES_ACADEMICOS]: [
        { id: 'indicadores-dashboard', title: 'Visión Académica', icon: Activity },
        { id: 'indicadores-trends', title: 'Visión de Calidad', icon: Target },
    ],
    [AppModule.VINCULACION]: [
        { id: 'vinculacion-dashboard', title: 'Visión Estratégica', icon: LayoutDashboard },
        { id: 'vinculacion-historico', title: 'Evolución de Vinculación', icon: History },
        { id: 'vinculacion-reporte', title: 'Reporte de Proyectos', icon: FileText },
    ],
    [AppModule.TITULACION]: [
        { id: 'titulacion-dashboard', title: 'Resumen General', icon: GraduationCap },
        { id: 'titulacion-comparison', title: 'Comparativa Institucional', icon: GitCompareArrows },
        { id: 'titulacion-search', title: 'Buscador de Tesis', icon: BookOpen },
        { id: 'titulacion-export', title: 'Exportación de Datos', icon: FileText },
    ],
};

interface SidebarProps {
    currentModule: AppModule;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentModule, currentPage, setCurrentPage, isCollapsed, toggleSidebar }) => {
    const navItems = moduleNavItems[currentModule];

    return (
        <aside className={`flex flex-col flex-shrink-0 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex-1 overflow-y-auto">
                <nav className="p-2 space-y-1 mt-2">
                    <h3 className={`px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity duration-200 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
                        Navegación
                    </h3>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                currentPage === item.id 
                                    ? 'bg-blue-50 text-blue-700' 
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'justify-center' : ''}`}
                            aria-current={currentPage === item.id ? 'page' : undefined}
                            title={isCollapsed ? item.title : undefined}
                        >
                            <item.icon className={`h-5 w-5 flex-shrink-0 ${currentPage === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>{item.title}</span>
                        </button>
                    ))}
                </nav>
            </div>
            <div className="p-2 border-t border-slate-200">
                <button
                    onClick={toggleSidebar}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 ${isCollapsed ? 'justify-center' : ''}`}
                    aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
                >
                    {isCollapsed ? 
                        <ChevronRight className="h-5 w-5 flex-shrink-0 text-slate-500" /> : 
                        <ChevronLeft className="h-5 w-5 flex-shrink-0 text-slate-500" />
                    }
                    <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
                        Colapsar
                    </span>
                </button>
            </div>
        </aside>
    );
};