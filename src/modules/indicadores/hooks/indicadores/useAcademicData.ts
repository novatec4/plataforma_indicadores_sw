import { useState, useMemo } from 'react';
import { AcademicPeriod, Kpi, ChartDataPoint } from '@core/types';

const formatPeriodLabel = (label: string | undefined): string => {
    if (!label) return '';

    const monthMap: { [key: string]: string } = {
        ENERO: 'Ene', FEBRERO: 'Feb', MARZO: 'Mar', ABRIL: 'Abr', MAYO: 'May', JUNIO: 'Jun',
        JULIO: 'Jul', AGOSTO: 'Ago', SEPTIEMBRE: 'Sep', OCTUBRE: 'Oct', NOVIEMBRE: 'Nov', DICIEMBRE: 'Dic',
        ENE: 'Ene', FEB: 'Feb', MAR: 'Mar', ABR: 'Abr', MAY: 'May', JUN: 'Jun',
        JUL: 'Jul', AGO: 'Ago', SEP: 'Sep', OCT: 'Oct', NOV: 'Nov', DIC: 'Dic'
    };
    
    const monthRegex = new RegExp(`\\b(${Object.keys(monthMap).join('|')})\\b`, 'i');
    const yearRegex = /(\d{4}|'\d{2})/;

    const fallbackFormat = (str: string) => str.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

    const parts = label.split(' - ');
    if (parts.length < 2) {
        return fallbackFormat(label);
    }
    
    const endPart = parts[1];
    const endPartYearMatch = endPart.match(yearRegex);
    const endYear = endPartYearMatch ? endPartYearMatch[0] : null;

    const formattedParts = parts.map((part, index) => {
        const monthMatch = part.match(monthRegex);
        let yearMatch = part.match(yearRegex);

        if (index === 0 && !yearMatch && endYear) {
            yearMatch = [endYear]; // Inherit year from the second part
        }
        
        if (monthMatch && yearMatch) {
            const month = monthMatch[0].toUpperCase();
            let year = yearMatch[0];
            if (year.startsWith("'")) year = year.substring(1);
            else if (year.length === 4) year = year.slice(-2);
            
            const monthKey = Object.keys(monthMap).find(k => k === month) as keyof typeof monthMap;
            return `${monthMap[monthKey]} '${year}`;
        }
        
        return fallbackFormat(part); // Fallback for the part if it doesn't match
    });

    return formattedParts.join(' - ');
};

const calculateTrendline = (data: ChartDataPoint[], key: string): ChartDataPoint[] => {
    const trendKey = `Tendencia ${key}`;
    const points = data.map((d, i) => ({ x: i, y: d[key] as number })).filter(p => p.y !== null && p.y !== undefined && !isNaN(p.y));
    
    if (points.length < 2) return data.map(d => ({ ...d, [trendKey]: null }));

    const n = points.length;
    const sumX = points.reduce((acc, p) => acc + p.x, 0);
    const sumY = points.reduce((acc, p) => acc + p.y, 0);
    const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
    const sumX2 = points.reduce((acc, p) => acc + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    if (isNaN(slope) || isNaN(intercept)) {
        return data.map(d => ({ ...d, [trendKey]: null }));
    }

    return data.map((d, i) => {
        // Find the original point index in the filtered `points` array
        const pointIndex = points.findIndex(p => p.x === i);
        if (pointIndex !== -1) {
            return { ...d, [trendKey]: slope * i + intercept };
        }
        return { ...d, [trendKey]: null };
    });
};

export const useAcademicData = (
    combinedAcademicData: AcademicPeriod[],
    annualGraduatesData: { anio: number; numeroGraduados: number; }[]
) => {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
    
    const availableYears = useMemo(() => {
        const yearsFromAcademic = combinedAcademicData.flatMap(p => p.descripcion.match(/\b(20\d{2})\b/g) || []);
        const yearsFromGraduates = annualGraduatesData.map(d => String(d.anio));
        const allYears = [...new Set([...yearsFromAcademic, ...yearsFromGraduates])];
        return allYears.sort();
    }, [combinedAcademicData, annualGraduatesData]);

    const [selectedYear, setSelectedYear] = useState<string>('all');

    const periodOptions = useMemo(() => 
        combinedAcademicData.filter(p => (p.valorRetencion ?? 0) > 0 || (p.valorTitulacion ?? 0) > 0),
        [combinedAcademicData]
    );

    const filteredAcademicData = useMemo(() => {
        if (selectedPeriod === 'all') return combinedAcademicData;
        return combinedAcademicData.filter(p => p.codigoPeriodo === selectedPeriod);
    }, [combinedAcademicData, selectedPeriod]);

    const trendsData = useMemo<ChartDataPoint[]>(() => 
        combinedAcademicData.map(p => ({
            name: formatPeriodLabel(p.descripcion),
            'Retención': p.valorRetencion,
            'Deserción': p.valorDesercion,
            'Titulación': p.valorTitulacion,
        })).filter(p => p.name !== formatPeriodLabel('15 SEPTIEMBRE 2025 - 13 FEBRERO 2026')),
        [combinedAcademicData]
    );

    const memoizedAnnualGraduatesData = useMemo<ChartDataPoint[]>(() => {
        const chartData = annualGraduatesData
            .filter(d => selectedPeriod === 'all' ? (selectedYear === 'all' || String(d.anio) === selectedYear) : true)
            .map(d => ({ name: String(d.anio), 'Graduados': d.numeroGraduados }));
        return calculateTrendline(chartData, 'Graduados');
    }, [annualGraduatesData, selectedYear, selectedPeriod]);

    const cohortData = useMemo<ChartDataPoint[]>(() => {
        // FIX: Explicitly type `data` as `ChartDataPoint[]` to prevent type inference conflicts
        // when reassigning the value returned from `calculateTrendline`.
        let data: ChartDataPoint[] = filteredAcademicData
            .map(p => ({
                name: formatPeriodLabel(p.descripcion),
                'Admitidos': p.admitidos,
                'Matriculados': p.matriculados,
            }))
            .filter(p => (p.Admitidos ?? 0) > 0 || (p.Matriculados ?? 0) > 0);
        
        data = calculateTrendline(data, 'Admitidos');
        data = calculateTrendline(data, 'Matriculados');
        return data;
    }, [filteredAcademicData]);
    
    const kpis = useMemo<Kpi[]>(() => {
        if (selectedPeriod === 'all') {
            if (combinedAcademicData.length < 2) return [];
            const relevantPeriods = combinedAcademicData.filter(p => (p.valorRetencion ?? 0) > 0 || (p.valorTitulacion ?? 0) > 0 || (p.matriculados ?? 0) > 0);
            if (relevantPeriods.length < 2) return [];
    
            const latestPeriod = relevantPeriods[relevantPeriods.length - 1];
            const previousPeriod = relevantPeriods[relevantPeriods.length - 2];

            const handleClick = () => setSelectedPeriod(latestPeriod.codigoPeriodo);
    
            const latestRetention = typeof latestPeriod.valorRetencion === 'number' ? latestPeriod.valorRetencion : 0;
            const previousRetention = typeof previousPeriod.valorRetencion === 'number' ? previousPeriod.valorRetencion : 0;
            const retentionTrend = latestRetention - previousRetention;

            const latestGraduation = typeof latestPeriod.valorTitulacion === 'number' ? latestPeriod.valorTitulacion : 0;
            const previousGraduation = typeof previousPeriod.valorTitulacion === 'number' ? previousPeriod.valorTitulacion : 0;
            const graduationTrend = latestGraduation - previousGraduation;

            const latestEnrolled = typeof latestPeriod.matriculados === 'number' ? latestPeriod.matriculados : 0;
            const previousEnrolled = typeof previousPeriod.matriculados === 'number' ? previousPeriod.matriculados : 0;
            const enrolledTrend = latestEnrolled - previousEnrolled;
    
            let graduatesKpi: Kpi = { 
                title: 'Graduados (Últ. Año)', 
                value: 'N/A', 
                icon: 'trophy', 
                color: 'amber',
                tooltip: 'Número total de estudiantes que obtuvieron su título en el año más reciente. Mide el resultado final del proceso formativo.'
            };
            if (annualGraduatesData.length >= 2) {
                const latestYear = annualGraduatesData[annualGraduatesData.length - 1];
                const previousYear = annualGraduatesData[annualGraduatesData.length - 2];
                const latestGraduatesCount = typeof latestYear.numeroGraduados === 'number' ? latestYear.numeroGraduados : 0;
                const previousGraduatesCount = typeof previousYear.numeroGraduados === 'number' ? previousYear.numeroGraduados : 0;
                const graduatesTrend = latestGraduatesCount - previousGraduatesCount;
                graduatesKpi = {
                    ...graduatesKpi,
                    value: latestGraduatesCount.toString(),
                    trend: graduatesTrend >= 0 ? 'up' : 'down',
                    trendValue: `${Math.abs(graduatesTrend)}`,
                    trendLabel: 'vs año anterior'
                };
            } else if (annualGraduatesData.length === 1) {
                const latestGraduatesCount = typeof annualGraduatesData[0].numeroGraduados === 'number' ? annualGraduatesData[0].numeroGraduados : 0;
                graduatesKpi.value = latestGraduatesCount.toString();
            }
    
            return [
                { title: 'Tasa de Retención (Últ. Periodo)', value: `${latestRetention.toFixed(2)}%`, icon: 'handshake', color: 'blue', trend: retentionTrend >= 0 ? 'up' : 'down', trendValue: `${Math.abs(retentionTrend).toFixed(2)} pp`, onClick: handleClick, tooltip: 'Mide el porcentaje de estudiantes que continúan sus estudios de un período a otro. Un valor alto indica una buena permanencia estudiantil.' },
                { title: 'Tasa de Titulación (Últ. Periodo)', value: `${latestGraduation.toFixed(2)}%`, icon: 'mortarboard', color: 'green', trend: graduationTrend >= 0 ? 'up' : 'down', trendValue: `${Math.abs(graduationTrend).toFixed(2)} pp`, onClick: handleClick, tooltip: 'Representa el porcentaje de estudiantes de una cohorte que completan exitosamente su programa. Es un indicador clave del éxito académico.' },
                { title: 'Matriculados (Últ. Periodo)', value: latestEnrolled.toString(), icon: 'people', color: 'indigo', trend: enrolledTrend >= 0 ? 'up' : 'down', trendValue: `${Math.abs(enrolledTrend)}`, onClick: handleClick, tooltip: 'Número total de estudiantes matriculados en el último período académico. Refleja la demanda y capacidad de la carrera.' },
                graduatesKpi,
            ];
        } else {
            const periodData = combinedAcademicData.find(p => p.codigoPeriodo === selectedPeriod);
            if (!periodData) return [];
    
            const currentRetention = typeof periodData.valorRetencion === 'number' ? periodData.valorRetencion : 0;
            const currentGraduation = typeof periodData.valorTitulacion === 'number' ? periodData.valorTitulacion : 0;
            const currentEnrolled = typeof periodData.matriculados === 'number' ? periodData.matriculados : 0;
            const currentAdmitted = typeof periodData.admitidos === 'number' ? periodData.admitidos : 0;

            let retencionKpi: Kpi = { title: `Tasa de Retención (${periodData.codigoPeriodo})`, value: `${currentRetention.toFixed(2)}%`, icon: 'handshake', color: 'blue', tooltip: 'Porcentaje de estudiantes que continuaron sus estudios en este período.' };
            let titulacionKpi: Kpi = { title: `Tasa de Titulación (${periodData.codigoPeriodo})`, value: `${currentGraduation.toFixed(2)}%`, icon: 'mortarboard', color: 'green', tooltip: 'Porcentaje de estudiantes de la cohorte que se titularon en este período.' };
            let matriculadosKpi: Kpi = { title: `Matriculados (${periodData.codigoPeriodo})`, value: currentEnrolled.toString(), icon: 'people', color: 'indigo', tooltip: 'Número total de estudiantes matriculados en este período.' };
            let admitidosKpi: Kpi = { title: `Admitidos (${periodData.codigoPeriodo})`, value: currentAdmitted.toString(), icon: 'check', color: 'amber', tooltip: 'Número de nuevos estudiantes admitidos en este período.' };
    
            const currentIndex = combinedAcademicData.findIndex(p => p.codigoPeriodo === selectedPeriod);
            if (currentIndex > 0) {
                const previousPeriodData = combinedAcademicData[currentIndex - 1];
    
                const prevRetention = typeof previousPeriodData.valorRetencion === 'number' ? previousPeriodData.valorRetencion : 0;
                const retencionDiff = currentRetention - prevRetention;
                retencionKpi = { ...retencionKpi, trend: retencionDiff >= 0 ? 'up' : 'down', trendValue: `${Math.abs(retencionDiff).toFixed(2)} pp` };

                const prevGraduation = typeof previousPeriodData.valorTitulacion === 'number' ? previousPeriodData.valorTitulacion : 0;
                const titulacionDiff = currentGraduation - prevGraduation;
                titulacionKpi = { ...titulacionKpi, trend: titulacionDiff >= 0 ? 'up' : 'down', trendValue: `${Math.abs(titulacionDiff).toFixed(2)} pp` };
                
                const prevEnrolled = typeof previousPeriodData.matriculados === 'number' ? previousPeriodData.matriculados : 0;
                const matriculadosDiff = currentEnrolled - prevEnrolled;
                matriculadosKpi = { ...matriculadosKpi, trend: matriculadosDiff >= 0 ? 'up' : 'down', trendValue: `${Math.abs(matriculadosDiff)}` };
    
                const prevAdmitted = typeof previousPeriodData.admitidos === 'number' ? previousPeriodData.admitidos : 0;
                const admitidosDiff = currentAdmitted - prevAdmitted;
                admitidosKpi = { ...admitidosKpi, trend: admitidosDiff >= 0 ? 'up' : 'down', trendValue: `${Math.abs(admitidosDiff)}` };
            }
    
            return [retencionKpi, titulacionKpi, matriculadosKpi, admitidosKpi];
        }
    }, [combinedAcademicData, selectedPeriod, annualGraduatesData]);

    return {
        selectedPeriod,
        setSelectedPeriod,
        kpis,
        trendsData,
        annualGraduatesData: memoizedAnnualGraduatesData,
        cohortData,
        periodOptions,
        availableYears,
        selectedYear,
        setSelectedYear,
    };
};