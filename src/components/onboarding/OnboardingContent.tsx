
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import WelcomeSection from '@/components/onboarding/WelcomeSection';
import EmotionalAssessment from '@/components/onboarding/EmotionalAssessment';
import FeaturesTour from '@/components/onboarding/FeaturesTour';
import PersonalizationSection from '@/components/onboarding/PersonalizationSection';
import CompletionSection from '@/components/onboarding/CompletionSection';

interface OnboardingContentProps {
  step: number;
  loading: boolean;
  emotion: string;
  userResponses: Record<string, any>;
  nextStep: () => void;
  prevStep: () => void;
  handleResponse: (key: string, value: any) => void;
  completeOnboarding: () => Promise<void>;
}

const OnboardingContent: React.FC<OnboardingContentProps> = ({
  step,
  loading,
  emotion,
  userResponses,
  nextStep,
  prevStep,
  handleResponse,
  completeOnboarding
}) => {
  // Create a video reference to pass to WelcomeSection
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <WelcomeSection 
            onContinue={nextStep} 
            onResponse={handleResponse}
            videoRef={videoRef}
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
  );
};

export default OnboardingContent;
