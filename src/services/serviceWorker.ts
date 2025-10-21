// @ts-nocheck

import { logger } from '@/lib/logger';

export const initServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      logger.info('Service Worker registered successfully', undefined, 'SYSTEM');
      return registration;
    } catch (error) {
      logger.error('Service Worker registration failed', error as Error, 'SYSTEM');
      throw error;
    }
  }
  throw new Error('Service Worker not supported');
};
