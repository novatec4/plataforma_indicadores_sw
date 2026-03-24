import { useMemo } from 'react';
import type { SheetData } from '@core/types';

const normalizeKey = (str: string | undefined | null): string => {
    if (typeof str !== 'string') return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
};

const findKey = (obj: Record<string, any>, targetKey: string): string | undefined => {
    if (!obj) return undefined;
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

export const useHistoricalPerformanceData = (data: SheetData | null, filters: { selectedCriteria: string[], selectedPeriods: string[] }) => {
    return useMemo(() => {
        if (!data || !data.rows || data.rows.length === 0) {
            return { chartData: [], criteria: [] };
        }

        const firstRow = data.rows[0];
        const ordenKey = findKey(firstRow, 'orden');
        const paoKey = findKey(firstRow, 'pao');
        const criterioKey = findKey(firstRow, 'criterio');
        const puntuacionKey = findKey(firstRow, 'puntuacion');

        if (!ordenKey || !paoKey || !criterioKey || !puntuacionKey) {
            return { chartData: [], criteria: [] };
        }

        const filteredRows = data.rows.filter(row => {
            const pao = String(row[paoKey]);
            const criterio = String(row[criterioKey]);
            return filters.selectedPeriods.includes(pao) && filters.selectedCriteria.includes(criterio);
        });

        if (filteredRows.length === 0) {
            return { chartData: [], criteria: filters.selectedCriteria };
        }

        const pivotedData = new Map<string, any>();
        
        filteredRows.forEach(row => {
            const pao = String(row[paoKey]);
            const criterio = String(row[criterioKey]);
            const puntuacion = safeToNumber(row[puntuacionKey]);
            const orden = safeToNumber(row[ordenKey]);

            if (!pivotedData.has(pao)) {
                pivotedData.set(pao, { pao, orden });
            }
            pivotedData.get(pao)[criterio] = puntuacion;
        });
        
        const unsortedChartData = Array.from(pivotedData.values());
        const sortedChartData = unsortedChartData.sort((a, b) => a.orden - b.orden);

        filters.selectedCriteria.forEach(criterio => {
            const series = sortedChartData.map(d => d[criterio]).filter(v => v !== undefined);
            const n = series.length;
            if (n < 2) return;

            let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
            let seriesIndex = 0;
            sortedChartData.forEach((d) => {
                const y = d[criterio];
                if (y !== undefined) {
                    sumX += seriesIndex;
                    sumY += y;
                    sumXY += seriesIndex * y;
                    sumX2 += seriesIndex * seriesIndex;
                    seriesIndex++;
                }
            });

            const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;

            seriesIndex = 0;
            sortedChartData.forEach((d) => {
                if (d[criterio] !== undefined) {
                     d[`${criterio}_trend`] = slope * seriesIndex + intercept;
                     seriesIndex++;
                }
            });
        });

        return { chartData: sortedChartData, criteria: filters.selectedCriteria };
    }, [data, filters]);
};