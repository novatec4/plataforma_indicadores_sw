import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { ChartSuggestion } from '@core/types';
import { ChartType } from '@core/types';

interface ChartRendererProps {
  config: ChartSuggestion;
  data: Record<string, string | number>[];
}

const COLORS = ['#3b82f6', '#84cc16', '#ef4444', '#f97316', '#8b5cf6', '#14b8a6', '#ec4899'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white border border-gray-200 rounded-md shadow-lg">
          <p className="font-bold text-gray-800">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
             <p key={`item-${index}`} style={{ color: entry.color }}>
                {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
  
    return null;
  };

export const ChartRenderer: React.FC<ChartRendererProps> = ({ config, data }) => {
  const renderChart = () => {
    switch (config.chartType) {
      case ChartType.BAR:
        if (!config.xAxisKey || !config.yAxisKey) return <p>Chart configuration is invalid.</p>;
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis dataKey={config.xAxisKey} tick={{ fill: '#6b7280' }} />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(219, 234, 254, 0.4)'}} />
            <Legend />
            <Bar dataKey={config.yAxisKey} fill="#3b82f6" name={config.yAxisKey} />
          </BarChart>
        );
      case ChartType.LINE:
        if (!config.xAxisKey || !config.yAxisKey) return <p>Chart configuration is invalid.</p>;
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis dataKey={config.xAxisKey} tick={{ fill: '#6b7280' }} />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey={config.yAxisKey} stroke="#3b82f6" strokeWidth={2} name={config.yAxisKey} dot={{ r: 4 }} activeDot={{ r: 8 }}/>
          </LineChart>
        );
      case ChartType.PIE:
        if (!config.nameKey || !config.dataKey) return <p>Chart configuration is invalid.</p>;
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={config.dataKey}
              nameKey={config.nameKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              // FIX: Explicitly convert label to a string to satisfy Recharts' typing for the label prop.
              label={(entry) => String(entry[config.nameKey!])}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        );
      default:
        return <p>Unsupported chart type.</p>;
    }
  };

  return (
    <>
      <h4 className="text-lg font-bold text-gray-800 mb-1">{config.title}</h4>
      <p className="text-sm text-gray-500 mb-4">{config.description}</p>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </>
  );
};