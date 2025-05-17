
import React from 'react';
import { Notification, NotificationType } from '@/types/notification';
import { Button } from '@/components/ui/button';
import { Bell, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const handleMarkAsRead = () => {
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  // Détermine l'horodatage à utiliser
  const timestamp = notification.timestamp || notification.created_at || notification.createdAt || '';
  
  // Fonction pour obtenir l'icône et la couleur en fonction du type
  const getTypeStyles = () => {
    const type = notification.type as NotificationType;
    
    switch (type) {
      case 'success':
        return { color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900' };
      case 'warning':
        return { color: 'text-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-900' };
      case 'error':
        return { color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900' };
      case 'achievement':
        return { color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900' };
      case 'badge':
        return { color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900' };
      case 'streak':
        return { color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900' };
      case 'system':
        return { color: 'text-slate-500', bgColor: 'bg-slate-100 dark:bg-slate-800' };
      default:
        return { color: 'text-primary', bgColor: 'bg-primary/10' };
    }
  };

  const { color, bgColor } = getTypeStyles();

  return (
    <div className={`p-4 rounded-lg border ${!notification.read ? 'bg-muted/30' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${bgColor}`}>
          <Bell className={`h-4 w-4 ${color}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: fr }) : ''}
            </span>
            
            {!notification.read && onMarkAsRead && (
              <Button
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={handleMarkAsRead}
              >
                <Check className="h-3 w-3 mr-1" />
                <span className="text-xs">Marquer comme lu</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
