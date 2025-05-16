
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationItem from './NotificationItem';
import { filterNotifications, getFilterLabel } from './notificationFilterUtils';
import { Notification, NotificationFilter } from '@/types/notification';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClickNotification?: (notification: Notification) => void;
}

/**
 * Displays notifications grouped by filters with tabs
 */
const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
  onClickNotification
}) => {
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');

  // Define the available filters
  const filters: NotificationFilter[] = [
    'all', 'unread', 'read', 'urgent', 
    'system', 'journal', 'emotion', 'user'
  ];

  // Get counts for each filter
  const filterCounts: Record<NotificationFilter, number> = {
    all: notifications.length,
    unread: filterNotifications(notifications, 'unread').length,
    read: filterNotifications(notifications, 'read').length,
    urgent: filterNotifications(notifications, 'urgent').length,
    system: filterNotifications(notifications, 'system').length,
    journal: filterNotifications(notifications, 'journal').length,
    emotion: filterNotifications(notifications, 'emotion').length,
    user: filterNotifications(notifications, 'user').length,
  };

  const filteredNotifications = filterNotifications(notifications, activeFilter);

  return (
    <div>
      <Tabs 
        defaultValue={activeFilter} 
        onValueChange={(value) => setActiveFilter(value as NotificationFilter)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-4">
          {filters.slice(0, 4).map((filter) => (
            <TabsTrigger 
              key={filter} 
              value={filter}
              className="text-xs"
              disabled={filterCounts[filter] === 0}
            >
              {getFilterLabel(filter)}
              {filterCounts[filter] > 0 && (
                <span className="ml-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
                  {filterCounts[filter]}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsList className="grid grid-cols-4 mb-4">
          {filters.slice(4).map((filter) => (
            <TabsTrigger 
              key={filter} 
              value={filter}
              className="text-xs"
              disabled={filterCounts[filter] === 0}
            >
              {getFilterLabel(filter)}
              {filterCounts[filter] > 0 && (
                <span className="ml-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
                  {filterCounts[filter]}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {filters.map((filter) => (
          <TabsContent key={filter} value={filter} className="space-y-2">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Aucune notification {activeFilter !== 'all' ? `de type "${getFilterLabel(activeFilter).toLowerCase()}"` : ''}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                  onClick={onClickNotification ? () => onClickNotification(notification) : undefined}
                />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default NotificationsPanel;
