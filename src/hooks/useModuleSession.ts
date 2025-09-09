import { useState, useCallback } from 'react';
import { ModuleState, SessionResult, ModuleContext } from '@/types/modules';
import { clinicalScoringService } from '@/services/clinicalScoring';
import { useToast } from '@/hooks/use-toast';

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
      // Submit clinical data if responses provided
      if (responses) {
        await clinicalScoringService.submitResponse(
          context.id,
          responses,
          { module: context.name, preset: context.preset }
        );
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
      console.error('Session end error:', error);
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