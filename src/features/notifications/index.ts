/**
 * Notifications Feature Module
 * Gestion des notifications push, in-app et email
 */

// Components
export { NotificationCenter } from './components/NotificationCenter';
export { NotificationCard } from './components/NotificationCard';
export { NotificationSettings } from './components/NotificationSettings';

// Hooks
export { useNotifications } from './hooks/useNotifications';

// Types
export type { Notification, NotificationPreferences } from './types';
