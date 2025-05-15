
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Calendar, CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';
import { Notification } from '@/types';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
  onSelect?: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onSelect }) => {
  const { markAsRead } = useNotifications();

  const getTypeIcon = () => {
    switch (notification.type) {
      case 'reminder':
        return <Calendar className="h-5 w-5 text-primary" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      default:
        return <Info className="h-5 w-5 text-info" />;
    }
  };

  const handleClick = () => {
    markAsRead(notification.id);
    if (onSelect) {
      onSelect(notification);
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer ${
        !notification.read ? 'bg-primary/5' : ''
      }`}
      onClick={handleClick}
    >
      <div className="mt-1">{getTypeIcon()}</div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <span className="font-medium">{notification.title}</span>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {notification.timestamp && formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{notification.message}</p>
        
        {notification.actionUrl && notification.actionLabel && (
          <a
            href={notification.actionUrl}
            className="text-sm text-primary hover:underline mt-1 block"
            onClick={(e) => e.stopPropagation()}
          >
            {notification.actionLabel}
          </a>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
