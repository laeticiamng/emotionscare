
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, Calendar, CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Notification, NotificationItemProps } from '@/types';

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'reminder':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const handleClick = () => {
    if (onRead) {
      onRead(notification.id);
    }
  };

  const formattedDate = notification.timestamp 
    ? formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true, locale: fr })
    : '';

  return (
    <div 
      className={cn(
        "p-4 border-b last:border-b-0 transition-colors",
        notification.read ? "bg-background" : "bg-primary/5",
        "hover:bg-muted/40 cursor-pointer"
      )}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-sm">{notification.title}</h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{formattedDate}</span>
          </div>
          
          {notification.message && (
            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          )}

          <div className="flex items-center justify-between mt-2">
            {!notification.read && (
              <Badge variant="secondary" className="text-xs">Nouveau</Badge>
            )}
            
            {notification.actionUrl && notification.actionLabel && (
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto text-xs"
                asChild
              >
                <a href={notification.actionUrl}>{notification.actionLabel}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
