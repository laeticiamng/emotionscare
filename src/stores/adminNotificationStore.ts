import { create } from 'zustand';

export type AdminNotificationType = 'info' | 'warning' | 'success' | 'error';
export type AdminNotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface AdminNotification {
  id: string;
  title: string;
  description: string;
  type: AdminNotificationType;
  priority: AdminNotificationPriority;
  read: boolean;
  timestamp: Date;
  module?: string;
  actionUrl?: string;
  dismissible?: boolean;
}

interface AdminNotificationState {
  notifications: AdminNotification[];
  unreadCount: number;

  addNotification: (notification: Omit<AdminNotification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

let notifCounter = 0;

export const useAdminNotificationStore = create<AdminNotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const newNotif: AdminNotification = {
      ...notification,
      id: `admin-notif-${++notifCounter}-${Date.now()}`,
      read: false,
      timestamp: new Date(),
      dismissible: notification.dismissible ?? true,
    };

    set((state) => {
      const updated = [newNotif, ...state.notifications].slice(0, 100); // Keep max 100
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  dismiss: (id) => {
    set((state) => {
      const updated = state.notifications.filter((n) => n.id !== id);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
