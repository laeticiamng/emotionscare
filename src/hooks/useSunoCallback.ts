// @ts-nocheck
import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SunoCallback } from '@/types/music-generation';
import { toast } from '@/hooks/use-toast';

interface UseSunoCallbackOptions {
  taskId: string | null;
  onComplete?: (callback: SunoCallback) => void;
  onError?: (error: string) => void;
}

export const useSunoCallback = ({ taskId, onComplete, onError }: UseSunoCallbackOptions) => {
  const [latestCallback, setLatestCallback] = useState<SunoCallback | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  // Poll pour vérifier les callbacks
  useEffect(() => {
    if (!taskId) return;

    setIsWaiting(true);
    let pollInterval: NodeJS.Timeout;

    const checkCallback = async () => {
      try {
        const { data, error } = await supabase
          .from('suno_callbacks')
          .select('*')
          .eq('task_id', taskId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching callback:', error);
          return;
        }

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
            toast({
              title: '🎵 Streaming disponible',
              description: 'Vous pouvez commencer à écouter',
            });
          } else if (callback.callbackType === 'complete') {
            toast({
              title: '✅ Musique prête !',
              description: 'Votre création musicale est terminée',
            });
            onComplete?.(callback);
            setIsWaiting(false);
            clearInterval(pollInterval);
          } else if (callback.callbackType === 'error') {
            const errorMsg = 'Erreur lors de la génération musicale';
            toast({
              title: '❌ Erreur',
              description: errorMsg,
              variant: 'destructive',
            });
            onError?.(errorMsg);
            setIsWaiting(false);
            clearInterval(pollInterval);
          }
        }
      } catch (err) {
        console.error('Error checking callback:', err);
      }
    };

    // Poll toutes les 3 secondes
    pollInterval = setInterval(checkCallback, 3000);
    checkCallback(); // Premier check immédiat

    return () => {
      clearInterval(pollInterval);
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
