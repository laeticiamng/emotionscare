
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { OnboardingStep } from '@/types/onboarding';
import { defaultOnboardingSteps } from '@/data/onboardingSteps';
import { useToast } from '@/hooks/use-toast';

interface OnboardingContextType {
  steps: OnboardingStep[];
  currentStepIndex: number;
  isComplete: boolean;
  userResponses: Record<string, any>;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (index: number) => void;
  completeOnboarding: () => void;
  updateResponse: (stepId: string, response: any) => void;
  resetOnboarding: () => void;
  currentStep: OnboardingStep | null;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
  steps?: OnboardingStep[];
  initialStep?: number;
  onComplete?: () => void;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({
  children,
  steps = defaultOnboardingSteps,
  initialStep = 0,
  onComplete
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [isComplete, setIsComplete] = useState(false);
  const [userResponses, setUserResponses] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const currentStep = steps[currentStepIndex] || null;

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      
      // Afficher un toast d'encouragement pour certaines étapes
      if ([1, 3, steps.length - 2].includes(currentStepIndex + 1)) {
        toast({
          title: "Bonne progression !",
          description: `Étape ${currentStepIndex + 2}/${steps.length} - Continuez comme ça !`,
          variant: "success",
        });
      }
    } else {
      completeOnboarding();
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  };

  const completeOnboarding = () => {
    setIsComplete(true);
    
    // Sauvegarder la complétion dans le localStorage
    try {
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('onboardingResponses', JSON.stringify(userResponses));
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
    
    toast({
      title: "Formation complétée !",
      description: "Félicitations ! Vous avez terminé la formation.",
      variant: "success",
    });
    
    if (onComplete) {
      onComplete();
    }
  };

  const updateResponse = (stepId: string, response: any) => {
    setUserResponses(prev => ({
      ...prev,
      [stepId]: response
    }));
  };

  const resetOnboarding = () => {
    setCurrentStepIndex(0);
    setIsComplete(false);
    setUserResponses({});
    
    // Effacer les données du localStorage
    try {
      localStorage.removeItem('onboardingComplete');
      localStorage.removeItem('onboardingResponses');
    } catch (error) {
      console.error('Error removing onboarding data:', error);
    }
    
    toast({
      title: "Formation réinitialisée",
      description: "Vous pouvez recommencer la formation depuis le début.",
      variant: "info",
    });
  };

  return (
    <OnboardingContext.Provider
      value={{
        steps,
        currentStepIndex,
        isComplete,
        userResponses,
        nextStep,
        previousStep,
        goToStep,
        completeOnboarding,
        updateResponse,
        resetOnboarding,
        currentStep
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
