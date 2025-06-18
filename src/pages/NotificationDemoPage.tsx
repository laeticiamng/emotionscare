
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const NotificationDemoPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'success',
      title: 'Scan émotionnel complété',
      message: 'Votre scan quotidien a été enregistré avec succès. Score: 8.2/10',
      timestamp: 'Il y a 5 minutes',
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Nouvelle session VR disponible',
      message: 'Découvrez notre nouvelle expérience "Forêt tropicale" pour la relaxation',
      timestamp: 'Il y a 1 heure',
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Rappel bien-être',
      message: 'Vous n\'avez pas fait votre pause relaxation aujourd\'hui',
      timestamp: 'Il y a 2 heures',
      read: true
    },
    {
      id: '4',
      type: 'error',
      title: 'Problème de synchronisation',
      message: 'Impossible de synchroniser vos données. Vérifiez votre connexion.',
      timestamp: 'Il y a 3 heures',
      read: true
    }
  ]);

  const [soundEnabled, setSoundEnabled] = useState(true);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'error':
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'border-orange-200 bg-orange-50 dark:bg-orange-900/20';
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      default:
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const addDemoNotification = () => {
    const demoNotif: NotificationItem = {
      id: Date.now().toString(),
      type: 'info',
      title: 'Notification de démonstration',
      message: 'Ceci est une notification de test générée automatiquement',
      timestamp: 'À l\'instant',
      read: false
    };
    setNotifications([demoNotif, ...notifications]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-950 dark:to-purple-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Centre de notifications
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Gérez vos alertes et messages importants
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">
                {unreadCount} non lues
              </Badge>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Zone de démonstration</CardTitle>
            <CardDescription>
              Testez les différents types de notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={addDemoNotification}>
                <Bell className="h-4 w-4 mr-2" />
                Ajouter notification test
              </Button>
              <Button variant="outline" onClick={() => setNotifications([])}>
                Effacer tout
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
              >
                Marquer tout comme lu
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Aucune notification
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Toutes vos notifications apparaîtront ici
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`${getNotificationColor(notification.type)} ${!notification.read ? 'border-l-4' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.timestamp}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Marquer comme lu
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Settings Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Paramètres des notifications</CardTitle>
            <CardDescription>
              Personnalisez vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications push</h4>
                  <p className="text-sm text-gray-600">Recevoir des alertes sur le bureau</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications par email</h4>
                  <p className="text-sm text-gray-600">Recevoir un résumé quotidien par email</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Sons de notification</h4>
                  <p className="text-sm text-gray-600">Jouer un son lors de nouvelles notifications</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="rounded" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotificationDemoPage;
