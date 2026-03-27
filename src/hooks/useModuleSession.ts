// @ts-nocheck
import { useState, useCallback } from 'react';
import { ModuleState, SessionResult, ModuleContext } from '@/types/modules';
import {
  clinicalScoringService,
  isSupportedInstrument,
  type InstrumentCode as ClinicalInstrumentCode,
} from '@/services/clinicalScoringService';
import { useToast } from '@/hooks/useToast';
import { logger } from '@/lib/logger';

export const useModuleSession = () => {
  const [state, setState] = useState<ModuleState>('content');
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  const startSession = useCallback((context: ModuleContext) => {
    setState('loading');
    setIsActive(true);
    
    // Brief loading state for smooth UX
    setTimeout(() => {
      setState('content');
    }, 500);
  }, []);

  const endSession = useCallback(async (
    context: ModuleContext,
    responses?: any[]
  ): Promise<SessionResult> => {
    setState('verbal-feedback');

    try {
      // Submit clinical data if responses provided and instrument is supported
      if (responses && typeof context.id === 'string') {
        const instrument = context.id.toUpperCase();

        if (isSupportedInstrument(instrument)) {
          const answers: Record<string, unknown> = Array.isArray(responses)
            ? responses.reduce<Record<string, unknown>>((acc, value, index) => {
                acc[String(index + 1)] = value;
                return acc;
              }, {})
            : typeof responses === 'object'
              ? (responses as Record<string, unknown>)
              : {};

          if (Object.keys(answers).length > 0) {
            await clinicalScoringService.submitResponse(
              instrument as ClinicalInstrumentCode,
              answers,
              {
                metadata: {
                  module: context.name,
                  preset: context.preset,
                },
              },
            );
          }
        }
      }

      // Get session result from cache
      const result = await clinicalScoringService.getUISuggestion(
        `post-${context.id}`
      );

      setIsActive(false);
      
      return {
        badge: result?.text || "Plus posé·e ✨",
        cta: result?.cta ? {
          text: result.cta.text,
          action: result.cta.route,
          duration: result.cta.duration
        } : undefined,
        reward: generateReward(context)
      };
    } catch (error) {
      logger.error('Session end error', error as Error, 'SYSTEM');
      setIsActive(false);
      
      return {
        badge: "Moment apaisé ✨",
        cta: {
          text: "Encore 60 s ?",
          action: "continue",
          duration: "1 min"
        }
      };
    }
  }, []);

  const generateReward = (context: ModuleContext) => {
    // Simple reward logic based on module
    const rewards = {
      'breath': { type: 'aura' as const, name: 'Brise du soir', description: 'Aura apaisante débloquée' },
      'scan': { type: 'theme' as const, name: 'Fond ambiance', description: 'Nouveau fond débloqué' },
      'flash-glow': { type: 'sticker' as const, name: 'Bougie zen', description: 'Sticker de sérénité' },
      'music': { type: 'loop' as const, name: 'Loop doux', description: 'Boucle audio sauvegardée' }
    };
    
    return rewards[context.id as keyof typeof rewards];
  };

  return {
    state,
    isActive,
    startSession,
    endSession,
    setState
  };
};