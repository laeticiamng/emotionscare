
import { useState, useEffect, useCallback } from 'react';
import { Notification, NotificationSettings } from '@/types/notifications';
import { NotificationService } from '@/lib/notifications';
import { useToast } from '@/hooks/use-toast';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  isLoading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => Promise<void>;
  removeNotification: (id: string) => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  refreshNotifications: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  const refreshNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedNotifications = await NotificationService.getNotifications();
      setNotifications(fetchedNotifications);
    } catch (err) {
      setError('Erreur lors du chargement des notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de marquer la notification comme lue',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const markAllAsRead = useCallback(async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      toast({
        title: 'Succès',
        description: 'Toutes les notifications ont été marquées comme lues',
      });
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de marquer toutes les notifications comme lues',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const addNotification = useCallback(async (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    try {
      const id = await NotificationService.addNotification(notificationData);
      const newNotification: Notification = {
        ...notificationData,
        id,
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
    } catch (err) {
      console.error('Error adding notification:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la notification',
        variant: 'destructive',
      });
    }
  }, [settings, toast]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Charger les notifications au montage
  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // S'abonner aux changements de notifications (optionnel pour temps réel)
  useEffect(() => {
    const unsubscribe = NotificationService.subscribeToNotifications(() => {
      refreshNotifications();
    });

    return unsubscribe;
  }, [refreshNotifications]);

  return {
    notifications,
    unreadCount,
    settings,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    updateSettings,
    refreshNotifications,
  };
};
