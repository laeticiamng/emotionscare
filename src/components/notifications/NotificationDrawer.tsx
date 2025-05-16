import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import NotificationItem from './NotificationItem';
import { Notification } from '@/types/notification';

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  open,
  onOpenChange,
  notifications,
  onMarkAsRead,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading notifications
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        onMarkAsRead(notification.id);
      }
    });
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead(id);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </SheetTitle>
          <SheetDescription>
            Consultez les dernières mises à jour et notifications de votre compte.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {notifications.length} Notifications
          </p>
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Tout marquer comme lu
          </Button>
        </div>

        <div className="divide-y divide-border mt-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucune notification pour le moment</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationDrawer;
