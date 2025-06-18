
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/services/notificationService';
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
  const [toastNotifications, setToastNotifications] = useState<Notification[]>([]);

  // Show toast for new notifications
  useEffect(() => {
    const newNotifications = notifications.filter(n => 
      !n.read && 
      !toastNotifications.some(t => t.id === n.id) &&
      new Date(n.timestamp).getTime() > Date.now() - 5000 // Only show recent notifications
    );

    if (newNotifications.length > 0) {
      setToastNotifications(prev => [...prev, ...newNotifications]);
    }
  }, [notifications, toastNotifications]);

  const showToast = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    await sendNotification(notification);
  };

  const closeToast = (id: string) => {
    setToastNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleToastAction = (notification: Notification) => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    closeToast(notification.id);
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Notifications */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <AnimatePresence>
          {toastNotifications.map((notification) => (
            <div key={notification.id} className="pointer-events-auto">
              <NotificationToast
                notification={notification}
                onClose={() => closeToast(notification.id)}
                onAction={() => handleToastAction(notification)}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
