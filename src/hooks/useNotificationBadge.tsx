
import { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/types/notification';

export interface NotificationBadge {
  badgeCount: number;
  setBadgeCount: (count: number) => void;
  notificationsCount: number;
  hasUnread: boolean;
  markAllAsRead: () => void;
  markAsRead: (notificationId: string) => void;
  addNotification: (notification: Notification) => void;
}

export const useNotificationBadge = (): NotificationBadge => {
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications) as Notification[];
        setNotifications(parsedNotifications);
        
        // Count unread notifications
        const unreadCount = parsedNotifications.filter(n => !n.read).length;
        setBadgeCount(unreadCount);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);
  
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setBadgeCount(0);
  }, []);
  
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    );
    
    // Recalculate badge count
    setNotifications(prev => {
      const unreadCount = prev.filter(n => !n.read).length;
      setBadgeCount(unreadCount);
      return prev;
    });
  }, []);
  
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [
      { ...notification, read: false },
      ...prev
    ]);
    setBadgeCount(prev => prev + 1);
  }, []);
  
  return {
    badgeCount,
    setBadgeCount,
    notificationsCount: notifications.length,
    hasUnread: badgeCount > 0,
    markAllAsRead,
    markAsRead,
    addNotification
  };
};

export default useNotificationBadge;
