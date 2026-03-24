import { AcademicPeriod, QualityIndicator, QualityIndicatorCategories } from '@core/types';

// --- Google Sheets Configuration ---
const SPREADSHEET_ID = '1-potr-yo3F9GeFzR-a-YLXlnu6YHEoYSe9nUIsKMRo0';
// This is a public, read-only API key. It's safe to be in the frontend code.
const SHEETS_API_KEY = 'AIzaSyDLIhC4_JNwSef39N1oE1aD-lKDHHG37Bg'; 
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values`;

// --- Data Parsing Helpers ---
const parseSheetData = (data: string[][]): any[] => {
    if (!data || data.length < 2) return [];
    const headers = data[0].map(h => {
        if (!h) return '';
        const trimmed = h.trim();
        if (!trimmed) return '';
        return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
    });

    const rows = data.slice(1);
    return rows.map(row => {
        const obj: { [key: string]: any } = {};
        headers.forEach((header, index) => {
            if (header) {
                const value = row[index];
                let processedValue: string | number | null = value;
                
                if (typeof processedValue === 'string') {
                    processedValue = processedValue.trim().replace(/%/g, '').replace(/,/g, '.');
                }

                if (processedValue && !isNaN(Number(processedValue)) && !/[-/]/.test(value || '') && String(processedValue).trim() !== '') {
                     obj[header] = Number(processedValue);
                } else {
                     obj[header] = value === undefined ? null : value;
                }
            }
        });
        return obj;
    });
};

const parseQualityIndicators = (data: string[][]): QualityIndicator[] => {
    if (!data || data.length < 2) return [];
    const headers = data[0];
    const rows = data.slice(1);

    const indicatorMap = new Map<string, QualityIndicator>();

    const headerMap = headers.reduce((acc, header, index) => {
        acc[header.trim()] = index;
        return acc;
    }, {} as {[key: string]: number});

    const requiredHeaders = ['idIndicador', 'titulo', 'descripcion', 'idValor', 'valor', 'nombrePeriodo'];
    for(const h of requiredHeaders) {
        if(headerMap[h] === undefined) {
            console.error(`Missing required header in 'Indicadores Calidad' sheet: ${h}`);
            return [];
        }
    }

    rows.forEach(row => {
        const titulo = row[headerMap['titulo']];
        if (!titulo) return;

        if (!indicatorMap.has(titulo)) {
            indicatorMap.set(titulo, {
                idIndicador: Number(row[headerMap['idIndicador']]),
                titulo: titulo,
                descripcion: row[headerMap['descripcion']],
                periodos: []
            });
        }
        
        const valueStr = row[headerMap['valor']];
        const value = (valueStr !== undefined && valueStr !== null && valueStr.trim() !== '') ? Number(valueStr.replace(/,/g, '.')) : null;
        const nombrePeriodo = row[headerMap['nombrePeriodo']];

        if (value !== null && !isNaN(value) && nombrePeriodo) {
            const indicator = indicatorMap.get(titulo)!;
            indicator.periodos.push({
                idValor: Number(row[headerMap['idValor']]),
                valor: value,
                nombrePeriodo: nombrePeriodo
            });
        }
    });

    return Array.from(indicatorMap.values());
};

const parseQualityCategories = (data: string[][]): QualityIndicatorCategories => {
    if (!data || data.length < 2) return {};
    const rows = data.slice(1);
    const categories: QualityIndicatorCategories = {};
    rows.forEach(row => {
        const [category, indicator] = row;
        if (category && indicator) {
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(indicator);
        }
    });
    return categories;
}

/**
 * Fetches and processes all required data from the Google Sheets API for the dashboard.
 * @returns A promise that resolves to an object containing all the parsed dashboard data.
 */
export const fetchDashboardData = async () => {
    const mainRanges = ['Indicadores Carrera', 'Admitidos', 'Matriculados', 'Graduados', 'Indicadores Calidad'];
    const categoryRange = 'Categorias Indicadores Calidad';

    const mainResponses = await Promise.all(
        mainRanges.map(range => fetch(`${BASE_URL}/${encodeURIComponent(range)}?key=${SHEETS_API_KEY}`))
    );

    for (const response of mainResponses) {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Google Sheets API error: ${errorData.error.message}`);
        }
    }
    
    const mainJsonData = await Promise.all(mainResponses.map(res => res.json()));
    const [rawAcademic, rawAdmitted, rawEnrolled, rawGraduates, rawQuality] = mainJsonData.map(d => d.values);
    
    let rawCategories: string[][] = [];
    try {
        const categoryResponse = await fetch(`${BASE_URL}/${encodeURIComponent(categoryRange)}?key=${SHEETS_API_KEY}`);
        if (categoryResponse.ok) {
            const categoryJson = await categoryResponse.json();
            rawCategories = categoryJson.values || [];
        } else {
             console.warn("Could not fetch 'Categorias Indicadores Calidad' sheet. It may be missing or private. Defaulting to basic categorization.");
        }
    } catch (categoryError) {
        console.warn("Error fetching 'Categorias Indicadores Calidad' sheet, defaulting to basic categorization:", categoryError);
    }

    const academicData: Omit<AcademicPeriod, 'admitidos' | 'matriculados'>[] = parseSheetData(rawAcademic);
    const admittedData: { codPeriodo: string, cantidad: number }[] = parseSheetData(rawAdmitted);
    const enrolledData: { codPeriodo: string, cantidad: number }[] = parseSheetData(rawEnrolled);
    
    const annualGraduatesData = parseSheetData(rawGraduates);
    const qualityIndicatorsData = parseQualityIndicators(rawQuality);
    const qualityIndicatorCategories = parseQualityCategories(rawCategories);

    const combinedAcademicData = academicData.map(period => ({
        ...period,
        admitidos: admittedData.find(a => a.codPeriodo === period.codigoPeriodo)?.cantidad || 0,
        matriculados: enrolledData.find(e => e.codPeriodo === period.codigoPeriodo)?.cantidad || 0,
    }));

    return {
        combinedAcademicData,
        annualGraduatesData,
        qualityIndicatorsData,
        qualityIndicatorCategories
    };
};
