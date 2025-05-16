
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotificationItem from './NotificationItem';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, AlertTriangle, Info, BookOpenCheck, BookOpen, UserCircle } from 'lucide-react';
import { Notification, NotificationFilter } from '@/types/notification';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onMarkAllAsRead: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
  onClearAll,
  onMarkAllAsRead
}) => {
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');

  const filters: NotificationFilter[] = [
    'all',
    'unread',
    'urgent',
    'system',
    'emotion',
    'journal',
    'user'
  ];

  const filterNotifications = (filter: NotificationFilter) => {
    switch (filter) {
      case 'all':
        return notifications;
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'urgent':
        return notifications.filter(n => n.type === 'urgent' || n.priority === 'urgent');
      case 'system':
        return notifications.filter(n => n.type === 'system');
      case 'emotion':
        return notifications.filter(n => n.type === 'emotion');
      case 'journal':
        return notifications.filter(n => n.type === 'journal');
      case 'user':
        return notifications.filter(n => n.type === 'user');
      default:
        return notifications;
    }
  };

  const filteredNotifications = filterNotifications(activeFilter);

  const getIcon = (filter: NotificationFilter) => {
    switch (filter) {
      case 'all':
        return <Bell className="h-4 w-4" />;
      case 'unread':
        return <CheckCircle className="h-4 w-4" />;
      case 'urgent':
        return <AlertTriangle className="h-4 w-4" />;
      case 'system':
        return <Info className="h-4 w-4" />;
      case 'emotion':
        return <Bell className="h-4 w-4" />;
      case 'journal':
        return <BookOpen className="h-4 w-4" />;
      case 'user':
        return <UserCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 p-2">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex gap-2">
          <button 
            className="text-xs text-blue-600 hover:text-blue-800" 
            onClick={onMarkAllAsRead}
          >
            Mark all as read
          </button>
          <button 
            className="text-xs text-red-600 hover:text-red-800" 
            onClick={onClearAll}
          >
            Clear all
          </button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeFilter as string} onValueChange={(value) => setActiveFilter(value as NotificationFilter)}>
        <TabsList className="w-full grid grid-cols-7 mb-4">
          {filters.map((filter) => (
            <TabsTrigger key={filter} value={filter} className="flex items-center gap-1 text-xs">
              {getIcon(filter)}
              <span className="hidden sm:inline">{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
              {filter === 'all' && (
                <Badge variant="secondary" className="ml-1">
                  {notifications.length}
                </Badge>
              )}
              {filter === 'unread' && (
                <Badge variant="secondary" className="ml-1">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="h-[400px]">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mb-2 opacity-20" />
              <p>No notifications in this category</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
                onClick={() => {
                  // Handle notification click if needed
                  if (!notification.read) {
                    onMarkAsRead(notification.id);
                  }
                }}
              />
            ))
          )}
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default NotificationsPanel;
