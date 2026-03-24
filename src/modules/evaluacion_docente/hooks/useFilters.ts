import { useState, useEffect } from 'react';
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
    return undefined;
};

export const useFilters = (
    historicalData: SheetData | null, 
    comparisonData: SheetData | null,
    evaluationData: SheetData | null,
    historicalComparisonData: SheetData | null,
    finalComparisonData: SheetData | null
) => {
    const [historicalFilters, setHistoricalFilters] = useState({ startPeriod: '', endPeriod: '' });
    const [comparisonFilters, setComparisonFilters] = useState<{ selectedCriteria: string[] }>({ selectedCriteria: [] });
    const [generalAnalysisFilters, setGeneralAnalysisFilters] = useState<{ selectedCriteria: string[] }>({ selectedCriteria: [] });
    const [periodComparisonFilters, setPeriodComparisonFilters] = useState({ periodA: '', periodB: '' });
    const [finalComparisonFilters, setFinalComparisonFilters] = useState<{ selectedCriteria: string[] }>({ selectedCriteria: [] });
    const [historicalComponentComparisonFilters, setHistoricalComponentComparisonFilters] = useState<{ selectedCriteria: string[], selectedPeriods: string[] }>({ selectedCriteria: [], selectedPeriods: [] });
    const [historicalPerformanceFilters, setHistoricalPerformanceFilters] = useState<{ selectedCriteria: string[], selectedPeriods: string[] }>({ selectedCriteria: [], selectedPeriods: [] });
    
    const [filterOptions, setFilterOptions] = useState<{ 
        historicalPeriods: string[], 
        comparisonCriteria: string[],
        generalAnalysisCriteria: string[],
        periodComparisonPeriods: string[],
        finalComparisonCriteria: string[],
        historicalComponentComparisonCriteria: string[],
        historicalComponentComparisonPeriods: string[]
    }>({ 
        historicalPeriods: [], 
        comparisonCriteria: [], 
        generalAnalysisCriteria: [], 
        periodComparisonPeriods: [], 
        finalComparisonCriteria: [],
        historicalComponentComparisonCriteria: [],
        historicalComponentComparisonPeriods: []
    });

    useEffect(() => {
        if (historicalData && historicalData.rows.length > 0) {
            const periods = Array.from(new Set(historicalData.rows.map(r => r['pao'] as string))).filter(Boolean);
            setFilterOptions(prev => ({ ...prev, historicalPeriods: periods }));
            if (periods.length > 0) {
                setHistoricalFilters({ startPeriod: periods[0], endPeriod: periods[periods.length - 1] });
            }
        }
    }, [historicalData]);

    useEffect(() => {
        if (comparisonData && comparisonData.rows.length > 0) {
            const firstRow = comparisonData.rows[0];
            if (firstRow) {
                const criterioKey = Object.keys(firstRow).find(key => normalizeKey(key) === 'criterio');
                if (criterioKey) {
                    const criteria = Array.from(new Set(comparisonData.rows.map(r => r[criterioKey] as string))).filter(Boolean);
                    setFilterOptions(prev => ({ ...prev, comparisonCriteria: criteria }));
                    setComparisonFilters({ selectedCriteria: criteria });
                }
            }
        }
    }, [comparisonData]);

    useEffect(() => {
        if (evaluationData && evaluationData.rows.length > 0) {
            const firstRow = evaluationData.rows[0];
            if (firstRow) {
                const criterioKey = Object.keys(firstRow).find(key => normalizeKey(key) === 'criterio');
                if (criterioKey) {
                    const criteria = Array.from(new Set(evaluationData.rows.map(r => r[criterioKey] as string))).filter(Boolean);
                    setFilterOptions(prev => ({ ...prev, generalAnalysisCriteria: criteria }));
                    setGeneralAnalysisFilters({ selectedCriteria: criteria });
                }
            }
        }
    }, [evaluationData]);

    useEffect(() => {
        if (historicalComparisonData && historicalComparisonData.rows.length > 0) {
            const firstRow = historicalComparisonData.rows[0];
            const paoKey = findKey(firstRow, 'pao');
            const ordenKey = findKey(firstRow, 'orden');
            const criterioKey = findKey(firstRow, 'criterio');

            if (paoKey && ordenKey) {
                const periodMap = new Map<string, number>();
                historicalComparisonData.rows.forEach(row => {
                    const pao = row[paoKey] as string;
                    const orden = Number(row[ordenKey]);
                    if (pao && !isNaN(orden) && !periodMap.has(pao)) {
                        periodMap.set(pao, orden);
                    }
                });
                
                const periods = Array.from(periodMap.keys()).sort((a, b) => (periodMap.get(b) ?? 0) - (periodMap.get(a) ?? 0));
                const sortedPeriodsForComparison = Array.from(periodMap.keys()).sort((a, b) => (periodMap.get(a) ?? 0) - (periodMap.get(b) ?? 0));

                setFilterOptions(prev => ({ ...prev, periodComparisonPeriods: periods, historicalComponentComparisonPeriods: sortedPeriodsForComparison }));
                if (periods.length >= 2) {
                    setPeriodComparisonFilters({ periodA: periods[1], periodB: periods[0] });
                }
                setHistoricalComponentComparisonFilters(prev => ({ ...prev, selectedPeriods: sortedPeriodsForComparison }));
                setHistoricalPerformanceFilters(prev => ({ ...prev, selectedPeriods: sortedPeriodsForComparison }));
            }

            if (criterioKey) {
                const criteria = Array.from(new Set(historicalComparisonData.rows.map(r => r[criterioKey] as string))).filter(Boolean);
                setFilterOptions(prev => ({ ...prev, historicalComponentComparisonCriteria: criteria }));
                setHistoricalComponentComparisonFilters(prev => ({ ...prev, selectedCriteria: criteria }));
                setHistoricalPerformanceFilters(prev => ({ ...prev, selectedCriteria: criteria }));
            }
        }
    }, [historicalComparisonData]);

    useEffect(() => {
        if (finalComparisonData && finalComparisonData.rows.length > 0) {
            const firstRow = finalComparisonData.rows[0];
            if (firstRow) {
                const componenteKey = findKey(firstRow, 'componente');
                if (componenteKey) {
                    const criteria = Array.from(new Set(finalComparisonData.rows.map(r => r[componenteKey] as string))).filter(Boolean);
                    setFilterOptions(prev => ({ ...prev, finalComparisonCriteria: criteria }));
                    setFinalComparisonFilters({ selectedCriteria: criteria });
                }
            }
        }
    }, [finalComparisonData]);

    const handleHistoricalFilterChange = (newFilters: Partial<typeof historicalFilters>) => setHistoricalFilters(prev => ({ ...prev, ...newFilters }));
    const resetHistoricalFilters = () => {
        if (filterOptions.historicalPeriods.length > 0) {
            setHistoricalFilters({
                startPeriod: filterOptions.historicalPeriods[0],
                endPeriod: filterOptions.historicalPeriods[filterOptions.historicalPeriods.length - 1]
            });
        }
    };

    const handleComparisonFilterChange = (newFilters: Partial<typeof comparisonFilters>) => setComparisonFilters(prev => ({ ...prev, ...newFilters }));
    const resetComparisonFilters = () => setComparisonFilters({ selectedCriteria: filterOptions.comparisonCriteria });

    const handleGeneralAnalysisFilterChange = (newFilters: Partial<typeof generalAnalysisFilters>) => setGeneralAnalysisFilters(prev => ({ ...prev, ...newFilters }));
    const resetGeneralAnalysisFilters = () => setGeneralAnalysisFilters({ selectedCriteria: filterOptions.generalAnalysisCriteria });

    const handlePeriodComparisonFilterChange = (newFilters: Partial<typeof periodComparisonFilters>) => setPeriodComparisonFilters(prev => ({ ...prev, ...newFilters }));
    const resetPeriodComparisonFilters = () => {
        if (filterOptions.periodComparisonPeriods.length >= 2) {
            setPeriodComparisonFilters({
                periodA: filterOptions.periodComparisonPeriods[1],
                periodB: filterOptions.periodComparisonPeriods[0]
            });
        }
    };

    const handleFinalComparisonFilterChange = (newFilters: Partial<typeof finalComparisonFilters>) => setFinalComparisonFilters(prev => ({ ...prev, ...newFilters }));
    const resetFinalComparisonFilters = () => setFinalComparisonFilters({ selectedCriteria: filterOptions.finalComparisonCriteria });

    const handleHistoricalComponentComparisonFilterChange = (newFilters: Partial<typeof historicalComponentComparisonFilters>) => setHistoricalComponentComparisonFilters(prev => ({ ...prev, ...newFilters }));
    const resetHistoricalComponentComparisonFilters = () => {
        setHistoricalComponentComparisonFilters({
            selectedCriteria: filterOptions.historicalComponentComparisonCriteria,
            selectedPeriods: filterOptions.historicalComponentComparisonPeriods
        });
    };

    const handleHistoricalPerformanceFilterChange = (newFilters: Partial<typeof historicalPerformanceFilters>) => setHistoricalPerformanceFilters(prev => ({ ...prev, ...newFilters }));
    const resetHistoricalPerformanceFilters = () => {
        setHistoricalPerformanceFilters({
            selectedCriteria: filterOptions.historicalComponentComparisonCriteria,
            selectedPeriods: filterOptions.historicalComponentComparisonPeriods
        });
    };

    return {
        historicalFilters,
        comparisonFilters,
        generalAnalysisFilters,
        periodComparisonFilters,
        finalComparisonFilters,
        historicalComponentComparisonFilters,
        historicalPerformanceFilters,
        filterOptions,
        handleHistoricalFilterChange,
        resetHistoricalFilters,
        handleComparisonFilterChange,
        resetComparisonFilters,
        handleGeneralAnalysisFilterChange,
        resetGeneralAnalysisFilters,
        handlePeriodComparisonFilterChange,
        resetPeriodComparisonFilters,
        handleFinalComparisonFilterChange,
        resetFinalComparisonFilters,
        handleHistoricalComponentComparisonFilterChange,
        resetHistoricalComponentComparisonFilters,
        handleHistoricalPerformanceFilterChange,
        resetHistoricalPerformanceFilters,
    };
};