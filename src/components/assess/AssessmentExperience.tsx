import React from 'react';
import type { InstrumentCode } from '@/lib/assess/types';
import { AssessmentWrapper } from './AssessmentWrapper';

interface AssessmentExperienceProps {
  instrument: InstrumentCode;
  onComplete: (result: any) => void;
}

export const AssessmentExperience: React.FC<AssessmentExperienceProps> = ({ 
  instrument, 
  onComplete 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Évaluation {instrument}
          </h1>
          <p className="text-gray-600">
            Évaluation basée sur des recherches validées scientifiquement
          </p>
        </div>
        
        <AssessmentWrapper
          instrument={instrument}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
};