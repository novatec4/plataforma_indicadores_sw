
import React from 'react';
import type { Theme } from '@titulacion/types';

export const THEMES: Theme[] = [
  {
    id: 'blue',
    name: 'Azul Profesional',
    colors: ['#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa']
  },
  {
    id: 'emerald',
    name: 'Esmeralda',
    colors: ['#064e3b', '#059669', '#10b981', '#34d399', '#6ee7b7']
  },
  {
    id: 'violet',
    name: 'Violeta',
    colors: ['#4c1d95', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd']
  },
  {
    id: 'amber',
    name: 'Ámbar',
    colors: ['#78350f', '#d97706', '#f59e0b', '#fbbf24', '#fcd34d']
  },
  {
    id: 'rose',
    name: 'Rosa',
    colors: ['#881337', '#e11d48', '#f43f5e', '#fb7185', '#fda4af']
  },
  {
    id: 'slate',
    name: 'Pizarra',
    colors: ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8']
  }
];

interface ThemeSwitcherProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
    isCollapsed: boolean;
}

const PaletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
);

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange, isCollapsed }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    if (isCollapsed) {
         return (
            <div className="relative px-2 py-2" ref={wrapperRef}>
                 <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex justify-center items-center p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Cambiar Tema"
                 >
                    <PaletteIcon className="h-5 w-5 text-slate-500" />
                 </button>
                 {isOpen && (
                     <div className="absolute left-full top-0 ml-2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 w-48 z-50">
                         <p className="text-xs font-semibold text-slate-500 mb-2 px-2">TEMAS</p>
                         {THEMES.map(theme => (
                             <button
                                 key={theme.id}
                                 onClick={() => { onThemeChange(theme); setIsOpen(false); }}
                                 className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-all ${currentTheme.id === theme.id ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                             >
                                 <div className="flex gap-1">
                                     {theme.colors.slice(0, 3).map((c, i) => (
                                         <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }}></div>
                                     ))}
                                 </div>
                                 <span className="text-slate-700">{theme.name}</span>
                             </button>
                         ))}
                     </div>
                 )}
            </div>
         )
    }

    return (
        <div className="px-3 py-4 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <PaletteIcon className="h-4 w-4" />
                <span>Apariencia</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
                {THEMES.map(theme => (
                    <button
                        key={theme.id}
                        onClick={() => onThemeChange(theme)}
                        className={`group relative flex flex-col items-center justify-center p-1.5 rounded-lg border-2 transition-all ${currentTheme.id === theme.id ? 'border-slate-900 bg-slate-50' : 'border-transparent hover:bg-slate-100'}`}
                        title={theme.name}
                    >
                        <div className="w-6 h-6 rounded-full shadow-sm border border-slate-200 overflow-hidden flex -space-x-3 transform -rotate-45 group-hover:scale-110 transition-transform">
                            {theme.colors.slice(0, 3).map((c, i) => (
                                <div key={i} className="w-full h-full" style={{ backgroundColor: c }}></div>
                            ))}
                        </div>
                    </button>
                ))}
            </div>
             <p className="text-center text-xs text-slate-500 mt-2 font-medium">{currentTheme.name}</p>
        </div>
    );
};
