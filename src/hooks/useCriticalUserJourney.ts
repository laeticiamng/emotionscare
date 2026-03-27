// @ts-nocheck
/**
 * Hook pour surveiller et valider les parcours critiques
 * Permet de détecter les blocages et optimiser l'UX
 */

import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useObservability } from '@/lib/observability';
import { performanceOptimizer } from '@/lib/performance-optimizer';

// ============= Types et interfaces =============

export interface JourneyStep {
  id: string;
  name: string;
  path: string;
  isRequired: boolean;
  maxDurationMs?: number;
  validationFn?: () => boolean;
}

export interface Journey {
  id: string;
  name: string;
  steps: JourneyStep[];
  maxTotalDurationMs?: number;
}

export interface JourneyProgress {
  journeyId: string;
  currentStep: number;
  startTime: number;
  stepStartTime: number;
  completedSteps: string[];
  isCompleted: boolean;
  hasErrors: boolean;
  totalDuration?: number;
}

// ============= Parcours critiques prédéfinis =============

const CRITICAL_JOURNEYS: Record<string, Journey> = {
  signup: {
    id: 'signup',
    name: 'Inscription utilisateur',
    maxTotalDurationMs: 5 * 60 * 1000, // 5 minutes max
    steps: [
      {
        id: 'landing',
        name: 'Page d\'accueil',
        path: '/',
        isRequired: false,
      },
      {
        id: 'signup_form',
        name: 'Formulaire d\'inscription',
        path: '/signup',
        isRequired: true,
        maxDurationMs: 3 * 60 * 1000, // 3 minutes max
        validationFn: () => {
          // Vérifier que les champs requis sont présents
          const emailField = document.querySelector('input[name="email"], input[type="email"]');
          const passwordField = document.querySelector('input[name="password"], input[type="password"]');
          return !!(emailField && passwordField);
        },
      },
      {
        id: 'signup_success',
        name: 'Confirmation d\'inscription',
        path: '/signup/success',
        isRequired: true,
      },
      {
        id: 'dashboard_first_visit',
        name: 'Premier accès au dashboard',
        path: '/app/consumer/home',
        isRequired: true,
      },
    ],
  },
  
  signin: {
    id: 'signin',
    name: 'Connexion utilisateur',
    maxTotalDurationMs: 2 * 60 * 1000, // 2 minutes max
    steps: [
      {
        id: 'login_form',
        name: 'Formulaire de connexion',
        path: '/login',
        isRequired: true,
        maxDurationMs: 90 * 1000, // 1.5 minute max
      },
      {
        id: 'dashboard_access',
        name: 'Accès au dashboard',
        path: '/app/consumer/home',
        isRequired: true,
      },
    ],
  },
  
  emotion_scan: {
    id: 'emotion_scan',
    name: 'Scan émotionnel complet',
    maxTotalDurationMs: 10 * 60 * 1000, // 10 minutes max
    steps: [
      {
        id: 'scan_start',
        name: 'Démarrage du scan',
        path: '/app/scan',
        isRequired: true,
      },
      {
        id: 'scan_process',
        name: 'Processus de scan',
        path: '/app/scan/process',
        isRequired: true,
        maxDurationMs: 5 * 60 * 1000,
      },
      {
        id: 'scan_results',
        name: 'Résultats du scan',
        path: '/app/scan/results',
        isRequired: true,
      },
    ],
  },
};

// ============= Hook principal =============

export const useCriticalUserJourney = (journeyId?: string) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logUserAction, logError, measureOperation } = useObservability();
  
  const [currentJourney, setCurrentJourney] = useState<JourneyProgress | null>(null);
  const [journeyHistory, setJourneyHistory] = useState<JourneyProgress[]>([]);

  // ============= Gestion du parcours =============

  const startJourney = useCallback((id: string) => {
    const journey = CRITICAL_JOURNEYS[id];
    if (!journey) {
      logError(new Error(`Journey not found: ${id}`), 'Parcours critique introuvable');
      return false;
    }

    const progress: JourneyProgress = {
      journeyId: id,
      currentStep: 0,
      startTime: Date.now(),
      stepStartTime: Date.now(),
      completedSteps: [],
      isCompleted: false,
      hasErrors: false,
    };

    setCurrentJourney(progress);
    measureOperation.start(`journey_${id}`);
    
    logUserAction('journey_started', {
      journeyId: id,
      journeyName: journey.name,
      totalSteps: journey.steps.length,
    });

    // Précharger les ressources des étapes suivantes
    const upcomingSteps = journey.steps.slice(0, 3);
    upcomingSteps.forEach((step) => {
      performanceOptimizer.preloadResource(step.path);
    });

    return true;
  }, [logUserAction, logError, measureOperation]);

  const completeStep = useCallback((stepId: string, metadata?: Record<string, any>) => {
    if (!currentJourney) return;

    const journey = CRITICAL_JOURNEYS[currentJourney.journeyId];
    const currentStep = journey.steps[currentJourney.currentStep];
    
    if (currentStep?.id !== stepId) {
      logError(
        new Error(`Step mismatch: expected ${currentStep?.id}, got ${stepId}`),
        'Incohérence dans le parcours utilisateur'
      );
      return;
    }

    const stepDuration = Date.now() - currentJourney.stepStartTime;
    const updatedProgress = {
      ...currentJourney,
      completedSteps: [...currentJourney.completedSteps, stepId],
      currentStep: currentJourney.currentStep + 1,
      stepStartTime: Date.now(),
    };

    // Vérifier si c'est la fin du parcours
    if (updatedProgress.currentStep >= journey.steps.length) {
      const totalDuration = Date.now() - currentJourney.startTime;
      updatedProgress.isCompleted = true;
      updatedProgress.totalDuration = totalDuration;
      
      measureOperation.end(`journey_${currentJourney.journeyId}`);
      
      logUserAction('journey_completed', {
        journeyId: currentJourney.journeyId,
        totalDuration,
        stepCount: journey.steps.length,
        completedSteps: updatedProgress.completedSteps,
      });

      // Archiver le parcours
      setJourneyHistory(prev => [...prev, updatedProgress]);
      setCurrentJourney(null);
    } else {
      setCurrentJourney(updatedProgress);
    }

    logUserAction('journey_step_completed', {
      journeyId: currentJourney.journeyId,
      stepId,
      stepDuration,
      stepNumber: currentJourney.currentStep + 1,
      ...metadata,
    });
  }, [currentJourney, logUserAction, logError, measureOperation]);

  const abandonJourney = useCallback((reason?: string) => {
    if (!currentJourney) return;

    const journey = CRITICAL_JOURNEYS[currentJourney.journeyId];
    const currentStep = journey.steps[currentJourney.currentStep];
    const totalDuration = Date.now() - currentJourney.startTime;

    logUserAction('journey_abandoned', {
      journeyId: currentJourney.journeyId,
      abandonedAtStep: currentStep?.id,
      stepNumber: currentJourney.currentStep + 1,
      totalDuration,
      completedSteps: currentJourney.completedSteps,
      reason: reason || 'unknown',
    });

    setCurrentJourney(null);
  }, [currentJourney, logUserAction]);

  // ============= Détection automatique des étapes =============

  useEffect(() => {
    if (!currentJourney) return;

    const journey = CRITICAL_JOURNEYS[currentJourney.journeyId];
    const expectedStep = journey.steps[currentJourney.currentStep];
    
    if (!expectedStep) return;

    // Vérifier si l'utilisateur est sur la bonne page
    if (location.pathname === expectedStep.path) {
      // Valider l'étape si une fonction de validation existe
      if (expectedStep.validationFn) {
        const isValid = expectedStep.validationFn();
        if (!isValid) {
          logError(
            new Error(`Step validation failed: ${expectedStep.id}`),
            'Validation de l\'étape échouée'
          );
          return;
        }
      }

      // Auto-compléter l'étape si elle est valide
      setTimeout(() => {
        completeStep(expectedStep.id, {
          autoCompleted: true,
          pathname: location.pathname,
        });
      }, 1000); // Délai pour s'assurer que la page est entièrement chargée
    }
  }, [location.pathname, currentJourney, completeStep, logError]);

  // ============= Détection des timeouts =============

  useEffect(() => {
    if (!currentJourney) return;

    const journey = CRITICAL_JOURNEYS[currentJourney.journeyId];
    const currentStep = journey.steps[currentJourney.currentStep];

    // Timeout pour l'étape actuelle
    if (currentStep?.maxDurationMs) {
      const stepTimeout = setTimeout(() => {
        logError(
          new Error(`Step timeout: ${currentStep.id}`),
          'Timeout sur une étape critique',
          {
            stepId: currentStep.id,
            maxDuration: currentStep.maxDurationMs,
            actualDuration: Date.now() - currentJourney.stepStartTime,
          }
        );
      }, currentStep.maxDurationMs);

      return () => clearTimeout(stepTimeout);
    }

    // Timeout pour le parcours complet
    if (journey.maxTotalDurationMs) {
      const journeyTimeout = setTimeout(() => {
        logError(
          new Error(`Journey timeout: ${journey.id}`),
          'Timeout sur un parcours critique',
          {
            journeyId: journey.id,
            maxDuration: journey.maxTotalDurationMs,
            actualDuration: Date.now() - currentJourney.startTime,
          }
        );
        abandonJourney('timeout');
      }, journey.maxTotalDurationMs);

      return () => clearTimeout(journeyTimeout);
    }
  }, [currentJourney, abandonJourney, logError]);

  // ============= Navigation assistée =============

  const navigateToNextStep = useCallback(() => {
    if (!currentJourney) return;

    const journey = CRITICAL_JOURNEYS[currentJourney.journeyId];
    const nextStep = journey.steps[currentJourney.currentStep];
    
    if (nextStep) {
      navigate(nextStep.path);
      logUserAction('journey_navigation_assisted', {
        journeyId: currentJourney.journeyId,
        targetStep: nextStep.id,
        targetPath: nextStep.path,
      });
    }
  }, [currentJourney, navigate, logUserAction]);

  // ============= API publique =============

  return {
    // État du parcours
    currentJourney,
    isInJourney: !!currentJourney,
    journeyHistory,
    
    // Actions
    startJourney: journeyId ? () => startJourney(journeyId) : startJourney,
    completeStep,
    abandonJourney,
    navigateToNextStep,
    
    // Informations sur le parcours actuel
    getCurrentStep: () => {
      if (!currentJourney) return null;
      const journey = CRITICAL_JOURNEYS[currentJourney.journeyId];
      return journey.steps[currentJourney.currentStep] || null;
    },
    
    getProgress: () => {
      if (!currentJourney) return { current: 0, total: 0, percentage: 0 };
      const journey = CRITICAL_JOURNEYS[currentJourney.journeyId];
      return {
        current: currentJourney.currentStep,
        total: journey.steps.length,
        percentage: (currentJourney.currentStep / journey.steps.length) * 100,
      };
    },

    // Analytics
    getJourneyStats: () => ({
      totalJourneys: journeyHistory.length,
      completedJourneys: journeyHistory.filter(j => j.isCompleted).length,
      averageDuration: journeyHistory.length > 0 
        ? journeyHistory.reduce((sum, j) => sum + (j.totalDuration || 0), 0) / journeyHistory.length 
        : 0,
    }),
  };
};