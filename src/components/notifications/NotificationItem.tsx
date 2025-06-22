
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ExternalLink, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  created_at: string;
  action_link?: string;
  action_text?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    // Icons based on category would be implemented here
    return notification.icon || '🔔';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative ${!notification.read ? 'ring-2 ring-primary/20' : ''}`}
    >
      <Card className={`${!notification.read ? 'bg-accent/10' : ''} transition-all duration-200`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Priority indicator */}
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)} mt-2`} />
            
            {/* Icon */}
            <div className="text-2xl">{getCategoryIcon(notification.category)}</div>
            
            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                    {notification.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                </div>
                
                {/* Status badges */}
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="outline" className="capitalize">
                    {notification.category}
                  </Badge>
                  {!notification.read && (
                    <Badge variant="default" className="bg-primary/20 text-primary">
                      Nouveau
                    </Badge>
                  )}
                </div>
              </div>

              {/* Metadata */}
              {notification.metadata && (
                <div className="text-xs text-muted-foreground">
                  {Object.entries(notification.metadata).map(([key, value]) => (
                    <span key={key} className="mr-3">
                      {key}: {String(value)}
                    </span>
                  ))}
                </div>
              )}

              {/* Timestamp and actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: true,
                    locale: fr
                  })}
                </div>

                <div className="flex items-center gap-2">
                  {notification.action_link && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(notification.action_link, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {notification.action_text || 'Voir'}
                    </Button>
                  )}
                  
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onMarkAsRead}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationItem;
