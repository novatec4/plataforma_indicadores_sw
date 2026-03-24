import { useState, useMemo, useEffect } from 'react';
import { QualityIndicator, QualityIndicatorCategories, ChartDataPoint } from '@core/types';

const INDICATOR_COLORS = [
  '#3b82f6', '#10b981', '#ef4444', '#f97316', '#8b5cf6', '#ec4899',
  '#14b8a6', '#6366f1', '#f59e0b', '#d946ef', '#0ea5e9', '#eab308'
];

type PerformanceFilter = 'all' | 'optimal' | 'acceptable' | 'critical';

// Built-in default categories to provide a good initial experience
const BUILT_IN_DEFAULT_CATEGORIES: QualityIndicatorCategories = {
    'Docencia': [
        'Porcentaje de docentes con título de PhD',
        'Número de horas de docencia impartidas por docentes titulares',
        'Resultados de la evaluación al desempeño docente',
        'Número de sílabos actualizados y aprobados',
        'Tasa de aprobación de asignaturas',
        'Tasa de deserción estudiantil',
        'Tasa de retención estudiantil',
        'Tasa de titulación',
        'Tiempo promedio de titulación',
        'Grado de satisfacción de los graduados con la carrera',
        'Grado de satisfacción de los empleadores',
        'Número de estudiantes por docente',
    ],
    'Investigación': [
        'Número de proyectos de investigación en ejecución',
        'Número de publicaciones indexadas',
        'Número de ponencias en congresos científicos',
        'Número de libros y capítulos de libro publicados',
    ],
    'Vinculación': [
        'Número de proyectos de vinculación con la sociedad',
        'Número de convenios interinstitucionales vigentes',
        'Número de prácticas preprofesionales realizadas',
        'Número de eventos de educación continua realizados',
        'Número de graduados con seguimiento',
    ],
    'Gestión e Infraestructura': [
        'Porcentaje de ejecución del presupuesto',
        'Porcentaje de cumplimiento del Plan Operativo Anual (POA)',
        'Disponibilidad de recursos bibliográficos',
        'Disponibilidad y estado de laboratorios y equipos',
        'Disponibilidad y calidad de la infraestructura física',
        'Disponibilidad y calidad de la infraestructura tecnológica',
        'Número de becas otorgadas a estudiantes',
        'Número de programas de bienestar estudiantil',
        'Número de programas de seguimiento a graduados',
    ]
};

export const useQualityData = (
    allIndicators: QualityIndicator[],
    defaultCategories: QualityIndicatorCategories
) => {
    const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
    const [activeFilter, setActiveFilter] = useState<PerformanceFilter>('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    const [userAssignments, setUserAssignments] = useState<Record<string, string>>(() => {
        try {
            const saved = localStorage.getItem('indicatorCategoryAssignments');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error("Error parsing indicator category assignments from localStorage", error);
            return {};
        }
    });

    const handleSetIndicatorAssignment = (indicatorTitle: string, category: string) => {
        setUserAssignments(prev => {
            const newAssignments = { ...prev, [indicatorTitle]: category };
            localStorage.setItem('indicatorCategoryAssignments', JSON.stringify(newAssignments));
            return newAssignments;
        });
    };

    const indicatorToCategoryMap = useMemo(() => {
        const finalMap: Record<string, string> = {};
        const sheetCategoryMap: Record<string, string> = {};
        const builtInCategoryMap: Record<string, string> = {};

        // 1. Create map from Google Sheets categories
        for (const category in defaultCategories) {
            (defaultCategories[category] as string[]).forEach(title => {
                sheetCategoryMap[title] = category;
            });
        }
        
        // 2. Create map from built-in default categories
        for (const category in BUILT_IN_DEFAULT_CATEGORIES) {
            (BUILT_IN_DEFAULT_CATEGORIES[category] as string[]).forEach(title => {
                builtInCategoryMap[title] = category;
            });
        }

        allIndicators.forEach(indicator => {
            // Precedence: User > Google Sheet > Built-in > Fallback
            finalMap[indicator.titulo] = 
                userAssignments[indicator.titulo] || 
                sheetCategoryMap[indicator.titulo] || 
                builtInCategoryMap[indicator.titulo] ||
                'Otros Indicadores';
        });

        return finalMap;
    }, [allIndicators, defaultCategories, userAssignments]);

    const finalCategories = useMemo(() => {
        const newCategories: QualityIndicatorCategories = {};
        for (const indicatorTitle in indicatorToCategoryMap) {
            const category = indicatorToCategoryMap[indicatorTitle];
            if (!newCategories[category]) {
                newCategories[category] = [];
            }
            newCategories[category].push(indicatorTitle);
        }
        // FIX: Added type assertion to resolve 'sort' does not exist on type 'unknown' error.
        Object.values(newCategories).forEach(arr => (arr as string[]).sort((a,b) => a.localeCompare(b)));
        return newCategories;
    }, [indicatorToCategoryMap]);

    const indicatorDescriptions = useMemo(() => {
        const map = new Map<string, string>();
        allIndicators.forEach(ind => map.set(ind.titulo, ind.descripcion));
        return map;
    }, [allIndicators]);

    const getLatestValue = (indicator: QualityIndicator): number | null => {
        if (!indicator.periodos || indicator.periodos.length === 0) return null;
        return indicator.periodos[indicator.periodos.length - 1]?.valor ?? null;
    };

    const filteredIndicators = useMemo(() => {
        return allIndicators.filter(indicator => {
            const latestValue = getLatestValue(indicator);
            const matchesFilter = 
                activeFilter === 'all' ||
                (activeFilter === 'critical' && latestValue !== null && latestValue < 50) ||
                (activeFilter === 'acceptable' && latestValue !== null && latestValue >= 50 && latestValue < 80) ||
                (activeFilter === 'optimal' && latestValue !== null && latestValue >= 80);

            const matchesSearch = 
                !searchTerm || 
                indicator.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                indicator.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [allIndicators, activeFilter, searchTerm]);
    
    const filteredCategories = useMemo(() => {
        const filteredIndicatorTitles = new Set(filteredIndicators.map(ind => ind.titulo));
        const newCategories: QualityIndicatorCategories = {};
        for (const category in finalCategories) {
            const indicatorsInCategory = (finalCategories[category] as string[]).filter(indicatorTitle => filteredIndicatorTitles.has(indicatorTitle));
            if (indicatorsInCategory.length > 0) {
                newCategories[category] = indicatorsInCategory;
            }
        }
        return newCategories;
    }, [finalCategories, filteredIndicators]);

    useEffect(() => {
        const filteredIndicatorTitles = new Set(filteredIndicators.map(ind => ind.titulo));
        setSelectedIndicators(prev => prev.filter(title => filteredIndicatorTitles.has(title)));
    }, [filteredIndicators]);

    const handleSelectionChange = (item: string) => {
        setSelectedIndicators(prev => 
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    const handleCategorySelectionChange = (items: string[], select: boolean) => {
        setSelectedIndicators(prev => {
            const newSelection = new Set(prev);
            items.forEach(item => {
                if (select) {
                    newSelection.add(item);
                } else {
                    newSelection.delete(item);
                }
            });
            return Array.from(newSelection);
        });
    };

    const handleClearAll = () => {
        setSelectedIndicators([]);
    };

    const chartIndicators = useMemo(() => 
        selectedIndicators.map((title, index) => ({
            key: title,
            color: INDICATOR_COLORS[index % INDICATOR_COLORS.length]
        })), [selectedIndicators]);

    const chartData = useMemo<ChartDataPoint[]>(() => {
        if (selectedIndicators.length === 0) return [];
        
        const indicatorsToShow = allIndicators.filter(ind => selectedIndicators.includes(ind.titulo));
        const allPeriodsSet = new Set<string>();
        indicatorsToShow.forEach(ind => ind.periodos.forEach(p => allPeriodsSet.add(p.nombrePeriodo)));

        const allPeriodsSorted = Array.from(allPeriodsSet).sort((a, b) => {
             const yearA = parseInt(a.split(' ')[1]);
             const yearB = parseInt(b.split(' ')[1]);
             if (!isNaN(yearA) && !isNaN(yearB) && yearA !== yearB) return yearA - yearB;
             const monthOrder = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
             return monthOrder.indexOf(a.split(' ')[0].toUpperCase()) - monthOrder.indexOf(b.split(' ')[0].toUpperCase());
       });

        return allPeriodsSorted.map(period => {
            const dataPoint: ChartDataPoint = { name: period };
            indicatorsToShow.forEach(indicator => {
                const periodData = indicator.periodos.find(p => p.nombrePeriodo === period);
                dataPoint[indicator.titulo] = periodData ? periodData.valor : null;
            });
            return dataPoint;
        });
    }, [allIndicators, selectedIndicators]);

    return {
        selectedIndicators,
        activeFilter,
        searchTerm,
        filteredIndicators,
        filteredCategories,
        finalCategories,
        indicatorToCategoryMap,
        indicatorDescriptions,
        chartData,
        chartIndicators,
        handleSetIndicatorAssignment,
        handleSelectionChange,
        handleCategorySelectionChange,
        handleClearAll,
        setActiveFilter,
        setSearchTerm,
    };
};
