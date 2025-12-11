// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Check, AlertCircle, Info, Heart, Star, Clock, Settings, BellOff, Group } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  created_at: string;
  icon?: string;
  action_text?: string;
  action_link?: string;
  category?: string;
  snoozedUntil?: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [groupByCategory, setGroupByCategory] = useState(false);
  const [mutedCategories, setMutedCategories] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
    
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        const newNotif = payload.new as Notification;
        if (!mutedCategories.includes(newNotif.category || '')) {
          setNotifications(prev => [newNotif, ...prev]);
          // Show toast for new notifications
          toast({
            title: newNotif.title,
            description: newNotif.message,
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutedCategories, toast]);

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Filter snoozed notifications
      const now = new Date();
      const filtered = (data || []).filter((n: Notification) => 
        !n.snoozedUntil || new Date(n.snoozedUntil) <= now
      );
      setNotifications(filtered);
    } catch (error) {
      logger.error('Erreur chargement notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      logger.error('Erreur marquage lecture:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase.from('notifications').update({ read: true }).eq('read', false);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast({ title: 'Toutes les notifications marquées comme lues' });
    } catch (error) {
      logger.error('Erreur marquage toutes lectures:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await supabase.from('notifications').delete().eq('id', id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      logger.error('Erreur suppression notification:', error);
    }
  };

  const snoozeNotification = async (id: string, minutes: number) => {
    const snoozedUntil = new Date();
    snoozedUntil.setMinutes(snoozedUntil.getMinutes() + minutes);
    
    try {
      await supabase.from('notifications').update({ snoozedUntil: snoozedUntil.toISOString() }).eq('id', id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast({
        title: `Notification reportée de ${minutes} min`,
        description: `Rappel à ${snoozedUntil.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      });
    } catch (error) {
      logger.error('Erreur snooze:', error);
    }
  };

  const toggleMuteCategory = (category: string) => {
    setMutedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getIcon = (type: string, icon?: string) => {
    if (icon === 'heart') return Heart;
    if (icon === 'star') return Star;
    switch (type) {
      case 'success': return Check;
      case 'warning': case 'error': return AlertCircle;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-primary';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
      case 'medium': return <Badge variant="default" className="text-xs">Important</Badge>;
      default: return null;
    }
  };

  const filteredNotifications = notifications.filter(n => 
    (filter === 'all' || !n.read) && !mutedCategories.includes(n.category || '')
  );

  // Group by category if enabled
  const groupedNotifications = groupByCategory 
    ? filteredNotifications.reduce((acc, n) => {
        const cat = n.category || 'Autre';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(n);
        return acc;
      }, {} as Record<string, Notification[]>)
    : { 'all': filteredNotifications };

  const unreadCount = notifications.filter(n => !n.read).length;
  const categories = [...new Set(notifications.map(n => n.category).filter(Boolean))];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">{unreadCount}</Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            >
              {filter === 'all' ? 'Non lues' : 'Toutes'}
            </Button>
            <Button
              variant={groupByCategory ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setGroupByCategory(!groupByCategory)}
              title="Grouper par catégorie"
            >
              <Group className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={markAllAsRead} disabled={unreadCount === 0}>
                  <Check className="h-4 w-4 mr-2" />
                  Tout marquer lu
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  Catégories masquées
                </div>
                {categories.map(cat => (
                  <DropdownMenuItem key={cat} onClick={() => toggleMuteCategory(cat!)}>
                    <BellOff className={`h-4 w-4 mr-2 ${mutedCategories.includes(cat!) ? 'text-red-500' : ''}`} />
                    {cat} {mutedCategories.includes(cat!) && '(masqué)'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(groupedNotifications).map(([category, notifs]) => (
              <div key={category}>
                {groupByCategory && category !== 'all' && (
                  <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    {category}
                  </h4>
                )}
                <AnimatePresence>
                  {notifs.map((notification) => {
                    const IconComponent = getIcon(notification.type, notification.icon);
                    
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`p-3 rounded-lg border mb-2 transition-colors ${
                          notification.read 
                            ? 'bg-muted/30 border-muted' 
                            : 'bg-background border-border shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 ${getTypeColor(notification.type)}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className={`font-medium text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                                    {notification.title}
                                  </h4>
                                  {getPriorityBadge(notification.priority)}
                                </div>
                                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                                  {notification.message}
                                </p>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 flex-shrink-0"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                {new Date(notification.created_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                })}
                              </span>
                              
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => snoozeNotification(notification.id, 30)}
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  30m
                                </Button>
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    Marquer lu
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
