import React from 'react';

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  onGenerate: () => void;
  disabled: boolean;
}

const GenerateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="m9 12 2 2 4-4"/>
    </svg>
);

export const UrlInput: React.FC<UrlInputProps> = ({ url, setUrl, onGenerate, disabled }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://docs.google.com/spreadsheets/..."
        className="flex-grow w-full px-4 py-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
        disabled={disabled}
      />
      <button
        onClick={onGenerate}
        disabled={disabled}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed transition-all duration-300"
      >
        <GenerateIcon className="h-5 w-5"/>
        <span>Generate Dashboard</span>
      </button>
    </div>
  );
};