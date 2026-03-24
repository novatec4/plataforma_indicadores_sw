import type { SheetData } from '@core/types';

function extractSheetId(url: string): string | null {
  const match = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/.exec(url);
  return match ? match[1] : null;
}

function parseGvizResponse(responseText: string): any {
  const jsonString = responseText.match(/google\.visualization\.Query\.setResponse\((.*)\);/s);
  if (!jsonString || jsonString.length < 2) {
    throw new Error('Invalid Gviz response format.');
  }
  return JSON.parse(jsonString[1]);
}

const fetchAndProcessSheet = async (url: string, sheetName: string): Promise<SheetData> => {
    const sheetId = extractSheetId(url);
    if (!sheetId) {
        throw new Error('Invalid Google Sheet URL. Could not find sheet ID.');
    }
    
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${sheetName}&headers=1&tqx=out:json`;

    const response = await fetch(gvizUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch sheet data. Status: ${response.status}`);
    }

    const responseText = await response.text();
    const gvizData = parseGvizResponse(responseText);
    
    if (gvizData.status === 'error') {
        throw new Error(`Google Sheets API error: ${gvizData.errors.map((e: any) => e.detailed_message).join(', ')}`);
    }

    const table = gvizData.table;

    if (!table || !table.cols || !Array.isArray(table.rows)) {
        throw new Error(`Sheet data from '${sheetName}' is empty or has an unexpected format.`);
    }

    const headers = table.cols.map((col: any) => col.label || col.id).filter(Boolean);

    const rows = table.rows
      .map((rowItem: any) => {
        if (!rowItem || !rowItem.c) {
          return null; 
        }
        const rowData: Record<string, string | number> = {};
        headers.forEach((header, index) => {
          const cell = rowItem.c[index];
          rowData[header] = (cell && cell.v !== null) ? cell.v : null;
        });
        return rowData;
      })
      .filter((row): row is Record<string, string | number> => {
        if (!row) return false;
        // Filter out rows where all values are null
        return Object.values(row).some(value => value !== null);
      });

    return { headers, rows };
}


export const fetchSheetData = async (url: string): Promise<SheetData> => {
  return fetchAndProcessSheet(url, 'GRAFICO_1');
};

export const fetchSheetDataForChart2 = async (url:string): Promise<SheetData> => {
    return fetchAndProcessSheet(url, 'GRAFICO_2');
}

export const fetchSheetDataForChart3 = async (url:string): Promise<SheetData> => {
    return fetchAndProcessSheet(url, 'GRAFICO_3');
}

export const fetchSheetDataForChart4 = async (url:string): Promise<SheetData> => {
    return fetchAndProcessSheet(url, 'GRAFICO_4');
}

export const fetchSheetDataForChart5 = async (url:string): Promise<SheetData> => {
    return fetchAndProcessSheet(url, 'GRAFICO_5');
}