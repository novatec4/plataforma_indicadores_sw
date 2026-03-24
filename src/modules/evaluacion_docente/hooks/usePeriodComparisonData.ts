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

export const usePeriodComparisonData = (data: SheetData | null, filters: { periodA: string, periodB: string }) => {
    return useMemo(() => {
        if (!data || !data.rows || data.rows.length === 0 || !filters.periodA || !filters.periodB) {
            return { chartData: [], tableData: {}, criteria: [], previousPeriodName: '', currentPeriodName: '', kpis: {} };
        }
        
        const firstRow = data.rows[0];
        const paoKey = findKey(firstRow, 'pao');
        const criterioKey = findKey(firstRow, 'criterio');
        const puntuacionKey = findKey(firstRow, 'puntuacion');

        if (!paoKey || !criterioKey || !puntuacionKey) {
             return { chartData: [], tableData: {}, criteria: [], previousPeriodName: '', currentPeriodName: '', kpis: {} };
        }

        const previousPeriod = filters.periodA;
        const currentPeriod = filters.periodB;

        const pivotedData = data.rows.reduce((acc, row) => {
            const pao = String(row[paoKey]);
            if (pao !== currentPeriod && pao !== previousPeriod) return acc;

            const criterio = String(row[criterioKey]);
            const puntuacion = safeToNumber(row[puntuacionKey]);
            
            if (!acc[criterio]) {
                acc[criterio] = { criterio };
            }
            
            acc[criterio][pao] = puntuacion;
            return acc;
        }, {} as Record<string, any>);
        
        const chartData = Object.values(pivotedData);
        const criteria = Object.keys(pivotedData);

        const tableData = {
            [previousPeriod]: {} as Record<string, any>,
            [currentPeriod]: {} as Record<string, any>,
        };

        chartData.forEach((item: any) => {
            tableData[previousPeriod][item.criterio] = item[previousPeriod];
            tableData[currentPeriod][item.criterio] = item[currentPeriod];
        });

        // KPI Calculations
        let currentPeriodSum = 0;
        let previousPeriodSum = 0;
        let validCriteriaCount = 0;
        let biggestImprovement = { name: 'N/A', change: -Infinity };
        let biggestDecline = { name: 'N/A', change: Infinity };

        chartData.forEach((item: any) => {
            const currentScore = item[currentPeriod] || 0;
            const previousScore = item[previousPeriod] || 0;

            if (currentScore > 0 && previousScore > 0) {
                currentPeriodSum += currentScore;
                previousPeriodSum += previousScore;
                validCriteriaCount++;

                const change = currentScore - previousScore;
                if (change > biggestImprovement.change) {
                    biggestImprovement = { name: item.criterio, change };
                }
                if (change < biggestDecline.change) {
                    biggestDecline = { name: item.criterio, change };
                }
            }
        });

        const kpis = {
            currentPeriodAverage: validCriteriaCount > 0 ? currentPeriodSum / validCriteriaCount : 0,
            previousPeriodAverage: validCriteriaCount > 0 ? previousPeriodSum / validCriteriaCount : 0,
            biggestImprovement,
            biggestDecline,
        };

        return {
            chartData,
            tableData,
            criteria,
            previousPeriodName: previousPeriod,
            currentPeriodName: currentPeriod,
            kpis,
        };
    }, [data, filters]);
};