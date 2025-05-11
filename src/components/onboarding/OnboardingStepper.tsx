
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface OnboardingStepperProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  isLoading?: boolean;
  isLastStep?: boolean;
  onComplete?: () => void;
}

const OnboardingStepper: React.FC<OnboardingStepperProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  isLoading = false,
  isLastStep = false,
  onComplete
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="space-y-6">
      <Progress value={progress} className="mb-8" />
      
      <div className="container max-w-5xl mx-auto flex justify-between">
        <Button 
          variant="ghost" 
          onClick={onPrev}
          disabled={currentStep === 0 || isLoading}
        >
          Précédent
        </Button>
        
        {isLastStep ? (
          <Button 
            onClick={onComplete}
            disabled={isLoading}
          >
            {isLoading ? "Chargement..." : "Terminer"}
          </Button>
        ) : (
          <Button 
            onClick={onNext}
            disabled={isLoading}
          >
            {isLoading ? "Chargement..." : "Continuer"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingStepper;
