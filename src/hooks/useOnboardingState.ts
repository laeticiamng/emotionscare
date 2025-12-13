// @ts-nocheck
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/** État d'une étape d'onboarding */
export type StepStatus = 'pending' | 'current' | 'completed' | 'skipped' | 'error';

/** Configuration de validation */
export interface StepValidation {
  required: boolean;
  validator?: () => boolean | Promise<boolean>;
  errorMessage?: string;
}

/** Étape d'onboarding complète */
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  status: StepStatus;
  icon?: string;
  validation?: StepValidation;
  skippable?: boolean;
  duration?: number; // Durée estimée en secondes
  helpUrl?: string;
}

/** Objectif utilisateur */
export interface UserGoal {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  category?: string;
}

/** Progression de l'onboarding */
export interface OnboardingProgress {
  completedSteps: number;
  totalSteps: number;
  percentage: number;
  estimatedTimeRemaining: number;
  startedAt?: Date;
  completedAt?: Date;
}

/** Analytics d'onboarding */
export interface OnboardingAnalytics {
  timePerStep: Record<string, number>;
  skippedSteps: string[];
  errorSteps: string[];
  totalDuration: number;
  completionRate: number;
}

/** Configuration */
export interface UseOnboardingConfig {
  persistProgress?: boolean;
  storageKey?: string;
  enableAnalytics?: boolean;
  requiredSteps?: string[];
  onStepChange?: (stepId: string, status: StepStatus) => void;
  onComplete?: () => void;
}

const DEFAULT_CONFIG: UseOnboardingConfig = {
  persistProgress: true,
  storageKey: 'onboarding-progress',
  enableAnalytics: true,
  requiredSteps: ['welcome', 'profile']
};

/** Objectifs disponibles */
export const AVAILABLE_GOALS: UserGoal[] = [
  { id: 'stress_reduction', label: 'Réduire le stress', icon: '🧘', category: 'wellness' },
  { id: 'better_sleep', label: 'Améliorer le sommeil', icon: '😴', category: 'health' },
  { id: 'emotion_awareness', label: 'Comprendre mes émotions', icon: '🎭', category: 'growth' },
  { id: 'productivity', label: 'Être plus productif', icon: '⚡', category: 'work' },
  { id: 'mindfulness', label: 'Pratiquer la pleine conscience', icon: '🌸', category: 'wellness' },
  { id: 'anxiety_management', label: 'Gérer l\'anxiété', icon: '💆', category: 'health' },
  { id: 'team_cohesion', label: 'Renforcer la cohésion d\'équipe', icon: '👥', category: 'work' },
  { id: 'personal_growth', label: 'Développement personnel', icon: '🌱', category: 'growth' }
];

interface AuthContextWithUpdateUser {
  user: User | null;
  updateUser: (user: User) => Promise<User | void>;
}

export const useOnboardingState = (config?: Partial<UseOnboardingConfig>) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const auth = useAuth() as unknown as AuthContextWithUpdateUser;
  const { user, updateUser } = auth;
  const { toast } = useToast();

  // État de base
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

  // État avancé
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [stepStartTime, setStepStartTime] = useState<Date>(new Date());
  const [analytics, setAnalytics] = useState<OnboardingAnalytics>({
    timePerStep: {},
    skippedSteps: [],
    errorSteps: [],
    totalDuration: 0,
    completionRate: 0
  });

  // Préférences additionnelles
  const [language, setLanguage] = useState('fr');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [emailFrequency, setEmailFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'never'>('weekly');
  const [accessibilityOptions, setAccessibilityOptions] = useState({
    reducedMotion: false,
    highContrast: false,
    largeText: false
  });
  
  // Définition des étapes
  const steps: OnboardingStep[] = useMemo(() => [
    {
      id: 'welcome',
      title: 'Bienvenue',
      description: 'Configurez votre profil pour obtenir une expérience personnalisée',
      completed: !!name,
      status: currentStep === 0 ? 'current' : (name ? 'completed' : 'pending'),
      icon: '👋',
      validation: { required: true, validator: () => name.length >= 2, errorMessage: 'Le nom doit contenir au moins 2 caractères' },
      skippable: false,
      duration: 30
    },
    {
      id: 'profile',
      title: 'Votre profil',
      description: 'Quelques informations pour personnaliser votre expérience',
      completed: !!role && !!department,
      status: currentStep === 1 ? 'current' : (role && department ? 'completed' : 'pending'),
      icon: '👤',
      validation: { required: true },
      skippable: false,
      duration: 60
    },
    {
      id: 'preferences',
      title: 'Préférences',
      description: 'Configurez l\'apparence et les notifications',
      completed: true,
      status: currentStep === 2 ? 'current' : 'completed',
      icon: '⚙️',
      skippable: true,
      duration: 45
    },
    {
      id: 'privacy',
      title: 'Confidentialité',
      description: 'Paramètres de confidentialité et de collecte de données',
      completed: true,
      status: currentStep === 3 ? 'current' : 'completed',
      icon: '🔒',
      skippable: true,
      duration: 30
    },
    {
      id: 'goals',
      title: 'Vos objectifs',
      description: 'Quels sont vos objectifs d\'utilisation ?',
      completed: goals.length > 0,
      status: currentStep === 4 ? 'current' : (goals.length > 0 ? 'completed' : 'pending'),
      icon: '🎯',
      validation: { required: false },
      skippable: true,
      duration: 45
    },
    {
      id: 'complete',
      title: 'Terminé',
      description: 'Vous êtes prêt à commencer',
      completed: false,
      status: currentStep === 5 ? 'current' : 'pending',
      icon: '✨',
      skippable: false,
      duration: 15
    },
  ], [currentStep, name, role, department, goals.length]);

  // Initialiser le temps de démarrage
  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date());
    }
  }, [startTime]);

  // Persister la progression
  useEffect(() => {
    if (!mergedConfig.persistProgress || typeof window === 'undefined') return;

    const progress = {
      currentStep,
      name,
      role,
      department,
      theme,
      notificationsEnabled,
      dataCollection,
      goals,
      language,
      timezone,
      emailFrequency,
      accessibilityOptions,
      analytics
    };

    localStorage.setItem(mergedConfig.storageKey!, JSON.stringify(progress));
  }, [currentStep, name, role, department, theme, notificationsEnabled, dataCollection, goals, language, timezone, emailFrequency, accessibilityOptions, analytics, mergedConfig.persistProgress, mergedConfig.storageKey]);

  // Charger la progression au montage
  useEffect(() => {
    if (!mergedConfig.persistProgress || typeof window === 'undefined') return;

    const saved = localStorage.getItem(mergedConfig.storageKey!);
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        if (progress.currentStep) setCurrentStep(progress.currentStep);
        if (progress.name) setName(progress.name);
        if (progress.role) setRole(progress.role);
        if (progress.department) setDepartment(progress.department);
        if (progress.theme) setTheme(progress.theme);
        if (progress.notificationsEnabled !== undefined) setNotificationsEnabled(progress.notificationsEnabled);
        if (progress.dataCollection !== undefined) setDataCollection(progress.dataCollection);
        if (progress.goals) setGoals(progress.goals);
        if (progress.language) setLanguage(progress.language);
        if (progress.timezone) setTimezone(progress.timezone);
        if (progress.emailFrequency) setEmailFrequency(progress.emailFrequency);
        if (progress.accessibilityOptions) setAccessibilityOptions(progress.accessibilityOptions);
        if (progress.analytics) setAnalytics(progress.analytics);
      } catch {}
    }
  }, [mergedConfig.persistProgress, mergedConfig.storageKey]);

  // Calculer le temps passé sur l'étape
  const recordStepTime = useCallback((stepId: string) => {
    if (!mergedConfig.enableAnalytics) return;

    const elapsed = Math.floor((Date.now() - stepStartTime.getTime()) / 1000);
    setAnalytics(prev => ({
      ...prev,
      timePerStep: {
        ...prev.timePerStep,
        [stepId]: (prev.timePerStep[stepId] || 0) + elapsed
      },
      totalDuration: prev.totalDuration + elapsed
    }));
    setStepStartTime(new Date());
  }, [stepStartTime, mergedConfig.enableAnalytics]);

  // Valider l'étape courante
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const step = steps[currentStep];
    if (!step.validation) return true;

    setErrors(prev => ({ ...prev, [step.id]: '' }));

    if (step.validation.validator) {
      const isValid = await step.validation.validator();
      if (!isValid) {
        const error = step.validation.errorMessage || 'Validation échouée';
        setErrors(prev => ({ ...prev, [step.id]: error }));
        setAnalytics(prev => ({
          ...prev,
          errorSteps: [...new Set([...prev.errorSteps, step.id])]
        }));
        return false;
      }
    }

    return true;
  }, [steps, currentStep]);
  
  // Navigation avec validation
  const nextStep = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return false;

    if (currentStep < steps.length - 1) {
      recordStepTime(steps[currentStep].id);
      mergedConfig.onStepChange?.(steps[currentStep].id, 'completed');
      setCurrentStep(currentStep + 1);
      return true;
    }
    return false;
  }, [currentStep, steps, validateCurrentStep, recordStepTime, mergedConfig.onStepChange]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      recordStepTime(steps[currentStep].id);
      setCurrentStep(currentStep - 1);
      return true;
    }
    return false;
  }, [currentStep, steps, recordStepTime]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < steps.length) {
      recordStepTime(steps[currentStep].id);
      setCurrentStep(step);
      return true;
    }
    return false;
  }, [steps.length, currentStep, recordStepTime]);

  // Sauter une étape
  const skipStep = useCallback(() => {
    const step = steps[currentStep];
    if (!step.skippable) return false;

    setAnalytics(prev => ({
      ...prev,
      skippedSteps: [...new Set([...prev.skippedSteps, step.id])]
    }));

    if (currentStep < steps.length - 1) {
      recordStepTime(step.id);
      mergedConfig.onStepChange?.(step.id, 'skipped');
      setCurrentStep(currentStep + 1);
      return true;
    }
    return false;
  }, [currentStep, steps, recordStepTime, mergedConfig.onStepChange]);

  const isStepCompleted = useCallback((step: number) => {
    return steps[step]?.completed || false;
  }, [steps]);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  // Toggle un objectif
  const toggleGoal = useCallback((goalId: string) => {
    setGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  }, []);

  // Progression
  const progress = useMemo((): OnboardingProgress => {
    const completedSteps = steps.filter(s => s.completed).length;
    const remainingSteps = steps.slice(currentStep);
    const estimatedTimeRemaining = remainingSteps.reduce((sum, s) => sum + (s.duration || 0), 0);

    return {
      completedSteps,
      totalSteps: steps.length,
      percentage: Math.round((completedSteps / steps.length) * 100),
      estimatedTimeRemaining,
      startedAt: startTime || undefined
    };
  }, [steps, currentStep, startTime]);

  // Compléter l'onboarding
  const completeOnboarding = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!user) return false;

      recordStepTime(steps[currentStep].id);

      const preferences = {
        ...(user?.preferences || {}),
        theme,
        notifications_enabled: notificationsEnabled,
        data_collection: dataCollection,
        language,
        timezone,
        email_frequency: emailFrequency,
        accessibility: accessibilityOptions
      };

      const updatedUser = {
        ...user,
        name,
        role,
        department,
        preferences,
        goals,
        onboarded: true,
      } as User;

      await updateUser(updatedUser);

      // Sauvegarder les analytics
      if (mergedConfig.enableAnalytics) {
        const finalAnalytics = {
          ...analytics,
          completionRate: (steps.filter(s => s.completed).length / steps.length) * 100,
          totalDuration: startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0
        };

        try {
          await supabase.from('onboarding_analytics').insert({
            user_id: user.id,
            analytics: finalAnalytics,
            completed_at: new Date().toISOString()
          });
        } catch (err) {
          logger.warn('Failed to save onboarding analytics', err as Error, 'SYSTEM');
        }

        // Track event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'onboarding_complete', {
            duration: finalAnalytics.totalDuration,
            skipped_steps: finalAnalytics.skippedSteps.length,
            goals_selected: goals.length
          });
        }
      }

      // Nettoyer le storage
      if (mergedConfig.persistProgress && typeof window !== 'undefined') {
        localStorage.removeItem(mergedConfig.storageKey!);
      }

      toast({
        title: 'Onboarding complété',
        description: 'Votre profil a été configuré avec succès.',
      });

      mergedConfig.onComplete?.();

      return true;
    } catch (error) {
      logger.error('Failed to complete onboarding', error as Error, 'SYSTEM');
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la configuration de votre profil.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, updateUser, name, role, department, theme, notificationsEnabled, dataCollection, goals, language, timezone, emailFrequency, accessibilityOptions, toast, analytics, startTime, steps, currentStep, recordStepTime, mergedConfig]);

  // Réinitialiser l'onboarding
  const resetOnboarding = useCallback(() => {
    setCurrentStep(0);
    setName('');
    setRole('user');
    setDepartment('');
    setTheme('light');
    setNotificationsEnabled(true);
    setDataCollection(true);
    setGoals([]);
    setLanguage('fr');
    setEmailFrequency('weekly');
    setAccessibilityOptions({ reducedMotion: false, highContrast: false, largeText: false });
    setErrors({});
    setStartTime(new Date());
    setAnalytics({
      timePerStep: {},
      skippedSteps: [],
      errorSteps: [],
      totalDuration: 0,
      completionRate: 0
    });

    if (mergedConfig.persistProgress && typeof window !== 'undefined') {
      localStorage.removeItem(mergedConfig.storageKey!);
    }
  }, [mergedConfig.persistProgress, mergedConfig.storageKey]);

  return {
    // Navigation
    currentStep,
    steps,
    nextStep,
    previousStep,
    goToStep,
    skipStep,
    isStepCompleted,
    isLastStep,
    isFirstStep,

    // Données utilisateur
    name, setName,
    role, setRole,
    department, setDepartment,
    theme, setTheme,
    notificationsEnabled, setNotificationsEnabled,
    dataCollection, setDataCollection,
    goals, setGoals, toggleGoal,

    // Préférences avancées
    language, setLanguage,
    timezone, setTimezone,
    emailFrequency, setEmailFrequency,
    accessibilityOptions, setAccessibilityOptions,

    // État
    isLoading,
    errors,
    progress,
    analytics,

    // Actions
    completeOnboarding,
    resetOnboarding,
    validateCurrentStep,

    // Objectifs disponibles
    availableGoals: AVAILABLE_GOALS,
    getGoalsByCategory: (category: string) => AVAILABLE_GOALS.filter(g => g.category === category)
  };
};

export default useOnboardingState;
