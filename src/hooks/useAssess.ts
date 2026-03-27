// @ts-nocheck
import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import type { InstrumentCode, StartRequest } from '@/lib/assess/types';
import { supabase } from '@/integrations/supabase/client';

// Local types matching the contract schemas
interface StartInput {
  instrument: string;
  lang?: string;
  context?: string;
}

interface StartOutput {
  session_id: string;
  items: Array<{ id: string; prompt: string; choices?: (string | number)[] }>;
  expiry_ts: number;
}

interface SubmitInput {
  session_id: string;
  answers: Array<{ id: string; value: number }>;
  meta?: { duration_ms?: number; device_flags?: Record<string, any> };
}

interface SubmitOutput {
  receipt_id: string;
  orchestration: { hints: string[] };
}

interface AggregateInput {
  org_id: string;
  period: { from: string; to: string };
  instruments?: string[];
  team_id?: string;
  min_n?: number;
}

interface AggregateOutput {
  ok: true;
  n: number;
  text_summary: string[];
}

type Instrument = string;

// Stubs for edge function calls
async function startAssess(input: StartInput): Promise<StartOutput> {
  const { data, error } = await supabase.functions.invoke('assess-start', { body: input });
  if (error) throw error;
  return data as StartOutput;
}

async function submitAssess(input: SubmitInput): Promise<SubmitOutput> {
  const { data, error } = await supabase.functions.invoke('assess-submit', { body: input });
  if (error) throw error;
  return data as SubmitOutput;
}

async function aggregateAssess(input: AggregateInput): Promise<AggregateOutput> {
  const { data, error } = await supabase.functions.invoke('assess-aggregate', { body: input });
  if (error) throw error;
  return data as AggregateOutput;
}

interface UseAssessOptions {
  onSubmitSuccess?: (result: SubmitOutput) => void;
  onError?: (error: Error) => void;
}

export function useAssess(options: UseAssessOptions = {}) {
  const { toast } = useToast();
  const [currentSession, setCurrentSession] = useState<StartOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startMutation = useMutation({
    mutationFn: startAssess,
    onSuccess: (data) => {
      setCurrentSession(data);
    },
    onError: (error) => {
      logger.error('Start assessment error', error as Error, 'UI');
      options.onError?.(error);
      
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

  const submitMutation = useMutation({
    mutationFn: submitAssess,
    retry: (failureCount, error) => {
      if (error.message.includes('rate_limited') && failureCount < 2) return true;
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    onMutate: () => { setIsSubmitting(true); },
    onSuccess: (data) => {
      setIsSubmitting(false);
      options.onSubmitSuccess?.(data);
    },
    onError: (error) => {
      setIsSubmitting(false);
      logger.error('Submit assessment error', error as Error, 'UI');
      options.onError?.(error);

      if (error.message.includes('already_submitted')) return;
      if (error.message.includes('rate_limited')) {
        toast({ title: "Un instant...", description: "On réessaie plus tard automatiquement.", variant: "default" });
      } else if (error.message.includes('unauthorized')) {
        toast({ title: "Session expirée", description: "Veuillez vous reconnecter.", variant: "destructive" });
      } else {
        toast({ title: "Envoi impossible", description: "Vos réponses n'ont pas pu être envoyées.", variant: "destructive" });
      }
    }
  });

  const aggregateMutation = useMutation({
    mutationFn: aggregateAssess,
    onError: (error) => {
      logger.error('Aggregate assessment error', error as Error, 'UI');
      options.onError?.(error);
      toast({ title: "Données indisponibles", description: "Impossible de charger le résumé d'équipe.", variant: "destructive" });
    }
  });

  const start = useCallback((instrument: Instrument, context?: string, lang: string = 'fr') => {
    const input: StartInput = { instrument, lang, context };
    return startMutation.mutate(input);
  }, [startMutation]);

  const submit = useCallback((sessionId: string, answers: Array<{id: string, value: number}>, meta?: any) => {
    if (isSubmitting) return;
    const input: SubmitInput = { session_id: sessionId, answers, meta };
    return submitMutation.mutate(input);
  }, [submitMutation, isSubmitting]);

  const aggregate = useCallback((orgId: string, period: {from: string, to: string}, instruments?: Instrument[], teamId?: string) => {
    const input: AggregateInput = { org_id: orgId, period, instruments, team_id: teamId, min_n: 5 };
    return aggregateMutation.mutate(input);
  }, [aggregateMutation]);

  return {
    start, submit, aggregate,
    currentSession, isSubmitting,
    isStarting: startMutation.isPending,
    isAggregating: aggregateMutation.isPending,
    startResult: startMutation.data,
    submitResult: submitMutation.data,
    aggregateResult: aggregateMutation.data,
    startError: startMutation.error,
    submitError: submitMutation.error,
    aggregateError: aggregateMutation.error,
    reset: () => {
      setCurrentSession(null);
      setIsSubmitting(false);
      startMutation.reset();
      submitMutation.reset();
      aggregateMutation.reset();
    }
  };
}
