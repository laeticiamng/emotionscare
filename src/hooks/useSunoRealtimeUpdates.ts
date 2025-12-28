/**
 * useSunoRealtimeUpdates - Listen to Suno callback updates via Supabase Realtime
 * Notifies when music generation completes
 */

import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface SunoCallback {
  id: string;
  task_id: string;
  callback_type: 'text' | 'first' | 'complete' | 'error';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  metadata: {
    audioUrl?: string;
    imageUrl?: string;
    duration?: number;
    title?: string;
  };
  created_at: string;
}

interface UseSunoRealtimeUpdatesOptions {
  onComplete?: (callback: SunoCallback) => void;
  onError?: (callback: SunoCallback) => void;
  enabled?: boolean;
}

export function useSunoRealtimeUpdates(options: UseSunoRealtimeUpdatesOptions = {}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { onComplete, onError, enabled = true } = options;
  const pendingTasksRef = useRef<Set<string>>(new Set());

  // Track a task ID for updates
  const trackTask = useCallback((taskId: string) => {
    pendingTasksRef.current.add(taskId);
    logger.info(`Tracking Suno task: ${taskId}`, {}, 'REALTIME');
  }, []);

  // Stop tracking a task
  const untrackTask = useCallback((taskId: string) => {
    pendingTasksRef.current.delete(taskId);
  }, []);

  useEffect(() => {
    if (!user || !enabled) return;

    const channel = supabase
      .channel('suno-callbacks-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'suno_callbacks'
        },
        (payload) => {
          const callback = payload.new as SunoCallback;
          
          // Only process if we're tracking this task
          if (!pendingTasksRef.current.has(callback.task_id)) {
            return;
          }

          logger.info(`Suno realtime update: ${callback.task_id}`, { 
            status: callback.status,
            type: callback.callback_type 
          }, 'REALTIME');

          if (callback.status === 'completed' && callback.callback_type === 'complete') {
            // Generation completed!
            toast({
              title: '🎵 Musique prête !',
              description: callback.metadata?.title || 'Votre musique a été générée',
            });
            
            onComplete?.(callback);
            untrackTask(callback.task_id);
          } else if (callback.status === 'failed' || callback.callback_type === 'error') {
            toast({
              title: 'Erreur de génération',
              description: 'La génération a échoué',
              variant: 'destructive',
            });
            
            onError?.(callback);
            untrackTask(callback.task_id);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('Subscribed to Suno callbacks realtime', {}, 'REALTIME');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, enabled, toast, onComplete, onError, untrackTask]);

  return {
    trackTask,
    untrackTask,
    pendingTasks: pendingTasksRef.current,
  };
}
