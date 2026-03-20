import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface ParcoursRealtimeOptions {
  runId: string | null;
  onSegmentUpdate?: (segment: any) => void;
  onRunComplete?: () => void;
}

export const useParcoursRealtime = ({
  runId,
  onSegmentUpdate,
  onRunComplete,
}: ParcoursRealtimeOptions) => {
  const [liveSegments, setLiveSegments] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!runId) return;

    logger.debug('[realtime] Subscribing to run', { runId }, 'MUSIC');

    const channel = supabase
      .channel(`parcours-run-${runId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'parcours_segments',
          filter: `run_id=eq.${runId}`,
        },
        (payload) => {
          const segment = payload.new as any;
          logger.debug('[realtime] Segment updated', { segment }, 'MUSIC');

          // Update local state
          setLiveSegments((prev) => ({
            ...prev,
            [segment.id]: segment,
          }));

          // Notify parent component
          if (onSegmentUpdate) {
            onSegmentUpdate(segment);
          }

          // Show toast for important events
          if (segment.status === 'first' && segment.preview_url) {
            toast({
              title: '🎵 Audio prêt',
              description: 'Prévisualisation disponible, lecture lancée...',
            });
          } else if (segment.status === 'complete' && segment.final_url) {
            toast({
              title: '✅ Segment finalisé',
              description: 'Audio final disponible',
            });
          } else if (segment.status === 'failed') {
            toast({
              title: '❌ Erreur de génération',
              description: 'Un segment n\'a pas pu être généré',
              variant: 'destructive',
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'parcours_runs',
          filter: `id=eq.${runId}`,
        },
        (payload) => {
          const run = payload.new as any;
          logger.debug('[realtime] Run updated', { run }, 'MUSIC');

          if (run.status === 'ready' && onRunComplete) {
            toast({
              title: '🎉 Parcours prêt !',
              description: 'Tous les segments sont générés',
            });
            onRunComplete();
          }
        }
      )
      .subscribe((status) => {
        logger.debug('[realtime] Status', { status }, 'MUSIC');
      });

    return () => {
      logger.debug('[realtime] Unsubscribing from run', { runId }, 'MUSIC');
      supabase.removeChannel(channel);
    };
  }, [runId, onSegmentUpdate, onRunComplete]);

  return {
    liveSegments,
  };
};
