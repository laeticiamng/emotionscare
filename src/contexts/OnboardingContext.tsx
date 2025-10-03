// @ts-nocheck

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  content: React.ReactNode;
  isComplete: boolean;
}

interface OnboardingContextType {
  steps: OnboardingStep[];
  currentStep: number;
  loading: boolean;
  emotion: string;
  intensity: number;
  userResponses: Record<string, any>;
  nextStep: () => void;
  previousStep: () => void;
  handleResponse: (key: string, value: any) => void;
  completeOnboarding: () => Promise<boolean>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState('');
  const [intensity, setIntensity] = useState(0);
  const [userResponses, setUserResponses] = useState<Record<string, any>>({});
  
  const { user } = useAuth();
  const { toast } = useToast();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bienvenue',
      content: <div>Bienvenue dans votre parcours de bien-être</div>,
      isComplete: false,
    },
    {
      id: 'goals',
      title: 'Vos objectifs',
      content: <div>Définissez vos objectifs de bien-être</div>,
      isComplete: false,
    },
    {
      id: 'preferences',
      title: 'Préférences',
      content: <div>Configurez vos préférences</div>,
      isComplete: false,
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleResponse = (key: string, value: any) => {
    setUserResponses(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const completeOnboarding = async (): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: {
            ...userResponses,
            onboarding_completed: true,
          }
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Onboarding terminé !",
        description: "Votre profil a été configuré avec succès.",
      });

      return true;
    } catch (error) {
      // Onboarding finalization error
      toast({
        title: "Erreur",
        description: "Impossible de finaliser l'onboarding",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    steps,
    currentStep,
    loading,
    emotion,
    intensity,
    userResponses,
    nextStep,
    previousStep,
    handleResponse,
    completeOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
