
import React, { createContext, useContext, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/hooks/useNotifications';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Notification } from '@/types/notifications';
import NotificationToast from './NotificationToast';

interface NotificationContextType {
  showToast: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { sendNotification, notifications } = useNotifications();
  const { promptForPermission } = usePushNotifications();

  // Proposer l'activation des notifications push au premier lancement
  useEffect(() => {
    const hasSeenPermissionPrompt = localStorage.getItem('notification-permission-prompted');
    if (!hasSeenPermissionPrompt) {
      setTimeout(() => {
        promptForPermission();
        localStorage.setItem('notification-permission-prompted', 'true');
      }, 3000); // Attendre 3 secondes avant de proposer
    }
  }, [promptForPermission]);

  const showToast = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    await sendNotification(notification);
  };

  // Obtenir les notifications récentes non lues pour les toasts
  const recentUnreadNotifications = notifications
    .filter(n => !n.read)
    .filter(n => {
      const notifTime = new Date(n.timestamp).getTime();
      const now = Date.now();
      return (now - notifTime) < 10000; // Moins de 10 secondes
    })
    .slice(0, 3); // Max 3 toasts

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none space-y-2">
        <AnimatePresence>
          {recentUnreadNotifications.map((notification) => (
            <div key={notification.id} className="pointer-events-auto">
              <NotificationToast
                notification={notification}
                onClose={() => {
                  // Les toasts se ferment automatiquement, mais on peut les marquer comme lues
                }}
                onAction={() => {
                  if (notification.actionUrl) {
                    window.location.href = notification.actionUrl;
                  }
                }}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
