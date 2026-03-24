import { useState, useEffect } from 'react';
import { fetchDashboardData } from '@indicadores/services/indicadores/googleSheets';
import { AcademicPeriod, QualityIndicator, QualityIndicatorCategories } from '@core/types';

interface DashboardData {
    combinedAcademicData: AcademicPeriod[];
    qualityIndicatorsData: QualityIndicator[];
    qualityIndicatorCategories: QualityIndicatorCategories;
    annualGraduatesData: { anio: number; numeroGraduados: number }[];
}

export const useDashboardData = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setFetchError(null);
            try {
                const fetchedData = await fetchDashboardData();
                setData(fetchedData);
            } catch (error) {
                console.error("Failed to fetch data from Google Sheets:", error);
                setFetchError(error instanceof Error ? error.message : "An unknown error occurred while fetching data.");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    return { data, isLoading, fetchError };
};
