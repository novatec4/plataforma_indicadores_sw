export interface SheetData {
  headers: string[];
  rows: Record<string, string | number>[];
}

export enum AppState {
    INITIAL,
    LOADING_DATA,
    ANALYZING_DATA,
    SHOWING_DASHBOARD,
    ERROR,
}

// FIX: Added missing ChartType enum.
export enum ChartType {
  BAR = 'BAR',
  LINE = 'LINE',
  PIE = 'PIE',
}

// FIX: Added missing ChartSuggestion interface.
export interface ChartSuggestion {
  title: string;
  description: string;
  chartType: ChartType;
  xAxisKey?: string;
  yAxisKey?: string;
  nameKey?: string;
  dataKey?: string;
}

export enum AppModule {
  EVALUACION_DOCENTE = 'evaluacion_docente',
  INDICADORES_ACADEMICOS = 'indicadores_academicos',
  VINCULACION = 'vinculacion',
  TITULACION = 'titulacion',
}
