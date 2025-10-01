// @ts-nocheck
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/user';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface AuthContextWithUpdateUser {
  user: User | null;
  updateUser: (user: User) => Promise<User | void>;
}

export const useOnboardingState = () => {
  const auth = useAuth() as unknown as AuthContextWithUpdateUser;
  const { user, updateUser } = auth;
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'user');
  const [department, setDepartment] = useState(user?.department || '');
  const [theme, setTheme] = useState(user?.preferences?.theme || 'light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.preferences?.notifications_enabled ?? true
  );
  const [dataCollection, setDataCollection] = useState(true);
  const [goals, setGoals] = useState<string[]>([]);
  
  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bienvenue',
      description: 'Configurez votre profil pour obtenir une expérience personnalisée',
      completed: !!name,
    },
    {
      id: 'profile',
      title: 'Votre profil',
      description: 'Quelques informations pour personnaliser votre expérience',
      completed: !!role && !!department,
    },
    {
      id: 'preferences',
      title: 'Préférences',
      description: 'Configurez l\'apparence et les notifications',
      completed: true,
    },
    {
      id: 'privacy',
      title: 'Confidentialité',
      description: 'Paramètres de confidentialité et de collecte de données',
      completed: true,
    },
    {
      id: 'goals',
      title: 'Vos objectifs',
      description: 'Quels sont vos objectifs d\'utilisation ?',
      completed: goals.length > 0,
    },
    {
      id: 'complete',
      title: 'Terminé',
      description: 'Vous êtes prêt à commencer',
      completed: false,
    },
  ];
  
  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      return true;
    }
    return false;
  }, [currentStep, steps.length]);
  
  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      return true;
    }
    return false;
  }, [currentStep]);
  
  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
      return true;
    }
    return false;
  }, [steps.length]);
  
  const isStepCompleted = useCallback((step: number) => {
    return steps[step]?.completed || false;
  }, [steps]);
  
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  
  const completeOnboarding = useCallback(async () => {
    try {
      if (!user) return false;
      
      const preferences = {
        ...(user?.preferences || {}),
        theme,
        notifications_enabled: notificationsEnabled,
        data_collection: dataCollection,
      };
      
      const updatedUser = {
        ...user,
        name,
        role,
        department,
        preferences,
        onboarded: true,
      } as User;
      
      // Update the user
      await updateUser(updatedUser);
      
      toast({
        title: 'Onboarding complété',
        description: 'Votre profil a été configuré avec succès.',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la configuration de votre profil.',
        variant: 'destructive',
      });
      return false;
    }
  }, [user, updateUser, name, role, department, theme, notificationsEnabled, dataCollection, goals, toast]);
  
  return {
    currentStep,
    steps,
    nextStep,
    previousStep,
    goToStep,
    isStepCompleted,
    isLastStep,
    isFirstStep,
    name,
    setName,
    role,
    setRole,
    department,
    setDepartment,
    theme,
    setTheme,
    notificationsEnabled,
    setNotificationsEnabled,
    dataCollection,
    setDataCollection,
    goals,
    setGoals,
    completeOnboarding,
  };
};

export default useOnboardingState;
