import React from 'react';
import type { ChartSuggestion } from '@core/types';
import { ChartType } from '@core/types';

interface SuggestionCardProps {
  suggestion: ChartSuggestion;
  onAdd: (suggestion: ChartSuggestion) => void;
}

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const BarChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="20" y2="10" />
        <line x1="18" x2="18" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
);

const LineChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
    </svg>
);

const PieChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
);

const CHART_ICONS: Record<ChartType, React.FC<React.SVGProps<SVGSVGElement>>> = {
  [ChartType.BAR]: BarChartIcon,
  [ChartType.LINE]: LineChartIcon,
  [ChartType.PIE]: PieChartIcon,
};

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onAdd }) => {
  const Icon = CHART_ICONS[suggestion.chartType] || BarChartIcon;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-between transition-transform transform hover:-translate-y-1 hover:shadow-2xl duration-300">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-primary-100 rounded-full">
            <Icon className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{suggestion.title}</h3>
            <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">{suggestion.chartType} Chart</span>
          </div>
        </div>
        <p className="text-gray-600 min-h-[60px]">
          {suggestion.description}
        </p>
      </div>
      <div className="bg-gray-50 p-4">
        <button
          onClick={() => onAdd(suggestion)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <PlusIcon className="h-5 w-5"/>
          Add to Dashboard
        </button>
      </div>
    </div>
  );
};