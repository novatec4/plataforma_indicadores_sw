
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

export enum ChartType {
  BAR = 'BAR',
  LINE = 'LINE',
  PIE = 'PIE',
}

export interface ChartSuggestion {
  title: string;
  description: string;
  chartType: ChartType;
  xAxisKey?: string;
  yAxisKey?: string;
  nameKey?: string;
  dataKey?: string;
}

export interface Theme {
    id: string;
    name: string;
    colors: string[];
}
