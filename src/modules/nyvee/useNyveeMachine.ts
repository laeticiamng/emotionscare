/**
 * useNyveeMachine - State machine pour sessions Nyvee
 */

import { useCallback, useState } from 'react';
import { nyveeService } from './nyveeService';
import type { 
  BreathingIntensity,
  SessionPhase,
  BadgeType,
  NyveeSession,
  CocoonType,
} from './types';
import { DEFAULT_CYCLE_CONFIG } from './types';
import { useToast } from '@/hooks/use-toast';

export interface NyveeMachineConfig {
  onComplete?: (session: NyveeSession) => void;
  onError?: (error: Error) => void;
}

export interface NyveeMachineReturn {
  phase: SessionPhase;
  session: NyveeSession | null;
  intensity: BreathingIntensity;
  cycleCount: number;
  targetCycles: number;
  badgeEarned: BadgeType | null;
  cocoonUnlocked: CocoonType | null;
  error: Error | null;
  isActive: boolean;
  
  // Actions
  setIntensity: (intensity: BreathingIntensity) => void;
  startSession: (moodBefore?: number) => Promise<void>;
  completeCycle: () => void;
  completeSession: (moodAfter?: number) => Promise<void>;
  restart: () => void;
  reset: () => void;
}

export function useNyveeMachine(
  config?: NyveeMachineConfig
): NyveeMachineReturn {
  const [phase, setPhase] = useState<SessionPhase>('ready');
  const [session, setSession] = useState<NyveeSession | null>(null);
  const [intensity, setIntensity] = useState<BreathingIntensity>('calm');
  const [cycleCount, setCycleCount] = useState(0);
  const [targetCycles] = useState(6);
  const [badgeEarned, setBadgeEarned] = useState<BadgeType | null>(null);
  const [cocoonUnlocked, setCocoonUnlocked] = useState<CocoonType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const { toast } = useToast();

  const isActive = phase === 'breathing';

  /**
   * Démarrer une nouvelle session
   */
  const startSession = useCallback(async (moodBefore?: number) => {
    setError(null);
    setPhase('breathing');

    try {
      const newSession = await nyveeService.createSession({
        intensity,
        targetCycles,
        moodBefore,
      });

      setSession(newSession);
      setCycleCount(0);

      toast({
        title: 'Session démarrée',
        description: `Respiration ${intensity} - ${targetCycles} cycles`,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to start session');
      setError(error);
      setPhase('ready');
      config?.onError?.(error);

      toast({
        title: 'Erreur',
        description: 'Impossible de démarrer la session',
        variant: 'destructive',
      });
    }
  }, [intensity, targetCycles, toast, config]);

  /**
   * Compléter un cycle de respiration
   */
  const completeCycle = useCallback(() => {
    setCycleCount((prev) => {
      const newCount = prev + 1;
      
      // Si on atteint le nombre de cycles cible, passer à l'affichage du badge
      if (newCount >= targetCycles) {
        setPhase('badge');
        
        // Déterminer le badge
        const badge = nyveeService.determineBadge(intensity, newCount, targetCycles);
        setBadgeEarned(badge);
        
        // Vérifier si on débloque un cocoon
        if (nyveeService.shouldUnlockCocoon(badge)) {
          const rareCocoons: CocoonType[] = ['cosmos', 'water', 'foliage', 'aurora', 'ember'];
          const randomCocoon = rareCocoons[Math.floor(Math.random() * rareCocoons.length)];
          setCocoonUnlocked(randomCocoon);
        }
        
        // Passer automatiquement à 'complete' après 3 secondes
        setTimeout(() => setPhase('complete'), 3000);
      }
      
      return newCount;
    });
  }, [intensity, targetCycles]);

  /**
   * Compléter la session
   */
  const completeSession = useCallback(async (moodAfter?: number) => {
    if (!session || !badgeEarned) {
      return;
    }

    try {
      const completedSession = await nyveeService.completeSession({
        sessionId: session.id,
        cyclesCompleted: cycleCount,
        badgeEarned,
        moodAfter,
        cocoonUnlocked: cocoonUnlocked || undefined,
      });

      setSession(completedSession);
      config?.onComplete?.(completedSession);

      const moodImprovement = completedSession.moodDelta && completedSession.moodDelta > 0
        ? ` (+${completedSession.moodDelta} humeur)`
        : '';

      toast({
        title: 'Session terminée',
        description: `${cycleCount} cycles complétés${moodImprovement}`,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to complete session');
      setError(error);
      config?.onError?.(error);

      toast({
        title: 'Erreur',
        description: 'Impossible de terminer la session',
        variant: 'destructive',
      });
    }
  }, [session, badgeEarned, cycleCount, cocoonUnlocked, toast, config]);

  /**
   * Redémarrer une nouvelle session
   */
  const restart = useCallback(() => {
    setPhase('ready');
    setSession(null);
    setCycleCount(0);
    setBadgeEarned(null);
    setCocoonUnlocked(null);
    setError(null);
  }, []);

  /**
   * Reset complet
   */
  const reset = useCallback(() => {
    restart();
    setIntensity('calm');
  }, [restart]);

  return {
    phase,
    session,
    intensity,
    cycleCount,
    targetCycles,
    badgeEarned,
    cocoonUnlocked,
    error,
    isActive,
    
    setIntensity,
    startSession,
    completeCycle,
    completeSession,
    restart,
    reset,
  };
}
