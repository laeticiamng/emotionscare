// @ts-nocheck
import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SunoCallback } from '@/types/music-generation';
import { toast } from 'sonner';

interface UseSunoCallbackOptions {
  taskId: string | null;
  onComplete?: (callback: SunoCallback) => void;
  onError?: (error: string) => void;
}

export const useSunoCallback = ({ taskId, onComplete, onError }: UseSunoCallbackOptions) => {
  const [latestCallback, setLatestCallback] = useState<SunoCallback | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Realtime instantané pour les callbacks
  useEffect(() => {
    if (!taskId) return;

    const channel = supabase
      .channel(`suno-cb-${taskId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'suno_callbacks',
        filter: `task_id=eq.${taskId}`,
      }, (payload) => {
        const row = payload.new as any;
        const callback: SunoCallback = {
          taskId: row.task_id,
          callbackType: row.callback_type,
          status: row.status,
          data: row.metadata
        };
        setLatestCallback(callback);
        
        if (row.callback_type === 'first') {
          toast.success('🎵 Streaming disponible - Vous pouvez commencer à écouter');
        } else if (row.callback_type === 'complete') {
          toast.success('✅ Musique prête ! Votre création musicale est terminée');
          onComplete?.(callback);
          setIsWaiting(false);
        } else if (row.callback_type === 'error') {
          toast.error('❌ Erreur lors de la génération musicale');
          onError?.('Erreur lors de la génération musicale');
          setIsWaiting(false);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [taskId, onComplete, onError]);

  // Poll pour vérifier les callbacks avec fallback API Suno
  useEffect(() => {
    if (!taskId) return;

    setIsWaiting(true);
    let pollInterval: NodeJS.Timeout;
    let timeInterval: NodeJS.Timeout;
    let pollCount = 0;
    const startTime = Date.now();

    // Timer visible pour l'utilisateur
    timeInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const checkCallback = async () => {
      pollCount++;
      const elapsedSeconds = (Date.now() - startTime) / 1000;

      try {
        // 1) LECTURE SANS maybeSingle -> jamais de 406 (array vide autorisé)
        const { data, error } = await supabase
          .from('suno_callbacks')
          .select('task_id, callback_type, status, metadata, created_at')
          .eq('task_id', taskId)
          .order('created_at', { ascending: false })
          .limit(1); // <- array

        const row = (data && data.length > 0) ? data[0] : null;

        if (row) {
          const callback: SunoCallback = {
            taskId: row.task_id,
            callbackType: row.callback_type as any,
            status: row.status,
            data: row.metadata
          };

          setLatestCallback(callback);

          if (callback.callbackType === 'first') {
            toast.success('🎵 Streaming disponible - Vous pouvez commencer à écouter');
            // on laisse tourner le poll au cas où un "complete" arrive
          } else if (callback.callbackType === 'complete') {
            toast.success('✅ Musique prête ! Votre création musicale est terminée');
            onComplete?.(callback);
            setIsWaiting(false);
            clearInterval(pollInterval);
            clearInterval(timeInterval);
          } else if (callback.callbackType === 'error') {
            const errorMsg = 'Erreur lors de la génération musicale';
            toast.error(`❌ ${errorMsg}`);
            onError?.(errorMsg);
            setIsWaiting(false);
            clearInterval(pollInterval);
            clearInterval(timeInterval);
          }
          return; // DB a répondu, pas besoin du fallback sur ce tick
        }

        // 2) POLLING SUNO AGRESSIF — toutes les 2s, commence immédiatement
        if (pollCount % 2 === 0) {
          console.log('⏰ Polling Suno API directly... (attempt', pollCount / 2, ')');
          
          const { data: pollData } = await supabase.functions.invoke('suno-poll-status', {
            body: { taskId }
          });

          if (pollData?.stage === 'first' && pollData.streamUrl) {
            const simulatedCallback: SunoCallback = {
              taskId,
              callbackType: 'first',
              status: 'success',
              data: { stream_url: pollData.streamUrl, polled: true }
            };
            setLatestCallback(simulatedCallback);
            toast.success('🎵 Streaming disponible - Audio preview prêt (via polling)');
          } else if (pollData?.stage === 'complete' && pollData.downloadUrl) {
            const simulatedCallback: SunoCallback = {
              taskId,
              callbackType: 'complete',
              status: 'success',
              data: { audio_url: pollData.downloadUrl, duration: pollData.duration, polled: true }
            };
            setLatestCallback(simulatedCallback);
            toast.success('✅ Musique prête ! Audio final disponible (via polling)');
            onComplete?.(simulatedCallback);
            setIsWaiting(false);
            clearInterval(pollInterval);
            clearInterval(timeInterval);
          }
        }
      } catch (err) {
        console.error('Error checking callback:', err);
      }
    };

    // Poll toutes les secondes
    pollInterval = setInterval(checkCallback, 1000);
    checkCallback(); // Premier check immédiat

    // Timeout de 5 minutes max
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      setIsWaiting(false);
      toast.error('⏱️ Timeout - La génération prend trop de temps');
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(timeInterval);
      clearTimeout(timeout);
    };
  }, [taskId, onComplete, onError]);

  const reset = useCallback(() => {
    setLatestCallback(null);
    setIsWaiting(false);
    setElapsedTime(0);
  }, []);

  return {
    latestCallback,
    isWaiting,
    elapsedTime,
    reset
  };
};
