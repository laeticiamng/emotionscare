
import React from 'react';
import { Notification, NotificationType } from '@/types/notification';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertCircle, MessageSquare, Book, Heart, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  // Function to determine icon based on notification type
  const getIcon = () => {
    const type = notification.type;
    switch (type) {
      case 'system':
        return <Bell className="h-4 w-4" />;
      case 'community':
      case 'user':
        return <Users className="h-4 w-4" />;
      case 'coach':
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'journal':
        return <Book className="h-4 w-4" />;
      case 'emotion':
        return <Heart className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Function to determine badge color
  const getBadgeVariant = () => {
    if (notification.priority === 'urgent') {
      return "destructive";
    }
    
    const type = notification.type;
    switch (type) {
      case 'system':
        return "secondary";
      case 'emotion':
        return "default";
      case 'coach':
      case 'message':
        return "outline";
      case 'journal':
        return "secondary";
      case 'community':
      case 'user':
        return "outline";
      default:
        return "secondary";
    }
  };

  // Check if notification is read
  const isRead = notification.read;

  // Get timestamp from various properties
  const timestamp = notification.created_at || notification.timestamp;

  return (
    <div className={`p-4 border-b ${isRead ? '' : 'bg-muted/30'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full bg-primary/10 flex-shrink-0`}>
          {getIcon()}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{notification.title}</h4>
              <Badge variant={getBadgeVariant()} className="text-xs">
                {notification.type}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {timestamp && formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: fr })}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          
          {notification.action && (
            <Button 
              variant="link" 
              className="p-0 h-auto text-sm mt-2" 
              onClick={() => window.location.href = notification.action!.url}
            >
              {notification.action.label}
            </Button>
          )}
          
          {!isRead && (
            <div className="flex justify-end mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => onMarkAsRead(notification.id)}
              >
                Marquer comme lu
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
