
import React, { useState, useEffect } from 'react';
import { Bell, Settings, X, Check, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/use-theme';
import { Notification, NotificationType } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface NotificationsPanelProps {
  onClose?: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead,
    unreadCount 
  } = useNotifications();
  const [activeTab, setActiveTab] = useState<string>('all');

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab as NotificationType;
  });

  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'warning':
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'reminder':
        return <Clock className="h-4 w-4 text-info" />;
      case 'success':
        return <Check className="h-4 w-4 text-success" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      if (onClose) onClose();
    }
  };

  // Format notification time
  const formatNotificationTime = (timestamp: string | number | Date) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true,
      locale: fr 
    });
  };

  return (
    <div className={cn(
      "flex flex-col h-full max-h-[85vh] w-full max-w-md rounded-lg shadow-lg",
      theme === 'dark' ? 'bg-background border border-border' : 'bg-background'
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 min-w-[20px] flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/settings/notifications')}
            className="text-xs"
          >
            <Settings className="h-4 w-4 mr-1" />
            Préférences
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">Toutes</TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">Non lues</TabsTrigger>
            <TabsTrigger value="warning" className="flex-1">Alertes</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="flex-1 mt-0">
          <ScrollArea className="h-[calc(100%-40px)] px-4">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-1 py-2">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={cn(
                      "p-3 rounded-md cursor-pointer transition-colors",
                      notification.read 
                        ? "bg-muted/40 hover:bg-muted/60" 
                        : "bg-primary/5 hover:bg-primary/10 border-l-2 border-primary",
                      "flex items-start gap-3"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <p className={cn(
                          "text-sm",
                          !notification.read && "font-medium"
                        )}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatNotificationTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      {notification.actionLabel && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-auto p-0 text-xs text-primary"
                        >
                          {notification.actionLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                <Bell className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
                <p className="text-muted-foreground">Aucune notification</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeTab === 'all' 
                    ? "Vous n'avez pas encore reçu de notifications." 
                    : activeTab === 'unread' 
                      ? "Toutes vos notifications ont été lues."
                      : "Aucune alerte à afficher."}
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {filteredNotifications.length > 0 && (
        <>
          <Separator />
          <div className="p-3 flex justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              Tout marquer comme lu
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground"
              onClick={() => navigate('/notifications')}
            >
              Voir toutes les notifications
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsPanel;
