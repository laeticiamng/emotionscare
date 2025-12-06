import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Heart, 
  Calendar,
  Settings,
  Trash2,
  MarkAsUnreadIcon
} from 'lucide-react';
import { Header } from '@/components/layout';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'reminder';
  timestamp: string;
  read: boolean;
  category: 'system' | 'therapy' | 'social' | 'achievement';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nouvelle session disponible',
      message: 'Votre session de respiration quotidienne vous attend',
      type: 'reminder',
      timestamp: '2025-01-15T10:30:00Z',
      read: false,
      category: 'therapy'
    },
    {
      id: '2',
      title: 'Objectif atteint !',
      message: 'Félicitations ! Vous avez terminé 7 jours consécutifs',
      type: 'success',
      timestamp: '2025-01-14T18:45:00Z',
      read: false,
      category: 'achievement'
    },
    {
      id: '3',
      title: 'Mise à jour du système',
      message: 'Nouvelles fonctionnalités IA disponibles',
      type: 'info',
      timestamp: '2025-01-14T14:20:00Z',
      read: true,
      category: 'system'
    }
  ]);

  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    therapyReminders: true,
    achievementAlerts: true,
    systemUpdates: false,
    socialNotifications: true
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'success': return 'bg-green-500/10 text-green-700';
      case 'warning': return 'bg-yellow-500/10 text-yellow-700';
      case 'reminder': return 'bg-blue-500/10 text-blue-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'therapy': return Heart;
      case 'achievement': return Calendar;
      case 'social': return MessageSquare;
      default: return Bell;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <header>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Gérez vos alertes et rappels</p>
          </header>

          <Tabs defaultValue="notifications" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Toutes les notifications</h2>
                  <p className="text-sm text-muted-foreground">
                    {notifications.filter(n => !n.read).length} non lues
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <MarkAsUnreadIcon className="h-4 w-4 mr-2" />
                  Tout marquer comme lu
                </Button>
              </div>

              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Aucune notification</p>
                    </CardContent>
                  </Card>
                ) : (
                  notifications.map((notification) => {
                    const CategoryIcon = getCategoryIcon(notification.category);
                    return (
                      <Card 
                        key={notification.id}
                        className={`${!notification.read ? 'border-l-4 border-l-primary' : ''} hover:shadow-md transition-shadow`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                                <CategoryIcon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                                    {notification.title}
                                  </h3>
                                  {!notification.read && (
                                    <Badge variant="secondary" className="text-xs">Nouveau</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(notification.timestamp).toLocaleString('fr-FR')}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Marquer comme lu
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Préférences de notification
                  </CardTitle>
                  <CardDescription>
                    Configurez vos alertes et rappels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-base">Notifications push</div>
                        <div className="text-sm text-muted-foreground">
                          Recevoir des alertes sur votre appareil
                        </div>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, pushNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-base">Notifications email</div>
                        <div className="text-sm text-muted-foreground">
                          Recevoir un résumé par email
                        </div>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-base">Rappels thérapeutiques</div>
                        <div className="text-sm text-muted-foreground">
                          Sessions et exercices de bien-être
                        </div>
                      </div>
                      <Switch
                        checked={settings.therapyReminders}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, therapyReminders: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-base">Alertes de réussite</div>
                        <div className="text-sm text-muted-foreground">
                          Objectifs atteints et badges débloqués
                        </div>
                      </div>
                      <Switch
                        checked={settings.achievementAlerts}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, achievementAlerts: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-base">Mises à jour système</div>
                        <div className="text-sm text-muted-foreground">
                          Nouvelles fonctionnalités et maintenance
                        </div>
                      </div>
                      <Switch
                        checked={settings.systemUpdates}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, systemUpdates: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-base">Notifications sociales</div>
                        <div className="text-sm text-muted-foreground">
                          Messages et activités communautaires
                        </div>
                      </div>
                      <Switch
                        checked={settings.socialNotifications}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, socialNotifications: checked }))
                        }
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button>Sauvegarder les préférences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}