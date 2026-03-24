import { useMemo } from 'react';
import type { SheetData } from '@core/types';

const normalizeKey = (str: string | undefined | null): string => {
    if (typeof str !== 'string') return '';
    return str.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const safeToNumber = (value: any): number => {
    if (value === null || value === undefined || value === 'N/A') return 0;
    if (typeof value === 'number') return isNaN(value) ? 0 : value;
    if (typeof value === 'string') {
      const cleanedValue = value.replace(',', '.').trim();
      const num = parseFloat(cleanedValue);
      return isNaN(num) ? 0 : num;
    }
    return 0;
};

const evaluationKeys: Record<string, string> = {
    'heteroevaluacion': 'HETEROEVALUACIÓN',
    'autoevaluacion': 'AUTOEVALUACIÓN',
    'coevaluacion directivo': 'COEVALUACIÓN DIRECTIVO',
    'coevaluacion pares academicos': 'COEVALUACIÓN PARES ACADÉMICOS',
};
const normalizedDataKeys = Object.keys(evaluationKeys);

export const useEvaluationData = (data: SheetData['rows'] | null, filters: { selectedCriteria: string[] }) => {
    return useMemo(() => {
        if (!data || data.length === 0) {
            return {
                chartData: [],
                kpis: {
                    overallAverage: 0,
                    heteroAverage: 0,
                    highestCriterion: { name: 'N/A', score: 0 },
                    lowestCriterion: { name: 'N/A', score: 0 },
                }
            };
        }

        const pivotedData = data.reduce((acc, row) => {
            const getRowValue = (keyName: string) => {
                const actualKey = Object.keys(row).find(k => normalizeKey(k) === keyName);
                return actualKey ? row[actualKey] : undefined;
            };

            const criterio = getRowValue('criterio');
            const tip_eva = getRowValue('tip_eva');
            const puntuacion = getRowValue('puntuacion');

            if (typeof criterio !== 'string' || typeof tip_eva !== 'string' || criterio.trim() === '') {
              return acc;
            }

            const componentName = criterio.trim();
            if (!acc[componentName]) {
              acc[componentName] = { 'Componente': componentName };
            }
            
            const normalizedTipEva = normalizeKey(String(tip_eva));
            if (evaluationKeys[normalizedTipEva]) {
              acc[componentName][normalizedTipEva] = safeToNumber(puntuacion);
            }
            return acc;
          }, {} as Record<string, Record<string, any>>);
        
        const allChartData = Object.values(pivotedData);
        allChartData.forEach(item => {
            normalizedDataKeys.forEach(key => {
                if (item[key] === undefined) {
                    item[key] = 0;
                }
            });
        });

        const chartData = allChartData.filter(item => filters.selectedCriteria.includes(item.Componente));

        // KPI Calculations
        let totalSum = 0;
        let totalCount = 0;
        let heteroSum = 0;
        let heteroCount = 0;
        let highestCriterion = { name: 'N/A', score: 0 };
        let lowestCriterion = { name: 'N/A', score: 121 };

        chartData.forEach(item => {
            const heteroScore = item['heteroevaluacion'] || 0;
            if (heteroScore > 0) {
                heteroSum += heteroScore;
                heteroCount++;
                if (heteroScore > highestCriterion.score) {
                    highestCriterion = { name: item.Componente, score: heteroScore };
                }
                if (heteroScore < lowestCriterion.score) {
                    lowestCriterion = { name: item.Componente, score: heteroScore };
                }
            }
            normalizedDataKeys.forEach(key => {
                if (item[key] > 0) {
                    totalSum += item[key];
                    totalCount++;
                }
            });
        });

        const kpis = {
            overallAverage: totalCount > 0 ? totalSum / totalCount : 0,
            heteroAverage: heteroCount > 0 ? heteroSum / heteroCount : 0,
            highestCriterion,
            lowestCriterion: lowestCriterion.score > 120 ? { name: 'N/A', score: 0 } : lowestCriterion,
        };

        return { chartData, kpis };
    }, [data, filters]);
};