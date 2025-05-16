
import React, { useState } from 'react';
import { Notification, NotificationFilter } from '@/types/notification';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import NotificationItem from './NotificationItem';
import { filterNotifications, getFilterLabel } from './notificationFilterUtils';
import { useNavigate } from 'react-router-dom';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onFilterChange?: (filter: NotificationFilter) => void;
  customFilters?: NotificationFilter[];
  loading?: boolean;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
  onFilterChange,
  customFilters,
  loading = false,
}) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  
  const defaultFilters: NotificationFilter[] = ['all', 'unread', 'urgent'];
  const filters = customFilters || defaultFilters;
  
  const handleFilterChange = (filter: NotificationFilter) => {
    setActiveFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };
  
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    
    // Navigate if there's an action URL
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };
  
  const filteredNotifications = filterNotifications(notifications, activeFilter);
  
  return (
    <div className="w-full">
      <Tabs defaultValue="all" value={activeFilter} onValueChange={(value) => handleFilterChange(value as NotificationFilter)}>
        <TabsList className="grid grid-cols-3">
          {filters.map((filter) => (
            <TabsTrigger key={filter} value={filter}>
              {getFilterLabel(filter)}
              {filter === 'unread' && (
                <span className="ml-1 rounded-full bg-primary w-5 h-5 inline-flex items-center justify-center text-xs text-white">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {filters.map((filter) => (
          <TabsContent key={filter} value={filter} className="mt-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune notification {filter !== 'all' && `dans la catégorie "${getFilterLabel(filter)}"`}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onDelete={onDelete}
                    onClick={() => handleNotificationClick(notification)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default NotificationsPanel;
