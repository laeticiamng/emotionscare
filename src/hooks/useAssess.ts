// @ts-nocheck
import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { startAssess, submitAssess, aggregateAssess } from '@/lib/assess/client';
import type { 
  StartInput, 
  StartOutput, 
  SubmitInput, 
  SubmitOutput, 
  AggregateInput, 
  Instrument 
} from '../../../packages/contracts/assess';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface UseAssessOptions {
  onSubmitSuccess?: (result: SubmitOutput) => void;
  onError?: (error: Error) => void;
}

export function useAssess(options: UseAssessOptions = {}) {
  const { toast } = useToast();
  const [currentSession, setCurrentSession] = useState<StartOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Start assessment
  const startMutation = useMutation({
    mutationFn: startAssess,
    onSuccess: (data) => {
      setCurrentSession(data);
      // Télémétrie anonyme
      if (typeof window !== 'undefined' && window.analytics) {
        window.analytics.track('assess_started', {
          instrument: data.items.length ? 'unknown' : 'unknown', // On évite de logger l'instrument spécifique
          context: 'unknown',
          locale: navigator.language || 'fr'
        });
      }
    },
    onError: (error) => {
      logger.error('Start assessment error', error as Error, 'UI');
      options.onError?.(error);
      
      // Messages d'erreur utilisateur-friendly
      if (error.message.includes('feature_disabled')) {
        toast({
          title: "Fonction temporairement indisponible",
          description: "Cette évaluation n'est pas encore activée.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Impossible de démarrer l'évaluation. Réessayez plus tard.",
          variant: "destructive"
        });
      }
    }
  });

  // Submit assessment avec retry automatique
  const submitMutation = useMutation({
    mutationFn: submitAssess,
    retry: (failureCount, error) => {
      // Retry seulement sur rate limiting, max 2 fois
      if (error.message.includes('rate_limited') && failureCount < 2) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: (data) => {
      setIsSubmitting(false);
      options.onSubmitSuccess?.(data);
      
      // Télémétrie anonyme - seulement le badge final
      if (typeof window !== 'undefined' && window.analytics) {
        window.analytics.track('assess_submitted', {
          badge_label: data.orchestration.hints[0] || 'completed',
          context: 'unknown'
        });
      }
    },
    onError: (error) => {
      setIsSubmitting(false);
      logger.error('Submit assessment error', error as Error, 'UI');
      options.onError?.(error);

      // Gestion d'erreurs spécifiques sans révéler de détails techniques
      if (error.message.includes('already_submitted')) {
        // Idempotent - pas d'erreur visible
        return;
      } else if (error.message.includes('rate_limited')) {
        toast({
          title: "Un instant...",
          description: "On réessaie plus tard automatiquement.",
          variant: "default"
        });
      } else if (error.message.includes('unauthorized')) {
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Envoi impossible",
          description: "Vos réponses n'ont pas pu être envoyées. Réessayez plus tard.",
          variant: "destructive"
        });
      }
    }
  });

  // Aggregate pour B2B/managers
  const aggregateMutation = useMutation({
    mutationFn: aggregateAssess,
    onSuccess: (data) => {
      // Télémétrie B2B
      if (typeof window !== 'undefined' && window.analytics) {
        window.analytics.track('assess_aggregate_viewed', {
          scope: 'team',
          period: 'unknown',
          can_show: data.n >= 5
        });
      }
    },
    onError: (error) => {
      logger.error('Aggregate assessment error', error as Error, 'UI');
      options.onError?.(error);
      
      toast({
        title: "Données indisponibles",
        description: "Impossible de charger le résumé d'équipe.",
        variant: "destructive"
      });
    }
  });

  // Helper pour démarrer un assessment
  const start = useCallback((instrument: Instrument, context?: string, lang: string = 'fr') => {
    const input: StartInput = {
      instrument,
      lang,
      context: context as any
    };
    
    // Télémétrie
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('assess_viewed', {
        instrument,
        context: context || 'unknown',
        locale: lang
      });
    }
    
    return startMutation.mutate(input);
  }, [startMutation]);

  // Helper pour soumettre
  const submit = useCallback((sessionId: string, answers: Array<{id: string, value: number}>, meta?: any) => {
    if (isSubmitting) return; // Éviter double submit
    
    const input: SubmitInput = {
      session_id: sessionId,
      answers,
      meta
    };
    
    return submitMutation.mutate(input);
  }, [submitMutation, isSubmitting]);

  // Helper pour agréger
  const aggregate = useCallback((orgId: string, period: {from: string, to: string}, instruments?: Instrument[], teamId?: string) => {
    const input: AggregateInput = {
      org_id: orgId,
      period,
      instruments,
      team_id: teamId,
      min_n: 5
    };
    
    return aggregateMutation.mutate(input);
  }, [aggregateMutation]);

  return {
    // Actions
    start,
    submit,
    aggregate,
    
    // État
    currentSession,
    isSubmitting,
    isStarting: startMutation.isPending,
    isAggregating: aggregateMutation.isPending,
    
    // Données
    startResult: startMutation.data,
    submitResult: submitMutation.data,
    aggregateResult: aggregateMutation.data,
    
    // Erreurs
    startError: startMutation.error,
    submitError: submitMutation.error,
    aggregateError: aggregateMutation.error,
    
    // Helpers
    reset: () => {
      setCurrentSession(null);
      setIsSubmitting(false);
      startMutation.reset();
      submitMutation.reset();
      aggregateMutation.reset();
    }
  };
}