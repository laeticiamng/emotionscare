
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import OnboardingStepper from '@/components/onboarding/OnboardingStepper';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import OnboardingContent from '@/components/onboarding/OnboardingContent';

const OnboardingExperiencePage: React.FC = () => {
  const {
    step,
    loading,
    emotion,
    intensity,
    userResponses,
    nextStep,
    prevStep,
    handleResponse,
    completeOnboarding,
  } = useOnboardingState();
  
  const totalSteps = 5;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <OnboardingHeader step={step} totalSteps={totalSteps} />

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <OnboardingStepper 
          currentStep={step}
          totalSteps={totalSteps}
          onNext={nextStep}
          onPrev={prevStep}
          isLoading={loading}
          isLastStep={step === totalSteps - 1}
          onComplete={completeOnboarding}
        />
        
        <AnimatePresence mode="wait">
          <OnboardingContent
            step={step}
            loading={loading}
            emotion={emotion}
            userResponses={userResponses}
            nextStep={nextStep}
            prevStep={prevStep}
            handleResponse={handleResponse}
            completeOnboarding={completeOnboarding}
          />
        </AnimatePresence>
      </main>
    </div>
  );
};

export default OnboardingExperiencePage;
