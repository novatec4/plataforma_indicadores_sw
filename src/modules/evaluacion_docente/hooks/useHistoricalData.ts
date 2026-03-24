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

export const useHistoricalData = (historicalData: SheetData | null, historicalFilters: { startPeriod: string; endPeriod: string; }) => {
    const historicalChartData = useMemo(() => {
        if (!historicalData || !historicalData.rows || historicalData.rows.length === 0) return [];
        const allPeriods = Array.from(new Set(historicalData.rows.map(r => r['pao'] as string))).filter(Boolean);
        const processed = historicalData.rows.map(row => ({
            periodo: row['pao'] as string,
            promedio: safeToNumber(row['puntuacion']),
        })).filter(item => item.periodo);
        const startIndex = allPeriods.indexOf(historicalFilters.startPeriod);
        const endIndex = allPeriods.indexOf(historicalFilters.endPeriod);
        if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) return [];
        const filteredProcessed = processed.filter(p => {
            const pIndex = allPeriods.indexOf(p.periodo);
            return pIndex >= startIndex && pIndex <= endIndex;
        });
        const n = filteredProcessed.length;
        if (n < 2) return filteredProcessed.map(p => ({ ...p, trend: p.promedio }));
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        filteredProcessed.forEach((p, i) => {
            sumX += i; sumY += p.promedio; sumXY += i * p.promedio; sumX2 += i * i;
        });
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        return filteredProcessed.map((p, i) => ({...p, trend: slope * i + intercept}));
    }, [historicalData, historicalFilters]);

    const periodOverPeriodChangeData = useMemo(() => {
        if (historicalChartData.length < 2) return [];
        const changes = [];
        for (let i = 1; i < historicalChartData.length; i++) {
            const prev = historicalChartData[i - 1];
            const current = historicalChartData[i];
            const prevAvg = prev.promedio || 0;
            const change = prevAvg !== 0 ? ((current.promedio - prevAvg) / prevAvg) * 100 : 0;
            changes.push({ periodo: `${prev.periodo} -> ${current.periodo}`, change });
        }
        return changes;
    }, [historicalChartData]);

    return { historicalChartData, periodOverPeriodChangeData };
};