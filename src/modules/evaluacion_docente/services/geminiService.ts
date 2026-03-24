import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key for Gemini is not set. AI features will be disabled.");
    return null;
  }
  
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const getIndividualAnalysis = async (chartData: any, chartTitle: string): Promise<string> => {
  const client = getAIClient();
  if (!client) {
    return "La funcionalidad de análisis por IA está desactivada porque no se ha configurado la API Key de Gemini.";
  }

  const prompt = `
    You are an expert data analyst specializing in academic performance metrics.
    The following JSON data is for a chart titled "${chartTitle}".

    Data:
    ${JSON.stringify(chartData, null, 2)}

    Please provide a concise analysis of this data in Spanish. Your analysis should be structured as follows:

    1.  **Resumen Clave:** A brief summary of what the chart shows and its main purpose.
    2.  **Observaciones Principales:** Identify 2-3 of the most important insights, significant trends, or notable anomalies in the data. Use bullet points.
    3.  **Recomendación Accionable:** Based on your observations, provide one specific and actionable recommendation.
    4.  **Conclusión:** A brief concluding remark.

    Format the response clearly. Use markdown for headings (e.g., '**Resumen Clave:**') and bullet points (using '*') to make it easy to read. Be direct and focus on providing value from the data.
  `;
  
  try {
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const analysisText = response.text;
    if (!analysisText) {
        throw new Error("Gemini returned an empty analysis.");
    }

    return analysisText;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get chart analysis from AI.");
  }
};