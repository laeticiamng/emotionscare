
import React from 'react';
import { Notification, NotificationType } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCircle, AlertTriangle, Info, BookOpenCheck } from 'lucide-react';

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onClick
}) => {
  // Get notification icon based on type
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'emotion':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'system':
        return <Info className="h-5 w-5 text-gray-500" />;
      case 'user':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'journal':
        return <BookOpenCheck className="h-5 w-5 text-purple-500" />;
      case 'urgent':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  // Get class name based on type and priority
  const getBgClass = () => {
    if (notification.type === 'urgent' || notification.priority === 'urgent') {
      return 'bg-red-50 dark:bg-red-950/30';
    }
    if (!notification.read) {
      return 'bg-blue-50 dark:bg-blue-950/30';
    }
    return 'bg-white dark:bg-gray-950';
  };

  // Format notification time as "X time ago"
  const timeAgo = notification.created_at 
    ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })
    : '';

  return (
    <div
      className={`p-3 rounded-lg mb-2 border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${getBgClass()}`}
      onClick={() => onClick && onClick()}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon(notification.type)}
        </div>
        <div className="flex-grow">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">{timeAgo}</span>
            <div className="flex gap-2">
              <button 
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
              >
                {notification.read ? 'Mark as unread' : 'Mark as read'}
              </button>
              <button 
                className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
