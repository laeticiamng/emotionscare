
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NotificationContextType, Notification } from '@/types/notifications';
import { useToast } from '@/hooks/use-toast';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    inApp: true,
    types: {
      security: true,
      system: true,
      social: true,
      achievements: true,
      reminders: true,
    },
  });
  
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Afficher une toast si les notifications in-app sont activées
    if (settings.inApp) {
      toast({
        title: newNotification.title,
        description: newNotification.message,
        variant: newNotification.type === 'error' ? 'destructive' : 'default',
      });
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Simulation de notifications initiales
  useEffect(() => {
    const initialNotifications: Notification[] = [
      {
        id: '1',
        type: 'info',
        priority: 'medium',
        title: 'Bienvenue sur EmotionsCare',
        message: 'Découvrez toutes les fonctionnalités de votre tableau de bord',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
      },
      {
        id: '2',
        type: 'achievement',
        priority: 'low',
        title: 'Nouveau badge débloqué',
        message: 'Félicitations ! Vous avez obtenu le badge "Premier pas"',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
      },
    ];
    
    setNotifications(initialNotifications);
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    settings,
    updateSettings,
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
