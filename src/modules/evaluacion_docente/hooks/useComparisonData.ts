import { useMemo } from 'react';
import type { SheetData } from '@core/types';

const safeToNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return isNaN(value) ? 0 : value;
    if (typeof value === 'string') {
      const cleanedValue = value.replace(',', '.').trim();
      const num = parseFloat(cleanedValue);
      return isNaN(num) ? 0 : num;
    }
    return 0;
};

const normalizeKey = (str: string | undefined | null): string => {
    if (typeof str !== 'string') return '';
    return str.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const useComparisonData = (comparisonData: SheetData | null, comparisonFilters: { selectedCriteria: string[] }) => {
    const comparisonChartData = useMemo(() => {
        if (!comparisonData || !comparisonData.rows || comparisonData.rows.length === 0) return [];

        const firstRow = comparisonData.rows[0];
        if (!firstRow) return [];

        const findKey = (targetKey: string): string | undefined => {
            const normalizedTarget = normalizeKey(targetKey);
            return Object.keys(firstRow).find(key => normalizeKey(key) === normalizedTarget);
        };

        const criterioKey = findKey('criterio');
        const tipoKey = findKey('tip_hetero');
        const puntuacionKey = findKey('puntuacion');

        if (!criterioKey || !tipoKey || !puntuacionKey) {
            console.error("Could not find required keys ('criterio', 'tip_hetero', 'puntuacion') in comparisonData");
            return [];
        }
        
        const pivotedData = comparisonData.rows.reduce((acc, row) => {
            const criterio = row[criterioKey] as string;
            const tipo = row[tipoKey] as string;
            const puntuacion = safeToNumber(row[puntuacionKey]);
            
            if (!criterio || !tipo) return acc;
            
            if (!acc[criterio]) {
                acc[criterio] = { name: criterio, SOFTWARE: 0, ESPOCH: 0 };
            }
            
            if (normalizeKey(tipo) === 'software') {
                acc[criterio].SOFTWARE = puntuacion;
            } else if (normalizeKey(tipo) === 'espoch') {
                acc[criterio].ESPOCH = puntuacion;
            }
            
            return acc;
        }, {} as Record<string, {name: string, SOFTWARE: number, ESPOCH: number}>);
        
        return Object.values(pivotedData)
            .filter((row: any) => comparisonFilters.selectedCriteria.includes(row.name));
    }, [comparisonData, comparisonFilters]);

    const scoreGapData = useMemo(() => {
        return comparisonChartData.map(item => ({
          criterio: item.name,
          SOFTWARE: item.SOFTWARE || 0,
          ESPOCH: item.ESPOCH || 0,
          diferencia: (item.SOFTWARE || 0) - (item.ESPOCH || 0)
        }));
    }, [comparisonChartData]);

    return { comparisonChartData, scoreGapData };
};