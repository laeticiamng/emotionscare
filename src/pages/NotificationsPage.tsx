
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Settings, Trash2, Check, AlertCircle, Heart, Trophy, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'achievement';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: 'Nouveau badge obtenu !',
      message: 'Félicitations ! Vous avez obtenu le badge "Régulier" pour 30 jours consécutifs.',
      time: 'Il y a 2 heures',
      read: false,
      icon: Trophy
    },
    {
      id: '2',
      type: 'info',
      title: 'Session VR recommandée',
      message: 'Votre coach IA vous recommande une session de relaxation en forêt.',
      time: 'Il y a 4 heures',
      read: false,
      icon: Heart
    },
    {
      id: '3',
      type: 'success',
      title: 'Objectif atteint',
      message: 'Vous avez atteint votre objectif de bien-être hebdomadaire !',
      time: 'Hier',
      read: true,
      icon: Check
    },
    {
      id: '4',
      type: 'info',
      title: 'Nouveau message',
      message: 'Vous avez reçu une réponse dans le Social Cocoon.',
      time: 'Il y a 2 jours',
      read: true,
      icon: MessageSquare
    }
  ]);

  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    weeklyReports: true,
    achievements: true,
    socialUpdates: true,
    coachRecommendations: true
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Toutes les notifications marquées comme lues');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification supprimée');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('Toutes les notifications supprimées');
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500 bg-green-50';
      case 'achievement': return 'border-yellow-500 bg-yellow-50';
      case 'warning': return 'border-orange-500 bg-orange-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Aucune nouvelle notification'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="px-3 py-1">
              {unreadCount}
            </Badge>
          )}
        </div>

        <Tabs defaultValue="notifications" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2 px-2 py-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            {notifications.length > 0 && (
              <div className="flex gap-2">
                <Button onClick={markAllAsRead} variant="outline" size="sm">
                  <Check className="h-4 w-4 mr-2" />
                  Tout marquer comme lu
                </Button>
                <Button onClick={clearAll} variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Tout supprimer
                </Button>
              </div>
            )}

            <AnimatePresence>
              {notifications.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Aucune notification</h3>
                    <p className="text-muted-foreground">
                      Vous êtes à jour ! Les nouvelles notifications apparaîtront ici.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`border-l-4 p-4 rounded-lg ${getNotificationColor(notification.type)} ${
                        !notification.read ? 'bg-opacity-100' : 'bg-opacity-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'success' ? 'bg-green-500' :
                          notification.type === 'achievement' ? 'bg-yellow-500' :
                          notification.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          <notification.icon className="h-4 w-4 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {notification.time}
                              </p>
                            </div>
                            
                            <div className="flex gap-1">
                              {!notification.read && (
                                <Button
                                  onClick={() => markAsRead(notification.id)}
                                  size="sm"
                                  variant="ghost"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                onClick={() => deleteNotification(notification.id)}
                                size="sm"
                                variant="ghost"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications push</h4>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications en temps réel
                      </p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications email</h4>
                      <p className="text-sm text-muted-foreground">
                        Recevoir un résumé par email
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Rapports hebdomadaires</h4>
                      <p className="text-sm text-muted-foreground">
                        Résumé de vos progrès chaque semaine
                      </p>
                    </div>
                    <Switch
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, weeklyReports: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Réalisations et badges</h4>
                      <p className="text-sm text-muted-foreground">
                        Notifications pour les nouveaux badges
                      </p>
                    </div>
                    <Switch
                      checked={settings.achievements}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, achievements: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Mises à jour sociales</h4>
                      <p className="text-sm text-muted-foreground">
                        Notifications du Social Cocoon
                      </p>
                    </div>
                    <Switch
                      checked={settings.socialUpdates}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, socialUpdates: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Recommandations du coach</h4>
                      <p className="text-sm text-muted-foreground">
                        Suggestions personnalisées de votre coach IA
                      </p>
                    </div>
                    <Switch
                      checked={settings.coachRecommendations}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, coachRecommendations: checked }))
                      }
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => toast.success('Paramètres sauvegardés')}
                  className="w-full"
                >
                  Sauvegarder les préférences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default NotificationsPage;
