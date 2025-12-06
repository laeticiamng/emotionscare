import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, Trophy, Target, Sparkles } from 'lucide-react';
import { useInAppNotifications } from '@/hooks/useInAppNotifications';
import { cn } from '@/lib/utils';

export const InAppNotificationCenter: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useInAppNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'badge_unlocked':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'badge_progress':
        return <Sparkles className="w-5 h-5 text-blue-500" />;
      case 'challenge_near_completion':
        return <Target className="w-5 h-5 text-orange-500" />;
      case 'new_challenge':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <>
      {/* Notification Bell Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
            >
              {unreadCount}
            </motion.span>
          )}
        </button>
      </motion.div>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-24 right-6 w-96 max-h-[500px] bg-card border border-border rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Tout marquer lu
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-muted rounded-md transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">Aucune notification</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {notifications.map((notification) => (
                      <motion.button
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          'w-full text-left p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors relative',
                          !notification.read && 'bg-primary/5'
                        )}
                        aria-label={`Notification: ${notification.title}${!notification.read ? ' (non lue)' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getIcon(notification.type)}</div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{notification.title}</h4>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                            {notification.message && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(notification.created_at).toLocaleDateString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 hover:bg-muted rounded-md transition-colors"
                            aria-label="Supprimer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};