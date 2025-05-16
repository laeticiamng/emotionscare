
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Notification, NotificationItemProps, NotificationType } from '@/types/notification';
import { Button } from '@/components/ui/button';
import {
  Heart, BookOpen, Users, Award, Bell, Info, CheckCircle, AlertTriangle, XCircle, AlertOctagon, MessageSquare
} from 'lucide-react';

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onClick, 
  onMarkAsRead, 
  onDelete,
  compact = false,
  onRead
}) => {

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'emotion':
        return <Heart className="h-5 w-5 text-rose-500" />;
      case 'journal':
        return <BookOpen className="h-5 w-5 text-amber-500" />;
      case 'community':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'achievement':
        return <Award className="h-5 w-5 text-purple-500" />;
      case 'reminder':
        return <Bell className="h-5 w-5 text-emerald-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'alert':
        return <AlertOctagon className="h-5 w-5 text-orange-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'system':
      default:
        return <Info className="h-5 w-5 text-slate-500" />;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(notification);
    }
    
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }

    if (!notification.read && onRead) {
      onRead(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(notification.id);
    }
  };

  const formattedTime = () => {
    // Use the first available date property
    const dateToUse = notification.date || notification.createdAt || notification.timestamp;
    
    if (!dateToUse) return '';
    
    try {
      return formatDistanceToNow(new Date(dateToUse), { 
        addSuffix: true,
        locale: fr
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateToUse;
    }
  };

  // Compact view (for mobile or limited space)
  if (compact) {
    return (
      <div
        onClick={handleClick}
        className={`p-3 border-b last:border-b-0 flex items-start gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${
          !notification.read ? 'bg-primary/5' : ''
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {getIcon(notification.type)}
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="font-medium text-sm line-clamp-1">{notification.title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {notification.message}
          </p>
          <span className="text-xs text-muted-foreground block mt-1">
            {formattedTime()}
          </span>
        </div>
        {!notification.read && (
          <span className="shrink-0 h-2 w-2 rounded-full bg-primary"></span>
        )}
      </div>
    );
  }

  // Full view
  return (
    <div 
      className={`p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer ${
        !notification.read ? 'bg-primary/5' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        <div className="shrink-0 mt-1">
          {getIcon(notification.type)}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">{notification.title}</h4>
            <div className="flex gap-1 items-center">
              {!notification.read && (
                <span className="h-2 w-2 rounded-full bg-primary"></span>
              )}
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formattedTime()}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {notification.message}
          </p>
          
          {/* Action button if provided */}
          {(notification.action_url || notification.actionUrl) && (
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(notification.action_url || notification.actionUrl, '_blank');
                }}
              >
                {notification.action_label || notification.actionLabel || 'Voir plus'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
