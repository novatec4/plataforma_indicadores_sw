export interface Kpi {
    title: string;
    value: string;
    icon: string;
    color: 'blue' | 'green' | 'amber' | 'indigo';
    trend?: 'up' | 'down';
    trendValue?: string;
    trendLabel?: string;
    onClick?: () => void;
    tooltip?: string;
}

export interface ChartDataPoint {
    name: string;
    [key: string]: string | number | null | undefined;
}

export interface AcademicPeriod {
    codigoPeriodo: string;
    descripcion: string;
    valorRetencion?: number;
    valorDesercion?: number;
    valorTitulacion?: number;
    admitidos: number;
    matriculados: number;
}

export interface QualityIndicatorPeriod {
    idValor: number;
    valor: number | null;
    nombrePeriodo: string;
}

export interface QualityIndicator {
    idIndicador: number;
    titulo: string;
    descripcion: string;
    periodos: QualityIndicatorPeriod[];
}

export interface QualityIndicatorCategories {
    [category: string]: string[];
}

export type AnalysisType = 'academic' | 'quality';
