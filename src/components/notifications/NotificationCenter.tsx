
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationList from './NotificationList';
import NotificationFilters from './NotificationFilters';
import NotificationPermissionDialog from './NotificationPermissionDialog';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { NotificationFilter } from '@/types/notifications';
import { filterNotifications } from './notificationFilterUtils';
import { CheckCheck, Settings } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification, unreadCount } = useNotifications();
  const { showPermissionDialog, setShowPermissionDialog, permission } = usePushNotifications();
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');

  const filteredNotifications = filterNotifications(notifications, activeFilter);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </SheetTitle>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs"
                  >
                    <CheckCheck className="h-4 w-4 mr-1" />
                    Tout lire
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPermissionDialog(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <NotificationFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              notifications={notifications}
            />
          </SheetHeader>
          
          <div className="mt-6 h-[calc(100vh-200px)]">
            <NotificationList
              notifications={filteredNotifications}
              onMarkAsRead={markAsRead}
              onRemove={removeNotification}
            />
          </div>
        </SheetContent>
      </Sheet>

      <NotificationPermissionDialog
        isOpen={showPermissionDialog}
        onClose={() => setShowPermissionDialog(false)}
        onPermissionGranted={() => {
          console.log('Notifications push activées');
        }}
      />
    </>
  );
};

export default NotificationCenter;
