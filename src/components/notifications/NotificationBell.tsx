
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '@/types/notifications';
import { formatDate } from '@/utils/formatDate';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Notifications de démonstration
const demoNotifications: Notification[] = [
  {
    id: '1',
    type: 'coach',
    title: 'Nouveau message de votre coach',
    message: 'Votre coach vous a envoyé une nouvelle série d\'exercices à pratiquer.',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    read: false,
    linkTo: '/coach'
  },
  {
    id: '2',
    type: 'emotion',
    title: 'Rappel d\'analyse émotionnelle',
    message: 'N\'oubliez pas de faire votre scan émotionnel quotidien.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: false,
    linkTo: '/scan'
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Nouvel accomplissement débloqué!',
    message: 'Félicitations! Vous avez débloqué le badge "Semaine cohérente".',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    linkTo: '/achievements'
  },
  {
    id: '4',
    type: 'system',
    title: 'Maintenance programmée',
    message: 'Une maintenance du système est prévue le 25 mai de 2h à 4h du matin.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: true
  }
];

const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleNotificationClick = (notification: Notification) => {
    // Marquer comme lu
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    
    // Naviguer si un lien est spécifié
    if (notification.linkTo) {
      setIsOpen(false);
      setTimeout(() => navigate(notification.linkTo!), 100);
    }
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Toutes les notifications ont été marquées comme lues');
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
    setIsOpen(false);
    toast.success('Toutes les notifications ont été supprimées');
  };
  
  // Animation pour la pastille de notification
  const pulseVariants = {
    pulse: {
      scale: [1, 1.15, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'loop'
      }
    }
  };
  
  // Couleur de la notification selon son type
  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'coach': return 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-800';
      case 'emotion': return 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-800';
      case 'achievement': return 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-800';
      case 'urgent': return 'bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-800';
      case 'success': return 'bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-800';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-800';
      case 'info':
      case 'system':
      default: return 'bg-gray-100 dark:bg-gray-800/40 border-gray-300 dark:border-gray-700';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <AnimatePresence>
              <motion.div
                key="badge"
                className="absolute -top-1 -right-1"
                variants={pulseVariants}
                animate="pulse"
              >
                <Badge variant="destructive" className="h-5 min-w-[1.25rem] px-1 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              </motion.div>
            </AnimatePresence>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Marquer tout comme lu
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 border-b cursor-pointer transition-colors hover:bg-accent ${
                    !notification.read ? 'bg-muted/50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium text-sm truncate">{notification.title}</h5>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${getNotificationColor(notification.type)}`}>
                        {notification.type}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <p className="text-muted-foreground">Aucune notification</p>
            </div>
          )}
        </ScrollArea>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t flex justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearAllNotifications}
            >
              Effacer tout
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
            >
              Voir toutes
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
