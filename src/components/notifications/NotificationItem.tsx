
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, Info, Check, Trash2, Book, HeartPulse, User, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NotificationItemProps, NotificationType } from '@/types/notification';

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead,
  onDelete,
  onClick
}) => {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'system':
        return <Info className="h-4 w-4" />;
      case 'journal':
        return <Book className="h-4 w-4" />;
      case 'emotion':
        return <HeartPulse className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const isUrgent = notification.type === 'urgent' || notification.priority === 'urgent';
  
  return (
    <Card 
      className={`mb-2 ${notification.read ? 'opacity-80' : ''} ${isUrgent ? 'border-red-400' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className={`mt-1 p-1.5 rounded-full ${
            isUrgent ? 'bg-red-100' : 'bg-primary/10'
          }`}>
            {getIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
              {notification.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {notification.message}
            </p>
            <div className="flex items-center text-xs text-muted-foreground mt-1.5">
              {notification.created_at && (
                <span className="flex-shrink-0">
                  {format(new Date(notification.created_at), 'dd MMM, HH:mm', { locale: fr })}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-shrink-0 gap-1">
            {!notification.read && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
              >
                <Check className="h-3.5 w-3.5" />
                <span className="sr-only">Marquer comme lu</span>
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-muted-foreground hover:text-destructive" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Supprimer</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationItem;
