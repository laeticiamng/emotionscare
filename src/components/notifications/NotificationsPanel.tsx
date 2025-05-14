
import React, { useState } from 'react';
import { 
  Sheet, 
  SheetClose, 
  SheetContent, 
  SheetDescription, 
  SheetFooter, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  BellOff, 
  Check, 
  Clock, 
  Trash
} from "lucide-react";
import { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onDeleteAll: () => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter(notification => !notification.read).length;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  open,
  onOpenChange,
  notifications,
  onMarkAllAsRead,
  onDeleteAll,
  onMarkAsRead,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const { theme } = useTheme();
  
  const unreadNotifications = notifications.filter(notification => !notification.read);
  const hasUnread = unreadNotifications.length > 0;
  
  const formatTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { 
        addSuffix: true,
        locale: fr
      });
    } catch (error) {
      return 'Date inconnue';
    }
  };
  
  // Render a single notification
  const renderNotification = (notification: Notification) => {
    const timeFormatted = formatTime(notification.timestamp || notification.createdAt || new Date().toISOString());
    
    return (
      <div 
        key={notification.id} 
        className={`p-3 border-b last:border-b-0 transition-colors ${!notification.read ? 'bg-accent/10' : ''}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-4">
            <h4 className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
              {notification.title}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">{notification.body}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">{timeFormatted}</span>
              {!notification.read && (
                <Badge variant="outline" className="text-[10px] py-0 h-4 bg-primary/10 hover:bg-primary/20">
                  Nouveau
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-start space-x-1">
            {!notification.read && (
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8" 
                onClick={() => onMarkAsRead(notification.id)}
                title="Marquer comme lu"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-destructive" 
              onClick={() => onDelete(notification.id)}
              title="Supprimer"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications 
            {hasUnread && (
              <Badge className="ml-2 bg-primary text-primary-foreground">{unreadNotifications.length}</Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Restez informé de vos avancées et des recommandations
          </SheetDescription>
        </SheetHeader>
        
        <div className="px-6 pb-2">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">Toutes</TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Non lues
                {hasUnread && (
                  <Badge variant="outline" className="ml-2 bg-background">{unreadNotifications.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-1 py-2">
            <TabsContent value="all" className="m-0">
              {notifications.length > 0 ? (
                notifications.map(renderNotification)
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <Clock className="h-10 w-10 mb-3 text-muted-foreground/50" />
                  <p>Aucune notification pour le moment</p>
                  <p className="text-sm mt-1">Nous vous informerons des mises à jour importantes</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="unread" className="m-0">
              {unreadNotifications.length > 0 ? (
                unreadNotifications.map(renderNotification)
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <BellOff className="h-10 w-10 mb-3 text-muted-foreground/50" />
                  <p>Aucune notification non lue</p>
                  <p className="text-sm mt-1">Toutes vos notifications ont été consultées</p>
                </div>
              )}
            </TabsContent>
          </div>
        </ScrollArea>
        
        <SheetFooter className="px-6 py-4 border-t">
          <div className="flex items-center justify-between w-full">
            <Button variant="outline" size="sm" onClick={onMarkAllAsRead} disabled={!hasUnread}>
              <Check className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
            <Button variant="outline" size="sm" onClick={onDeleteAll} disabled={notifications.length === 0}>
              <Trash className="h-4 w-4 mr-2" />
              Tout supprimer
            </Button>
            <SheetClose asChild>
              <Button variant="secondary" size="sm">Fermer</Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsPanel;
