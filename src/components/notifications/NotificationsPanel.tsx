
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import NotificationItem from './NotificationItem';
import { Notification, NotificationFilter } from '@/types/notification';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onDeleteAll: () => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onMarkAllAsRead,
  onDeleteAll,
  onMarkAsRead,
  onDelete,
}) => {
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') {
      return true;
    } 
    if (activeFilter === 'unread') {
      return !notification.read;
    }
    if (activeFilter === 'system') {
      return notification.type === 'system';
    }
    if (activeFilter === 'emotion') {
      return notification.type === 'emotion';
    }
    if (activeFilter === 'coach') {
      return notification.type === 'coach';
    }
    if (activeFilter === 'journal') {
      return notification.type === 'journal';
    }
    if (activeFilter === 'community') {
      return notification.type === 'community';
    }
    if (activeFilter === 'urgent') {
      return notification.priority === 'urgent';
    }
    return true;
  });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" /> Notifications
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-normal">
              {unreadCount}
            </span>
          )}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onMarkAllAsRead} 
            disabled={unreadCount === 0}
            className="text-xs flex items-center gap-1"
          >
            <CheckCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Tout marquer comme lu</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onDeleteAll}
            disabled={notifications.length === 0}
            className="text-xs flex items-center gap-1 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Tout effacer</span>
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue="all" 
        value={activeFilter}
        onValueChange={(value) => setActiveFilter(value as NotificationFilter)}
        className="w-full"
      >
        <div className="px-4">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              Tout
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Non lu{unreadCount > 0 && ` (${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="system" className="flex-1 hidden md:flex">
              Système
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 h-[500px]">
          <TabsContent value="all" className="m-0">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Vous n'avez pas de notifications</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="unread" className="m-0">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <CheckCheck className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Vous n'avez pas de notifications non lues</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="system" className="m-0">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Vous n'avez pas de notifications système</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                />
              ))
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default NotificationsPanel;
