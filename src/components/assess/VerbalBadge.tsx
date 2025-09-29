import React from 'react';

interface VerbalBadgeProps {
  level: number;
  summary: string;
  instrument: string;
}

export const VerbalBadge: React.FC<VerbalBadgeProps> = ({ 
  level, 
  summary, 
  instrument 
}) => {
  const getColorClass = (level: number) => {
    switch (level) {
      case 0: return 'bg-red-100 text-red-800 border-red-200';
      case 1: return 'bg-orange-100 text-orange-800 border-orange-200';
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 3: return 'bg-green-100 text-green-800 border-green-200';
      case 4: return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getColorClass(level)}`}>
      <span className="font-medium mr-2">{instrument}</span>
      <span>{summary}</span>
    </div>
  );
};