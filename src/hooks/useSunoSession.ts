import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type MoodPreset = 'calme' | 'focus' | 'energie_douce' | 'sommeil' | 'uplift' | 'ambient';
export type Blend = { valence: number; arousal: number };

export interface SunoStartResponse {
  session_id: string;
  track_url: string;
  cover_url?: string;
  tags: string[];
}

export interface SunoNextResponse {
  track_url: string;
  cover_url?: string;
  tags: string[];
}

interface SessionState {
  sessionId: string | null;
  preset: MoodPreset;
  trackUrl: string | null;
  coverUrl: string | null;
  tags: string[];
  playing: boolean;
  loading: boolean;
  source: 'manual' | 'hume';
  humeEnabled: boolean;
  blend: Blend | null;
  nowLabel: string;
  setPreset: (preset: MoodPreset) => void;
  setBlend: (blend: Blend) => void;
}

const fallbackTracks = {
  calme: '/sounds/ambient-calm.mp3',
  focus: '/sounds/focus-ambient.mp3',
  energie_douce: '/sounds/nature-calm.mp3',
  sommeil: '/sounds/ambient-calm.mp3',
  uplift: '/sounds/energy-boost.mp3',
  ambient: '/sounds/ambient-calm.mp3',
};

export const useSunoSession = () => {
  const [state, setState] = useState<Omit<SessionState, 'setPreset' | 'setBlend'>>({
    sessionId: null,
    preset: 'calme',
    trackUrl: null,
    coverUrl: null,
    tags: [],
    playing: false,
    loading: false,
    source: 'manual',
    humeEnabled: false,
    blend: null,
    nowLabel: '',
  });

  const setPreset = useCallback((preset: MoodPreset) => {
    setState(prev => ({ ...prev, preset }));
  }, []);

  const setBlend = useCallback((blend: Blend) => {
    setState(prev => ({ ...prev, blend }));
  }, []);

  const sessionState: SessionState = {
    ...state,
    setPreset,
    setBlend,
  };

  const start = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const { data, error } = await supabase.functions.invoke('suno-music-generation', {
        body: { 
          preset: state.preset, 
          mode: 'quick',
          source: state.source 
        }
      });

      if (error) throw error;

      const response = data as SunoStartResponse;
      
      setState(prev => ({
        ...prev,
        sessionId: response.session_id,
        trackUrl: response.track_url,
        coverUrl: response.cover_url,
        tags: response.tags,
        playing: true,
        loading: false,
        nowLabel: `Lecture : ${state.preset} - piste 1`
      }));

      toast({
        title: "Session démarrée",
        description: `Génération musicale pour ${state.preset}`,
        duration: 2000
      });

    } catch (error) {
      // Fallback to local tracks
      const fallbackUrl = fallbackTracks[state.preset];
      setState(prev => ({
        ...prev,
        trackUrl: fallbackUrl,
        tags: [state.preset, 'fallback'],
        playing: true,
        loading: false,
        nowLabel: `Lecture locale : ${state.preset}`
      }));

      toast({
        title: "Mode hors ligne",
        description: "Lecture d'une piste locale",
        duration: 3000
      });
    }
  }, [state.preset, state.source]);

  const next = useCallback(async (options?: { blend?: Blend }) => {
    if (!state.sessionId) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      const { data, error } = await supabase.functions.invoke('suno-music-generation', {
        body: {
          session_id: state.sessionId,
          blend: options?.blend
        }
      });

      if (error) throw error;

      const response = data as SunoNextResponse;
      
      setState(prev => ({
        ...prev,
        trackUrl: response.track_url,
        coverUrl: response.cover_url,
        tags: response.tags,
        loading: false,
        nowLabel: `Lecture : ${state.preset} - piste suivante`
      }));

      toast({
        title: "Piste suivante",
        description: "Nouvelle génération musicale",
        duration: 2000
      });

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      toast({
        title: "Pas de piste suivante",
        description: "On continue avec la piste actuelle",
        duration: 2000
      });
    }
  }, [state.sessionId, state.preset]);

  const stop = useCallback(async () => {
    if (state.sessionId) {
      try {
        await supabase.functions.invoke('suno-music-generation', {
          body: {
            session_id: state.sessionId,
            action: 'stop',
            duration_sec: 180 // Exemple de durée
          }
        });
      } catch (error) {
        console.log('Error stopping session:', error);
      }
    }

    setState(prev => ({
      ...prev,
      playing: false,
      sessionId: null,
      nowLabel: ''
    }));

    toast({
      title: "Session terminée",
      description: "Belle session ✨",
      duration: 2000
    });
  }, [state.sessionId]);

  const save = useCallback(async () => {
    if (!state.sessionId) return;

    try {
      const { data, error } = await supabase.functions.invoke('suno-music-generation', {
        body: {
          session_id: state.sessionId,
          action: 'save',
          title: `Session ${state.preset} - ${new Date().toLocaleDateString()}`
        }
      });

      if (error) throw error;

      toast({
        title: "Session sauvegardée",
        description: "Ajoutée à votre playlist",
        duration: 2000
      });

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder",
        variant: "destructive"
      });
    }
  }, [state.sessionId, state.preset]);

  return {
    start,
    next,
    stop,
    save,
    state: sessionState
  };
};