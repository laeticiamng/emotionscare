
import React from 'react';
import {
  OnboardingProvider,
  useOnboarding,
  OnboardingStep
} from '@/contexts/OnboardingContext';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import OnboardingContent from '@/components/onboarding/OnboardingContent';
import OnboardingStepper from '@/components/onboarding/OnboardingStepper';
import { useNavigate } from 'react-router-dom';

const steps: OnboardingStep[] = [
  { id: 'welcome', title: 'Bienvenue' },
  { id: 'assessment', title: 'Évaluation émotionnelle' },
  { id: 'features', title: 'Découverte' },
  { id: 'personalize', title: 'Personnalisation' },
  { id: 'complete', title: 'Finalisation' }
];

const ExperienceInner: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    steps: ctxSteps,
    loading,
    emotion,
    userResponses,
    nextStep,
    previousStep,
    handleResponse,
    completeOnboarding
  } = useOnboarding();

  const handleComplete = async () => {
    const success = await completeOnboarding();
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <OnboardingHeader step={currentStep} totalSteps={ctxSteps.length} />
      <OnboardingContent
        step={currentStep}
        loading={loading}
        emotion={emotion}
        userResponses={userResponses}
        nextStep={nextStep}
        prevStep={previousStep}
        handleResponse={handleResponse}
        completeOnboarding={handleComplete}
      />
      <OnboardingStepper
        currentStep={currentStep}
        totalSteps={ctxSteps.length}
        onNext={nextStep}
        onPrev={previousStep}
        isLoading={loading}
        isLastStep={currentStep === ctxSteps.length - 1}
        onComplete={handleComplete}
      />
    </div>
  );
};

const OnboardingExperiencePage: React.FC = () => (
  <OnboardingProvider steps={steps}>
    <ExperienceInner />
  </OnboardingProvider>
);

export default OnboardingExperiencePage;
