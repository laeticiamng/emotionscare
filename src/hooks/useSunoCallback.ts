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

  // Poll pour vérifier les callbacks avec fallback API Suno
  useEffect(() => {
    if (!taskId) return;

    setIsWaiting(true);
    let pollInterval: NodeJS.Timeout;
    let pollCount = 0;
    const startTime = Date.now();

    const checkCallback = async () => {
      pollCount++;
      const elapsedSeconds = (Date.now() - startTime) / 1000;

      try {
        // D'abord vérifier si un callback est arrivé en DB
        const { data, error } = await supabase
          .from('suno_callbacks')
          .select('*')
          .eq('task_id', taskId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data) {
          const callback: SunoCallback = {
            taskId: data.task_id,
            callbackType: data.callback_type as any,
            status: data.status,
            data: data.metadata
          };

          setLatestCallback(callback);

          // Notifier selon le type de callback
          if (callback.callbackType === 'first') {
            toast.success('🎵 Streaming disponible - Vous pouvez commencer à écouter');
          } else if (callback.callbackType === 'complete') {
            toast.success('✅ Musique prête ! Votre création musicale est terminée');
            onComplete?.(callback);
            setIsWaiting(false);
            clearInterval(pollInterval);
          } else if (callback.callbackType === 'error') {
            const errorMsg = 'Erreur lors de la génération musicale';
            toast.error(`❌ ${errorMsg}`);
            onError?.(errorMsg);
            setIsWaiting(false);
            clearInterval(pollInterval);
          }
          return;
        }

        // Fallback: après 30s sans callback, poll l'API Suno directement
        if (elapsedSeconds > 30 && pollCount % 3 === 0) {
          console.log('⏰ Fallback: polling Suno API directly...');
          
          const { data: pollData, error: pollError } = await supabase.functions.invoke(
            'suno-poll-status',
            { body: { taskId } }
          );

          if (pollData && pollData.stage) {
            console.log('✅ Suno poll result:', pollData);

            // Simuler un callback selon le stage
            if (pollData.stage === 'first' && pollData.streamUrl) {
              const simulatedCallback: SunoCallback = {
                taskId,
                callbackType: 'first',
                status: 'success',
                data: {
                  stream_url: pollData.streamUrl,
                  polled: true
                }
              };
              setLatestCallback(simulatedCallback);
              toast.success('🎵 Streaming disponible - Audio preview prêt (via polling)');
            } else if (pollData.stage === 'complete' && pollData.downloadUrl) {
              const simulatedCallback: SunoCallback = {
                taskId,
                callbackType: 'complete',
                status: 'success',
                data: {
                  audio_url: pollData.downloadUrl,
                  duration: pollData.duration,
                  polled: true
                }
              };
              setLatestCallback(simulatedCallback);
              toast.success('✅ Musique prête ! Audio final disponible (via polling)');
              onComplete?.(simulatedCallback);
              setIsWaiting(false);
              clearInterval(pollInterval);
            }
          }
        }

      } catch (err) {
        console.error('Error checking callback:', err);
      }
    };

    // Poll toutes les 3 secondes
    pollInterval = setInterval(checkCallback, 3000);
    checkCallback(); // Premier check immédiat

    // Timeout de 5 minutes max
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      setIsWaiting(false);
      toast.error('⏱️ Timeout - La génération prend trop de temps');
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [taskId, onComplete, onError]);

  const reset = useCallback(() => {
    setLatestCallback(null);
    setIsWaiting(false);
  }, []);

  return {
    latestCallback,
    isWaiting,
    reset
  };
};
