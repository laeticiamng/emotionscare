
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Bell, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Notification, NotificationFilter } from "@/types/notification";
import NotificationItem from "./NotificationItem";

interface NotificationDrawerProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  children?: React.ReactNode;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  
  const getFilteredNotifications = () => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter(n => !n.read);
    
    // Filter by type
    return notifications.filter(n => n.type === filter);
  };

  const filteredNotifications = getFilteredNotifications();
  
  const handleMarkAsRead = async (id: string) => {
    await onMarkAsRead(id);
  };
  
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="flex flex-row justify-between items-center">
            <DrawerTitle>Notifications</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button 
                  variant={filter === "all" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  Tous
                </Button>
                <Button 
                  variant={filter === "unread" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilter("unread")}
                >
                  Non lus
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                Tout marquer comme lu
              </Button>
            </div>
            
            <Separator />
            
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={onDelete}
                    />
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">Aucune notification</p>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex justify-center space-x-1 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setFilter("all")}
              >
                <Filter className="h-3 w-3" />
                Plus de filtres
              </Button>
              
              <Button 
                variant={filter === "system" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("system")}
              >
                Système
              </Button>
              
              <Button 
                variant={filter === "emotion" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("emotion")}
              >
                Émotions
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NotificationDrawer;
