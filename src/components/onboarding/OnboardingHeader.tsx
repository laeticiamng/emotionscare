
import React from 'react';

interface OnboardingHeaderProps {
  step: number;
  totalSteps: number;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ 
  step, 
  totalSteps 
}) => {
  return (
    <header className="py-6 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl text-primary">EmotionsCare</span>
      </div>
      <div className="text-sm text-muted-foreground">
        Étape {step + 1} de {totalSteps}
      </div>
    </header>
  );
};

export default OnboardingHeader;
