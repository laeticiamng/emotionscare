// @ts-nocheck

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface NotificationBarProps {
  initialNotifications?: Notification[];
  className?: string;
  maxNotifications?: number;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ 
  initialNotifications = [], 
  className = '',
  maxNotifications = 3
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
    if (!showNotifications && unreadCount > 0) {
      markAllAsRead();
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "Notifications",
      description: "Toutes les notifications ont été marquées comme lues",
    });
  };
  
  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
    toast({
      title: "Notifications",
      description: "Toutes les notifications ont été effacées",
    });
  };
  
  return (
    <div className={`relative ${className}`}>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleNotifications}
        className="relative"
        aria-label="Afficher les notifications"
        aria-expanded={showNotifications}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
      
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto bg-card shadow-lg rounded-md border z-50"
          >
            <div className="p-3 border-b flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex gap-1">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Tout marquer comme lu
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllNotifications}>
                    Effacer tout
                  </Button>
                )}
              </div>
            </div>
            
            <div className="p-2 space-y-2">
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Aucune notification
                </div>
              ) : (
                notifications.slice(0, maxNotifications).map(notification => (
                  <Alert 
                    key={notification.id} 
                    variant={notification.read ? 'default' : 'destructive'}
                    className="relative"
                  >
                    <div className="absolute top-2 right-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => removeNotification(notification.id)}
                      >
                        &times;
                      </Button>
                    </div>
                    <AlertTitle className="pr-6">{notification.title}</AlertTitle>
                    <AlertDescription className="text-sm">
                      {notification.description}
                      <div className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </div>
                    </AlertDescription>
                  </Alert>
                ))
              )}
              
              {notifications.length > maxNotifications && (
                <div className="text-center py-2 text-muted-foreground text-sm">
                  +{notifications.length - maxNotifications} autres notifications
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBar;
