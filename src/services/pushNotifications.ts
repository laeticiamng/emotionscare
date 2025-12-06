// @ts-nocheck

import { logger } from '@/lib/logger';

export const usePushNotifications = () => {
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      logger.info('Push notification permission', { permission }, 'SYSTEM');
      return permission === 'granted';
    }
    return false;
  };

  return {
    requestPermission,
  };
};
