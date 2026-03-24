import type { SheetData } from '@core/types';

export const fetchSheetData = async (url: string, apiKey: string): Promise<SheetData> => {
    // We are now fetching from our local BigQuery Proxy configured in vite.config.ts
    const apiUrl = `/api/titulacion`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to fetch BigQuery data. ${errorData.error || 'Server error'}`);
    }

    const data = await response.json();
    
    if (!data.rows || data.rows.length === 0) {
        throw new Error('BigQuery returned no data.');
    }

    // Adapt data format if needed (headers and rows)
    // The API already returns { headers, rows } where rows are objects
    return data;
};
