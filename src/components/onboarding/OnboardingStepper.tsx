// @ts-nocheck
import React from 'react';
import { Check } from 'lucide-react';

interface OnboardingStepperProps {
  currentStep: number;
  totalSteps?: number;
}

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ 
  currentStep, 
  totalSteps = 6 
}) => {
  return (
    <nav aria-label="Progression de l'accueil" className="mb-8">
      <ol className="flex items-center justify-center space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          
          return (
            <li key={stepNum} className="flex items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isCompleted 
                    ? 'bg-primary text-primary-foreground' 
                    : isCurrent 
                    ? 'bg-primary/20 text-primary border-2 border-primary' 
                    : 'bg-muted text-muted-foreground'
                  }
                  transition-colors
                `}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  stepNum
                )}
              </div>
              
              {index < totalSteps - 1 && (
                <div 
                  className={`
                    w-8 h-0.5 ml-2
                    ${isCompleted ? 'bg-primary' : 'bg-muted'}
                    transition-colors
                  `} 
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};