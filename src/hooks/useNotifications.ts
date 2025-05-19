
import { useState, useEffect } from 'react';
import { Notification } from '@/types/notification';

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate with mock data
        const mockNotifications = [
          {
            id: '1',
            user_id: userId,
            title: 'Nouvelle analyse émotionnelle',
            message: 'Votre analyse émotionnelle quotidienne est prête',
            type: 'emotion',
            read: false,
            timestamp: new Date().toISOString(),
            created_at: new Date().toISOString()
          },
          {
            id: '2', 
            user_id: userId,
            title: 'Rappel de méditation',
            message: 'N\'oubliez pas votre session de méditation quotidienne',
            type: 'reminder',
            read: true,
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ];

        // Convert to proper Notification objects
        const formattedNotifications: Notification[] = mockNotifications.map(n => ({
          id: n.id,
          userId: n.user_id,
          title: n.title,
          message: n.message,
          type: n.type,
          read: n.read,
          createdAt: n.created_at,
          timestamp: n.timestamp
        }));

        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead
  };
}
