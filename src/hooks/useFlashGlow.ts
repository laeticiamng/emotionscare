import { useCallback, useEffect, useRef } from 'react';
import { useGlowStore, type GlowPattern, type SelfReport } from '@/store/glow.store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PatternConfig {
  inhale: number;
  hold: number;
  exhale: number;
}

const PATTERN_CONFIGS: Record<GlowPattern, PatternConfig> = {
  '4-2-4': { inhale: 4, hold: 2, exhale: 4 },
  '4-6-8': { inhale: 4, hold: 6, exhale: 8 },
  '5-5': { inhale: 5, hold: 0, exhale: 5 },
};

export const useFlashGlow = () => {
  const store = useGlowStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseStartRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);

  // Configuration du pattern actuel
  const patternConfig = PATTERN_CONFIGS[store.pattern];
  const totalCycleDuration = patternConfig.inhale + patternConfig.hold + patternConfig.exhale;

  // Gestion du cycle de respiration
  const updateBreathCycle = useCallback(() => {
    if (!store.running || store.paused) return;

    const now = Date.now();
    const elapsed = Math.floor((now - phaseStartRef.current) / 1000);
    
    let newPhase = store.phase;
    let shouldAdvance = false;

    switch (store.phase) {
      case 'inhale':
        if (elapsed >= patternConfig.inhale) {
          newPhase = patternConfig.hold > 0 ? 'hold' : 'exhale';
          shouldAdvance = true;
        }
        break;
      case 'hold':
        if (elapsed >= patternConfig.hold) {
          newPhase = 'exhale';
          shouldAdvance = true;
        }
        break;
      case 'exhale':
        if (elapsed >= patternConfig.exhale) {
          newPhase = 'inhale';
          shouldAdvance = true;
          store.incrementCycle();
        }
        break;
    }

    if (shouldAdvance) {
      phaseStartRef.current = now;
      store.setPhase(newPhase);
      
      // Haptique subtile sur changement de phase (si supporté)
      if (store.enableHaptic && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }

    // Auto-stop après 2 minutes max
    const totalElapsed = store.startedAt ? (now - store.startedAt) / 1000 : 0;
    if (totalElapsed > 120) {
      stop();
      return;
    }

    // Continuer l'animation
    animationRef.current = requestAnimationFrame(updateBreathCycle);
  }, [store, patternConfig]);

  // Démarrer la session
  const start = useCallback(() => {
    if (store.running) return;

    store.start();
    phaseStartRef.current = Date.now();
    
    // Démarrer la boucle d'animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(updateBreathCycle);

    // Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'flashglow.start', {
        pattern: store.pattern,
      });
    }

    toast({
      title: "Flash Glow démarré",
      description: "Suivez le rythme de l'anneau",
    });
  }, [store, updateBreathCycle]);

  // Mettre en pause
  const pause = useCallback(() => {
    if (!store.running || store.paused) return;

    store.pause();
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'flashglow.pause');
    }
  }, [store]);

  // Reprendre
  const resume = useCallback(() => {
    if (!store.running || !store.paused) return;

    store.resume();
    phaseStartRef.current = Date.now();
    animationRef.current = requestAnimationFrame(updateBreathCycle);

    // Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'flashglow.resume');
    }
  }, [store, updateBreathCycle]);

  // Arrêter la session
  const stop = useCallback(() => {
    if (!store.running) return;

    store.stop();
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'flashglow.finish', {
        duration_sec: store.duration,
        cycles: store.totalCycles,
      });
    }

    toast({
      title: "Session terminée",
      description: "Bien joué ✨",
    });
  }, [store]);

  // Soumettre les métriques au backend
  const submit = useCallback(async () => {
    try {
      const payload = {
        pattern: store.pattern,
        duration_sec: store.duration,
        events: store.events,
        self_report: store.selfReport,
        hrv: {
          before_ms: null,
          after_ms: null
        }
      };

      const { data, error } = await supabase.functions.invoke('flash-glow-metrics', {
        body: payload
      });

      if (error) {
        console.error('Error submitting Flash Glow metrics:', error);
        // Fire-and-forget : ne pas bloquer l'UI
        return;
      }

      if (data?.badge_id) {
        store.setBadge(data.badge_id);
        toast({
          title: "Badge débloqué !",
          description: "Instant Glow obtenu 🌟",
        });
      }

      // Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'flashglow.metrics.submitted', {
          duration: store.duration,
          pattern: store.pattern,
        });
      }

    } catch (error) {
      console.error('Network error submitting metrics:', error);
      // Silencieux en cas d'offline - sera re-essayé plus tard
    }
  }, [store]);

  // Détection du prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      store.setReduceMotion(e.matches);
    };

    store.setReduceMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [store]);

  // Cleanup sur unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Calculer le progrès dans le cycle actuel
  const getPhaseProgress = useCallback(() => {
    if (!store.running || store.paused) return 0;
    
    const elapsed = phaseStartRef.current ? (Date.now() - phaseStartRef.current) / 1000 : 0;
    
    switch (store.phase) {
      case 'inhale':
        return Math.min(elapsed / patternConfig.inhale, 1);
      case 'hold':
        return Math.min(elapsed / patternConfig.hold, 1);
      case 'exhale':
        return Math.min(elapsed / patternConfig.exhale, 1);
      default:
        return 0;
    }
  }, [store.running, store.paused, store.phase, patternConfig]);

  return {
    // État
    state: {
      pattern: store.pattern,
      phase: store.phase,
      running: store.running,
      paused: store.paused,
      duration: store.duration,
      currentCycle: store.currentCycle,
      selfReport: store.selfReport,
      badgeId: store.badgeId,
      reduceMotion: store.reduceMotion,
      enableSound: store.enableSound,
      enableHaptic: store.enableHaptic,
    },
    
    // Actions
    start,
    pause,
    resume,
    stop,
    submit,
    
    // Configuration
    setPattern: store.setPattern,
    updateSelfReport: store.updateSelfReport,
    setReduceMotion: store.setReduceMotion,
    setEnableSound: store.setEnableSound,
    setEnableHaptic: store.setEnableHaptic,
    
    // Utils
    getPhaseProgress,
    patternConfig,
    totalCycleDuration,
    
    // Reset
    reset: store.reset,
  };
};