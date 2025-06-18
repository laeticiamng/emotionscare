import React, { createContext, useContext, ReactNode } from 'react';
import { NotificationContextType } from '@/types/notifications';
import { useNotifications as useNotificationsHook } from '@/hooks/useNotifications';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notificationData = useNotificationsHook();

  const value: NotificationContextType = {
    notifications: notificationData.notifications,
    unreadCount: notificationData.unreadCount,
    markAsRead: notificationData.markAsRead,
    markAllAsRead: notificationData.markAllAsRead,
    addNotification: notificationData.addNotification,
    removeNotification: notificationData.removeNotification,
    settings: notificationData.settings,
    updateSettings: notificationData.updateSettings,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
