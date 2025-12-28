import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

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
      // Utiliser suno-music qui existe
      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: { 
          action: 'generate',
          emotion: state.preset,
          style: state.preset,
          mode: 'quick',
          source: state.source,
          instrumental: true
        }
      });

      if (error) throw error;

      const trackData = data?.data || data;
      const trackUrl = trackData?.audio_url || trackData?.audioUrl;
      
      if (trackUrl) {
        setState(prev => ({
          ...prev,
          sessionId: trackData?.taskId || trackData?.id || `session_${Date.now()}`,
          trackUrl,
          coverUrl: trackData?.image_url || trackData?.imageUrl,
          tags: trackData?.tags || [state.preset],
          playing: true,
          loading: false,
          nowLabel: `Lecture : ${state.preset} - piste 1`
        }));

        toast({
          title: "Session démarrée",
          description: `Génération musicale pour ${state.preset}`,
          duration: 2000
        });
      } else {
        // Si on a un taskId, on doit attendre la génération
        const taskId = trackData?.taskId;
        if (taskId) {
          setState(prev => ({
            ...prev,
            sessionId: taskId,
            tags: [state.preset, 'generating'],
            loading: true,
            nowLabel: `Génération en cours pour ${state.preset}...`
          }));
          
          toast({
            title: "Génération en cours",
            description: "Votre musique sera prête dans quelques instants",
            duration: 3000
          });
        } else {
          throw new Error('No track URL or taskId returned');
        }
      }

    } catch (error) {
      logger.warn('Suno session error, using fallback', error as Error, 'MUSIC');
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
      // Utiliser suno-music avec action status/next
      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: {
          action: 'generate',
          emotion: state.preset,
          style: state.preset,
          blend: options?.blend,
          instrumental: true
        }
      });

      if (error) throw error;

      const trackData = data?.data || data;
      const trackUrl = trackData?.audio_url || trackData?.audioUrl;
      
      if (trackUrl) {
        setState(prev => ({
          ...prev,
          trackUrl,
          coverUrl: trackData?.image_url || trackData?.imageUrl,
          tags: trackData?.tags || [state.preset],
          loading: false,
          nowLabel: `Lecture : ${state.preset} - piste suivante`
        }));

        toast({
          title: "Piste suivante",
          description: "Nouvelle génération musicale",
          duration: 2000
        });
      }

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
  }, []);

  const save = useCallback(async () => {
    if (!state.sessionId || !state.trackUrl) {
      toast({
        title: "Rien à sauvegarder",
        description: "Lancez d'abord une session",
        duration: 2000
      });
      return;
    }

    try {
      // Sauvegarder dans la table music_tracks
      const { error } = await supabase
        .from('music_tracks')
        .insert({
          title: `Session ${state.preset} - ${new Date().toLocaleDateString()}`,
          artist: 'Suno AI',
          audio_url: state.trackUrl,
          cover_url: state.coverUrl,
          emotion: state.preset,
          tags: state.tags?.join(', '),
          duration: 120
        });

      if (error) throw error;

      toast({
        title: "Session sauvegardée",
        description: "Ajoutée à votre bibliothèque",
        duration: 2000
      });

    } catch (error) {
      logger.error('Save session error', error as Error, 'MUSIC');
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder",
        variant: "destructive"
      });
    }
  }, [state.sessionId, state.preset, state.trackUrl, state.coverUrl, state.tags]);

  return {
    start,
    next,
    stop,
    save,
    state: sessionState
  };
};