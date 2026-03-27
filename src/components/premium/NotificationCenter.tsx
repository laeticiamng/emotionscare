// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, Heart, Brain, Music, Users, Trophy, 
  AlertCircle, CheckCircle, Info, Star, Clock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Notification {
  id: string;
  type: 'achievement' | 'social' | 'system' | 'reminder' | 'milestone';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    path: string;
  };
  user?: {
    name: string;
    avatar?: string;
  };
  data?: any;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: '🏆 Nouveau niveau atteint !',
      message: 'Félicitations ! Vous avez atteint le niveau 15 - Mentor Émotionnel',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      action: { label: 'Voir mes récompenses', path: '/app/leaderboard' },
      data: { level: 15, xp: 2847 }
    },
    {
      id: '2',
      type: 'social',
      title: '💬 Nouveau message communauté',
      message: 'Marie Dubois a répondu à votre post sur la méditation matinale',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      action: { label: 'Voir le message', path: '/app/community' },
      user: { name: 'Marie Dubois', avatar: '/avatars/marie.jpg' }
    },
    {
      id: '3',
      type: 'milestone',
      title: '✨ Jalon franchit !',
      message: 'Vous avez terminé 7 jours consécutifs de pratiques bien-être',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      action: { label: 'Continuer la série', path: '/app/home' }
    },
    {
      id: '4',
      type: 'reminder',
      title: '🧘 Rappel personnalisé',
      message: 'Il est temps pour votre session de respiration quotidienne',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true,
      action: { label: 'Commencer maintenant', path: '/app/breathwork' }
    },
    {
      id: '5',
      type: 'system',
      title: '🎵 Nouvelle playlist générée',
      message: 'Votre playlist "Sérénité Matinale" a été mise à jour selon votre humeur',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      read: true,
      action: { label: 'Écouter', path: '/app/music' }
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'social':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'milestone':
        return <Star className="w-5 h-5 text-purple-500" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'system':
        return <Info className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return 'border-l-yellow-500 bg-yellow-500/5';
      case 'social':
        return 'border-l-blue-500 bg-blue-500/5';
      case 'milestone':
        return 'border-l-purple-500 bg-purple-500/5';
      case 'reminder':
        return 'border-l-orange-500 bg-orange-500/5';
      case 'system':
        return 'border-l-green-500 bg-green-500/5';
      default:
        return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Ouvrir le centre de notifications">
          <motion.div
            animate={{ rotate: unreadCount > 0 ? [0, 15, -15, 0] : 0 }}
            transition={{ duration: 0.5, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}
          >
            <Bell className="w-5 h-5" />
          </motion.div>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
            >
              {unreadCount}
            </motion.div>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md overflow-hidden">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </SheetTitle>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs"
              >
                Tout marquer lu
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto pt-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  Aucune notification
                </h3>
                <p className="text-sm text-muted-foreground/70">
                  Nous vous tiendrons informé de vos progrès !
                </p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card 
                    className={`relative transition-all duration-200 hover:shadow-md cursor-pointer border-l-4 ${
                      getNotificationColor(notification.type)
                    } ${
                      !notification.read ? 'bg-accent/50' : 'bg-background'
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium truncate pr-2">
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            
                            {notification.action && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs h-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Navigate to action path
                                  window.location.href = notification.action!.path;
                                }}
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </div>

                          {notification.user && (
                            <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-border/50">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                                <AvatarFallback className="text-xs">
                                  {notification.user.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {notification.user.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {!notification.read && (
                        <motion.div
                          className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {notifications.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setNotifications([])}
            >
              Effacer toutes les notifications
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;