
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellOff, 
  Check, 
  X, 
  Settings, 
  Archive,
  Star,
  Clock,
  Shield,
  Heart,
  Trophy,
  Users,
  MessageSquare,
  Zap,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'achievement' | 'reminder' | 'social' | 'security';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  actionUrl?: string;
}

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState({
    push: true,
    email: true,
    inApp: true,
    sound: true,
    categories: {
      security: true,
      achievements: true,
      reminders: true,
      social: true,
      system: true,
      wellness: true
    }
  });

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: NotificationItem[] = [
      {
        id: '1',
        type: 'achievement',
        title: 'Nouveau badge débloqué !',
        message: 'Félicitations ! Vous avez obtenu le badge "Méditateur régulier" pour 7 jours consécutifs.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false,
        priority: 'high',
        category: 'achievements',
        actionUrl: '/gamification'
      },
      {
        id: '2',
        type: 'reminder',
        title: 'Temps de méditation',
        message: 'C\'est l\'heure de votre session de méditation quotidienne. Prenez 10 minutes pour vous.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: false,
        priority: 'medium',
        category: 'wellness'
      },
      {
        id: '3',
        type: 'social',
        title: 'Nouveau message de votre coach',
        message: 'Votre coach IA a préparé des recommandations personnalisées basées sur votre dernière session.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        read: true,
        priority: 'medium',
        category: 'social',
        actionUrl: '/coach'
      },
      {
        id: '4',
        type: 'security',
        title: 'Nouvelle connexion détectée',
        message: 'Une connexion depuis un nouvel appareil a été détectée. Si ce n\'était pas vous, sécurisez votre compte.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        read: true,
        priority: 'high',
        category: 'security',
        actionUrl: '/security'
      },
      {
        id: '5',
        type: 'info',
        title: 'Mise à jour de l\'application',
        message: 'Nouvelles fonctionnalités disponibles ! Découvrez les améliorations de votre expérience VR.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        read: true,
        priority: 'low',
        category: 'system'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return Trophy;
      case 'reminder':
        return Clock;
      case 'social':
        return MessageSquare;
      case 'security':
        return Shield;
      case 'success':
        return Check;
      case 'warning':
        return Bell;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
      case 'reminder':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
      case 'social':
        return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'security':
        return 'text-red-600 bg-red-100 dark:bg-red-900';
      case 'success':
        return 'text-green-600 bg-green-100 dark:bg-green-900';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'read') return notification.read;
    return notification.category === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              Gérez vos notifications et paramètres de communication
            </p>
          </div>
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <Check className="h-4 w-4 mr-2" />
                Tout marquer comme lu
              </Button>
            )}
            <Badge variant="secondary" className="text-sm">
              {unreadCount} non lues
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Toutes', count: notifications.length },
                { id: 'unread', label: 'Non lues', count: unreadCount },
                { id: 'achievements', label: 'Récompenses', count: notifications.filter(n => n.category === 'achievements').length },
                { id: 'wellness', label: 'Bien-être', count: notifications.filter(n => n.category === 'wellness').length },
                { id: 'security', label: 'Sécurité', count: notifications.filter(n => n.category === 'security').length }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2"
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {tab.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`group ${!notification.read ? 'bg-blue-50 dark:bg-blue-950' : ''}`}
                    >
                      <Card className={`transition-all hover:shadow-md ${!notification.read ? 'border-blue-200 dark:border-blue-800' : ''}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className={`font-semibold text-sm ${!notification.read ? 'text-blue-900 dark:text-blue-100' : ''}`}>
                                  {notification.title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>
                                    {formatDistanceToNow(new Date(notification.timestamp), { 
                                      addSuffix: true, 
                                      locale: fr 
                                    })}
                                  </span>
                                  {notification.priority === 'high' && (
                                    <Badge variant="destructive" className="text-xs">
                                      Urgent
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <p className="text-muted-foreground text-sm mb-3">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center gap-2">
                                {notification.actionUrl && (
                                  <Button size="sm" variant="outline">
                                    Voir
                                  </Button>
                                )}
                                {!notification.read && (
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Marquer comme lu
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <BellOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune notification</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'unread' ? 'Toutes vos notifications sont lues !' : 'Vous n\'avez aucune notification dans cette catégorie.'}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Notification Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Méthodes de notification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications push</h4>
                      <p className="text-sm text-muted-foreground">Recevoir des notifications sur l'appareil</p>
                    </div>
                    <Switch 
                      checked={settings.push}
                      onCheckedChange={(checked) => setSettings({...settings, push: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications email</h4>
                      <p className="text-sm text-muted-foreground">Recevoir des résumés par email</p>
                    </div>
                    <Switch 
                      checked={settings.email}
                      onCheckedChange={(checked) => setSettings({...settings, email: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications dans l'app</h4>
                      <p className="text-sm text-muted-foreground">Affichage des notifications dans l'application</p>
                    </div>
                    <Switch 
                      checked={settings.inApp}
                      onCheckedChange={(checked) => setSettings({...settings, inApp: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Sons de notification</h4>
                      <p className="text-sm text-muted-foreground">Jouer un son pour les notifications</p>
                    </div>
                    <Switch 
                      checked={settings.sound}
                      onCheckedChange={(checked) => setSettings({...settings, sound: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Catégories de notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'security', label: 'Sécurité', description: 'Alertes de sécurité importantes', icon: Shield },
                    { key: 'achievements', label: 'Récompenses', description: 'Badges et accomplissements', icon: Trophy },
                    { key: 'reminders', label: 'Rappels', description: 'Rappels de méditation et exercices', icon: Clock },
                    { key: 'social', label: 'Social', description: 'Messages et interactions', icon: Users },
                    { key: 'system', label: 'Système', description: 'Mises à jour et maintenance', icon: Settings },
                    { key: 'wellness', label: 'Bien-être', description: 'Conseils et recommandations', icon: Heart }
                  ].map((category) => {
                    const Icon = category.icon;
                    return (
                      <div key={category.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">{category.label}</h4>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                        <Switch 
                          checked={settings.categories[category.key as keyof typeof settings.categories]}
                          onCheckedChange={(checked) => setSettings({
                            ...settings,
                            categories: {
                              ...settings.categories,
                              [category.key]: checked
                            }
                          })}
                        />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NotificationsPage;
