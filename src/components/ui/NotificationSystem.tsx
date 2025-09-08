/**
 * 🔔 NOTIFICATION SYSTEM PREMIUM
 * Système de notifications intelligent et accessible
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bell, 
  Check, 
  AlertTriangle, 
  Info, 
  AlertCircle,
  Zap,
  Heart,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { usePremiumStore } from '@/core/PremiumStateManager';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'premium';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
  metadata?: any;
  timestamp: number;
  read: boolean;
}

interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'default' | 'destructive' | 'outline';
  primary?: boolean;
}

export const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [position, setPosition] = useState<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>('top-right');
  const { user } = usePremiumStore();

  // Auto-remove notifications
  useEffect(() => {
    const intervals = notifications
      .filter(n => n.duration && !n.persistent)
      .map(notification => 
        setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration)
      );

    return () => {
      intervals.forEach(clearTimeout);
    };
  }, [notifications]);

  // Add notification function
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
      duration: notification.duration ?? 5000
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep max 5 notifications
    
    // Announce to screen readers
    announceToScreenReader(notification.title, notification.type);
  };

  // Remove notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Mark as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // Screen reader announcement
  const announceToScreenReader = (message: string, type: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `${type}: ${message}`;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'premium':
        return <Zap className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  // Sample notifications for demo
  useEffect(() => {
    if (user) {
      // Welcome notification
      setTimeout(() => {
        addNotification({
          type: 'success',
          title: `Bienvenue ${user.name}!`,
          message: 'Votre session a été initialisée avec succès.',
          duration: 4000
        });
      }, 1000);

      // Feature announcement
      setTimeout(() => {
        addNotification({
          type: 'premium',
          title: 'Nouvelle fonctionnalité disponible!',
          message: 'Le coach IA Premium est maintenant accessible.',
          duration: 6000,
          actions: [
            {
              label: 'Découvrir',
              action: () => console.log('Navigate to coach'),
              primary: true
            },
            {
              label: 'Plus tard',
              action: () => console.log('Dismiss'),
              variant: 'outline'
            }
          ]
        });
      }, 3000);
    }
  }, [user]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div 
      className={cn(
        'fixed z-50 flex flex-col gap-3 w-96 max-w-[calc(100vw-2rem)]',
        getPositionClasses()
      )}
      aria-label="Notifications"
      role="region"
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            layout
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              y: position.includes('top') ? -20 : 20
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              x: position.includes('right') ? 400 : -400
            }}
            transition={{ 
              duration: 0.3, 
              ease: "easeInOut",
              layout: { duration: 0.2 }
            }}
            className="relative"
          >
            <Card 
              className={cn(
                'shadow-lg border-l-4 backdrop-blur-sm bg-card/95',
                notification.type === 'success' && 'border-l-green-500',
                notification.type === 'error' && 'border-l-red-500',
                notification.type === 'warning' && 'border-l-yellow-500',
                notification.type === 'info' && 'border-l-blue-500',
                notification.type === 'premium' && 'border-l-purple-500',
                !notification.read && 'ring-2 ring-primary/20'
              )}
              role="alert"
              aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
              tabIndex={0}
              onFocus={() => markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm leading-tight">
                          {notification.title}
                        </h4>
                        {notification.message && (
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                        )}
                      </div>

                      {/* Close Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNotification(notification.id)}
                        className="h-6 w-6 p-0 hover:bg-muted/50 flex-shrink-0"
                        aria-label="Fermer la notification"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Actions */}
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {notification.actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            size="sm"
                            variant={action.variant || (action.primary ? 'default' : 'outline')}
                            onClick={() => {
                              action.action();
                              removeNotification(notification.id);
                            }}
                            className="h-7 text-xs"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Metadata */}
                    {notification.type === 'premium' && (
                      <div className="flex items-center gap-1 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          <Heart className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar for timed notifications */}
                {notification.duration && !notification.persistent && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-primary/20 rounded-b-md overflow-hidden"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ 
                      duration: notification.duration / 1000,
                      ease: "linear"
                    }}
                  >
                    <div className="h-full bg-primary" />
                  </motion.div>
                )}

                {/* Unread indicator */}
                {!notification.read && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Notification Settings (if multiple notifications) */}
      {notifications.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNotifications([])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Tout effacer ({notifications.length})
          </Button>
        </motion.div>
      )}
    </div>
  );
};

// Export hook for adding notifications
export const useNotifications = () => {
  return {
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      // This would integrate with the global state or context
      console.log('Add notification:', notification);
    }
  };
};

export default NotificationSystem;