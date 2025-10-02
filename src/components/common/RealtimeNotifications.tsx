import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fullApiService } from '@/services/api/fullApiService';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'achievement' | 'social' | 'alert';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  created_at: string;
  action_link?: string;
  action_text?: string;
}

const RealtimeNotifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const response = await fullApiService.getNotifications({
        unread_only: false,
        page: 1
      }) as any;
      
      if (response.success && response.data) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unread_count || 0);
      }
    } catch (error) {
      logger.error('Erreur lors du chargement des notifications', { error });
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fullApiService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      logger.error('Erreur lors du marquage comme lu', { error });
    }
  };

  const markAllAsRead = async () => {
    try {
      await fullApiService.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      logger.error('Erreur lors du marquage de toutes les notifications', { error });
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    if (priority === 'high') return <AlertTriangle className="h-4 w-4 text-red-500" />;
    
    switch (type) {
      case 'achievement':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const showToastNotification = (notification: Notification) => {
    const icon = getNotificationIcon(notification.type, notification.priority);
    
    toast(notification.title, {
      description: notification.message,
      action: notification.action_link ? {
        label: notification.action_text || 'Voir',
        onClick: () => window.open(notification.action_link, '_blank')
      } : undefined,
      duration: notification.priority === 'high' ? 10000 : 5000,
    });
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Actualiser les notifications toutes les 30 secondes
      const interval = setInterval(fetchNotifications, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    // Afficher une toast pour les nouvelles notifications importantes
    notifications.forEach(notification => {
      if (!notification.read && notification.priority === 'high') {
        showToastNotification(notification);
      }
    });
  }, [notifications]);

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs"
              >
                Tout marquer comme lu
              </Button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Aucune notification
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-2">
                    {getNotificationIcon(notification.type, notification.priority)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealtimeNotifications;
