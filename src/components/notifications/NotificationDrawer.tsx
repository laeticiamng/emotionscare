
import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';
import { useNotifications, NotificationFilter } from '@/hooks/useNotifications';
import NotificationItem from './NotificationItem';
import NotificationBadge from './NotificationBadge';

interface NotificationDrawerProps {
  userId?: string;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ userId }) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead
  } = useNotifications();
  
  const handleFilterChange = (value: string) => {
    setFilter(value as NotificationFilter);
  };
  
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label="Afficher les notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <NotificationBadge 
              count={unreadCount} 
              className="absolute -top-1 -right-1" 
            />
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh] flex flex-col">
        <DrawerHeader className="flex justify-between items-center border-b pb-2">
          <DrawerTitle>Notifications</DrawerTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Tout marquer comme lu
            </Button>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <Tabs 
          value={filter} 
          onValueChange={handleFilterChange} 
          className="w-full flex-1 flex flex-col"
        >
          <div className="border-b px-4 py-2">
            <TabsList className="w-full h-auto py-1 bg-transparent">
              <TabsTrigger value="all" className="text-xs h-7 flex-1">
                Tout
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs h-7 flex-1">
                Non lus ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="invitation" className="text-xs h-7 flex-1">
                Invitations
              </TabsTrigger>
              <TabsTrigger value="reminder" className="text-xs h-7 flex-1">
                Rappels
              </TabsTrigger>
            </TabsList>
          </div>
          
          {Object.entries({
            all: 'Toutes les notifications',
            unread: 'Notifications non lues',
            invitation: 'Invitations',
            reminder: 'Rappels',
            system: 'Notifications système'
          }).map(([key, title]) => (
            <TabsContent 
              key={key} 
              value={key}
              className="overflow-y-auto flex-1 p-0 mt-0"
            >
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Chargement...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Aucune notification {key !== 'all' ? 'dans cette catégorie' : ''}
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={markAsRead}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
};

export default NotificationDrawer;
