import React from 'react';

interface AnalysisReportProps {
  analysis: string;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ analysis }) => {
  const formattedAnalysis = analysis.split('\n').map((line, index) => {
    line = line.trim();
    if (line.startsWith('**') && line.endsWith('**')) {
      return <h4 key={index} className="text-xl font-bold text-slate-800 mt-6 mb-3">{line.replace(/\*\*/g, '')}</h4>;
    }
    if (line.startsWith('* ')) {
      return <li key={index} className="ml-5 list-disc mb-2 text-slate-600">{line.substring(2)}</li>;
    }
    if (line === '') {
      return null;
    }
    return <p key={index} className="mb-3 text-slate-700 leading-relaxed">{line}</p>;
  });

  return (
    <article className="prose prose-slate max-w-none">
      <div className="space-y-2">
          {formattedAnalysis}
      </div>
    </article>
  );
};