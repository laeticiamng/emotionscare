
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Trash2, Bell, FileText, Box, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification } from '@/types/notification';

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
  onClick,
}) => {
  // Format the date
  const formattedDate = new Date(notification.created_at).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'journal':
        return <FileText className="h-5 w-5" />;
      case 'system':
        return <Bell className="h-5 w-5" />;
      case 'emotion':
        return <Box className="h-5 w-5" />;
      case 'urgent':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  return (
    <Card
      className={cn(
        "flex items-start justify-between p-4 cursor-pointer transition-colors hover:bg-accent",
        !notification.read && "border-l-4 border-l-primary"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-md",
          notification.type === 'urgent' ? "bg-red-100 text-red-600" :
          notification.type === 'journal' ? "bg-blue-100 text-blue-600" :
          notification.type === 'emotion' ? "bg-purple-100 text-purple-600" :
          "bg-gray-100 text-gray-600"
        )}>
          {getIcon()}
        </div>
        
        <div>
          <h4 className={cn(
            "font-medium",
            !notification.read && "font-semibold"
          )}>
            {notification.title}
          </h4>
          <p className="text-muted-foreground text-sm">{notification.message}</p>
          <span className="text-xs text-muted-foreground mt-1 block">{formattedDate}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {!notification.read && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            title="Marquer comme lu"
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">Marquer comme lu</span>
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Supprimer</span>
        </Button>
      </div>
    </Card>
  );
};

export default NotificationItem;
