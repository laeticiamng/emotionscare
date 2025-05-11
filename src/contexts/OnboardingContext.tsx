
import React, { createContext, useContext, useState } from 'react';

// Define the step structure
export interface OnboardingStep {
  id: string;
  title: string;
  content: React.ReactNode;
  required?: boolean;
}

// Define the context type
interface OnboardingContextType {
  currentStep: number;
  steps: OnboardingStep[];
  nextStep: () => boolean;
  previousStep: () => boolean;
  goToStep: (step: number) => boolean;
  isStepCompleted: (step: number) => boolean;
  completeOnboarding: () => Promise<boolean>;
  // Added properties that were causing errors
  loading: boolean;
  emotion: string;
  intensity: number;
  userResponses: Record<string, any>;
  handleResponse: (key: string, value: any) => void;
}

// Create context with default values
const OnboardingContext = createContext<OnboardingContextType>({
  currentStep: 0,
  steps: [],
  nextStep: () => false,
  previousStep: () => false,
  goToStep: () => false,
  isStepCompleted: () => false,
  completeOnboarding: async () => false,
  loading: false,
  emotion: '',
  intensity: 0,
  userResponses: {},
  handleResponse: () => {},
});

// Provider component
export const OnboardingProvider: React.FC<{
  children: React.ReactNode;
  steps: OnboardingStep[];
}> = ({ children, steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [userResponses, setUserResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState('');
  const [intensity, setIntensity] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps([...completedSteps, currentStep]);
      return true;
    }
    return false;
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      return true;
    }
    return false;
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
      return true;
    }
    return false;
  };

  const isStepCompleted = (step: number) => {
    return completedSteps.includes(step);
  };

  const handleResponse = (key: string, value: any) => {
    setUserResponses({
      ...userResponses,
      [key]: value,
    });
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      // Here you would typically save the onboarding data to your backend
      console.log('Onboarding completed with responses:', userResponses);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        steps,
        nextStep,
        previousStep,
        goToStep,
        isStepCompleted,
        completeOnboarding,
        loading,
        emotion,
        intensity,
        userResponses,
        handleResponse,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

// Hook for using the onboarding context
export const useOnboarding = () => useContext(OnboardingContext);

export default OnboardingContext;
