import { useState, useCallback } from 'react';
import { fetchSheetData, fetchSheetDataForChart2, fetchSheetDataForChart3, fetchSheetDataForChart4, fetchSheetDataForChart5 } from '@evaluacion_docente/services/googleSheetsService';
import type { SheetData } from '@core/types';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1OF4QU4GfX1z5XS2Foqh90lGahw5A7khPBMZbP80nbY8/edit?usp=sharing';

export const useDashboardData = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [evaluationData, setEvaluationData] = useState<SheetData | null>(null);
    const [comparisonData, setComparisonData] = useState<SheetData | null>(null);
    const [historicalData, setHistoricalData] = useState<SheetData | null>(null);
    const [historicalComparisonData, setHistoricalComparisonData] = useState<SheetData | null>(null);
    const [finalComparisonData, setFinalComparisonData] = useState<SheetData | null>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [evalData, compData, histData, histCompData, finalCompData] = await Promise.all([
                fetchSheetData(SHEET_URL),
                fetchSheetDataForChart2(SHEET_URL),
                fetchSheetDataForChart3(SHEET_URL),
                fetchSheetDataForChart4(SHEET_URL),
                fetchSheetDataForChart5(SHEET_URL),
            ]);
            setEvaluationData(evalData);
            setComparisonData(compData);
            setHistoricalData(histData);
            setHistoricalComparisonData(histCompData);
            setFinalComparisonData(finalCompData);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Could not load data from the Google Sheet. Please ensure the sheet is publicly accessible and has the correct format. Details: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        error,
        evaluationData,
        comparisonData,
        historicalData,
        historicalComparisonData,
        finalComparisonData,
        loadData,
    };
};