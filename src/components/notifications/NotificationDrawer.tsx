
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, Trash2 } from 'lucide-react';
import { Notification, NotificationFilter } from '@/types';
import { useNotifications } from '@/hooks/use-notifications';
import NotificationItem from '@/components/notifications/NotificationItem';

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ open, onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    filter, 
    setFilter, 
    markAsRead, 
    markAllAsRead,
    clearAllNotifications
  } = useNotifications();
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearConfirm = () => {
    setShowConfirmClear(true);
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setShowConfirmClear(false);
  };

  const handleCancelClear = () => {
    setShowConfirmClear(false);
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const notificationsList = (
    <div className="divide-y">
      {notifications.length > 0 ? (
        notifications.map(notification => (
          <NotificationItem 
            key={notification.id} 
            notification={notification} 
            onRead={handleMarkAsRead}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-12">
          <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="font-medium text-lg mb-2">Pas de notifications</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Vous n'avez aucune notification{filter === 'unread' ? ' non lue' : ''} pour le moment.
          </p>
        </div>
      )}
    </div>
  );

  const clearConfirmation = (
    <div className="p-4 border rounded-md bg-muted/20 my-4">
      <h4 className="font-medium mb-2">Effacer toutes les notifications ?</h4>
      <p className="text-sm text-muted-foreground mb-4">
        Cette action est irréversible et supprimera définitivement toutes vos notifications.
      </p>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={handleCancelClear}>
          Annuler
        </Button>
        <Button variant="destructive" size="sm" onClick={handleClearAll}>
          Confirmer
        </Button>
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex justify-between items-center">
            <span>Notifications {unreadCount > 0 && `(${unreadCount})`}</span>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                title="Marquer tout comme lu"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearConfirm}
                disabled={notifications.length === 0}
                title="Effacer tout"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </SheetTitle>
        </SheetHeader>

        {showConfirmClear ? (
          clearConfirmation
        ) : (
          <Tabs defaultValue="all" value={filter} onValueChange={(v) => setFilter(v as NotificationFilter)} className="h-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="unread">Non lues{unreadCount > 0 && ` (${unreadCount})`}</TabsTrigger>
              <TabsTrigger value="alerts">Alertes</TabsTrigger>
            </TabsList>
            
            <TabsContent value={filter} className="h-[calc(100%-50px)] overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                notificationsList
              )}
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NotificationDrawer;
