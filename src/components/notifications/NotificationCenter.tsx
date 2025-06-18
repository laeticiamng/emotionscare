
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  Bell, 
  Check, 
  Trash2, 
  Settings, 
  X,
  CheckCheck,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll 
  } = useNotifications();
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      default: return 'border-l-blue-500';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-0 right-0 h-full w-96 bg-background border-l shadow-2xl z-50"
        >
          <Card className="h-full rounded-none border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}>
                  {filter === 'all' ? 'Non lues' : 'Toutes'}
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <div className="px-6 pb-4">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  Tout marquer lu
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearAll}
                  disabled={notifications.length === 0}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Tout effacer
                </Button>
              </div>
            </div>

            <CardContent className="p-0 flex-1">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <AnimatePresence>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                          !notification.read ? 'bg-muted/30' : ''
                        } hover:bg-muted/50 transition-colors`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm">{notification.title}</p>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(notification.timestamp), { 
                                    addSuffix: true, 
                                    locale: fr 
                                  })}
                                </span>
                                {notification.actionText && notification.actionUrl && (
                                  <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                    {notification.actionText}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">
                        {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>

            <div className="p-4 border-t">
              <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Paramètres des notifications
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
