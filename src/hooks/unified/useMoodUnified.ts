/**
 * useMoodUnified - Hook unifié pour toute la gestion de l'humeur
 * Consolide: useMood, useCurrentMood, useMoodSession, useMoodTracking
 * 
 * Architecture: Single source of truth pour l'état émotionnel
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { buildMoodSignals, type MoodPalette, type MoodEventDetail } from '@/utils/moodSignals';
import { getVibeEmoji, getVibeLabel, type MoodVibe } from '@/utils/moodVibes';

// ============================================================================
// TYPES
// ============================================================================

export interface MoodState {
  // Core SAM dimensions
  valence: number;   // -100 à +100 (négatif à positif)
  arousal: number;   // 0 à 100 (calme à excité)
  
  // Computed signals
  vibe: MoodVibe;
  summary: string;
  microGesture: string;
  palette: MoodPalette;
  
  // Metadata
  timestamp: string;
  isLoading: boolean;
  error: string | null;
}

export interface MoodEntry {
  id?: string;
  user_id?: string;
  mood_score: number;
  energy_level?: number;
  stress_level?: number;
  emotions: string[];
  notes?: string;
  source: 'manual' | 'scan' | 'voice' | 'emoji' | 'session';
  context?: {
    location?: string;
    activity?: string;
    weather?: string;
    time_of_day?: string;
  };
  created_at?: string;
}

export interface SessionState {
  sessionId: string | null;
  status: 'idle' | 'starting' | 'active' | 'ending' | 'completed';
  cards: string[];
  blend: { joy: number; calm: number; energy: number; focus: number };
  trackUrl: string | null;
  isPlaying: boolean;
}

export interface MoodStats {
  average_mood: number;
  average_energy: number;
  average_stress: number;
  dominant_emotions: string[];
  entries_count: number;
  trend: 'up' | 'down' | 'stable';
}

// ============================================================================
// STORE (Single source of truth)
// ============================================================================

const baselineSignals = buildMoodSignals(0, 50);

interface UnifiedMoodStore extends MoodState, SessionState {
  // Core actions
  updateMood: (valence: number, arousal: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetMood: () => void;
  
  // Session actions
  startSession: (sessionId: string) => void;
  endSession: () => void;
  setCards: (cards: string[]) => void;
  setTrackUrl: (url: string) => void;
  setIsPlaying: (playing: boolean) => void;
  updateBlend: (blend: Partial<SessionState['blend']>) => void;
  resetSession: () => void;
}

const useUnifiedMoodStore = create<UnifiedMoodStore>()(
  persist(
    (set, get) => ({
      // Initial mood state
      valence: 0,
      arousal: 50,
      vibe: baselineSignals.vibe,
      summary: baselineSignals.summary,
      microGesture: baselineSignals.microGesture,
      palette: baselineSignals.palette,
      timestamp: new Date().toISOString(),
      isLoading: false,
      error: null,
      
      // Initial session state
      sessionId: null,
      status: 'idle',
      cards: [],
      blend: { joy: 0.5, calm: 0.5, energy: 0.5, focus: 0.5 },
      trackUrl: null,
      isPlaying: false,
      
      // Core mood actions
      updateMood: (valence: number, arousal: number) => {
        const clampedValence = Math.max(-100, Math.min(100, valence));
        const clampedArousal = Math.max(0, Math.min(100, arousal));
        const signals = buildMoodSignals(clampedValence, clampedArousal);
        const timestamp = new Date().toISOString();
        
        set({
          valence: clampedValence,
          arousal: clampedArousal,
          vibe: signals.vibe,
          summary: signals.summary,
          microGesture: signals.microGesture,
          palette: signals.palette,
          timestamp,
          error: null,
        });
        
        // Dispatch global event for cross-module sync
        if (typeof window !== 'undefined') {
          const detail: MoodEventDetail = {
            valence: clampedValence,
            arousal: clampedArousal,
            timestamp,
            summary: signals.summary,
            microGesture: signals.microGesture,
            palette: signals.palette,
            vibe: signals.vibe,
          };
          window.dispatchEvent(new CustomEvent('mood.updated', { detail }));
        }
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      resetMood: () => {
        const baseline = buildMoodSignals(0, 50);
        set({
          valence: 0,
          arousal: 50,
          vibe: baseline.vibe,
          summary: baseline.summary,
          microGesture: baseline.microGesture,
          palette: baseline.palette,
          timestamp: new Date().toISOString(),
          error: null,
        });
      },
      
      // Session actions
      startSession: (sessionId) => set({
        sessionId,
        status: 'starting',
      }),
      
      endSession: () => {
        const state = get();
        if (state.status === 'active' || state.status === 'starting') {
          set({ status: 'ending', isPlaying: false });
        }
      },
      
      setCards: (cards) => {
        const currentBlend = get().blend;
        const newBlend = cards.reduce((acc, card) => {
          if (card === 'joy') acc.joy = Math.min(1, acc.joy + 0.3);
          if (card === 'calm') acc.calm = Math.min(1, acc.calm + 0.3);
          if (card === 'energy') acc.energy = Math.min(1, acc.energy + 0.3);
          if (card === 'focus') acc.focus = Math.min(1, acc.focus + 0.3);
          return acc;
        }, { ...currentBlend });
        set({ cards, blend: newBlend });
      },
      
      setTrackUrl: (url) => set({ trackUrl: url, status: 'active' }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      updateBlend: (blend) => set((state) => ({ blend: { ...state.blend, ...blend } })),
      
      resetSession: () => set({
        sessionId: null,
        status: 'idle',
        cards: [],
        blend: { joy: 0.5, calm: 0.5, energy: 0.5, focus: 0.5 },
        trackUrl: null,
        isPlaying: false,
      }),
    }),
    {
      name: 'emotions-care-mood-unified',
      version: 2,
      partialize: (state) => ({
        valence: state.valence,
        arousal: state.arousal,
        timestamp: state.timestamp,
        sessionId: state.sessionId,
        cards: state.cards,
      }),
    }
  )
);

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useMoodUnified() {
  const store = useUnifiedMoodStore();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  
  // ===== COMPUTED VALUES =====
  
  const normalized = useMemo(() => ({
    valence: Math.round(((store.valence + 100) / 200) * 100),
    arousal: Math.round(store.arousal),
  }), [store.valence, store.arousal]);
  
  const snapshot = useMemo(() => ({
    vibe: store.vibe,
    label: getVibeLabel(store.vibe),
    emoji: getVibeEmoji(store.vibe),
    summary: store.summary,
    microGesture: store.microGesture,
    palette: store.palette,
    valence: store.valence,
    arousal: store.arousal,
    normalized,
    timestamp: store.timestamp,
    isLoading: store.isLoading,
    hasError: Boolean(store.error),
  }), [store, normalized]);
  
  // ===== MOOD TRACKING =====
  
  const recordMood = useCallback(async (
    entry: Omit<MoodEntry, 'id' | 'user_id' | 'created_at'>
  ): Promise<MoodEntry | null> => {
    if (!isAuthenticated || !user?.id) {
      logger.warn('Cannot record mood: user not authenticated', 'MOOD');
      return null;
    }
    
    setIsRecording(true);
    
    try {
      const moodData = {
        user_id: user.id,
        mood_score: entry.mood_score,
        energy_level: entry.energy_level,
        stress_level: entry.stress_level,
        emotions: entry.emotions,
        notes: entry.notes,
        source: entry.source,
        context: entry.context || {},
        created_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('mood_entries')
        .insert(moodData)
        .select()
        .single();
      
      if (error) {
        logger.error(`Failed to record mood: ${error.message}`, 'MOOD');
        toast({
          title: 'Erreur',
          description: 'Impossible d\'enregistrer votre humeur',
          variant: 'destructive',
        });
        return null;
      }
      
      toast({
        title: '✨ Humeur enregistrée',
        description: 'Merci de partager comment vous vous sentez',
      });
      
      return data;
    } catch (err) {
      logger.error(`Mood recording error: ${err}`, 'MOOD');
      return null;
    } finally {
      setIsRecording(false);
    }
  }, [isAuthenticated, user?.id, toast]);
  
  const recordFromScan = useCallback(async (
    emotions: Record<string, number>,
    source: 'scan' | 'voice' = 'scan'
  ): Promise<MoodEntry | null> => {
    const sortedEmotions = Object.entries(emotions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([emotion]) => emotion);
    
    const positiveEmotions = ['joy', 'happy', 'excited', 'calm', 'content', 'peaceful'];
    const negativeEmotions = ['sad', 'angry', 'anxious', 'fear', 'disgust', 'stressed'];
    
    let moodScore = 5;
    const topEmotion = sortedEmotions[0]?.toLowerCase();
    
    if (positiveEmotions.includes(topEmotion)) {
      moodScore = 7 + Math.floor(emotions[sortedEmotions[0]] * 3);
    } else if (negativeEmotions.includes(topEmotion)) {
      moodScore = 4 - Math.floor(emotions[sortedEmotions[0]] * 3);
    }
    
    moodScore = Math.max(1, Math.min(10, moodScore));
    
    return recordMood({
      mood_score: moodScore,
      emotions: sortedEmotions,
      source,
      context: {
        time_of_day: getTimeOfDay(),
      },
    });
  }, [recordMood]);
  
  // ===== STATS & HISTORY =====
  
  const getStats = useCallback(async (days = 7): Promise<MoodStats | null> => {
    if (!isAuthenticated || !user?.id) return null;
    
    try {
      const startDate = new Date(Date.now() - days * 86400000).toISOString();
      
      const { data: entries } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .order('created_at', { ascending: true });
      
      if (!entries || entries.length === 0) {
        return {
          average_mood: 0,
          average_energy: 0,
          average_stress: 0,
          dominant_emotions: [],
          entries_count: 0,
          trend: 'stable',
        };
      }
      
      const avgMood = entries.reduce((sum, e) => sum + e.mood_score, 0) / entries.length;
      const avgEnergy = entries.reduce((sum, e) => sum + (e.energy_level || 5), 0) / entries.length;
      const avgStress = entries.reduce((sum, e) => sum + (e.stress_level || 5), 0) / entries.length;
      
      const emotionCounts: Record<string, number> = {};
      entries.forEach(entry => {
        (entry.emotions || []).forEach((emotion: string) => {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
      });
      
      const dominantEmotions = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([emotion]) => emotion);
      
      const midpoint = Math.floor(entries.length / 2);
      const firstHalfAvg = entries.slice(0, midpoint).reduce((sum, e) => sum + e.mood_score, 0) / midpoint || avgMood;
      const secondHalfAvg = entries.slice(midpoint).reduce((sum, e) => sum + e.mood_score, 0) / (entries.length - midpoint) || avgMood;
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (secondHalfAvg - firstHalfAvg > 0.5) trend = 'up';
      else if (firstHalfAvg - secondHalfAvg > 0.5) trend = 'down';
      
      return {
        average_mood: Math.round(avgMood * 10) / 10,
        average_energy: Math.round(avgEnergy * 10) / 10,
        average_stress: Math.round(avgStress * 10) / 10,
        dominant_emotions: dominantEmotions,
        entries_count: entries.length,
        trend,
      };
    } catch (err) {
      logger.error(`Failed to get mood stats: ${err}`, 'MOOD');
      return null;
    }
  }, [isAuthenticated, user?.id]);
  
  const getHistory = useCallback(async (limit = 30): Promise<MoodEntry[]> => {
    if (!isAuthenticated || !user?.id) return [];
    
    try {
      const { data } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      return data || [];
    } catch (err) {
      logger.error(`Failed to get mood history: ${err}`, 'MOOD');
      return [];
    }
  }, [isAuthenticated, user?.id]);
  
  // ===== SESSION MANAGEMENT =====
  
  const startSession = useCallback(async (config: { mode?: 'quick' | 'deep'; cards?: string[] } = {}) => {
    store.setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('mood-mixer', {
        body: {
          mode: config.mode || 'quick',
          cards: config.cards || ['joy', 'calm', 'energy'],
        },
      });
      
      if (error) throw error;
      
      if (data?.mix) {
        const sessionId = data.mix.mixId;
        store.startSession(sessionId);
        
        if (config.cards) store.setCards(config.cards);
        if (data.mix.playlist?.[0]?.audioUrl) {
          store.setTrackUrl(data.mix.playlist[0].audioUrl);
        }
        
        toast({
          title: 'Session démarrée',
          description: 'Votre mix personnalisé est prêt !',
        });
      }
    } catch (error) {
      logger.error('Error starting mood session', error as Error, 'MUSIC');
      
      // Fallback offline
      const fallbackSessionId = `offline-${Date.now()}`;
      store.startSession(fallbackSessionId);
      if (config.cards) store.setCards(config.cards);
      store.setTrackUrl('/audio/fallback-ambient.mp3');
      
      toast({
        title: 'Mode hors-ligne',
        description: 'Session locale créée avec succès',
      });
    } finally {
      store.setLoading(false);
    }
  }, [store, toast]);
  
  const endSession = useCallback(async () => {
    if (!store.sessionId) return;
    
    store.endSession();
    
    try {
      await supabase.functions.invoke('mood-session-end', {
        body: {
          session_id: store.sessionId,
          blend: store.blend,
        },
      });
      
      toast({
        title: 'Mix sauvé !',
        description: 'Votre création a été ajoutée à votre playlist ✨',
      });
    } catch (error) {
      logger.error('Error ending session', error as Error, 'MUSIC');
      toast({
        title: 'Session terminée',
        description: 'Merci d\'avoir utilisé Mood Mixer !',
      });
    } finally {
      store.resetSession();
    }
  }, [store, toast]);
  
  // ===== SYNC WITH GLOBAL EVENTS =====
  
  useEffect(() => {
    const handleMoodUpdate = (event: CustomEvent<Partial<MoodEventDetail>>) => {
      const detail = event.detail;
      if (!detail) return;
      
      const valence = Number.isFinite(detail.valence) 
        ? Math.max(-100, Math.min(100, detail.valence!))
        : store.valence;
      const arousal = Number.isFinite(detail.arousal)
        ? Math.max(0, Math.min(100, detail.arousal!))
        : store.arousal;
      
      // Only update if values are different (prevent loop)
      if (valence !== store.valence || arousal !== store.arousal) {
        const computed = buildMoodSignals(valence, arousal);
        useUnifiedMoodStore.setState({
          valence,
          arousal,
          timestamp: detail.timestamp ?? new Date().toISOString(),
          vibe: detail.vibe ?? computed.vibe,
          summary: detail.summary ?? computed.summary,
          microGesture: detail.microGesture ?? computed.microGesture,
          palette: detail.palette ?? computed.palette,
        });
      }
    };
    
    window.addEventListener('mood.updated', handleMoodUpdate as EventListener);
    return () => window.removeEventListener('mood.updated', handleMoodUpdate as EventListener);
  }, [store.valence, store.arousal]);
  
  // ===== AUTO-REFRESH STALE DATA =====
  
  useEffect(() => {
    const lastUpdate = new Date(store.timestamp);
    const diffMinutes = (Date.now() - lastUpdate.getTime()) / 60000;
    
    if (diffMinutes > 30) {
      // Data is stale, could trigger a refresh here
      logger.info('Mood data is stale (>30min)', 'MOOD');
    }
  }, [store.timestamp]);
  
  return {
    // State
    ...snapshot,
    session: {
      id: store.sessionId,
      status: store.status,
      cards: store.cards,
      blend: store.blend,
      trackUrl: store.trackUrl,
      isPlaying: store.isPlaying,
    },
    isRecording,
    
    // Core actions
    updateMood: store.updateMood,
    resetMood: store.resetMood,
    
    // Tracking
    recordMood,
    recordFromScan,
    getStats,
    getHistory,
    
    // Session
    startSession,
    endSession,
    setCards: store.setCards,
    setTrackUrl: store.setTrackUrl,
    setIsPlaying: store.setIsPlaying,
    updateBlend: store.updateBlend,
  };
}

// ============================================================================
// HELPERS
// ============================================================================

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

// Export store for direct access if needed
export { useUnifiedMoodStore };

export default useMoodUnified;
