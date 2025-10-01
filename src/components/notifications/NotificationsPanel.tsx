// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Notification, NotificationFilter } from '@/types/notifications';
import { filterNotifications } from './notificationFilterUtils';
import NotificationItem from './NotificationItem';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  
  const filteredNotifications = filterNotifications(notifications, activeFilter);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 text-sm bg-primary text-primary-foreground rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
          Mark all as read
        </Button>
      </CardHeader>
      
      <CardContent>
        <Tabs 
          value={activeFilter} 
          onValueChange={(value) => setActiveFilter(value as NotificationFilter)}
          className="mb-6"
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="achievement">Achievements</TabsTrigger>
            <TabsTrigger value="reminder">Reminders</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
            <p className="mt-4 text-muted-foreground">
              {activeFilter === 'all' 
                ? "You don't have any notifications yet." 
                : `No ${activeFilter === 'unread' ? 'unread' : activeFilter} notifications.`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;
