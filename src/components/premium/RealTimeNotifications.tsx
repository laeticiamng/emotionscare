import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, X, CheckCircle, AlertCircle, Info, Heart,
  Music, Brain, Users, Star, Zap, Gift, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'achievement' | 'social' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoHide?: boolean;
  hideDelay?: number;
}

interface RealTimeNotificationsProps {
  className?: string;
  maxVisible?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  userId?: string;
}

const RealTimeNotifications: React.FC<RealTimeNotificationsProps> = ({
  className,
  maxVisible = 3,
  position = 'top-right',
  userId
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Simuler les notifications en temps réel
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'achievement',
        title: 'Nouveau niveau atteint !',
        message: 'Félicitations ! Vous venez d\'atteindre le niveau 4 🎉',
        timestamp: new Date(),
        read: false,
        priority: 'high',
        icon: <Star className="w-4 h-4 text-amber-400" />,
        autoHide: false
      },
      {
        id: '2',
        type: 'social',
        title: 'Nouveau membre dans votre groupe',
        message: 'Marie a rejoint votre groupe "Méditation du matin"',
        timestamp: new Date(Date.now() - 300000),
        read: false,
        priority: 'medium',
        icon: <Users className="w-4 h-4 text-blue-400" />,
        autoHide: true,
        hideDelay: 5000
      },
      {
        id: '3',
        type: 'info',
        title: 'Nouvelle playlist disponible',
        message: 'Découvrez "Sérénité Matinale" adaptée à votre profil',
        timestamp: new Date(Date.now() - 600000),
        read: false,
        priority: 'low',
        icon: <Music className="w-4 h-4 text-purple-400" />,
        action: {
          label: 'Écouter',
          onClick: () => console.log('Navigate to playlist')
        },
        autoHide: true,
        hideDelay: 7000
      }
    ];

    setNotifications(mockNotifications);

    // Simuler de nouvelles notifications
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: Math.random() > 0.5 ? 'info' : 'social',
        title: 'Nouvelle activité',
        message: `Notification en temps réel - ${new Date().toLocaleTimeString()}`,
        timestamp: new Date(),
        read: false,
        priority: 'medium',
        icon: <Bell className="w-4 h-4 text-primary" />,
        autoHide: true,
        hideDelay: 4000
      };

      setNotifications(prev => [newNotification, ...prev].slice(0, 10));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Auto-hide des notifications
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.autoHide && notification.hideDelay) {
        setTimeout(() => {
          dismissNotification(notification.id);
        }, notification.hideDelay);
      }
    });
  }, [notifications]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const getTypeConfig = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-400" />,
          borderColor: 'border-l-green-400',
          bgColor: 'bg-green-500/10'
        };
      case 'warning':
        return {
          icon: <AlertCircle className="w-4 h-4 text-amber-400" />,
          borderColor: 'border-l-amber-400',
          bgColor: 'bg-amber-500/10'
        };
      case 'achievement':
        return {
          icon: <Star className="w-4 h-4 text-amber-400" />,
          borderColor: 'border-l-amber-400',
          bgColor: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10'
        };
      case 'social':
        return {
          icon: <Users className="w-4 h-4 text-blue-400" />,
          borderColor: 'border-l-blue-400',
          bgColor: 'bg-blue-500/10'
        };
      case 'system':
        return {
          icon: <Info className="w-4 h-4 text-gray-400" />,
          borderColor: 'border-l-gray-400',
          bgColor: 'bg-gray-500/10'
        };
      default:
        return {
          icon: <Info className="w-4 h-4 text-primary" />,
          borderColor: 'border-l-primary',
          bgColor: 'bg-primary/10'
        };
    }
  };

  const getPositionClasses = () => {
    switch (position) {
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

  const visibleNotifications = notifications.slice(0, maxVisible);
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isVisible || visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      "fixed z-50 max-w-sm w-full space-y-3",
      getPositionClasses(),
      className
    )}>
      {/* Header avec compteur */}
      {unreadCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-2"
        >
          <Badge variant="outline" className="bg-primary/10 border-primary/30">
            {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''} notification{unreadCount > 1 ? 's' : ''}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </motion.div>
      )}

      {/* Liste des notifications */}
      <AnimatePresence>
        {visibleNotifications.map((notification, index) => {
          const typeConfig = getTypeConfig(notification.type);
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              layout
            >
              <Card className={cn(
                "relative overflow-hidden backdrop-blur-sm border-l-4 transition-all duration-300 hover:shadow-lg",
                typeConfig.borderColor,
                typeConfig.bgColor,
                !notification.read && "ring-2 ring-primary/20",
                notification.priority === 'high' && "ring-2 ring-amber-400/30"
              )}>
                {/* Indicateur de priorité haute */}
                {notification.priority === 'high' && (
                  <motion.div
                    className="absolute top-0 right-0 w-2 h-2 bg-amber-400 rounded-full m-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}

                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icône */}
                    <div className="flex-shrink-0 mt-0.5">
                      {notification.icon || typeConfig.icon}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm leading-tight">
                          {notification.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissNotification(notification.id)}
                          className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp.toLocaleTimeString()}
                        </span>

                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-5 text-xs px-2"
                            >
                              Marquer lu
                            </Button>
                          )}

                          {notification.action && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={notification.action.onClick}
                              className="h-5 text-xs px-2"
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Barre de progression pour auto-hide */}
                {notification.autoHide && notification.hideDelay && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-primary/50"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: notification.hideDelay / 1000, ease: "linear" }}
                  />
                )}
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Indicateur s'il y a plus de notifications */}
      {notifications.length > maxVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
            onClick={() => console.log('Show all notifications')}
          >
            +{notifications.length - maxVisible} notification{notifications.length - maxVisible > 1 ? 's' : ''} de plus
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default RealTimeNotifications;