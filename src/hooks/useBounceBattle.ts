// @ts-nocheck
import { useState, useCallback, useEffect, useRef } from 'react';
import { useBounceStore } from '@/store/bounce.store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface StartBattleResponse {
  battle_id: string;
  ws_url?: string;
  stimuli: Array<{
    kind: 'mail' | 'notif' | 'timer';
    payload: any;
    at: number;
    id: string;
  }>;
}

interface DebriefResponse {
  coach_msg: string;
  pair_token?: string;
}

export const useBounceBattle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const bounceStore = useBounceStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const stimuliTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const start = useCallback(async (mode: string = 'standard') => {
    setIsLoading(true);
    setError(null);
    
    try {
      bounceStore.setMode(mode);
      bounceStore.setPhase('starting');
      
      const { data, error: supabaseError } = await supabase.functions.invoke('bounce-back-battle', {
        body: {
          action: 'start',
          mode
        }
      });

      if (supabaseError) throw supabaseError;

      const response: StartBattleResponse = data;
      
      bounceStore.setBattleId(response.battle_id);
      bounceStore.setStimuli(response.stimuli);
      
      if (response.ws_url) {
        bounceStore.setWsUrl(response.ws_url);
        connectWebSocket(response.ws_url);
      }
      
      // Start the battle
      bounceStore.startBattle();
      startTimer();
      scheduleStimuli(response.stimuli);
      
    } catch (error) {
      logger.error('Error starting bounce battle', error as Error, 'UI');
      setError('Erreur lors du démarrage de la bataille');
      
      // Fallback offline mode
      const fallbackBattleId = `offline-${Date.now()}`;
      bounceStore.setBattleId(fallbackBattleId);
      bounceStore.setMode(mode);
      
      // Generate offline stimuli
      const offlineStimuli = generateOfflineStimuli(mode);
      bounceStore.setStimuli(offlineStimuli);
      bounceStore.startBattle();
      startTimer();
      scheduleStimuli(offlineStimuli);
      
      toast({
        title: 'Mode hors-ligne',
        description: 'Bataille locale démarrée',
      });
    } finally {
      setIsLoading(false);
    }
  }, [bounceStore]);

  const sendEvent = useCallback(async (eventType: 'start' | 'pause' | 'resume' | 'calm' | 'end' | 'error') => {
    if (!bounceStore.battleId) return;
    
    const event = {
      type: eventType,
      timestamp: Date.now()
    };
    
    bounceStore.addEvent(event);
    
    // Handle local state changes
    switch (eventType) {
      case 'pause':
        bounceStore.pauseBattle();
        pauseTimer();
        break;
      case 'resume':
        bounceStore.resumeBattle();
        resumeTimer();
        break;
      case 'calm':
        bounceStore.useCalmBoost();
        break;
      case 'end':
        bounceStore.endBattle();
        stopTimer();
        break;
    }
    
    // Send to backend
    try {
      await supabase.functions.invoke('bounce-back-battle', {
        body: {
          action: 'event',
          battle_id: bounceStore.battleId,
          event_type: eventType,
          ts: event.timestamp
        }
      });
    } catch (error) {
      logger.error('Error sending event', error as Error, 'UI');
      // Continue offline - event is already stored locally
    }
  }, [bounceStore]);

  const submitDebrief = useCallback(async (answers: Array<{ id: string; value: 0 | 1 | 2 | 3 }>) => {
    if (!bounceStore.battleId) return;
    
    setIsLoading(true);
    
    try {
      // Save answers locally
      answers.forEach(answer => {
        bounceStore.addCopingAnswer(answer);
      });
      
      const { data, error: supabaseError } = await supabase.functions.invoke('bounce-back-battle', {
        body: {
          action: 'debrief',
          battle_id: bounceStore.battleId,
          answers,
          hrv: bounceStore.hrvSummary
        }
      });

      if (supabaseError) throw supabaseError;

      const response: DebriefResponse = data;
      
      bounceStore.setCoachMessage(response.coach_msg);
      
      if (response.pair_token) {
        bounceStore.setPairToken(response.pair_token);
        bounceStore.setPhase('pairing');
      } else {
        bounceStore.setPhase('completed');
      }
      
    } catch (error) {
      logger.error('Error submitting debrief', error as Error, 'UI');
      
      // Fallback: local coaching message
      const encouragementMessages = [
        "Bravo ! Vous avez affronté le stress avec courage. 💪",
        "Chaque défi est une opportunité de grandir. Bien joué !",
        "Votre résilience se renforce à chaque épreuve. 🌟"
      ];
      
      const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
      bounceStore.setCoachMessage(randomMessage);
      bounceStore.setPhase('completed');
    } finally {
      setIsLoading(false);
    }
  }, [bounceStore]);

  const sendPairTip = useCallback(async (tip: string) => {
    if (!bounceStore.pairToken) return;
    
    try {
      await supabase.functions.invoke('bounce-back-battle', {
        body: {
          action: 'pair',
          pair_token: bounceStore.pairToken,
          tip
        }
      });
      
      bounceStore.setSentTip(tip);
      bounceStore.setPhase('completed');
      
      toast({
        title: 'Conseil partagé !',
        description: 'Votre conseil a été envoyé à votre partenaire',
      });
      
    } catch (error) {
      logger.error('Error sending pair tip', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le conseil',
        variant: 'destructive'
      });
    }
  }, [bounceStore]);

  // Timer management
  const startTimer = useCallback(() => {
    // Duration based on mode: quick=90, standard=180, zen=240, challenge=300
    const durationMap: Record<string, number> = {
      quick: 90,
      standard: 180,
      zen: 240,
      challenge: 300
    };
    const duration = durationMap[bounceStore.mode] || 180;
    bounceStore.updateTimeLeft(duration);
    
    timerRef.current = setInterval(() => {
      const currentTimeLeft = bounceStore.timeLeft;
      if (currentTimeLeft > 0) {
        bounceStore.updateTimeLeft(currentTimeLeft - 1);
      } else {
        stopTimer();
        sendEvent('end');
      }
    }, 1000);
  }, [bounceStore, sendEvent]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resumeTimer = useCallback(() => {
    if (!timerRef.current && bounceStore.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        const currentTimeLeft = bounceStore.timeLeft;
        if (currentTimeLeft > 0) {
          bounceStore.updateTimeLeft(currentTimeLeft - 1);
        } else {
          stopTimer();
          sendEvent('end');
        }
      }, 1000);
    }
  }, [bounceStore, sendEvent]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Clear all stimuli timeouts
    stimuliTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    stimuliTimeoutsRef.current = [];
  }, []);

  // Stimuli scheduling
  const scheduleStimuli = useCallback((stimuli: any[]) => {
    stimuli.forEach(stimulus => {
      const timeout = setTimeout(() => {
        if (bounceStore.phase === 'battle') {
          bounceStore.addStimulus(stimulus);
        }
      }, stimulus.at * 1000);
      
      stimuliTimeoutsRef.current.push(timeout);
    });
  }, [bounceStore]);

  // WebSocket management
  const connectWebSocket = useCallback((wsUrl: string) => {
    try {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        bounceStore.setWsConnected(true);
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'stimulus') {
            bounceStore.addStimulus(data.stimulus);
          }
        } catch (error) {
          logger.error('Error parsing WebSocket message', error as Error, 'SYSTEM');
        }
      };
      
      wsRef.current.onerror = () => {
        bounceStore.setWsConnected(false);
      };
      
      wsRef.current.onclose = () => {
        bounceStore.setWsConnected(false);
      };
    } catch (error) {
      logger.error('Error connecting WebSocket', error as Error, 'SYSTEM');
    }
  }, [bounceStore]);

  // Generate offline stimuli for all modes
  const generateOfflineStimuli = useCallback((mode: string) => {
    const durationMap: Record<string, number> = {
      quick: 90,
      standard: 180,
      zen: 240,
      challenge: 300
    };
    const stimuliCountMap: Record<string, number> = {
      quick: 5,
      standard: 8,
      zen: 6,
      challenge: 15
    };
    
    const duration = durationMap[mode] || 180;
    const stimuliCount = stimuliCountMap[mode] || 8;
    
    const stimuli = [];
    for (let i = 0; i < stimuliCount; i++) {
      const stimulus = {
        id: `offline-${i}`,
        kind: ['mail', 'notif', 'timer'][Math.floor(Math.random() * 3)] as 'mail' | 'notif' | 'timer',
        at: Math.random() * duration,
        payload: {
          title: `Stimulus ${i + 1}`,
          content: 'Contenu de test hors-ligne'
        }
      };
      stimuli.push(stimulus);
    }
    
    return stimuli.sort((a, b) => a.at - b.at);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [stopTimer]);

  return {
    // State
    state: bounceStore,
    
    // Status
    isLoading,
    error,
    
    // Actions
    start,
    sendEvent,
    end: () => sendEvent('end'),
    submitDebrief,
    sendPairTip,
    
    // Timer actions
    pause: () => sendEvent('pause'),
    resume: () => sendEvent('resume'),
    useCalmBoost: () => sendEvent('calm'),
    
    // Store actions
    reset: bounceStore.reset,
    processStimulus: bounceStore.processStimulus,
  };
};