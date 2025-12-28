/**
 * Exchange Notifications - Real-time notification system for exchange events
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  BellOff,
  Clock,
  Shield,
  TrendingUp,
  Heart,
  CheckCircle,
  X,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExchangeNotification {
  id: string;
  type: 'time_request' | 'trust_given' | 'emotion_purchase' | 'match_found' | 'goal_completed';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  metadata?: Record<string, unknown>;
}

const notificationIcons = {
  time_request: Clock,
  trust_given: Shield,
  emotion_purchase: Heart,
  match_found: Users,
  goal_completed: TrendingUp,
};

const notificationColors = {
  time_request: 'text-amber-500',
  trust_given: 'text-blue-500',
  emotion_purchase: 'text-pink-500',
  match_found: 'text-purple-500',
  goal_completed: 'text-emerald-500',
};

export const ExchangeNotifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<ExchangeNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load notifications from localStorage (simulated)
  useEffect(() => {
    if (!user?.id) return;
    
    const stored = localStorage.getItem(`exchange_notifications_${user.id}`);
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      // Default welcome notifications
      const defaultNotifications: ExchangeNotification[] = [
        {
          id: '1',
          type: 'match_found',
          title: 'Bienvenue sur Exchange !',
          message: 'Découvrez les utilisateurs compatibles avec votre profil.',
          read: false,
          created_at: new Date().toISOString(),
        },
      ];
      setNotifications(defaultNotifications);
      localStorage.setItem(`exchange_notifications_${user.id}`, JSON.stringify(defaultNotifications));
    }
  }, [user?.id]);

  // Real-time subscription for new events
  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to time exchange requests
    const timeChannel = supabase
      .channel('time_exchanges_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'time_exchanges',
          filter: `provider_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification: ExchangeNotification = {
            id: payload.new.id,
            type: 'time_request',
            title: 'Nouvelle demande d\'échange',
            message: 'Quelqu\'un souhaite échanger du temps avec vous !',
            read: false,
            created_at: new Date().toISOString(),
            metadata: payload.new,
          };
          addNotification(newNotification);
          toast.info('Nouvelle demande d\'échange de temps !');
        }
      )
      .subscribe();

    // Subscribe to trust transactions
    const trustChannel = supabase
      .channel('trust_transactions_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trust_transactions',
          filter: `to_user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification: ExchangeNotification = {
            id: payload.new.id,
            type: 'trust_given',
            title: 'Confiance reçue !',
            message: `Vous avez reçu ${payload.new.amount} points de confiance.`,
            read: false,
            created_at: new Date().toISOString(),
            metadata: payload.new,
          };
          addNotification(newNotification);
          toast.success(`+${payload.new.amount} points de confiance reçus !`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(timeChannel);
      supabase.removeChannel(trustChannel);
    };
  }, [user?.id]);

  const addNotification = (notification: ExchangeNotification) => {
    setNotifications(prev => {
      const updated = [notification, ...prev].slice(0, 50);
      if (user?.id) {
        localStorage.setItem(`exchange_notifications_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      if (user?.id) {
        localStorage.setItem(`exchange_notifications_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      if (user?.id) {
        localStorage.setItem(`exchange_notifications_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      if (user?.id) {
        localStorage.setItem(`exchange_notifications_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={markAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <BellOff className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Aucune notification</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                const colorClass = notificationColors[notification.type];
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={`p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-full bg-muted ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm truncate">
                            {notification.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default ExchangeNotifications;
