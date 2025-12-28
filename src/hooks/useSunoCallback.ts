/**
 * useSunoCallback - Hook pour écouter les callbacks Suno via Supabase Realtime
 * Écoute la table suno_callbacks en temps réel
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SunoCallback } from '@/types/music-generation';
import { logger } from '@/lib/logger';

interface UseSunoCallbackOptions {
  taskId: string | null;
  onComplete?: (callback: SunoCallback) => void;
  onError?: (error: string) => void;
}

interface CallbackMetadata {
  audioUrl?: string;
  imageUrl?: string;
  duration?: number;
  title?: string;
  model?: string;
  style?: string;
}

export const useSunoCallback = ({ taskId, onComplete, onError }: UseSunoCallbackOptions) => {
  const [latestCallback, setLatestCallback] = useState<SunoCallback | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onErrorRef.current = onError;
  }, [onComplete, onError]);

  // Get signed URL from storage
  const getSignedUrl = useCallback(async (tId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('sign-emotion-track', {
        body: { taskId: tId }
      });
      if (!error && data?.url) {
        logger.info('Got signed URL for playback', { taskId: tId }, 'MUSIC');
        setSignedUrl(data.url);
        return data.url;
      }
    } catch (err) {
      logger.warn('Could not get signed URL', err as Error, 'MUSIC');
    }
    return null;
  }, []);

  // Handle completion
  const handleComplete = useCallback(async (metadata: CallbackMetadata) => {
    if (completedRef.current) return;
    completedRef.current = true;

    const audioUrl = metadata.audioUrl || (taskId ? await getSignedUrl(taskId) : null);
    
    const callback: SunoCallback = {
      taskId: taskId || '',
      callbackType: 'complete',
      status: 'completed',
      data: {
        audioUrl: audioUrl || undefined,
        title: metadata.title,
        duration: metadata.duration,
      }
    };

    setLatestCallback(callback);
    setIsWaiting(false);
    onCompleteRef.current?.(callback);
  }, [taskId, getSignedUrl]);

  // Handle error
  const handleError = useCallback((errorMsg: string) => {
    if (completedRef.current) return;
    completedRef.current = true;

    setLatestCallback({
      taskId: taskId || '',
      callbackType: 'error',
      status: 'failed',
    });
    setIsWaiting(false);
    onErrorRef.current?.(errorMsg);
  }, [taskId]);

  useEffect(() => {
    if (!taskId) {
      setIsWaiting(false);
      setElapsedTime(0);
      completedRef.current = false;
      return;
    }

    setIsWaiting(true);
    setElapsedTime(0);
    completedRef.current = false;

    const startTime = Date.now();
    const timeInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // Check for existing callback first
    const checkExisting = async () => {
      const { data } = await supabase
        .from('suno_callbacks')
        .select('*')
        .eq('task_id', taskId)
        .eq('callback_type', 'complete')
        .order('created_at', { ascending: false })
        .limit(1);

      if (data?.[0]) {
        const metadata = data[0].metadata as CallbackMetadata;
        await handleComplete(metadata);
        return true;
      }
      return false;
    };

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`suno-callback-${taskId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'suno_callbacks',
          filter: `task_id=eq.${taskId}`
        },
        async (payload) => {
          const row = payload.new as { callback_type: string; status: string; metadata: CallbackMetadata };
          logger.info('Realtime callback received', { taskId, type: row.callback_type }, 'MUSIC');
          
          if (row.callback_type === 'complete') {
            await handleComplete(row.metadata);
          } else if (row.callback_type === 'error') {
            handleError('Generation failed');
          }
        }
      )
      .subscribe();

    // Check existing immediately
    checkExisting();

    // Fallback polling every 5 seconds (in case realtime misses)
    const pollInterval = setInterval(async () => {
      if (completedRef.current) return;
      
      const { data } = await supabase
        .from('suno_callbacks')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false })
        .limit(1);

      const row = data?.[0];
      if (row?.callback_type === 'complete') {
        await handleComplete(row.metadata as CallbackMetadata);
      } else if (row?.callback_type === 'error') {
        handleError('Generation failed');
      }
    }, 5000);

    // Timeout after 3 minutes
    const timeout = setTimeout(() => {
      if (!completedRef.current) {
        handleError('Generation timeout');
      }
    }, 180000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(pollInterval);
      clearTimeout(timeout);
      supabase.removeChannel(channel);
    };
  }, [taskId, handleComplete, handleError]);

  return { latestCallback, isWaiting, elapsedTime, signedUrl };
};
