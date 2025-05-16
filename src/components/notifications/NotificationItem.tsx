
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Bell, ScanLine, MessageSquare, Users, Award } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { NotificationItemProps, NotificationType } from '@/types/notification';

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification, onMarkAsRead, onDelete, onClick, compact = false, onRead
}) => {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "emotion":
        return <ScanLine className="h-5 w-5 text-purple-500" />;
      case "journal":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "community":
        return <Users className="h-5 w-5 text-green-500" />;
      case "achievement":
        return <Award className="h-5 w-5 text-amber-500" />;
      case "reminder":
        return <Bell className="h-5 w-5 text-orange-500" />;
      case "success":
        return <Bell className="h-5 w-5 text-green-500" />;
      case "warning":
        return <Bell className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <Bell className="h-5 w-5 text-red-500" />;
      case "alert":
        return <Bell className="h-5 w-5 text-red-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "system":
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };
  
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkAsRead) onMarkAsRead(notification.id);
    if (onRead) onRead(notification.id);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(notification.id);
  };
  
  const handleClick = () => {
    if (onClick) onClick(notification);
    if (!notification.read && onMarkAsRead) onMarkAsRead(notification.id);
    if (!notification.read && onRead) onRead(notification.id);
  };
  
  const formattedDate = notification.timestamp || notification.date || notification.createdAt;
  
  return (
    <div 
      className={`
        p-3 rounded-lg border 
        ${!notification.read ? 'bg-muted/40' : 'bg-card'} 
        hover:bg-accent/10 transition-colors cursor-pointer
        ${compact ? 'text-sm' : ''}
      `}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p className={`font-medium ${compact ? 'text-sm' : ''}`}>{notification.title}</p>
            
            <div className="flex items-center gap-1">
              {!notification.read && !compact && (
                <div className="h-2 w-2 rounded-full bg-primary"></div>
              )}
              
              <div className="flex">
                {!compact && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleMarkAsRead}>
                    <span className="sr-only">Mark as read</span>
                    <span className="text-xs">✓</span>
                  </Button>
                )}
                
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDelete}>
                  <span className="sr-only">Delete notification</span>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          
          <p className={`text-muted-foreground ${compact ? 'text-xs line-clamp-1' : ''}`}>
            {notification.message}
          </p>
          
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">
              {formattedDate && typeof formattedDate === 'string' 
                ? formatDistanceToNow(new Date(formattedDate), { addSuffix: true, locale: fr }) 
                : formatDistanceToNow(new Date(), { addSuffix: true, locale: fr })
              }
            </span>
            
            {((notification.action_url || notification.actionUrl) && (notification.action_label || notification.actionLabel)) && !compact && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                {notification.action_label || notification.actionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
