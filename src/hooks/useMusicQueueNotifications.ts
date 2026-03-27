// @ts-nocheck
/**
 * Hook pour les notifications en temps réel de la queue musicale
 */

import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import type { QueueItem } from '@/services/musicQueueService';

export const useMusicQueueNotifications = (userId?: string) => {
  const handleQueueUpdate = useCallback((payload: any) => {
    const newItem = payload.new as QueueItem;
    const oldItem = payload.old as QueueItem;

    // Ne notifier que pour les éléments de l'utilisateur connecté
    if (userId && newItem.user_id !== userId) {
      return;
    }

    logger.info('Queue update received', { 
      event: payload.eventType,
      oldStatus: oldItem?.status,
      newStatus: newItem.status,
      queueId: newItem.id 
    }, 'MUSIC_QUEUE');

    // Notification quand la génération est terminée avec succès
    if (oldItem?.status !== 'completed' && newItem.status === 'completed') {
      toast.success('🎵 Votre musique est prête !', {
        description: `Émotion : ${newItem.emotion} - Intensité : ${newItem.intensity}`,
        duration: 8000,
        action: {
          label: 'Écouter',
          onClick: () => {
            // Naviguer vers la page de musique ou ouvrir le player
            window.location.href = '/app/music';
          },
        },
      });
    }

    // Notification quand une génération échoue
    if (oldItem?.status !== 'failed' && newItem.status === 'failed') {
      toast.error('❌ Génération échouée', {
        description: newItem.error_message || 'Une erreur s\'est produite',
        duration: 6000,
        action: {
          label: 'Réessayer',
          onClick: () => {
            window.location.href = '/app/music';
          },
        },
      });
    }

    // Notification quand le traitement commence
    if (oldItem?.status === 'pending' && newItem.status === 'processing') {
      toast.info('⏳ Génération en cours...', {
        description: `Émotion : ${newItem.emotion}`,
        duration: 4000,
      });
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      logger.debug('No user ID, skipping queue notifications subscription', {}, 'MUSIC_QUEUE');
      return;
    }

    logger.info('Subscribing to music queue notifications', { userId }, 'MUSIC_QUEUE');

    // S'abonner aux changements de la table music_generation_queue
    const channel = supabase
      .channel('music-queue-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'music_generation_queue',
          filter: `user_id=eq.${userId}`,
        },
        handleQueueUpdate
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'music_generation_queue',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newItem = payload.new as QueueItem;
          logger.info('New queue item created', { queueId: newItem.id }, 'MUSIC_QUEUE');
          
          toast.info('🎼 Demande ajoutée à la file', {
            description: `Émotion : ${newItem.emotion} - En attente de traitement`,
            duration: 4000,
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('Successfully subscribed to music queue updates', {}, 'MUSIC_QUEUE');
        } else if (status === 'CHANNEL_ERROR') {
          logger.error('Failed to subscribe to music queue updates', new Error('Channel error'), 'MUSIC_QUEUE');
        }
      });

    return () => {
      logger.info('Unsubscribing from music queue notifications', {}, 'MUSIC_QUEUE');
      supabase.removeChannel(channel);
    };
  }, [userId, handleQueueUpdate]);
};
