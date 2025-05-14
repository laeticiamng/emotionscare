
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { Notification, EnhancedNotification } from '@/types/notification';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNotificationBadge } from '@/hooks/useNotificationBadge';

const NotificationsPanel = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const badge = useNotificationBadge();

  // Cast and enhance notifications to include required properties
  const enhancedNotifications: EnhancedNotification[] = notifications ? notifications.map(notification => ({
    ...notification,
    read: 'isRead' in notification ? notification.isRead : false,
    timestamp: 'date' in notification ? notification.date : new Date().toISOString()
  })) : [];

  useEffect(() => {
    // Update unread count based on count property if unreadCount is missing
    if (badge && badge.count > 0) {
      // Use count as fallback
      const unreadCountValue = badge.count;
      // Do whatever you need with unreadCountValue
    }
    
    if (notifications) {
      const unread = enhancedNotifications.filter(n => !n.read).length;
      badge.setBadgesCount?.(unread);
    }
  }, [notifications, badge, enhancedNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    setLoading(true);
    try {
      await markAsRead(notificationId);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    setLoading(true);
    try {
      await markAllAsRead();
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Notifications</CardTitle>
        <Button variant="ghost" size="sm" onClick={handleClearAll} disabled={loading}>
          Marquer tout comme lu
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] w-full">
          {enhancedNotifications && enhancedNotifications.length > 0 ? (
            enhancedNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start space-x-4 p-4 border-b last:border-b-0"
              >
                {getIcon(notification.type)}
                <div className="flex-1">
                  <div className="text-sm font-medium">{notification.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {notification.message}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.timestamp), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </div>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMarkAsRead(notification.id)}
                    disabled={loading}
                  >
                    <span className="sr-only">Marquer comme lu</span>
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucune notification pour le moment.
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          {notifications ? notifications.length : 0} Notifications
        </p>
        {user && (
          <p className="text-xs text-muted-foreground">
            Connecté en tant que {user.email}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default NotificationsPanel;
