/**
 * useFlashGlowMachine - State machine pour Flash Glow
 * Pattern : idle → loading → active → ending → success|error
 */

import { useState, useCallback } from 'react';
import { useAsyncMachine } from '@/hooks/useAsyncMachine';
import { flashGlowService, FlashGlowSession } from './flash-glowService';
import { toast } from '@/hooks/use-toast';
import { createFlashGlowJournalEntry } from './journal';
import type { JournalEntry } from '@/modules/journal/journalService';

interface FlashGlowConfig {
  glowType: string;
  intensity: number;
  duration: number;
}

interface FlashGlowMachineReturn {
  // État de la machine
  state: 'idle' | 'loading' | 'active' | 'ending' | 'success' | 'error';
  isActive: boolean;
  
  // Configuration
  config: FlashGlowConfig;
  setConfig: (config: Partial<FlashGlowConfig>) => void;
  
  // Contrôles
  startSession: () => Promise<void>;
  stopSession: () => void;
  extendSession: (additionalSeconds: number) => Promise<void>;
  
  // Données de résultat
  sessionDuration: number;
  result: any;
  error: Error | null;
  
  // Callbacks pour les composants UI
  onSessionComplete: (label: 'gain' | 'léger' | 'incertain', extend?: boolean) => Promise<void>;
  
  // Stats
  stats: { totalSessions: number; avgDuration: number } | null;
  loadStats: () => Promise<void>;
}

export const useFlashGlowMachine = (): FlashGlowMachineReturn => {
  const [config, setConfigState] = useState<FlashGlowConfig>({
    glowType: 'energy',
    intensity: 75,
    duration: 90
  });

  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [stats, setStats] = useState<{ totalSessions: number; avgDuration: number } | null>(null);

  // Configuration de la machine async
  const machine = useAsyncMachine<any>({
    run: async (signal: AbortSignal) => {
      // Phase 1: Démarrer la session
      const sessionStart = await flashGlowService.startSession(config);
      setSessionStartTime(Date.now());
      
      if (signal.aborted) throw new Error('Session aborted');

      // Phase 2: Attendre la durée configurée
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(resolve, config.duration * 1000);
        
        signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new Error('Session interrupted'));
        });
      });

      if (signal.aborted) throw new Error('Session aborted');

      // Phase 3: Calcul de la durée réelle
      const actualDuration = sessionStartTime 
        ? Math.round((Date.now() - sessionStartTime) / 1000)
        : config.duration;
      
      setSessionDuration(actualDuration);

      // Feedback haptique
      flashGlowService.triggerHapticFeedback();

      return {
        sessionId: sessionStart.sessionId,
        duration: actualDuration,
        completed: true
      };
    },
    onSuccess: (result) => {
      console.log('✅ Flash Glow session completed:', result);
    },
    onError: (error) => {
      console.error('❌ Flash Glow session error:', error);
      toast({
        title: "Session interrompue",
        description: "La session Flash Glow a été interrompue",
        variant: "destructive",
      });
    },
    retryLimit: 0, // Pas de retry automatique pour une session utilisateur
    timeout: (config.duration + 10) * 1000 // Timeout avec marge
  });

  const setConfig = useCallback((newConfig: Partial<FlashGlowConfig>) => {
    setConfigState(prev => ({ ...prev, ...newConfig }));
  }, []);

  const startSession = useCallback(async () => {
    if (machine.isActive || machine.isLoading) return;
    
    console.log('🌟 Starting Flash Glow session:', config);
    await machine.start();
  }, [machine, config]);

  const stopSession = useCallback(() => {
    machine.stop();
    setSessionStartTime(null);
    setSessionDuration(0);
  }, [machine]);

  const extendSession = useCallback(async (additionalSeconds: number) => {
    if (!machine.isActive) return;
    
    const newDuration = config.duration + additionalSeconds;
    setConfig({ duration: newDuration });
    
    toast({
      title: "Session prolongée",
      description: `+${additionalSeconds}s ajoutées à votre session`,
    });
  }, [machine.isActive, config.duration, setConfig]);

  const loadStats = useCallback(async () => {
    try {
      const statsData = await flashGlowService.getStats();
      setStats({
        totalSessions: statsData.total_sessions,
        avgDuration: statsData.avg_duration
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  const onSessionComplete = useCallback(async (
    label: 'gain' | 'léger' | 'incertain',
    extend: boolean = false
  ) => {
    if (extend) {
      await extendSession(60);
      return;
    }

    try {
      const recordedDuration = sessionDuration || config.duration;
      const recommendation = flashGlowService.getRecommendation(label, 3); // Real streak will be calculated later

      let journalEntry: JournalEntry | null = await createFlashGlowJournalEntry({
        label,
        duration: recordedDuration,
        intensity: config.intensity,
        glowType: config.glowType,
        recommendation,
        context: 'Flash Glow Ultra'
      });

      const sessionData: FlashGlowSession = {
        duration_s: recordedDuration,
        label,
        glow_type: config.glowType,
        intensity: config.intensity,
        result: 'completed',
        metadata: {
          timestamp: new Date().toISOString(),
          extended: false,
          autoJournal: Boolean(journalEntry),
          journalEntryId: journalEntry?.id,
          journalSummary: journalEntry?.summary,
          journalTone: journalEntry?.tone
        }
      };

      await flashGlowService.endSession(sessionData);

      if (!journalEntry) {
        journalEntry = await createFlashGlowJournalEntry({
          duration: recordedDuration,
          intensity: config.intensity,
          glowType: config.glowType,
          recommendation,
          context: 'Flash Glow Ultra'
        });
      }

      toast({
        title: "Session terminée ! ✨",
        description: [
          recommendation,
          journalEntry
            ? '📝 Votre expérience a été ajoutée automatiquement au journal.'
            : '📝 Journalisation automatique indisponible, pensez à noter votre ressenti manuellement.'
        ].join('\n')
      });

      // Recharger les stats
      await loadStats();

    } catch (error) {
      console.error('Error completing session:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la session",
        variant: "destructive",
      });
    }
  }, [sessionDuration, config, extendSession, loadStats]);

  return {
    // État
    state: machine.state,
    isActive: machine.isActive,
    
    // Configuration
    config,
    setConfig,
    
    // Contrôles
    startSession,
    stopSession,
    extendSession,
    
    // Données
    sessionDuration,
    result: machine.result,
    error: machine.error,
    
    // Callbacks
    onSessionComplete,
    
    // Stats
    stats,
    loadStats
  };
};