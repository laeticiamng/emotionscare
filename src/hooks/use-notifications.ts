
import { useState, useEffect } from 'react';
import { Notification, NotificationType } from '@/types';

export default function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Mock function to add a notification
  const addNotification = (
    title: string, 
    message: string, 
    type: NotificationType = 'system'
  ) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(2, 11),
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    updateUnreadCount();
    
    return newNotification.id;
  };
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    updateUnreadCount();
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    updateUnreadCount();
  };
  
  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
    updateUnreadCount();
  };
  
  // Remove all notifications
  const clearNotifications = () => {
    setNotifications([]);
    updateUnreadCount();
  };
  
  // Filter notifications by type
  const filterByType = (type: NotificationType = 'all') => {
    if (type === 'all') return notifications;
    return notifications.filter(notification => notification.type === type);
  };
  
  // Update unread count
  const updateUnreadCount = () => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  };
  
  useEffect(() => {
    updateUnreadCount();
  }, [notifications]);
  
  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    filterByType
  };
}
