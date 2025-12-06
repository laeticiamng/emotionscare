
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationToastProps {
  notifications: ToastNotification[];
  onRemove: (id: string) => void;
}

const getIcon = (type: ToastNotification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const getBackgroundColor = (type: ToastNotification['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
    case 'error':
      return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';
    case 'info':
      return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
  }
};

const NotificationToast: React.FC<NotificationToastProps> = ({ 
  notifications, 
  onRemove 
}) => {
  React.useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration !== 0) {
        const timer = setTimeout(() => {
          onRemove(notification.id);
        }, notification.duration || 5000);
        
        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onRemove]);
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            className={`max-w-sm p-4 rounded-lg border shadow-lg ${getBackgroundColor(notification.type)}`}
          >
            <div className="flex items-start gap-3">
              {getIcon(notification.type)}
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                {notification.message && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onRemove(notification.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
