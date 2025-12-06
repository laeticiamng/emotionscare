/**
 * Hook pour gérer les notifications de changement de goût
 */

import { useState, useEffect, useCallback } from 'react';
import { useMusicPreferencesLearning } from './useMusicPreferencesLearning';
import { logger } from '@/lib/logger';

interface TasteChangeNotification {
  id: string;
  suggestedGenres: string[];
  confidence: number;
  timestamp: Date;
}

export const useTasteChangeNotifications = () => {
  const { insights, isAnalyzing } = useMusicPreferencesLearning();
  const [notifications, setNotifications] = useState<TasteChangeNotification[]>([]);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  // Vérifier les changements de goût régulièrement
  useEffect(() => {
    if (!insights || isAnalyzing) return;

    // Vérifier si on doit afficher une notification
    if (insights.tasteChangeDetected && insights.confidence > 0.7) {
      // Éviter les doublons en vérifiant le dernier check
      const now = new Date();
      if (lastCheck && (now.getTime() - lastCheck.getTime()) < 3600000) {
        // Moins d'1h depuis le dernier check
        return;
      }

      const notification: TasteChangeNotification = {
        id: `taste-change-${Date.now()}`,
        suggestedGenres: insights.suggestedGenres || [],
        confidence: insights.confidence,
        timestamp: now,
      };

      setNotifications(prev => [notification, ...prev]);
      setLastCheck(now);

      logger.info('Taste change notification created', {
        suggestedGenres: notification.suggestedGenres.length,
        confidence: notification.confidence,
      }, 'MUSIC');
    }
  }, [insights, isAnalyzing, lastCheck]);

  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    logger.info('Notification dismissed', { notificationId }, 'MUSIC');
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    logger.info('All notifications cleared', undefined, 'MUSIC');
  }, []);

  return {
    notifications,
    hasNotifications: notifications.length > 0,
    dismissNotification,
    clearAllNotifications,
  };
};
