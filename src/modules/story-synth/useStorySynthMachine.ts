/**
 * Story Synth State Machine
 * Gère l'état des sessions de narration thérapeutique
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as service from './storySynthService';
import type {
  StorySynthState,
  StoryTheme,
  StoryTone,
  CreateStorySynthSession,
} from './types';

const INITIAL_STATE: StorySynthState = {
  phase: 'idle',
  session: null,
  currentStory: null,
  startTime: null,
  error: null,
};

export function useStorySynthMachine() {
  const [state, setState] = useState<StorySynthState>(INITIAL_STATE);
  const { toast } = useToast();

  // ─────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────

  const startStory = useCallback(
    async (theme: StoryTheme, tone: StoryTone, userContext?: string) => {
      try {
        setState(prev => ({ ...prev, phase: 'generating', error: null }));

        const payload: CreateStorySynthSession = { theme, tone, user_context: userContext };
        const session = await service.createSession(payload);

        // Generate story content
        const story = await service.generateStory(session.id);

        setState(prev => ({
          ...prev,
          phase: 'reading',
          session,
          currentStory: story,
          startTime: Date.now(),
        }));

        toast({
          title: 'Histoire générée',
          description: 'Votre narration thérapeutique est prête.',
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          phase: 'error',
          error: err instanceof Error ? err.message : 'start_story_failed',
        }));
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de générer l\'histoire.',
        });
      }
    },
    [toast],
  );

  const completeStory = useCallback(async () => {
    if (!state.session || !state.startTime) {
      setState(prev => ({ ...prev, phase: 'idle' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, phase: 'completed' }));

      const duration = Math.floor((Date.now() - state.startTime) / 1000);

      await service.completeSession({
        session_id: state.session.id,
        reading_duration_seconds: duration,
      });

      toast({
        title: 'Histoire terminée',
        description: 'Merci d\'avoir pris ce temps pour vous.',
      });

      // Reset after a delay
      setTimeout(() => {
        setState(INITIAL_STATE);
      }, 3000);
    } catch (err) {
      setState(prev => ({
        ...prev,
        phase: 'error',
        error: err instanceof Error ? err.message : 'complete_story_failed',
      }));
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder la session.',
      });
    }
  }, [state.session, state.startTime, toast]);

  const resetStory = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    startStory,
    completeStory,
    resetStory,
  };
}
