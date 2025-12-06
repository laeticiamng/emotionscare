import { useState, useCallback, useEffect } from 'react';
import { useMoodStore, BlendState, BrsAnswer } from '@/store/mood.store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MoodSessionConfig {
  mode?: 'quick' | 'deep';
  cards?: string[];
}

interface MoodSessionResponse {
  session_id: string;
  ws_url?: string;
  cards: string[];
  track_url?: string;
}

interface MoodTrackResponse {
  track_url: string;
}

interface MoodEndResponse {
  saved: boolean;
  playlist_item_url: string;
}

export const useMoodSession = () => {
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  
  const moodStore = useMoodStore();

  const start = useCallback(async (config: MoodSessionConfig = {}) => {
    setIsStarting(true);
    try {
      const { data, error } = await supabase.functions.invoke('mood-mixer', {
        body: {
          mode: config.mode || 'quick',
          cards: config.cards || ['joy', 'calm', 'energy']
        }
      });

      if (error) throw error;

      if (data?.mix) {
        const sessionId = data.mix.mixId;
        const wsUrl = data.mix.adaptiveFeatures?.realTimeAdjustment ? 
          `${process.env.VITE_SUPABASE_URL?.replace('https', 'wss')}/functions/v1/mood-ws` : 
          undefined;

        moodStore.startSession(sessionId, wsUrl);
        
        if (config.cards) {
          moodStore.setCards(config.cards);
        }

        // Set initial track if available
        if (data.mix.playlist?.[0]?.audioUrl) {
          moodStore.setTrackUrl(data.mix.playlist[0].audioUrl);
        }

        toast({
          title: 'Session démarrée',
          description: 'Votre mix personnalisé est prêt !',
        });
      }
    } catch (error) {
      console.error('Error starting mood session:', error);
      
      // Fallback offline session
      const fallbackSessionId = `offline-${Date.now()}`;
      moodStore.startSession(fallbackSessionId);
      
      if (config.cards) {
        moodStore.setCards(config.cards);
      }
      
      // Set a fallback track URL
      moodStore.setTrackUrl('/audio/fallback-ambient.mp3');
      
      toast({
        title: 'Mode hors-ligne',
        description: 'Session locale créée avec succès',
      });
    } finally {
      setIsStarting(false);
    }
  }, [moodStore]);

  const end = useCallback(async () => {
    if (!moodStore.sessionId) return;

    setIsEnding(true);
    moodStore.endSession();
    
    try {
      const { data, error } = await supabase.functions.invoke('mood-session-end', {
        body: {
          session_id: moodStore.sessionId,
          answers: moodStore.answers,
          hume: moodStore.humeSummary,
          blend: moodStore.blend
        }
      });

      if (error) throw error;

      if (data?.playlist_item_url) {
        setPlaylistUrl(data.playlist_item_url);
      }

      toast({
        title: 'Mix sauvé !',
        description: 'Votre création a été ajoutée à votre playlist ✨',
      });
      
      moodStore.reset();
    } catch (error) {
      console.error('Error ending session:', error);
      
      // Fallback: just show completion message
      toast({
        title: 'Session terminée',
        description: 'Merci d\'avoir utilisé Mood Mixer !',
      });
      
      moodStore.reset();
    } finally {
      setIsEnding(false);
    }
  }, [moodStore]);

  const nextTrack = useCallback(async (blend: BlendState) => {
    if (!moodStore.sessionId) return;

    try {
      const { data, error } = await supabase.functions.invoke('mood-next-track', {
        body: {
          session_id: moodStore.sessionId,
          blend
        }
      });

      if (error) throw error;

      if (data?.track_url) {
        moodStore.setTrackUrl(data.track_url);
      }
    } catch (error) {
      console.error('Error loading next track:', error);
      
      // Fallback: cycle through predefined tracks
      const fallbackTracks = [
        '/audio/ambient-1.mp3',
        '/audio/ambient-2.mp3',
        '/audio/ambient-3.mp3'
      ];
      const randomTrack = fallbackTracks[Math.floor(Math.random() * fallbackTracks.length)];
      moodStore.setTrackUrl(randomTrack);
    }
  }, [moodStore]);

  const answerPrompt = useCallback((answer: BrsAnswer) => {
    moodStore.addAnswer(answer);
  }, [moodStore]);

  const setCards = useCallback((cards: string[]) => {
    moodStore.setCards(cards);
  }, [moodStore]);

  const updateBlend = useCallback((blend: Partial<BlendState>) => {
    moodStore.updateBlend(blend);
  }, [moodStore]);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      if (moodStore.status === 'active') {
        // Silent cleanup without API call
        moodStore.reset();
      }
    };
  }, [moodStore]);

  return {
    // State
    sessionId: moodStore.sessionId,
    status: moodStore.status,
    cards: moodStore.cards,
    blend: moodStore.blend,
    trackUrl: moodStore.trackUrl,
    isPlaying: moodStore.isPlaying,
    answers: moodStore.answers,
    currentPromptId: moodStore.currentPromptId,
    isStarting,
    isEnding,
    playlistUrl,
    
    // Actions
    start,
    end,
    nextTrack,
    answerPrompt,
    setCards,
    updateBlend,
    
    // Store actions
    setIsPlaying: moodStore.setIsPlaying,
    setCurrentPrompt: moodStore.setCurrentPrompt,
    setHumeSummary: moodStore.setHumeSummary,
  };
};