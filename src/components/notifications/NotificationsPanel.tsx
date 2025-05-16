
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { Bell, Trash2, Check, Filter, ChevronRight, X } from 'lucide-react';
import NotificationItem from './NotificationItem';
import { filterNotifications } from './notificationFilterUtils';
import { Notification, NotificationFilter } from '@/types/notification';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDeleteNotification?: (id: string) => void;
  onDeleteAllNotifications?: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onDeleteAllNotifications,
  isLoading = false
}) => {
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(notifications || []);
  
  const filterOptions: { value: NotificationFilter; label: string; icon?: React.ReactNode }[] = [
    { value: 'all', label: 'Toutes' },
    { value: 'unread', label: 'Non lues' },
    { value: 'emotion', label: 'Emotions' },
    { value: 'journal', label: 'Journal' },
    { value: 'community', label: 'Communauté' },
    { value: 'achievement', label: 'Achievements' },
    { value: 'system', label: 'Système' }
  ];

  useEffect(() => {
    setFilteredNotifications(filterNotifications(notifications, activeFilter));
  }, [notifications, activeFilter]);

  const handleActionButton = (notification: Notification) => {
    // Handle notification action button click
    if (notification.action_url || notification.actionUrl) {
      window.open(notification.action_url || notification.actionUrl, '_blank');
      
      // Mark as read when action is taken
      if (!notification.read && onMarkAsRead) {
        onMarkAsRead(notification.id);
      }
    }
  };

  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;
  
  const renderNotificationList = () => {
    if (isLoading) {
      return (
        <div className="p-4 text-center">
          <div className="animate-spin h-6 w-6 border-t-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Chargement des notifications...</p>
        </div>
      );
    }
    
    if (!filteredNotifications || filteredNotifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="font-medium text-lg">Aucune notification</h3>
          <p className="text-muted-foreground mt-2">
            {activeFilter === 'all' 
              ? "Vous n'avez pas encore reçu de notifications." 
              : `Aucune notification de type "${activeFilter as string}" n'a été trouvée.`}
          </p>
          {activeFilter !== 'all' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => setActiveFilter('all')}
            >
              Afficher toutes les notifications
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div>
        {filteredNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDeleteNotification}
          />
        ))}
      </div>
    );
  };

  const renderFilterOptions = () => {
    return (
      <div className="p-2">
        <div className="text-sm font-medium mb-2 px-2">Filtrer par type</div>
        <div className="space-y-1">
          {filterOptions.map((option) => (
            <button
              key={option.value as string}
              className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between hover:bg-muted transition-colors ${
                activeFilter === option.value ? 'bg-muted font-medium' : ''
              }`}
              onClick={() => setActiveFilter(option.value)}
            >
              <span className="flex items-center gap-2">
                {option.icon}
                {option.label}
              </span>
              {activeFilter === option.value && <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full max-w-md sm:max-w-lg p-0 flex flex-col h-full">
        <SheetHeader className="px-4 pt-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground h-5 min-w-[20px] rounded-full text-xs flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </SheetTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onMarkAllAsRead} title="Marquer tout comme lu">
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDeleteAllNotifications} title="Supprimer toutes les notifications">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>
        
        <Tabs defaultValue="notifications" className="flex flex-col h-full">
          <div className="border-b">
            <div className="px-4">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="filters">
                  <Filter className="h-4 w-4 mr-1" />
                  Filtres
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto">
            <TabsContent value="notifications" className="m-0 h-full">
              <div className="h-full overflow-y-auto">
                {renderNotificationList()}
              </div>
            </TabsContent>
            
            <TabsContent value="filters" className="m-0 h-full">
              <div className="h-full overflow-y-auto">
                {renderFilterOptions()}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsPanel;
