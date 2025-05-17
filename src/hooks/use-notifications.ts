
import { useState, useCallback } from 'react';
import { 
  Notification,
  NotificationFilter,
  NotificationType
} from '@/types/notification';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // Mock fetching notifications - in a real app this would be an API call
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Système mis à jour',
          message: 'Le système a été mis à jour avec succès',
          type: 'system',
          read: false,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Nouvelle analyse émotionnelle',
          message: 'Votre analyse émotionnelle hebdomadaire est prête',
          type: 'emotion',
          read: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          title: 'Badge débloqué',
          message: 'Félicitations ! Vous avez débloqué le badge "Régularité"',
          type: 'badge', // Using string as per updated NotificationType
          read: false,
          created_at: new Date(Date.now() - 172800000).toISOString(),
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  }, []);
  
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);
  
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  }, []);
  
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications: filteredNotifications,
    unreadCount,
    loading,
    error,
    filter,
    setFilter,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };
}

export default useNotifications;
