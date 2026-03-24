
import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import type { Theme } from '@titulacion/types';

const LineChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
    </svg>
);

const BarChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="20" y2="10" />
        <line x1="18" x2="18" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
);

const LayersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
    </svg>
);

const TrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
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
    | 'overview' 
    | 'search' 
    | 'export';

interface NavItem {
    id: Page;
    title: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
);

const navItems: NavItem[] = [
    { id: 'overview', title: 'Resumen General', icon: LineChartIcon },
    { id: 'search', title: 'Búsqueda de Tesis', icon: SearchIcon },
    { id: 'export', title: 'Exportación de Datos', icon: DownloadIcon },
];

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    isCollapsed: boolean;
    toggleSidebar: () => void;
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isCollapsed, toggleSidebar, currentTheme, onThemeChange }) => {
    return (
        <aside className={`flex flex-col flex-shrink-0 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                <nav className="p-2 space-y-1 mt-2">
                    <h3 className={`px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity duration-200 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Análisis de Datos</h3>
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
            
            <ThemeSwitcher 
                currentTheme={currentTheme} 
                onThemeChange={onThemeChange} 
                isCollapsed={isCollapsed}
            />

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
