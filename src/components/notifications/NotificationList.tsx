// @ts-nocheck

// @ts-nocheck
import React from 'react';
import { Notification } from '@/types/notifications';
import NotificationItem from './NotificationItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onRemove?: (id: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onRemove,
}) => {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">🔔</span>
        </div>
        <p className="text-muted-foreground">Aucune notification</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-2">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onRemove={onRemove}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default NotificationList;
