import type { SheetData } from '@core/types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAAV1MqAGIg3PNM0eF6rp1qMThkg6zo5wk';

function extractSheetId(url: string): string | null {
  const match = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/.exec(url);
  return match ? match[1] : null;
}

const fetchAndProcessSheet = async (url: string, sheetName: string): Promise<SheetData> => {
    const sheetId = extractSheetId(url);
    if (!sheetId) {
        throw new Error('Invalid Google Sheet URL. Could not find sheet ID.');
    }
    
    // Using the provided API key
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}?key=AIzaSyAAV1MqAGIg3PNM0eF6rp1qMThkg6zo5wk`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch sheet data. Status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.values || data.values.length === 0) {
        throw new Error(`Sheet data from '${sheetName}' is empty.`);
    }

    const headers = data.values[0] as string[];
    const rows = data.values.slice(1).map((rowArray: any[]) => {
        const rowData: Record<string, string | number | null> = {};
        headers.forEach((header, index) => {
            const val = rowArray[index];
            rowData[header] = val !== undefined && val !== '' ? val : null;
        });
        return rowData;
    });

    return { headers, rows };
}

export const fetchProjectsData = async (url: string): Promise<SheetData> => {
  return fetchAndProcessSheet(url, 'Proyectos');
};
