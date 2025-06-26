
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Check, 
  X, 
  Trash2, 
  Settings, 
  Heart, 
  Trophy, 
  MessageSquare, 
  Calendar,
  Info,
  AlertTriangle,
  CheckCircle,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'achievement';
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: 'system' | 'coach' | 'achievement' | 'reminder';
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: 'Nouveau badge obtenu !',
      message: 'Félicitations ! Vous avez débloqué le badge "Méditant Régulier" pour 30 jours consécutifs.',
      time: '2h',
      read: false,
      category: 'achievement'
    },
    {
      id: '2',
      type: 'info',
      title: 'Rappel de session',
      message: 'Il est temps pour votre session de bien-être quotidienne. Votre coach vous attend !',
      time: '4h',
      read: false,
      category: 'reminder'
    },
    {
      id: '3',
      type: 'success',
      title: 'Scan émotionnel complété',
      message: 'Excellent travail ! Votre scan émotionnel d\'aujourd\'hui montre une amélioration de 15%.',
      time: '6h',
      read: true,
      category: 'system'
    },
    {
      id: '4',
      type: 'warning',
      title: 'Niveau de stress élevé détecté',
      message: 'Votre dernier scan indique un niveau de stress élevé. Prenez quelques minutes pour vous détendre.',
      time: '1j',
      read: false,
      category: 'coach'
    },
    {
      id: '5',
      type: 'info',
      title: 'Nouvelle fonctionnalité',
      message: 'Découvrez notre nouveau module de réalité virtuelle pour la méditation immersive !',
      time: '2j',
      read: true,
      category: 'system'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement':
        return <Trophy className="h-4 w-4" />;
      case 'coach':
        return <MessageSquare className="h-4 w-4" />;
      case 'reminder':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    toast.success('Notification marquée comme lue');
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: false } : notif
      )
    );
    toast.success('Notification marquée comme non lue');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success('Notification supprimée');
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast.success('Toutes les notifications marquées comme lues');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('Toutes les notifications supprimées');
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <Bell className="h-8 w-8 text-blue-600" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>
          </div>
          <p className="text-xl text-gray-600">
            Restez informé de vos progrès et activités
          </p>
        </motion.div>

        {/* Action Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Filtrer:</span>
                </div>
                <Tabs value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">Toutes ({notifications.length})</TabsTrigger>
                    <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
                    <TabsTrigger value="read">Lues ({notifications.length - unreadCount})</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-2" />
                  Tout marquer comme lu
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Tout supprimer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucune notification
                </h3>
                <p className="text-gray-600">
                  {filter === 'unread' ? 'Toutes vos notifications ont été lues' : 
                   filter === 'read' ? 'Aucune notification lue' : 
                   'Vous n\'avez pas encore de notifications'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`hover:shadow-lg transition-all ${!notification.read ? 'ring-2 ring-blue-200' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Nouveau
                              </Badge>
                            )}
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getCategoryIcon(notification.category)}
                              <span className="capitalize">{notification.category}</span>
                            </Badge>
                          </div>
                          <p className={`text-sm mb-2 ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            il y a {notification.time}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {notification.read ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsUnread(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Settings Link */}
        <Card>
          <CardContent className="p-6 text-center">
            <Settings className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gérer les préférences de notifications
            </h3>
            <p className="text-gray-600 mb-4">
              Personnalisez quand et comment vous souhaitez être notifié
            </p>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres de notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;
