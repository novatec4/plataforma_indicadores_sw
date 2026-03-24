import React from 'react';
import type { ChartSuggestion } from '@core/types';
import { ChartRenderer } from './ChartRenderer';

interface DashboardProps {
  charts: ChartSuggestion[];
  data: Record<string, string | number>[];
}

export const Dashboard: React.FC<DashboardProps> = ({ charts, data }) => {
  if (charts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8">
      {charts.map((chart, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg p-4 md:p-6 transition-all duration-500 ease-in-out">
          <ChartRenderer config={chart} data={data} />
        </div>
      ))}
    </div>
  );
};