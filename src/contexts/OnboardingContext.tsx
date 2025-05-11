
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface OnboardingStep {
  id: string;
  title: string;
  content: React.ReactNode;
  completed?: boolean;
}

interface OnboardingContextType {
  currentStep: number;
  steps: OnboardingStep[];
  nextStep: () => boolean;
  previousStep: () => boolean;
  goToStep: (step: number) => boolean;
  isStepCompleted: (step: number) => boolean;
  markStepCompleted: (step: number) => void;
  emotion: string;
  intensity: number;
  handleResponse: (key: string, value: any) => void;
  userResponses: Record<string, any>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  completeOnboarding: () => Promise<boolean>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export interface OnboardingProviderProps {
  children: ReactNode;
  initialSteps?: OnboardingStep[];
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({
  children,
  initialSteps = []
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>(initialSteps);
  const [userResponses, setUserResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState('');
  const [intensity, setIntensity] = useState(50);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
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
    return steps[step]?.completed || false;
  };

  const markStepCompleted = (step: number) => {
    const updatedSteps = [...steps];
    if (updatedSteps[step]) {
      updatedSteps[step].completed = true;
      setSteps(updatedSteps);
    }
  };

  const handleResponse = (key: string, value: any) => {
    setUserResponses(prev => ({
      ...prev,
      [key]: value
    }));
    
    if (key === 'emotion') {
      setEmotion(value);
    }
    
    if (key === 'intensity') {
      setIntensity(value);
    }
  };

  const completeOnboarding = async (): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulate API call to save onboarding data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to dashboard after completion
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingContext.Provider value={{
      currentStep,
      steps,
      nextStep,
      previousStep,
      goToStep,
      isStepCompleted,
      markStepCompleted,
      emotion,
      intensity,
      handleResponse,
      userResponses,
      loading,
      setLoading,
      completeOnboarding
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
