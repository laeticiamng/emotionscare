import React from 'react';
import type { InstrumentCode } from '@/lib/assess/types';

interface AssessCardProps {
  instrument: InstrumentCode;
  title: string;
  description: string;
  onStart: () => void;
}

export const AssessCard: React.FC<AssessCardProps> = ({ 
  instrument, 
  title, 
  description, 
  onStart 
}) => {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">
        <div className="text-sm text-blue-600 font-medium mb-1">
          {instrument}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
      </div>
      
      <p className="text-gray-600 text-sm mb-6">
        {description}
      </p>
      
      <button
        onClick={onStart}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Commencer l'évaluation
      </button>
    </div>
  );
};