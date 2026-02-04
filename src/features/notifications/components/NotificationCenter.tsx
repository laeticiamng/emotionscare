/**
 * Centre de notifications
 * Affiche toutes les notifications avec filtrage et actions groupées
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Settings,
  Inbox
} from 'lucide-react';
import { NotificationCard } from './NotificationCard';
import type { Notification, NotificationType } from '../types';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onOpenSettings?: () => void;
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onClearAll,
  onOpenSettings,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return notifications;
    return notifications.filter(n => n.type === filter);
  }, [notifications, filter]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const groupedNotifications = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    
    filteredNotifications.forEach(notification => {
      const date = notification.createdAt.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });

    return Object.entries(groups).map(([date, items]) => ({
      date,
      notifications: items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }));
  }, [filteredNotifications]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Gérez vos alertes et rappels
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Tout lire
              </Button>
            )}
            
            {notifications.length > 0 && (
              <Button variant="outline" size="sm" onClick={onClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Effacer
              </Button>
            )}

            {onOpenSettings && (
              <Button variant="ghost" size="sm" onClick={onOpenSettings}>
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <div className="px-6 border-b">
            <TabsList className="h-10 w-full justify-start bg-transparent p-0">
              <TabsTrigger 
                value="all" 
                onClick={() => setFilter('all')}
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Toutes
              </TabsTrigger>
              <TabsTrigger 
                value="reminder"
                onClick={() => setFilter('reminder')}
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Rappels
              </TabsTrigger>
              <TabsTrigger 
                value="achievement"
                onClick={() => setFilter('achievement')}
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Succès
              </TabsTrigger>
              <TabsTrigger 
                value="social"
                onClick={() => setFilter('social')}
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Social
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[500px]">
              {groupedNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
                  <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Aucune notification</h3>
                  <p className="text-sm text-muted-foreground">
                    Vous êtes à jour ! Les nouvelles notifications apparaîtront ici.
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-6">
                  {groupedNotifications.map(group => (
                    <div key={group.date}>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3 capitalize">
                        {group.date}
                      </h3>
                      <div className="space-y-3">
                        {group.notifications.map(notification => (
                          <NotificationCard
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={onMarkAsRead}
                            onDismiss={onDismiss}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="reminder" className="m-0">
            <ScrollArea className="h-[500px] p-4">
              <div className="space-y-3">
                {filteredNotifications.map(notification => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onDismiss={onDismiss}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="achievement" className="m-0">
            <ScrollArea className="h-[500px] p-4">
              <div className="space-y-3">
                {filteredNotifications.map(notification => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onDismiss={onDismiss}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="social" className="m-0">
            <ScrollArea className="h-[500px] p-4">
              <div className="space-y-3">
                {filteredNotifications.map(notification => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onDismiss={onDismiss}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
