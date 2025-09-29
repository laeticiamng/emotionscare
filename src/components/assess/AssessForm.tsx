import React, { useState } from 'react';
import type { InstrumentCode, InstrumentItem } from '@/lib/assess/types';

interface AssessFormProps {
  items: InstrumentItem[];
  onSubmit: (responses: Record<string, number>) => void;
  instrument: InstrumentCode;
}

export const AssessForm: React.FC<AssessFormProps> = ({ items, onSubmit, instrument }) => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = items[currentIndex];
  const isLastItem = currentIndex === items.length - 1;
  const progress = ((currentIndex + 1) / items.length) * 100;

  const handleResponse = (value: number) => {
    const newResponses = {
      ...responses,
      [currentItem.id]: value
    };
    setResponses(newResponses);

    if (isLastItem) {
      onSubmit(newResponses);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const renderInput = () => {
    if (currentItem.type === 'scale' || currentItem.type === 'slider') {
      const min = currentItem.min ?? 0;
      const max = currentItem.max ?? 4;
      
      return (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 flex justify-between">
            <span>{min}</span>
            <span>{max}</span>
          </div>
          <div className="flex justify-center space-x-2">
            {Array.from({ length: max - min + 1 }, (_, i) => {
              const value = min + i;
              return (
                <button
                  key={value}
                  onClick={() => handleResponse(value)}
                  className="w-12 h-12 rounded-full border-2 border-blue-300 hover:bg-blue-100 focus:bg-blue-200 transition-colors"
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (currentItem.type === 'choice' && currentItem.options) {
      return (
        <div className="space-y-2">
          {currentItem.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleResponse(index)}
              className="w-full p-3 text-left border rounded hover:bg-gray-50 focus:bg-gray-100 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentIndex + 1} sur {items.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="mb-6">
          <div className="text-sm text-blue-600 font-medium mb-2">
            {instrument}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {currentItem.prompt}
          </h2>
        </div>

        {renderInput()}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <span className="text-sm text-gray-500">
            {isLastItem ? 'Dernière question' : 'Cliquez pour continuer'}
          </span>
        </div>
      </div>
    </div>
  );
};