import React from 'react';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import { StepWelcome } from '@/components/onboarding/StepWelcome';
import { StepProfile } from '@/components/onboarding/StepProfile';
import { StepGoals } from '@/components/onboarding/StepGoals';
import { StepSensors } from '@/components/onboarding/StepSensors';
import { StepNotifications } from '@/components/onboarding/StepNotifications';
import { StepSummary } from '@/components/onboarding/StepSummary';
import { useOnboarding } from '@/hooks/useOnboarding';

const OnboardingPage: React.FC = () => {
  const { 
    currentStep, 
    next, 
    prev, 
    skip, 
    saveProfile, 
    saveGoals,
    saveSensors,
    complete 
  } = useOnboarding();


  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto py-8">
        <OnboardingStepper currentStep={currentStep + 1} totalSteps={6} />
        
        {currentStep === 0 && (
          <StepWelcome onNext={next} onSkip={skip} />
        )}
        
        {currentStep === 1 && (
          <StepProfile 
            onSubmit={async (profile) => {
              await saveProfile(profile);
              next();
            }}
            onBack={prev}
          />
        )}
        
        {currentStep === 2 && (
          <StepGoals 
            onSubmit={async (goals) => {
              await saveGoals(goals);
              next();
            }}
            onBack={prev}
          />
        )}
        
        {currentStep === 3 && (
          <StepSensors 
            onNext={next}
            onBack={prev}
          />
        )}

        {currentStep === 4 && (
          <StepNotifications 
            onNext={next}
            onBack={prev}
          />
        )}
        
        {currentStep === 5 && (
          <StepSummary 
            onFinish={async () => {
              await complete();
            }}
            onBack={prev}
          />
        )}
      </div>
    </main>
  );
};

export default OnboardingPage;