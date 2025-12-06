// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SunoCallback } from '@/types/music-generation';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface UseSunoCallbackOptions {
  taskId: string | null;
  onComplete?: (callback: SunoCallback) => void;
  onError?: (error: string) => void;
}

export const useSunoCallback = ({ taskId, onComplete, onError }: UseSunoCallbackOptions) => {
  const [latestCallback, setLatestCallback] = useState<SunoCallback | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  // Obtenir URL signée depuis Storage
  const getSignedUrl = useCallback(async (taskId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('sign-emotion-track', {
        body: { taskId }
      });
      if (error) {
        logger.error('Error signing URL', error as Error, 'MUSIC');
        return;
      }
      if (data?.url) {
        logger.info('Got signed URL for playback', { taskId }, 'MUSIC');
        setSignedUrl(data.url);
      }
    } catch (err) {
      logger.warn('Could not get signed URL yet', err as Error, 'MUSIC');
    }
  }, []);

  // Realtime + Polling combinés
  useEffect(() => {
    if (!taskId) return;

    setIsWaiting(true);
    setElapsedTime(0);
    let pollInterval: NodeJS.Timeout;
    let timeInterval: NodeJS.Timeout;
    let pollCount = 0;
    const startTime = Date.now();

    timeInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const checkCallback = async () => {
      pollCount++;
      try {
        const { data } = await supabase
          .from('suno_callbacks')
          .select('*')
          .eq('task_id', taskId)
          .order('created_at', { ascending: false })
          .limit(1);

        const row = data?.[0];
        if (row) {
          setLatestCallback({ taskId: row.task_id, callbackType: row.callback_type, status: row.status, data: row.metadata });
          if (row.callback_type === 'complete') {
            await getSignedUrl(taskId);
            onComplete?.({ taskId: row.task_id, callbackType: 'complete', status: row.status, data: row.metadata });
            setIsWaiting(false);
            clearInterval(pollInterval);
            clearInterval(timeInterval);
          }
          return;
        }

        // Fallback polling toutes les 2s
        if (pollCount % 2 === 0) {
          const { data: pollData } = await supabase.functions.invoke('suno-poll-status', { body: { taskId } });
          if (pollData?.stage === 'complete') {
            await getSignedUrl(taskId);
            setLatestCallback({ taskId, callbackType: 'complete', status: 'success', data: { audio_url: pollData.downloadUrl, duration: pollData.duration } });
            onComplete?.({ taskId, callbackType: 'complete', status: 'success', data: {} });
            setIsWaiting(false);
            clearInterval(pollInterval);
            clearInterval(timeInterval);
          }
        }
      } catch (err) {
        logger.error('Poll error', err as Error, 'MUSIC');
      }
    };

    pollInterval = setInterval(checkCallback, 1000);
    checkCallback();

    const channel = supabase.channel(`suno-cb-${taskId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'suno_callbacks', filter: `task_id=eq.${taskId}` }, 
      async (payload) => {
        const row = payload.new as any;
        if (row.callback_type === 'complete') {
          await getSignedUrl(taskId);
          onComplete?.({ taskId: row.task_id, callbackType: 'complete', status: row.status, data: row.metadata });
          setIsWaiting(false);
        }
      }).subscribe();

    return () => {
      clearInterval(pollInterval);
      clearInterval(timeInterval);
      supabase.removeChannel(channel);
    };
  }, [taskId, onComplete, onError, getSignedUrl]);

  return { latestCallback, isWaiting, elapsedTime, signedUrl };
};
