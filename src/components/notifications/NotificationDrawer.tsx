
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Notification } from '@/types/notifications';
import NotificationList from './NotificationList';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  markAsRead: (id: string) => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  markAsRead,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <NotificationList notifications={notifications} onMarkAsRead={markAsRead} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationDrawer;
