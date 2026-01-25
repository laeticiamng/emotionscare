/**
 * ParkNotificationsPanel - Panneau de notifications temps réel du parc
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParkRealtime, type ParkNotification } from '@/hooks/useParkRealtime';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ParkNotificationsPanelProps {
  className?: string;
}

export function ParkNotificationsPanel({ className = '' }: ParkNotificationsPanelProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  } = useParkRealtime();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: ParkNotification['type']) => {
    const icons: Record<ParkNotification['type'], string> = {
      badge: '🏅',
      quest: '🏆',
      streak: '🔥',
      weather: '🌤️',
      event: '🎉',
      friend: '👥'
    };
    return icons[type];
  };

  const getNotificationColor = (type: ParkNotification['type']) => {
    const colors: Record<ParkNotification['type'], string> = {
      badge: 'from-yellow-500/20 to-orange-500/20',
      quest: 'from-purple-500/20 to-pink-500/20',
      streak: 'from-red-500/20 to-orange-500/20',
      weather: 'from-blue-500/20 to-cyan-500/20',
      event: 'from-green-500/20 to-emerald-500/20',
      friend: 'from-indigo-500/20 to-violet-500/20'
    };
    return colors[type];
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`relative gap-2 ${className}`}
        >
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-7 px-2 text-xs"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Tout lu
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearNotifications}
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>

        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Aucune notification</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative p-3 border-b hover:bg-accent/50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getNotificationColor(
                        notification.type
                      )} flex items-center justify-center text-lg shrink-0`}
                    >
                      {notification.icon || getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium truncate">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                          locale: fr
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export default ParkNotificationsPanel;
