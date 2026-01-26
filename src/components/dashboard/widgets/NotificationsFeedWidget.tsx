/**
 * Widget de notifications pour le dashboard
 * Affiche les notifications récentes et permet de les marquer comme lues
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  BellOff, 
  Check, 
  CheckCheck,
  Trophy,
  Zap,
  Calendar,
  MessageCircle,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'streak' | 'social' | 'tip' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  action_url?: string;
  metadata?: Record<string, any>;
}

interface NotificationsFeedWidgetProps {
  className?: string;
  maxItems?: number;
}

const typeIcons = {
  achievement: <Trophy className="w-4 h-4 text-amber-500" />,
  reminder: <Calendar className="w-4 h-4 text-blue-500" />,
  streak: <Zap className="w-4 h-4 text-orange-500" />,
  social: <MessageCircle className="w-4 h-4 text-green-500" />,
  tip: <Star className="w-4 h-4 text-purple-500" />,
  system: <Bell className="w-4 h-4 text-muted-foreground" />,
};

export const NotificationsFeedWidget: React.FC<NotificationsFeedWidgetProps> = ({
  className,
  maxItems = 5
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      // Mock notifications for non-authenticated users
      setNotifications([
        {
          id: '1',
          type: 'tip',
          title: 'Astuce du jour',
          message: 'La respiration 4-7-8 peut réduire votre stress en seulement 2 minutes.',
          is_read: false,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          type: 'streak',
          title: 'Commencez votre série !',
          message: 'Connectez-vous pour commencer à gagner des points.',
          is_read: true,
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
      setUnreadCount(1);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('in_app_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(maxItems);

      if (error) throw error;

      const typedNotifications = (data || []) as Notification[];
      setNotifications(typedNotifications);
      setUnreadCount(typedNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      logger.error('Failed to fetch notifications', error as Error, 'NOTIFICATIONS');
      // Fallback to empty state
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, maxItems]);

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('in_app_notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      logger.error('Failed to mark notification as read', error as Error, 'NOTIFICATIONS');
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('in_app_notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      logger.error('Failed to mark all notifications as read', error as Error, 'NOTIFICATIONS');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Subscribe to realtime notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications-widget')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'in_app_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev.slice(0, maxItems - 1)]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, maxItems]);

  if (isLoading) {
    return (
      <Card className={cn("h-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="w-5 h-5 text-primary" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="default" className="ml-1">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={markAllAsRead}
            className="text-xs gap-1"
          >
            <CheckCheck className="w-3 h-3" />
            Tout lire
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[250px] px-4">
          <AnimatePresence mode="popLayout">
            {notifications.length > 0 ? (
              <div className="space-y-2 py-2">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "flex gap-3 p-3 rounded-lg transition-all cursor-pointer",
                      "hover:bg-accent",
                      notification.is_read 
                        ? "bg-transparent opacity-70" 
                        : "bg-primary/5 border border-primary/10"
                    )}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      notification.is_read ? "bg-muted" : "bg-background shadow-sm"
                    )}>
                      {typeIcons[notification.type]}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium text-sm",
                          !notification.is_read && "text-foreground"
                        )}>
                          {notification.title}
                        </span>
                        {!notification.is_read && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      <span className="text-xs text-muted-foreground/60 mt-1 block">
                        {formatDistanceToNow(new Date(notification.created_at), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </span>
                    </div>

                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 w-6 h-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <BellOff className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">Aucune notification</p>
                <p className="text-xs mt-1">Vous êtes à jour !</p>
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationsFeedWidget;
