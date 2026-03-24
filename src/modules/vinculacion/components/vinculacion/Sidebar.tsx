import React from 'react';

const LineChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
    </svg>
);

const LayersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
    </svg>
);

const TableIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <line x1="3" x2="21" y1="9" y2="9" />
        <line x1="3" x2="21" y1="15" y2="15" />
        <line x1="9" x2="9" y1="9" y2="21" />
        <line x1="15" x2="15" y1="9" y2="21" />
    </svg>
);

const ChevronLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
);
  
const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
);

export type Page = 
    | 'resumen-general' 
    | 'evolucion-historica' 
    | 'reporte';

interface NavItem {
    id: Page;
    title: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
    { id: 'resumen-general', title: 'Resumen General', icon: LayersIcon },
    { id: 'evolucion-historica', title: 'Evolución Histórica', icon: LineChartIcon },
    { id: 'reporte', title: 'Reporte de Proyectos', icon: TableIcon },
];

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isCollapsed, toggleSidebar }) => {
    return (
        <aside className={`flex flex-col flex-shrink-0 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                <nav className="p-2 space-y-1 mt-2">
                    <h3 className={`px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity duration-200 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Proyectos de Vinculación</h3>
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
                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-slate-500" /> : 
                        <ChevronLeftIcon className="h-5 w-5 flex-shrink-0 text-slate-500" />
                    }
                    <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
                        Colapsar
                    </span>
                </button>
            </div>
        </aside>
    );
};
