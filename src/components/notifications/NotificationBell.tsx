// @ts-nocheck

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Bell, Settings, CheckCheck, Volume2, VolumeX, Trash2, BellRing, MessageCircle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationItem from './NotificationItem';
import { toast } from 'sonner';

type NotificationCategory = 'all' | 'social' | 'achievements' | 'system';

const CATEGORY_ICONS: Record<NotificationCategory, React.ReactNode> = {
  all: <Bell className="h-3 w-3" />,
  social: <MessageCircle className="h-3 w-3" />,
  achievements: <Trophy className="h-3 w-3" />,
  system: <BellRing className="h-3 w-3" />,
};

const NotificationBell: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    loading
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('all');
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('notification-sound');
    return saved !== 'false';
  });

  // Filter notifications by category
  const filteredNotifications = useMemo(() => {
    if (selectedCategory === 'all') return notifications;
    return notifications.filter(n => {
      const type = n.type?.toLowerCase() || '';
      if (selectedCategory === 'social') return type.includes('message') || type.includes('social') || type.includes('friend');
      if (selectedCategory === 'achievements') return type.includes('achievement') || type.includes('badge') || type.includes('level');
      if (selectedCategory === 'system') return type.includes('system') || type.includes('alert') || type.includes('update');
      return true;
    });
  }, [notifications, selectedCategory]);

  const recentNotifications = filteredNotifications.slice(0, 10);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: notifications.filter(n => !n.read).length,
      social: notifications.filter(n => !n.read && (n.type?.includes('message') || n.type?.includes('social'))).length,
      achievements: notifications.filter(n => !n.read && (n.type?.includes('achievement') || n.type?.includes('badge'))).length,
      system: notifications.filter(n => !n.read && (n.type?.includes('system') || n.type?.includes('alert'))).length,
    };
  }, [notifications]);

  const handleMarkAllAsRead = () => {
    notifications.filter(n => !n.read).forEach(n => markAsRead(n.id));
    toast.success('Toutes les notifications marquées comme lues');
  };

  const handleClearAll = () => {
    notifications.forEach(n => deleteNotification(n.id));
    toast.success('Notifications effacées');
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('notification-sound', String(newValue));
    toast.success(newValue ? 'Sons activés' : 'Sons désactivés');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Afficher les notifications">
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1"
              >
                <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs gap-1"
                  onClick={handleMarkAllAsRead}
                  aria-label="Tout marquer comme lu"
                >
                  <CheckCheck className="h-3 w-3" />
                  Tout lire
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={toggleSound}
                aria-label={soundEnabled ? 'Désactiver les sons' : 'Activer les sons'}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Paramètres des notifications"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex gap-1 mt-3">
            {(['all', 'social', 'achievements', 'system'] as NotificationCategory[]).map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                className="h-7 text-xs gap-1 flex-1"
                onClick={() => setSelectedCategory(cat)}
              >
                {CATEGORY_ICONS[cat]}
                {categoryCounts[cat] > 0 && (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                    {categoryCounts[cat]}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sons de notification</span>
                  <Switch checked={soundEnabled} onCheckedChange={toggleSound} />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2 text-destructive"
                  onClick={handleClearAll}
                >
                  <Trash2 className="h-3 w-3" />
                  Effacer toutes les notifications
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ScrollArea className="h-80">
          <div className="p-2 space-y-2">
            <AnimatePresence>
              {recentNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={() => markAsRead(notification.id)}
                    onDelete={() => deleteNotification(notification.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {recentNotifications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucune notification</p>
                <p className="text-xs mt-1">
                  {selectedCategory !== 'all' && 'dans cette catégorie'}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {notifications.length > 10 && (
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
              Voir toutes les notifications ({notifications.length})
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
