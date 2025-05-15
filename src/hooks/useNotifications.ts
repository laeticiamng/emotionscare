
import { useState, useEffect } from 'react';
import { Notification, NotificationType } from '@/types';

export type NotificationFilter = 'all' | 'unread' | NotificationType;

// Mock notifications for development
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Bienvenue sur notre plateforme',
    message: 'Découvrez toutes les fonctionnalités disponibles',
    type: 'system',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: '2',
    title: 'Rappel : Scan émotionnel',
    message: 'N\'oubliez pas votre scan émotionnel quotidien',
    type: 'reminder',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
    actionUrl: '/scan'
  },
  {
    id: '3',
    title: 'Nouvelle session VR disponible',
    message: 'Découvrez notre nouveau programme de méditation en réalité virtuelle',
    type: 'success',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: false,
    actionUrl: '/vr'
  },
  {
    id: '4',
    title: 'Attention : Niveau de stress élevé',
    message: 'Nous avons détecté un niveau de stress élevé. Prenez un moment pour vous détendre.',
    type: 'warning',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    read: false
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  
  // Calculate unread count when notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);
  
  // Fetch notifications based on filter
  const fetchNotifications = async (selectedFilter: NotificationFilter = filter) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // We're using mock data for now
      let filteredNotifications = [...mockNotifications];
      
      if (selectedFilter === 'unread') {
        filteredNotifications = filteredNotifications.filter(n => !n.read);
      } else if (selectedFilter !== 'all') {
        filteredNotifications = filteredNotifications.filter(n => n.type === selectedFilter);
      }
      
      setNotifications(filteredNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      // In a real app, this would be an API call
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // In a real app, this would be an API call
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  return {
    notifications,
    unreadCount,
    isLoading,
    filter,
    setFilter,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};
