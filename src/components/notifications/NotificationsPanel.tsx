
import React from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { 
  useNotifications, 
  NotificationFilter 
} from '@/hooks/useNotifications';
import NotificationItem from './NotificationItem';
import NotificationBadge from './NotificationBadge';
import { useNotificationBadge } from '@/hooks/useNotificationBadge';

const NotificationsPanel: React.FC = () => {
  const {
    notifications,
    isLoading,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead
  } = useNotifications();
  
  const { unreadCount } = useNotificationBadge();
  
  const handleFilterChange = (value: string) => {
    setFilter(value as NotificationFilter);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
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
      </PopoverTrigger>
      <PopoverContent 
        className="w-[340px] max-h-[70vh] p-0 overflow-hidden flex flex-col" 
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-3 border-b">
          <h2 className="text-sm font-semibold">Notifications</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Tout marquer comme lu
          </Button>
        </div>
        
        <Tabs 
          value={filter} 
          onValueChange={handleFilterChange} 
          className="w-full"
        >
          <div className="border-b px-2">
            <TabsList className="w-full h-auto py-1 bg-transparent gap-1">
              <TabsTrigger 
                value="all" 
                className="text-xs h-7 data-[state=active]:bg-muted"
              >
                Tout
              </TabsTrigger>
              <TabsTrigger 
                value="unread" 
                className="text-xs h-7 data-[state=active]:bg-muted"
              >
                Non lus ({unreadCount})
              </TabsTrigger>
              <TabsTrigger 
                value="invitation" 
                className="text-xs h-7 data-[state=active]:bg-muted"
              >
                Invitations
              </TabsTrigger>
              <TabsTrigger 
                value="reminder" 
                className="text-xs h-7 data-[state=active]:bg-muted"
              >
                Rappels
              </TabsTrigger>
              <TabsTrigger 
                value="system" 
                className="text-xs h-7 data-[state=active]:bg-muted"
              >
                Système
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
              className="overflow-y-auto max-h-[400px] focus:outline-none"
              aria-live="polite"
            >
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Chargement...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
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
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPanel;
