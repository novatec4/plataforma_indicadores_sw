import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const AlertTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <div className="flex justify-center mb-4">
            <AlertTriangleIcon className="h-10 w-10 text-red-500"/>
        </div>
      <h3 className="text-xl font-semibold text-red-800">Ocurrió un error</h3>
      <p className="mt-2 text-red-600 max-w-lg mx-auto">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
      >
        Intentar de nuevo
      </button>
    </div>
  );
};