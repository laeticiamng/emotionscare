// @ts-nocheck

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { Notification } from '@/types/notifications';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  onAction?: () => void;
  duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onAction,
  duration = 5000
}) => {
  useEffect(() => {
    if (notification.priority !== 'high' && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration, notification.priority]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success': return 'border-l-green-500';
      case 'warning': return 'border-l-yellow-500';
      case 'error': return 'border-l-red-500';
      default: return 'border-l-blue-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: '50%' }}
      animate={{ opacity: 1, y: 0, x: '50%' }}
      exit={{ opacity: 0, y: -50, x: '50%' }}
      className="fixed top-4 left-1/2 z-50 w-96 max-w-[90vw]"
    >
      <Card className={`p-4 border-l-4 ${getBorderColor()} shadow-lg bg-background/95 backdrop-blur-sm`}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
            {notification.actionText && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={onAction}
              >
                {notification.actionText}
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onClose}
            aria-label="Fermer la notification"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default NotificationToast;
