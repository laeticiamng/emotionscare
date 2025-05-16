
import { ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp?: string;
  created_at?: string;
  priority?: 'normal' | 'high' | 'urgent';
  action?: {
    label: string;
    url: string;
  };
  actions?: {
    label: string;
    url: string;
  }[];
}

export type NotificationType = 'system' | 'emotion' | 'coach' | 'journal' | 'community' | 'user' | 'message';
export type NotificationFilter = 'all' | 'unread' | 'read' | NotificationType | 'urgent';

export interface NotificationPreferences {
  enabled: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  email?: boolean;
  push?: boolean;
  sms?: boolean;
  types?: {
    system?: boolean;
    emotion?: boolean;
    coach?: boolean;
    journal?: boolean;
    community?: boolean;
    achievement?: boolean;
  },
  frequency?: string;
}
