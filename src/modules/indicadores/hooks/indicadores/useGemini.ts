import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { AnalysisType, AcademicPeriod, QualityIndicator } from '@core/types';

interface AnalysisData {
    academic?: AcademicPeriod[];
    graduates?: { anio: number; numeroGraduados: number; }[];
    quality?: QualityIndicator[];
    period?: string;
}

export const useGemini = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateInsights = async (type: AnalysisType, data: AnalysisData) => {
        // Set modal state immediately for user feedback
        const title = type === 'academic' ? 'Análisis de Indicadores Académicos' : 'Análisis de Indicadores de Calidad';
        setModalTitle(title);
        setModalContent('');
        setError(null);
        setIsGenerating(true);
        setIsModalOpen(true);

        try {
            const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
            if (!apiKey) {
                console.warn("API Key for Gemini is not set. AI features will be disabled.");
                setModalContent("La funcionalidad de análisis por IA está desactivada porque no se ha configurado la API Key de Gemini.");
                setIsGenerating(false);
                return;
            }

            const ai = new GoogleGenAI({ apiKey });
            let prompt = '';

            if (type === 'academic') {
                const { academic, graduates, period = 'all' } = data;
                if (period === 'all') {
                    prompt = `
                        Analiza los siguientes datos de los indicadores académicos de la carrera de Software de la Escuela Superior Politécnica de Chimborazo.
                        Datos de periodos académicos (retención, deserción, titulación): ${JSON.stringify(academic)}
                        Datos de graduados por año: ${JSON.stringify(graduates)}
    
                        Basado en estos datos, proporciona un resumen ejecutivo con:
                        1.  **Observaciones Clave:** Puntos más importantes sobre las tendencias de retención, deserción, titulación y matriculación.
                        2.  **Fortalezas:** ¿Qué indican los datos como puntos fuertes?
                        3.  **Áreas de Oportunidad:** ¿Dónde se observan desafíos o áreas a mejorar?
                        4.  **Recomendaciones Estratégicas:** Sugiere 2-3 acciones concretas.
                        Formatea la respuesta en Markdown.`;
                } else {
                    const selectedPeriodDescription = academic?.find(p => p.codigoPeriodo === period)?.descripcion || period;
                    const periodSpecificData = academic?.filter(p => p.codigoPeriodo === period);
                    prompt = `
                        Analiza los datos del periodo académico "${selectedPeriodDescription}" para la carrera de Software de la Escuela Superior Politécnica de Chimborazo.
                        Datos específicos del periodo seleccionado (código ${period}): ${JSON.stringify(periodSpecificData)}
    
                        A continuación, se presentan los datos históricos completos para dar contexto:
                        Datos de todos los periodos académicos (retención, deserción, titulación): ${JSON.stringify(academic)}
                        Datos de graduados por año: ${JSON.stringify(graduates)}
    
                        Basado en estos datos, proporciona un análisis enfocado en el periodo "${selectedPeriodDescription}":
                        1.  **Análisis del Periodo Específico:** Describe el rendimiento del periodo seleccionado en términos de retención, titulación, admitidos y matriculados.
                        2.  **Comparación con Tendencias Generales:** Compara el rendimiento de este periodo con los datos históricos. ¿Fue un periodo de mejora, declive o se mantuvo estable?
                        3.  **Conclusiones y Puntos a Destacar:** ¿Qué conclusiones clave se pueden sacar sobre este periodo en particular?
                        Formatea la respuesta en Markdown.`;
                }
            } else { // type === 'quality'
                prompt = `
                    Analiza los siguientes datos de los 32 indicadores de calidad de la carrera de Software de la Escuela Superior Politécnica de Chimborazo. Los datos representan el cumplimiento porcentual a lo largo de varios periodos.
                    Datos de Indicadores de Calidad: ${JSON.stringify(data.quality)}

                    Basado en estos datos, proporciona un análisis detallado:
                    1.  **Resumen General:** Evaluación general de la evolución de la calidad en la carrera.
                    2.  **Indicadores Destacados (Fortalezas):** Identifica 3-4 indicadores que consistentemente muestran un alto rendimiento (cercano al 100%) o una tendencia positiva muy marcada. Explica por qué son importantes.
                    3.  **Indicadores Críticos (Áreas de Oportunidad):** Identifica 3-4 indicadores con bajo rendimiento constante o tendencias a la baja. Explica el posible impacto negativo.
                    4.  **Recomendaciones Clave:** Sugiere acciones específicas para abordar los indicadores críticos y mantener las fortalezas.
                    Formatea la respuesta en Markdown.`;
            }

            const response = await ai.models.generateContent({ model: 'gemini-2.0-flash', contents: prompt });
            setModalContent(response.text);

        } catch (e) {
            console.error(e);
            setError('Error al generar el análisis. Verifique que la API Key esté configurada correctamente y revise la consola para más detalles.');
        } finally {
            setIsGenerating(false);
        }
    };

    const closeModal = () => setIsModalOpen(false);

    return {
        isModalOpen,
        modalTitle,
        modalContent,
        isGenerating,
        error,
        generateInsights,
        closeModal
    };
};