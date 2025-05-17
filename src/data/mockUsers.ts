
import { User, UserPreferences } from '@/types/user';
import { NotificationType } from '@/types/notification';

// Définition complète des types de notifications pour éviter les erreurs
const allNotificationTypes: Record<NotificationType, boolean> = {
  system: true,
  emotion: true,
  coach: true,
  journal: true,
  community: true,
  achievement: true,
  badge: true,
  challenge: true,
  reminder: true,
  info: true,
  warning: true,
  error: true,
  success: true,
  streak: true,
  urgent: true
};

const disabledNotificationTypes: Record<NotificationType, boolean> = {
  system: false,
  emotion: false,
  coach: false,
  journal: false,
  community: false,
  achievement: false,
  badge: false,
  challenge: false,
  reminder: false,
  info: false,
  warning: false,
  error: false,
  success: false,
  streak: false,
  urgent: false
};

// Mock user data for development
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'b2c',
    created_at: new Date().toISOString(),
    preferences: {
      theme: 'light',
      fontSize: 'medium',
      fontFamily: 'system',
      reduceMotion: false,
      colorBlindMode: false,
      autoplayMedia: true,
      soundEnabled: true,
      notifications: {
        enabled: true,
        emailEnabled: true,
        pushEnabled: true,
        inAppEnabled: true,
        types: allNotificationTypes,
        frequency: 'daily',
        email: true,
        push: true,
        sms: false,
        tone: 'friendly',
      },
      privacy: {
        shareData: true,
        anonymizeReports: false,
        profileVisibility: 'public',
      },
    },
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'b2b_user',
    created_at: new Date().toISOString(),
    preferences: {
      theme: 'dark',
      fontSize: 'large',
      fontFamily: 'serif',
      reduceMotion: true,
      colorBlindMode: true,
      autoplayMedia: false,
      soundEnabled: false,
      notifications: {
        enabled: false,
        emailEnabled: false,
        pushEnabled: false,
        inAppEnabled: false,
        types: disabledNotificationTypes,
        frequency: 'weekly',
        email: false,
        push: false,
        sms: false,
        tone: 'neutral',
      },
      privacy: {
        shareData: false,
        anonymizeReports: true,
        profileVisibility: 'private',
      },
    },
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'b2b_admin',
    created_at: new Date().toISOString(),
    preferences: {
      theme: 'system',
      fontSize: 'small',
      fontFamily: 'monospace',
      reduceMotion: false,
      colorBlindMode: false,
      autoplayMedia: true,
      soundEnabled: true,
      notifications: {
        enabled: true,
        emailEnabled: true,
        pushEnabled: true,
        inAppEnabled: true,
        types: allNotificationTypes,
        frequency: 'immediate',
        email: true,
        push: true,
        sms: true,
        tone: 'formal',
      },
      privacy: {
        shareData: true,
        anonymizeReports: false,
        profileVisibility: 'public',
      },
    },
  },
];
