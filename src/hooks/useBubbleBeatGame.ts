/**
 * Hook complet pour le jeu Bubble Beat
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type GameMode = 'calm' | 'energetic' | 'focus';
type GamePhase = 'idle' | 'playing' | 'paused' | 'completed';

interface GameState {
  phase: GamePhase;
  mode: GameMode;
  difficulty: number;
  score: number;
  bubblesPopped: number;
  elapsedTime: number;
  heartRate: number;
  coherence: number;
  combo: number;
  sessionId: string | null;
}

interface GameStats {
  totalSessions: number;
  totalScore: number;
  totalBubblesPopped: number;
  averageScore: number;
  bestScore: number;
  totalPlaytimeMinutes: number;
  currentStreak: number;
  bestStreak: number;
}

const INITIAL_STATE: GameState = {
  phase: 'idle',
  mode: 'calm',
  difficulty: 2,
  score: 0,
  bubblesPopped: 0,
  elapsedTime: 0,
  heartRate: 72,
  coherence: 75,
  combo: 0,
  sessionId: null
};

const INITIAL_STATS: GameStats = {
  totalSessions: 0,
  totalScore: 0,
  totalBubblesPopped: 0,
  averageScore: 0,
  bestScore: 0,
  totalPlaytimeMinutes: 0,
  currentStreak: 0,
  bestStreak: 0
};

export function useBubbleBeatGame() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hrSimRef = useRef<NodeJS.Timeout | null>(null);
  const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Charger les stats depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bubble-beat-stats');
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (e) {
        console.error('Erreur chargement stats:', e);
      }
    }
    setIsLoadingStats(false);
  }, []);

  // Sauvegarder les stats
  const saveStats = useCallback((newStats: GameStats) => {
    localStorage.setItem('bubble-beat-stats', JSON.stringify(newStats));
    setStats(newStats);
  }, []);

  // Démarrer une partie
  const startGame = useCallback(async () => {
    const sessionId = crypto.randomUUID();
    
    setState(prev => ({
      ...prev,
      phase: 'playing',
      score: 0,
      bubblesPopped: 0,
      elapsedTime: 0,
      combo: 0,
      sessionId
    }));

    // Timer
    timerRef.current = setInterval(() => {
      setState(prev => ({ ...prev, elapsedTime: prev.elapsedTime + 1 }));
    }, 1000);

    // Simulation rythme cardiaque
    hrSimRef.current = setInterval(() => {
      setState(prev => ({
        ...prev,
        heartRate: Math.max(50, Math.min(120, prev.heartRate + (Math.random() - 0.5) * 4)),
        coherence: Math.max(0, Math.min(100, prev.coherence + (Math.random() - 0.5) * 5))
      }));
    }, 1000);

    // Appel backend
    try {
      await supabase.functions.invoke('bubble-sessions', {
        body: { action: 'start', gameMode: state.mode, difficulty: state.difficulty }
      });
    } catch (e) {
      console.warn('Failed to start session on backend:', e);
    }

    toast({ title: '🎮 C\'est parti !', description: 'Éclatez les bulles !' });
  }, [state.mode, state.difficulty, toast]);

  // Pause
  const pauseGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (hrSimRef.current) clearInterval(hrSimRef.current);
    setState(prev => ({ ...prev, phase: 'paused' }));
    toast({ title: '⏸️ Pause' });
  }, [toast]);

  // Reprendre
  const resumeGame = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'playing' }));
    
    timerRef.current = setInterval(() => {
      setState(prev => ({ ...prev, elapsedTime: prev.elapsedTime + 1 }));
    }, 1000);

    hrSimRef.current = setInterval(() => {
      setState(prev => ({
        ...prev,
        heartRate: Math.max(50, Math.min(120, prev.heartRate + (Math.random() - 0.5) * 4)),
        coherence: Math.max(0, Math.min(100, prev.coherence + (Math.random() - 0.5) * 5))
      }));
    }, 1000);
  }, []);

  // Terminer
  const endGame = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (hrSimRef.current) clearInterval(hrSimRef.current);
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);

    setState(prev => ({ ...prev, phase: 'completed' }));

    // Mettre à jour les stats
    const newStats: GameStats = {
      totalSessions: stats.totalSessions + 1,
      totalScore: stats.totalScore + state.score,
      totalBubblesPopped: stats.totalBubblesPopped + state.bubblesPopped,
      averageScore: Math.round((stats.totalScore + state.score) / (stats.totalSessions + 1)),
      bestScore: Math.max(stats.bestScore, state.score),
      totalPlaytimeMinutes: stats.totalPlaytimeMinutes + state.elapsedTime / 60,
      currentStreak: stats.currentStreak + 1,
      bestStreak: Math.max(stats.bestStreak, stats.currentStreak + 1)
    };
    saveStats(newStats);

    // Appel backend
    try {
      await supabase.functions.invoke('bubble-sessions', {
        body: { 
          action: 'end', 
          score: state.score, 
          duration: state.elapsedTime,
          biometrics: { hrv: 45, coherenceLevel: state.coherence }
        }
      });
    } catch (e) {
      console.warn('Failed to end session on backend:', e);
    }

    toast({ 
      title: '🎉 Partie terminée !', 
      description: `Score : ${state.score.toLocaleString()} points` 
    });
  }, [state, stats, saveStats, toast]);

  // Éclater une bulle
  const popBubble = useCallback((points: number) => {
    // Reset combo timeout
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    
    setState(prev => {
      const newCombo = prev.combo + 1;
      const multiplier = Math.min(newCombo, 5);
      const finalPoints = points * multiplier;
      
      return {
        ...prev,
        score: prev.score + finalPoints,
        bubblesPopped: prev.bubblesPopped + 1,
        combo: newCombo
      };
    });

    // Combo decay après 2 secondes
    comboTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, combo: 0 }));
    }, 2000);
  }, []);

  // Reset
  const resetGame = useCallback(() => {
    setState(prev => ({
      ...INITIAL_STATE,
      mode: prev.mode,
      difficulty: prev.difficulty
    }));
  }, []);

  // Changer le mode
  const setMode = useCallback((mode: GameMode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  // Changer la difficulté
  const setDifficulty = useCallback((difficulty: number) => {
    setState(prev => ({ ...prev, difficulty }));
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (hrSimRef.current) clearInterval(hrSimRef.current);
      if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    };
  }, []);

  return {
    state,
    stats,
    isLoadingStats,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    popBubble,
    resetGame,
    setMode,
    setDifficulty
  };
}
