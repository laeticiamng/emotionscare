// @ts-nocheck
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Lightbulb, Flame, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { MoodMixerNotification } from '../hooks/useMoodMixerRealtime';

interface NotificationsPanelProps {
  notifications: MoodMixerNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClear: () => void;
}

const NOTIFICATION_ICONS: Record<MoodMixerNotification['type'], React.ElementType> = {
  session_reminder: Clock,
  streak_warning: Flame,
  achievement: Award,
  tip: Lightbulb,
};

const NOTIFICATION_COLORS: Record<MoodMixerNotification['type'], string> = {
  session_reminder: 'text-blue-500',
  streak_warning: 'text-orange-500',
  achievement: 'text-yellow-500',
  tip: 'text-green-500',
};

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (mins < 1) return 'À l\'instant';
  if (mins < 60) return `Il y a ${mins}m`;
  if (hours < 24) return `Il y a ${hours}h`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={onMarkAllAsRead}
              >
                <Check className="h-3 w-3 mr-1" />
                Tout lire
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={onClear}
              >
                <X className="h-3 w-3 mr-1" />
                Effacer
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y">
              <AnimatePresence>
                {notifications.map((notification, index) => {
                  const Icon = NOTIFICATION_ICONS[notification.type];
                  const colorClass = NOTIFICATION_COLORS[notification.type];

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className={`flex-shrink-0 mt-0.5 ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPanel;
