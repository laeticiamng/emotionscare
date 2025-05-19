import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Notification, NotificationFrequency, NotificationType } from '@/types/notification';

// Define NotificationFilter type locally since it's not exported from notification.ts
type NotificationFilter = 'all' | 'unread' | 'read' | NotificationType;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch notifications based on filter
  const fetchNotifications = async (selectedFilter: NotificationFilter = filter) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Mock notification data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'info',
          title: 'Nouveau rapport disponible',
          message: 'Votre rapport hebdomadaire est prêt à être consulté.',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          read: false,
          userId: user.id,
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // For backward compatibility
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // For backward compatibility
          linkTo: '/dashboard',
          isRead: false
        },
        {
          id: '2',
          type: 'invitation',
          title: 'Invitation à une session VR',
          message: 'Jean Dupont vous invite à rejoindre une session VR relaxation.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          read: false,
          userId: user.id,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // For backward compatibility
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // For backward compatibility
          linkTo: '/vr-sessions',
          isRead: false
        },
        {
          id: '3',
          type: 'reminder',
          title: 'Rappel: Scan émotionnel',
          message: 'N\'oubliez pas d\'effectuer votre scan émotionnel quotidien.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          read: true,
          userId: user.id,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // For backward compatibility
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // For backward compatibility
          linkTo: '/scan',
          isRead: true
        },
        {
          id: '4',
          type: 'system',
          title: 'Maintenance système prévue',
          message: 'Une maintenance est prévue demain à 22h00.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          read: true,
          userId: user.id,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // For backward compatibility
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // For backward compatibility
          linkTo: '/notifications',
          isRead: true
        }
      ];
      
      // Filter notifications based on selected filter
      let filteredNotifications = mockNotifications;
      if (selectedFilter === 'unread') {
        filteredNotifications = mockNotifications.filter(n => !n.read);
      } else if (selectedFilter !== 'all') {
        filteredNotifications = mockNotifications.filter(n => n.type === selectedFilter);
      }
      
      setNotifications(filteredNotifications);
      const unreadNotifications = mockNotifications.filter(n => !n.read);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les notifications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mark a notification as read
  const markAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      // In a real app, this would be an API call
      // For now, we'll update the local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true, isRead: true } : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de marquer la notification comme lue',
        variant: 'destructive',
      });
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      // In a real app, this would be an API call
      // For now, we'll update the local state
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true, isRead: true })));
      setUnreadCount(0);
      
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  };
  
  // Fetch notifications on mount and when filter changes
  useEffect(() => {
    if (user) {
      fetchNotifications(filter);
    }
  }, [filter, user]);
  
  // Simulate real-time notification (in a real app, this would be a WebSocket connection)
  useEffect(() => {
    if (!user) return;
    
    const simulateNewNotification = () => {
      const newNotification: Notification = {
        id: `new-${Date.now()}`,
        type: Math.random() > 0.5 ? 'info' : 'reminder',
        title: 'Nouvelle notification',
        message: `Ceci est une notification simulée générée à ${new Date().toLocaleTimeString()}`,
        createdAt: new Date().toISOString(),
        read: false,
        userId: user.id,
        timestamp: new Date().toISOString(), // For backward compatibility
        created_at: new Date().toISOString(), // For backward compatibility
        linkTo: '/dashboard',
        isRead: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      toast({
        title: 'Nouvelle notification',
        description: newNotification.message,
      });
    };
    
    // Uncomment for demo purposes
    // const interval = setInterval(simulateNewNotification, 30000); // New notification every 30 seconds
    // return () => clearInterval(interval);
  }, [user, toast]);
  
  return {
    notifications,
    unreadCount,
    isLoading,
    filter,
    setFilter,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
}

export default useNotifications;
