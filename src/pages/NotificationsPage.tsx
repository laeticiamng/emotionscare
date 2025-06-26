
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  BellOff, 
  Settings, 
  Check, 
  X, 
  Mail, 
  Smartphone, 
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  MarkAsRead
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/utils/formatDate';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
  category: 'system' | 'reminder' | 'achievement' | 'social';
}

const NotificationsPage: React.FC = () => {
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Objectif hebdomadaire atteint !',
      message: 'Félicitations ! Vous avez completé 7 sessions de bien-être cette semaine.',
      type: 'success',
      read: false,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: 'achievement'
    },
    {
      id: '2',
      title: 'Rappel quotidien',
      message: 'Il est temps de faire votre scan émotionnel quotidien.',
      type: 'info',
      read: false,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      category: 'reminder'
    },
    {
      id: '3',
      title: 'Nouvelle fonctionnalité disponible',
      message: 'Découvrez la nouvelle section de méditation guidée dans l\'espace VR.',
      type: 'info',
      read: true,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      category: 'system'
    },
    {
      id: '4',
      title: 'Attention : Score de stress élevé',
      message: 'Vos dernières analyses montrent un niveau de stress inhabituel. Prenez un moment pour vous.',
      type: 'warning',
      read: false,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      category: 'reminder'
    },
    {
      id: '5',
      title: 'Rapport mensuel disponible',
      message: 'Votre rapport de bien-être du mois dernier est prêt à être consulté.',
      type: 'info',
      read: true,
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      category: 'system'
    }
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    reminderNotifications: true,
    achievementNotifications: true,
    socialNotifications: false,
    quietMode: false,
    quietStart: '22:00',
    quietEnd: '08:00'
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "Notifications marquées comme lues",
      description: "Toutes vos notifications ont été marquées comme lues."
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification supprimée",
      description: "La notification a été supprimée avec succès."
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "Notifications effacées",
      description: "Toutes les notifications ont été supprimées."
    });
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <X className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'achievement': return 'bg-green-100 text-green-800';
      case 'reminder': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotifications = (category?: string) => {
    if (!category) return notifications;
    return notifications.filter(n => n.category === category);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notifications
          </h1>
          <p className="text-muted-foreground">
            Gérez vos notifications et préférences d'alerte
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unreadCount} non lues
            </Badge>
          )}
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <MarkAsRead className="h-4 w-4 mr-2" />
            Tout marquer lu
          </Button>
          <Button variant="outline" onClick={clearAllNotifications} disabled={notifications.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            Tout effacer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Toutes ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center gap-2">
            <BellOff className="h-4 w-4" />
            Non lues ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="achievement" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Succès
          </TabsTrigger>
          <TabsTrigger value="reminder" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Rappels
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Système
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getNotificationIcon(notification.type)}
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </h4>
                              <Badge variant="outline" className={`text-xs ${getCategoryColor(notification.category)}`}>
                                {notification.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
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
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune notification pour le moment</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {filteredNotifications().filter(n => !n.read).map((notification) => (
                <Card key={notification.id} className="border-l-4 border-l-blue-500 bg-blue-50/30">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="space-y-1 flex-1">
                          <h4 className="font-semibold">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(notification.timestamp)}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {['achievement', 'reminder', 'system'].map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {filteredNotifications(category).map((notification) => (
                  <Card key={notification.id} className={!notification.read ? 'border-l-4 border-l-blue-500' : ''}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getNotificationIcon(notification.type)}
                          <div className="space-y-1 flex-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(notification.timestamp)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Préférences de notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="font-medium">Notifications par email</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Recevoir les notifications importantes par email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={() => toggleSetting('emailNotifications')}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <span className="font-medium">Notifications push</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Notifications instantanées sur votre appareil</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={() => toggleSetting('pushNotifications')}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Rappels automatiques</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Rappels pour vos sessions quotidiennes</p>
                    </div>
                    <Switch
                      checked={settings.reminderNotifications}
                      onCheckedChange={() => toggleSetting('reminderNotifications')}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Notifications de succès</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Célébrer vos objectifs atteints</p>
                    </div>
                    <Switch
                      checked={settings.achievementNotifications}
                      onCheckedChange={() => toggleSetting('achievementNotifications')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellOff className="h-5 w-5" />
                  Mode silencieux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-medium">Activer le mode silencieux</span>
                    <p className="text-sm text-muted-foreground">Désactiver les notifications sur certaines heures</p>
                  </div>
                  <Switch
                    checked={settings.quietMode}
                    onCheckedChange={() => toggleSetting('quietMode')}
                  />
                </div>
                
                {settings.quietMode && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Début du mode silencieux</label>
                      <input
                        type="time"
                        value={settings.quietStart}
                        onChange={(e) => setSettings(prev => ({ ...prev, quietStart: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fin du mode silencieux</label>
                      <input
                        type="time"
                        value={settings.quietEnd}
                        onChange={(e) => setSettings(prev => ({ ...prev, quietEnd: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
