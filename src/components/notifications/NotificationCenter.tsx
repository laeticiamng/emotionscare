
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationList from './NotificationList';
import NotificationFilters from './NotificationFilters';
import { NotificationFilter } from '@/types/notifications';

const NotificationCenter: React.FC = () => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [isOpen, setIsOpen] = useState(false);

  const filteredNotifications = notifications.filter(notification => {
    switch (activeFilter) {
      case 'unread':
        return !notification.read;
      case 'read':
        return notification.read;
      case 'all':
        return true;
      default:
        return notification.type === activeFilter;
    }
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary">
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </Badge>
              )}
            </SheetTitle>
            
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={markAllAsRead}
              >
                Tout marquer comme lu
              </Button>
            )}
          </div>
          
          <NotificationFilters 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            notifications={notifications}
          />
        </SheetHeader>
        
        <div className="mt-6">
          <NotificationList 
            notifications={filteredNotifications}
            emptyMessage={
              activeFilter === 'all' 
                ? "Aucune notification" 
                : `Aucune notification ${activeFilter === 'unread' ? 'non lue' : activeFilter}`
            }
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;
