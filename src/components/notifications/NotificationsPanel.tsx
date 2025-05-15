
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Notification, NotificationType, NotificationFilter } from '@/types';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { 
  Bell,
  Calendar, 
  CheckCircle2, 
  Info, 
  Trash2, 
  AlertTriangle, 
  XCircle, 
  Check,
  MailOpen 
} from 'lucide-react';

const NotificationsPanel: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    filter, 
    setFilter, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-4"></div>
        <p className="text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "reminder":
        return <Calendar className="h-5 w-5 text-primary" />;
      case "success": 
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "error":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Info className="h-5 w-5 text-info" />;
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const renderNotificationContent = (notification: Notification) => {
    return (
      <div className="flex flex-col gap-0.5 flex-1">
        <div className="flex justify-between items-center w-full">
          <span className="font-medium">{notification.title}</span>
          <span className="text-xs text-muted-foreground">
            {notification.timestamp && formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
        
        {notification.actionUrl && notification.actionLabel && (
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto mt-1 justify-start w-fit"
            onClick={() => markAsRead(notification.id)}
            asChild
          >
            <a href={notification.actionUrl}>{notification.actionLabel}</a>
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md bg-background border rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">Notifications</h2>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 px-2" 
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some(n => !n.read)}
          >
            <MailOpen className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={filter} onValueChange={(value) => setFilter(value as NotificationFilter)}>
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={filter} className="m-0">
          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex gap-3 p-3 hover:bg-muted/50 cursor-pointer ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    {renderNotificationContent(notification)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <h3 className="font-medium text-lg">No notifications</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {filter === "all"
                    ? "You don't have any notifications yet."
                    : filter === "unread"
                    ? "You have read all your notifications."
                    : `You don't have any ${filter} notifications.`}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPanel;
