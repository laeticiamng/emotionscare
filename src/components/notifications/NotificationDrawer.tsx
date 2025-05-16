
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bell } from 'lucide-react';
import NotificationsPanel from './NotificationsPanel';
import { Notification } from '@/types/notification';
import { v4 as uuidv4 } from 'uuid';

// Sample notifications data
const sampleNotifications: Notification[] = [
  {
    id: uuidv4(),
    title: 'Bienvenue sur EmotionsCare',
    message: 'Nous sommes ravis de vous accueillir sur la plateforme.',
    type: 'system',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    action: {
      label: 'Explorer',
      url: '/b2c/dashboard'
    }
  },
  {
    id: uuidv4(),
    title: 'Nouvelle fonctionnalité disponible',
    message: 'Découvrez notre nouvelle fonctionnalité de musicothérapie !',
    type: 'system',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    id: uuidv4(),
    title: 'Rappel journal émotionnel',
    message: "Vous n'avez pas encore écrit dans votre journal aujourd'hui.",
    type: 'journal',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    action: {
      label: 'Écrire maintenant',
      url: '/b2c/journal'
    }
  }
];

export interface NotificationDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ open, onOpenChange }) => {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };
  
  const hasUnreadNotifications = notifications.some(notification => !notification.read);
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const handleDelete = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };
  
  const handleDeleteAll = () => {
    setNotifications([]);
  };
  
  return (
    <Sheet open={open !== undefined ? open : isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnreadNotifications && (
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md w-full p-0">
        <NotificationsPanel 
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDelete={handleDelete}
          onDeleteAll={handleDeleteAll}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NotificationDrawer;
