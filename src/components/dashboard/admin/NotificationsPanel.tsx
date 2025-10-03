
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, FileClock, MessageSquare, UserCheck, Users } from 'lucide-react';

const notifications = [
  {
    id: 'notif-1',
    title: 'Nouveau rapport disponible',
    description: 'Le rapport hebdomadaire est prêt à être consulté',
    time: 'Il y a 10 min',
    icon: FileClock,
    type: 'info',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Équipe Marketing',
    description: 'Alerte de stress détectée (3 membres)',
    time: 'Il y a 45 min',
    icon: Users,
    type: 'warning',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Nouvel utilisateur',
    description: 'Thomas Dubois a rejoint l\'organisation',
    time: 'Il y a 2h',
    icon: UserCheck,
    type: 'success',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Message du support',
    description: 'Votre demande #4523 a été traitée',
    time: 'Il y a 3h',
    icon: MessageSquare,
    type: 'info',
    read: true
  }
];

const NotificationsPanel: React.FC = () => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Récentes</h3>
        <Bell className="h-4 w-4 text-muted-foreground" />
      </div>
      
      {notifications.map((notification, index) => (
        <motion.div
          key={notification.id}
          className={`p-3 rounded-lg border flex gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${!notification.read ? 'border-primary/30 bg-primary/5' : 'border-border'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            ${notification.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 
              notification.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
              'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}
          `}>
            <notification.icon className="h-4 w-4" />
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                {notification.title}
              </p>
              {!notification.read && (
                <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full"></span>
              )}
            </div>
            <p className={`text-xs mt-1 ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
              {notification.description}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {notification.time}
            </p>
          </div>
        </motion.div>
      ))}
      
      <motion.button
        className="w-full text-center text-xs text-primary hover:text-primary/80 py-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Voir toutes les notifications
      </motion.button>
    </div>
  );
};

export default NotificationsPanel;
