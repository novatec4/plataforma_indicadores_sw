import { useMemo } from 'react';
import type { SheetData } from '@core/types';

const normalizeKey = (str: string | undefined | null): string => {
    if (typeof str !== 'string') return '';
    return str.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const findKey = (obj: Record<string, any>, targetKey: string): string | undefined => {
    if (!obj) return undefined;
    const normalizedTarget = normalizeKey(targetKey);
    for (const key in obj) {
        if (normalizeKey(key) === normalizedTarget) {
            return key;
        }
    }
    // Fallback search: check if target is part of key
    for (const key in obj) {
        if (normalizeKey(key).includes(normalizedTarget) || normalizedTarget.includes(normalizeKey(key))) {
            return key;
        }
    }
    return undefined;
};

const safeToNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return isNaN(value) ? 0 : value;
    if (typeof value === 'string') {
      const cleanedValue = value.replace(/[^\d,.-]/g, '').replace(',', '.').trim();
      const num = parseFloat(cleanedValue);
      return isNaN(num) ? 0 : num;
    }
    return 0;
};

export const useFinalComparisonData = (dataRows: any[] | null, filters: { selectedCriteria: string[] }) => {
    return useMemo(() => {
        if (!dataRows || dataRows.length === 0) {
            return { chartData: [], seriesNames: [], kpis: null };
        }

        const firstRow = dataRows[0];
        const componenteKey = findKey(firstRow, 'componente');
        const paoKey = findKey(firstRow, 'pao');
        const puntuacionKey = findKey(firstRow, 'puntuacion');
        
        if (!componenteKey || !paoKey || !puntuacionKey) {
             console.warn("useFinalComparisonData: Missing keys", { componenteKey, paoKey, puntuacionKey, sampleRow: firstRow });
             return { chartData: [], seriesNames: [], kpis: null };
        }
        
        const pivotedData = dataRows.reduce((acc, row) => {
            const componenteName = String(row[componenteKey]);
            const pao = String(row[paoKey]);
            const puntuacion = safeToNumber(row[puntuacionKey]);
            
            if (!acc[componenteName]) {
                acc[componenteName] = { criterio: componenteName };
            }
            acc[componenteName][pao] = puntuacion;
            return acc;
        }, {} as Record<string, any>);

        const allChartData = Object.values(pivotedData);
        
        // Filter based on selected criteria
        const chartData = filters.selectedCriteria.length > 0 
            ? allChartData.filter(item => filters.selectedCriteria.includes(item.criterio))
            : allChartData;
        
        const allSeries = Array.from(new Set(dataRows.map(row => String(row[paoKey]))));
        
        const institutionalPeriodName = allSeries.find(s => normalizeKey(s)?.includes('institucional'));
        const timePeriods = allSeries.filter(s => s !== institutionalPeriodName).sort().reverse(); // Newest first
        
        const currentPeriodName = timePeriods[0];
        const previousPeriodName = timePeriods[1];

        const seriesNames = [currentPeriodName, previousPeriodName, institutionalPeriodName].filter(Boolean) as string[];

        let currentSum = 0;
        let previousSum = 0;
        let componentCount = 0;
        let biggestImprovement = { name: 'N/A', change: -Infinity };
        let biggestGap = { name: 'N/A', gap: -Infinity, actualGap: 0 };

        chartData.forEach(item => {
            const currentScore = currentPeriodName ? item[currentPeriodName] : 0;
            const previousScore = previousPeriodName ? item[previousPeriodName] : 0;
            const institutionalScore = institutionalPeriodName ? item[institutionalPeriodName] : 0;

            if (currentScore > 0) {
                currentSum += currentScore;
                componentCount++;
            }
            if (previousScore > 0) {
                previousSum += previousScore;
            }

            if (currentScore > 0 && previousScore > 0) {
                const improvement = currentScore - previousScore;
                if (improvement > biggestImprovement.change) {
                    biggestImprovement = { name: item.criterio, change: improvement };
                }
            }

            if (currentScore > 0 && institutionalScore > 0) {
                const gap = Math.abs(currentScore - institutionalScore);
                if (gap > biggestGap.gap) {
                    biggestGap = { name: item.criterio, gap: gap, actualGap: currentScore - institutionalScore };
                }
            }
        });

        const currentPeriodAverage = componentCount > 0 ? currentSum / componentCount : 0;
        const previousPeriodAverage = componentCount > 0 ? previousSum / componentCount : 0;

        const kpis = {
            currentPeriodAverage: currentPeriodAverage,
            overallChange: (currentPeriodAverage > 0 && previousPeriodAverage > 0) ? currentPeriodAverage - previousPeriodAverage : 0,
            biggestImprovement: biggestImprovement.name !== 'N/A' ? biggestImprovement : { name: 'Sin datos', change: 0 },
            biggestGap: biggestGap.name !== 'N/A' ? biggestGap : { name: 'Sin datos', gap: 0, actualGap: 0 },
        };

        return { chartData, seriesNames, kpis };
    }, [dataRows, filters]);
};