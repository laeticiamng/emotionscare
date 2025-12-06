// @ts-nocheck
import { useCallback } from 'react';
import { useStoryStore, type StoryGenre, type StoryEvent } from '@/store/story.store';
import { useSSE } from './useSSE';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface StartStoryParams {
  genre: StoryGenre;
  language?: 'fr' | 'en';
  intensity?: 'calm' | 'epic';
}

export const useStorySession = () => {
  const store = useStoryStore();

  // Gestion des événements SSE
  const handleSSEMessage = useCallback((event: MessageEvent) => {
    try {
      let data: StoryEvent;
      
      // Gérer les événements nommés
      if (event.type !== 'message') {
        data = {
          type: event.type as any,
          payload: JSON.parse(event.data)
        };
      } else {
        data = JSON.parse(event.data);
      }

      logger.debug('Story SSE event', { data }, 'SYSTEM');

      switch (data.type) {
        case 'chapter':
          store.addChapter(data.payload);
          break;
        case 'choices':
          store.setChoices(data.payload.items);
          break;
        case 'music':
          store.setMusic(data.payload);
          break;
        case 'prompt':
          // Micro-prompt narratif - peut être utilisé pour des interactions subtiles
          logger.debug('Narrative prompt', { payload: data.payload }, 'SYSTEM');
          break;
        default:
          logger.warn('Unknown SSE event type', { type: data.type }, 'SYSTEM');
      }
    } catch (error) {
      logger.error('Error parsing SSE message', error as Error, 'SYSTEM');
    }
  }, [store]);

  // Configuration SSE
  const { isConnected, error: sseError, reconnect } = useSSE(store.sseUrl, {
    onMessage: handleSSEMessage,
    onOpen: () => {
      store.setConnection(true);
      store.setError(null);
    },
    onError: () => {
      store.setConnection(false);
    },
    onClose: () => {
      store.setConnection(false);
    },
    autoReconnect: true,
    maxRetries: 5,
  });

  // Démarrer une nouvelle histoire
  const start = useCallback(async (params: StartStoryParams) => {
    try {
      store.setPhase('starting');
      store.setGenre(params.genre);
      store.setError(null);

      const { data, error } = await supabase.functions.invoke('story-start', {
        body: params
      });

      if (error) throw error;

      if (data?.session_id && data?.sse_url) {
        store.setSessionData(data.session_id, data.cover_url || '', data.sse_url);
        toast({
          title: "Histoire lancée",
          description: "La narration va commencer...",
        });
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error) {
      logger.error('Error starting story', error as Error, 'SYSTEM');
      store.setError('Impossible de lancer l\'histoire');
      store.setPhase('idle');
      toast({
        title: "Erreur",
        description: "Impossible de lancer l'histoire. Réessayez.",
        variant: "destructive",
      });
    }
  }, [store]);

  // Envoyer un choix utilisateur
  const sendChoice = useCallback(async (choiceId: string) => {
    if (!store.sessionId) {
      logger.error('No session ID available', new Error('Missing session ID'), 'SYSTEM');
      return;
    }

    try {
      store.setPhase('streaming');
      store.setChoices([]); // Clear choices while loading

      const { error } = await supabase.functions.invoke('story-choice', {
        body: {
          session_id: store.sessionId,
          choice_id: choiceId
        }
      });

      if (error) throw error;

      // Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'story.choice.made', {
          choice_id: choiceId,
          session_id: store.sessionId,
        });
      }

    } catch (error) {
      logger.error('Error sending choice', error as Error, 'SYSTEM');
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre choix. Réessayez.",
        variant: "destructive",
      });
      store.setPhase('choosing'); // Restore previous state
    }
  }, [store.sessionId, store]);

  // Exporter l'histoire en podcast
  const exportStory = useCallback(async (format: 'mp3' = 'mp3', includeArtwork = true) => {
    if (!store.sessionId) {
      logger.error('No session ID available for export', new Error('Missing session ID'), 'SYSTEM');
      return;
    }

    try {
      store.setPhase('exporting');

      const { data, error } = await supabase.functions.invoke('story-export', {
        body: {
          session_id: store.sessionId,
          format,
          include_artwork: includeArtwork
        }
      });

      if (error) throw error;

      if (data?.download_url) {
        store.setExportUrls(data.download_url, data.transcript_url || '');
        toast({
          title: "Export terminé",
          description: "Votre podcast est prêt ! 🎧",
        });

        // Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'story.export.ready', {
            session_id: store.sessionId,
            format,
          });
        }
      } else {
        throw new Error('URL de téléchargement manquante');
      }
    } catch (error) {
      logger.error('Error exporting story', error as Error, 'SYSTEM');
      store.setPhase('choosing');
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter l'histoire. Réessayez.",
        variant: "destructive",
      });
    }
  }, [store]);

  // Reprendre la narration en cas d'erreur SSE
  const resumeNarration = useCallback(() => {
    if (store.sseUrl && !isConnected) {
      reconnect();
      toast({
        title: "Reconnexion",
        description: "Reprise de la narration...",
      });
    }
  }, [store.sseUrl, isConnected, reconnect]);

  return {
    // État
    state: {
      sessionId: store.sessionId,
      genre: store.genre,
      phase: store.phase,
      chapter: store.chapter,
      choices: store.choices,
      music: store.music,
      coverUrl: store.coverUrl,
      chapters: store.chapters,
      currentAct: store.currentAct,
      isConnected,
      error: store.error || sseError,
      exportUrl: store.exportUrl,
      transcriptUrl: store.transcriptUrl,
    },
    
    // Actions
    start,
    sendChoice,
    exportStory,
    resumeNarration,
    reset: store.reset,
  };
};