import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellOff,
  CheckCheck,
  X,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useAdminNotificationStore,
  type AdminNotification,
  type AdminNotificationType,
} from '@/stores/adminNotificationStore';
import { cn } from '@/lib/utils';

const typeConfig: Record<AdminNotificationType, { icon: React.ElementType; className: string }> = {
  info: {
    icon: Info,
    className: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  },
  success: {
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  error: {
    icon: XCircle,
    className: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  },
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "A l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `Il y a ${diffD}j`;
}

const NotificationItem: React.FC<{
  notification: AdminNotification;
  index: number;
}> = ({ notification, index }) => {
  const { markAsRead, dismiss } = useAdminNotificationStore();
  const config = typeConfig[notification.type];
  const IconComponent = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'p-3 rounded-lg border flex gap-3 group relative cursor-pointer',
        'hover:bg-muted/50 transition-colors',
        !notification.read && 'border-primary/30 bg-primary/5',
        notification.read && 'border-border'
      )}
      role="listitem"
      onClick={() => !notification.read && markAsRead(notification.id)}
    >
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          config.className
        )}
      >
        <IconComponent className="h-4 w-4" aria-hidden="true" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              'text-sm font-medium truncate',
              !notification.read ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full" aria-label="Non lu" />
          )}
        </div>
        <p
          className={cn(
            'text-xs mt-0.5 truncate',
            !notification.read ? 'text-foreground/80' : 'text-muted-foreground'
          )}
        >
          {notification.description}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">
            {formatRelativeTime(notification.timestamp)}
          </p>
          {notification.module && (
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {notification.module}
            </span>
          )}
        </div>
      </div>

      {notification.dismissible && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            dismiss(notification.id);
          }}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
          aria-label={`Supprimer la notification : ${notification.title}`}
        >
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      )}
    </motion.div>
  );
};

interface NotificationsPanelProps {
  maxVisible?: number;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ maxVisible = 5 }) => {
  const { notifications, unreadCount, markAllAsRead } = useAdminNotificationStore();
  const visibleNotifications = notifications.slice(0, maxVisible);

  return (
    <div className="space-y-2" role="region" aria-label="Notifications administrateur">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-xs font-bold text-white bg-primary rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={markAllAsRead}
              aria-label="Tout marquer comme lu"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Tout lire
            </Button>
          )}
          <Bell className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
      </div>

      {visibleNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <BellOff className="h-8 w-8 text-muted-foreground/50 mb-2" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Aucune notification</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Les alertes systeme apparaitront ici
          </p>
        </div>
      ) : (
        <div className="space-y-2" role="list" aria-label="Liste des notifications">
          <AnimatePresence mode="popLayout">
            {visibleNotifications.map((notification, index) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {notifications.length > maxVisible && (
        <p className="text-center text-xs text-muted-foreground pt-2">
          +{notifications.length - maxVisible} autres notifications
        </p>
      )}
    </div>
  );
};

export default NotificationsPanel;
