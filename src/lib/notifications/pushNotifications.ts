// @ts-nocheck

import { logger } from '@/lib/logger';

export class PushNotificationService {
  private static instance: PushNotificationService;
  private isSupported: boolean;
  private isPermissionGranted: boolean;

  constructor() {
    this.isSupported = 'Notification' in window;
    this.isPermissionGranted = this.isSupported && Notification.permission === 'granted';
  }

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      logger.warn('Les notifications push ne sont pas supportées sur ce navigateur', undefined, 'SYSTEM');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.isPermissionGranted = true;
      return true;
    }

    if (Notification.permission === 'denied') {
      logger.warn('L\'utilisateur a refusé les notifications push', undefined, 'SYSTEM');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.isPermissionGranted = permission === 'granted';
      return this.isPermissionGranted;
    } catch (error) {
      logger.error('Erreur lors de la demande de permission', error as Error, 'SYSTEM');
      return false;
    }
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.isPermissionGranted) {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });

      // Auto-fermer après 5 secondes
      setTimeout(() => {
        notification.close();
      }, 5000);

    } catch (error) {
      logger.error('Erreur lors de l\'affichage de la notification', error as Error, 'SYSTEM');
    }
  }

  getPermissionStatus(): NotificationPermission {
    return this.isSupported ? Notification.permission : 'denied';
  }

  isNotificationSupported(): boolean {
    return this.isSupported;
  }
}

export const pushNotificationService = PushNotificationService.getInstance();
