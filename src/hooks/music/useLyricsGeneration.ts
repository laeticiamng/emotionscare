/**
 * Hook pour générer des paroles via Suno API
 */
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

interface LyricsGenerationState {
  isGenerating: boolean;
  taskId: string | null;
  lyrics: string | null;
  title: string | null;
  error: string | null;
  status: 'idle' | 'pending' | 'completed' | 'error';
}

interface UseLyricsGenerationOptions {
  onSuccess?: (lyrics: string, title: string | null) => void;
  onError?: (error: string) => void;
  pollInterval?: number;
  maxPolls?: number;
}

export function useLyricsGeneration(options: UseLyricsGenerationOptions = {}) {
  const { 
    onSuccess, 
    onError, 
    pollInterval = 3000,
    maxPolls = 40 // 2 minutes max
  } = options;
  
  const { toast } = useToast();
  
  const [state, setState] = useState<LyricsGenerationState>({
    isGenerating: false,
    taskId: null,
    lyrics: null,
    title: null,
    error: null,
    status: 'idle'
  });

  const pollStatus = useCallback(async (taskId: string, pollCount = 0): Promise<void> => {
    if (pollCount >= maxPolls) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: 'Génération timeout - veuillez réessayer',
        status: 'error'
      }));
      onError?.('Timeout');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('suno-lyrics', {
        body: { action: 'status', taskId }
      });

      if (error) throw error;

      if (data?.data?.status === 'completed' && data?.data?.lyrics) {
        setState(prev => ({
          ...prev,
          isGenerating: false,
          lyrics: data.data.lyrics,
          title: data.data.title,
          status: 'completed'
        }));
        
        onSuccess?.(data.data.lyrics, data.data.title);
        
        toast({
          title: 'Paroles générées',
          description: data.data.title || 'Vos paroles sont prêtes',
        });
        
        return;
      }

      // Continue polling
      setTimeout(() => pollStatus(taskId, pollCount + 1), pollInterval);
      
    } catch (err) {
      logger.error('[useLyricsGeneration] Poll error:', err as Error, 'Hooks');
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: 'Erreur lors de la vérification',
        status: 'error'
      }));
      onError?.('Poll error');
    }
  }, [maxPolls, pollInterval, onSuccess, onError, toast]);

  const generateLyrics = useCallback(async (prompt: string): Promise<string | null> => {
    if (!prompt.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer un thème pour les paroles',
        variant: 'destructive'
      });
      return null;
    }

    setState({
      isGenerating: true,
      taskId: null,
      lyrics: null,
      title: null,
      error: null,
      status: 'pending'
    });

    try {
      logger.info('[useLyricsGeneration] Generating lyrics with prompt:', { prompt }, 'Hooks');
      
      const { data, error } = await supabase.functions.invoke('suno-lyrics', {
        body: { action: 'generate', prompt }
      });

      if (error) throw error;

      if (!data?.success || !data?.data?.taskId) {
        throw new Error(data?.error || 'Failed to start lyrics generation');
      }

      const taskId = data.data.taskId;
      setState(prev => ({ ...prev, taskId }));
      
      toast({
        title: 'Génération en cours',
        description: 'Vos paroles sont en cours de création...',
      });

      // Start polling
      pollStatus(taskId);
      
      return taskId;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      logger.error('[useLyricsGeneration] Generation error:', err as Error, 'Hooks');
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
        status: 'error'
      }));
      
      toast({
        title: 'Erreur de génération',
        description: errorMessage,
        variant: 'destructive'
      });
      
      onError?.(errorMessage);
      return null;
    }
  }, [pollStatus, toast, onError]);

  const reset = useCallback(() => {
    setState({
      isGenerating: false,
      taskId: null,
      lyrics: null,
      title: null,
      error: null,
      status: 'idle'
    });
  }, []);

  return {
    ...state,
    generateLyrics,
    reset
  };
}
