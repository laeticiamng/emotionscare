
import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import OnboardingStepper from '@/components/onboarding/OnboardingStepper';

// Onboarding sections
import WelcomeSection from '@/components/onboarding/WelcomeSection';
import EmotionalAssessment from '@/components/onboarding/EmotionalAssessment';
import FeaturesTour from '@/components/onboarding/FeaturesTour';
import PersonalizationSection from '@/components/onboarding/PersonalizationSection';
import CompletionSection from '@/components/onboarding/CompletionSection';

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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const totalSteps = 5;
  
  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <WelcomeSection 
            onContinue={nextStep} 
            videoRef={videoRef}
            onResponse={handleResponse}
          />
        );
      case 1:
        return (
          <EmotionalAssessment 
            onContinue={nextStep} 
            onBack={prevStep}
            onResponse={handleResponse}
            loading={loading}
          />
        );
      case 2:
        return (
          <FeaturesTour 
            onContinue={nextStep} 
            onBack={prevStep}
            emotion={emotion}
            onResponse={handleResponse}
          />
        );
      case 3:
        return (
          <PersonalizationSection 
            onContinue={nextStep} 
            onBack={prevStep}
            emotion={emotion}
            onResponse={handleResponse}
          />
        );
      case 4:
        return (
          <CompletionSection 
            onFinish={completeOnboarding} 
            onBack={prevStep}
            emotion={emotion}
            responses={userResponses}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <header className="py-6 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-primary">EmotionsCare</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Étape {step + 1} de {totalSteps}
        </div>
      </header>

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
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full mt-8"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default OnboardingExperiencePage;
