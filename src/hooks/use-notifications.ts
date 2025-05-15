
import { useState, useEffect } from 'react';
import { Notification, NotificationFilter } from '@/types';

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nouvelle recommandation',
    message: 'Découvrez une nouvelle activité de pleine conscience adaptée à votre profil.',
    type: 'emotion',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    read: false,
    actionUrl: '/activities/mindfulness',
    actionLabel: 'Voir l\'activité'
  },
  {
    id: '2',
    title: 'Rappel de scan émotionnel',
    message: 'Il est temps de faire votre scan émotionnel quotidien.',
    type: 'reminder',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: true
  },
  {
    id: '3',
    title: 'Nouveau badge débloqué',
    message: 'Félicitations ! Vous avez obtenu le badge "Explorateur Émotionnel".',
    type: 'success',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: false,
    actionUrl: '/gamification/badges',
    actionLabel: 'Voir mes badges'
  },
  {
    id: '4',
    title: 'Maintenance système prévue',
    message: 'Une maintenance est prévue le 15 mai de 2h à 4h du matin.',
    type: 'system',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    read: true
  }
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch notifications (mock implementation)
  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulating API call latency
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set the notifications from our mock data
      setNotifications(mockNotifications);
      
      // Count unread notifications
      const count = mockNotifications.filter(n => !n.read).length;
      setUnreadCount(count);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => {
        if (notification.id === id && !notification.read) {
          setUnreadCount(count => Math.max(0, count - 1));
          return { ...notification, read: true };
        }
        return notification;
      })
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };
  
  // Delete a notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(notification => notification.id !== id);
    });
  };
  
  // Filter notifications based on the selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });
  
  // Fetch notifications on mount and when filter changes
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  return {
    notifications: filteredNotifications,
    allNotifications: notifications,
    unreadCount,
    isLoading,
    error,
    filter,
    setFilter,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
}
