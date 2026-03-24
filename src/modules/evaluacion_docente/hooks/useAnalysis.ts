import { useState, useCallback, useEffect } from 'react';
import { getIndividualAnalysis } from '@evaluacion_docente/services/geminiService';

export const useAnalysis = () => {
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState<boolean>(false);
    const [analysis, setAnalysis] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [currentAnalysisTitle, setCurrentAnalysisTitle] = useState<string>('');
    const [currentAnalysisData, setCurrentAnalysisData] = useState<any>(null);

    const handleGenerateAnalysis = useCallback(async () => {
        if (!currentAnalysisData) return;
        setIsAnalyzing(true);
        setError(null);
        setAnalysis('');
        try {
            const analysisResult = await getIndividualAnalysis(currentAnalysisData, currentAnalysisTitle);
            setAnalysis(analysisResult);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`The AI failed to generate an analysis. This could be a temporary issue with the AI service. Please try again. Details: ${errorMessage}`);
        } finally {
            setIsAnalyzing(false);
        }
    }, [currentAnalysisData, currentAnalysisTitle]);

    useEffect(() => {
        if (isAnalysisModalOpen && currentAnalysisData && !analysis && !isAnalyzing && !error) {
            handleGenerateAnalysis();
        }
    }, [isAnalysisModalOpen, currentAnalysisData, analysis, isAnalyzing, error, handleGenerateAnalysis]);

    const openAnalysisModal = (data: any, title: string) => {
        setCurrentAnalysisData(data);
        setCurrentAnalysisTitle(title);
        setIsAnalysisModalOpen(true);
    };

    const closeAnalysisModal = () => {
        setIsAnalysisModalOpen(false);
        setTimeout(() => {
            setCurrentAnalysisData(null);
            setCurrentAnalysisTitle('');
            setAnalysis('');
            setError(null);
        }, 300);
    };

    const retryAnalysis = () => {
        setAnalysis('');
        setError(null);
        handleGenerateAnalysis();
    };

    return {
        isAnalyzing,
        isAnalysisModalOpen,
        analysis,
        error,
        currentAnalysisTitle,
        openAnalysisModal,
        closeAnalysisModal,
        retryAnalysis,
    };
};