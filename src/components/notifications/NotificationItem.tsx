
import React from 'react';
import { Button } from '@/components/ui/button';
import { Notification } from '@/types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  const handleMarkAsRead = () => {
    onMarkAsRead(notification.id);
  };

  // Get icon based on notification type
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'achievement':
        return '🏆';
      case 'reminder':
        return '⏰';
      case 'badge':
        return '🎖️';
      case 'streak':
        return '🔥';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`p-4 rounded-lg mb-3 ${notification.read ? 'bg-muted/40' : 'bg-muted'}`}>
      <div className="flex">
        <div className="mr-3 text-xl">{getIcon(notification.type)}</div>
        <div className="flex-1">
          <h4 className="font-medium">{notification.title}</h4>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {new Date(notification.timestamp).toLocaleString()}
            </span>
            {!notification.read && (
              <Button variant="ghost" size="sm" onClick={handleMarkAsRead}>
                Mark as read
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
