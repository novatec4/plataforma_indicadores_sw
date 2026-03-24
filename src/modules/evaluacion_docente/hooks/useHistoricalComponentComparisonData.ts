import { useMemo } from 'react';
import type { SheetData } from '@core/types';

const normalizeKey = (str: string | undefined | null): string => {
    if (typeof str !== 'string') return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
};

const findKey = (obj: Record<string, any>, targetKey: string): string | undefined => {
    const normalizedTarget = normalizeKey(targetKey);
    for (const key in obj) {
        if (normalizeKey(key) === normalizedTarget) {
            return key;
        }
    }
    return undefined;
};

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

export const useHistoricalComponentComparisonData = (data: SheetData | null, filters: { selectedCriteria: string[], selectedPeriods: string[] }) => {
    return useMemo(() => {
        if (!data || !data.rows || data.rows.length === 0) {
            return { chartData: [], periods: [] };
        }

        const pivotedData = data.rows.reduce((acc, row) => {
            const criterioKey = findKey(row, 'criterio');
            const paoKey = findKey(row, 'pao');
            const puntuacionKey = findKey(row, 'puntuacion');

            if (!criterioKey || !paoKey || !puntuacionKey) return acc;
            
            const criterio = String(row[criterioKey]);
            const pao = String(row[paoKey]);
            const puntuacion = safeToNumber(row[puntuacionKey]);

            if (!criterio || !pao) return acc;

            if (!acc[criterio]) {
                acc[criterio] = { criterio };
            }

            acc[criterio][pao] = puntuacion;
            return acc;
        }, {} as Record<string, any>);

        const allChartData = Object.values(pivotedData);
        
        const periodOrderMap = new Map<string, number>();
        data.rows.forEach(row => {
            const paoKey = findKey(row, 'pao');
            const ordenKey = findKey(row, 'orden');
            if (paoKey && ordenKey && row[paoKey] && row[ordenKey]) {
                const paoValue = String(row[paoKey]);
                if (!periodOrderMap.has(paoValue)) {
                    periodOrderMap.set(paoValue, Number(row[ordenKey]));
                }
            }
        });

        const allPeriods = Array.from(periodOrderMap.keys()).sort((a, b) => (periodOrderMap.get(a) ?? 0) - (periodOrderMap.get(b) ?? 0));
        
        const chartData = allChartData.filter(item => filters.selectedCriteria.includes(item.criterio));
        const periods = allPeriods.filter(period => filters.selectedPeriods.includes(period));

        return { chartData, periods };
    }, [data, filters]);
};