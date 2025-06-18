
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Notification } from '@/types/notifications';
import { formatRelativeTime } from '@/lib/utils';
import { useNotifications } from '@/contexts/NotificationContext';
import { 
  Bell, 
  Trophy, 
  Calendar, 
  Heart, 
  Users, 
  Mail, 
  Settings, 
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface NotificationListProps {
  notifications: Notification[];
  emptyMessage?: string;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  emptyMessage = "Aucune notification" 
}) => {
  const { markAsRead, removeNotification } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'reminder':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'wellness':
        return <Heart className="h-4 w-4 text-pink-500" />;
      case 'system':
        return <Settings className="h-4 w-4 text-gray-500" />;
      case 'social':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'message':
        return <Mail className="h-4 w-4 text-purple-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
      default:
        return 'outline';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {notifications.map((notification, index) => (
        <div key={notification.id}>
          <Card 
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
              !notification.read ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-medium ${
                        !notification.read ? 'text-primary' : 'text-foreground'
                      }`}>
                        {notification.title}
                      </h4>
                      
                      <div className="flex items-center space-x-2">
                        {notification.priority && notification.priority !== 'low' && (
                          <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                            {notification.priority}
                          </Badge>
                        )}
                        
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(notification.timestamp)}
                      </span>
                      
                      {notification.actionText && (
                        <span className="text-xs text-primary hover:underline">
                          {notification.actionText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {index < notifications.length - 1 && <Separator className="my-1" />}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
