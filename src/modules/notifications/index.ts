/**
 * Module Notifications
 * Exports centralisés pour le système de notifications
 */

// Types
export * from './types';

// Service
export { notificationService } from './notificationService';

// Hook principal
export { useNotifications } from './useNotifications';
export type { UseNotificationsReturn } from './useNotifications';
