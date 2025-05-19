
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
}

// Exemple de notifications, à remplacer par des données réelles
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nouvel exercice disponible',
    message: 'Une nouvelle session de relaxation a été ajoutée à votre programme.',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false
  },
  {
    id: '2',
    title: 'Scan émotionnel terminé',
    message: 'Votre analyse émotionnelle quotidienne est prête à être consultée.',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false
  },
  {
    id: '3',
    title: 'Rappel de méditation',
    message: "N'oubliez pas votre session de méditation de l'après-midi.",
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true
  }
];

const NotificationToast: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [visibleNotification, setVisibleNotification] = useState<Notification | null>(null);
  
  // Show unread notifications sequentially
  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length > 0 && !visibleNotification) {
      // Show the most recent unread notification
      setVisibleNotification(unreadNotifications[0]);
      
      // Mark as read after showing
      setNotifications(prev => 
        prev.map(n => 
          n.id === unreadNotifications[0].id ? { ...n, read: true } : n
        )
      );
    }
  }, [notifications, visibleNotification]);
  
  // Auto-dismiss notification after 5 seconds
  useEffect(() => {
    if (!visibleNotification) return;
    
    const timer = setTimeout(() => {
      setVisibleNotification(null);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [visibleNotification]);
  
  // Get icon based on notification type
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Get toast background color based on type
  const getToastClassName = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800';
    }
  };
  
  // Format relative time (e.g., "5m ago")
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'à l\'instant';
    if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)}h`;
    return `il y a ${Math.floor(diffInSeconds / 86400)}j`;
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {visibleNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className={cn(
              'p-4 rounded-lg border shadow-lg max-w-sm',
              getToastClassName(visibleNotification.type)
            )}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                {getIcon(visibleNotification.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">
                  {visibleNotification.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {visibleNotification.message}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(visibleNotification.timestamp)}
                  </span>
                  <button 
                    onClick={() => setVisibleNotification(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-background/50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
