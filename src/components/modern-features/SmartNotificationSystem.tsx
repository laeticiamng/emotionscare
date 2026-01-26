// @ts-nocheck
/**
 * SmartNotificationSystem - Système de notifications intelligentes
 * Gère les notifications en temps réel avec personnalisation
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Check, 
  X, 
  Settings, 
  Heart, 
  Target,
  MessageSquare,
  Award,
  Clock
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'social' | 'system' | 'goal' | 'wellness';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationSettings {
  achievements: boolean;
  reminders: boolean;
  social: boolean;
  system: boolean;
  goals: boolean;
  wellness: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
}

const SmartNotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: 'Nouveau badge débloqué !',
      message: 'Félicitations ! Vous avez obtenu le badge "Semaine productive"',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      priority: 'high',
      actionUrl: '/app/achievements',
      actionLabel: 'Voir mes badges'
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Session planifiée',
      message: 'Votre session de méditation commence dans 15 minutes',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      priority: 'medium',
      actionUrl: '/app/sessions',
      actionLabel: 'Commencer'
    },
    {
      id: '3',
      type: 'goal',
      title: 'Objectif en vue !',
      message: 'Plus que 2 sessions pour atteindre votre objectif hebdomadaire',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'wellness',
      title: 'Moment de pause suggéré',
      message: 'Il est temps de prendre une pause pour votre bien-être',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      priority: 'low'
    },
    {
      id: '5',
      type: 'social',
      title: 'Nouveau message de support',
      message: 'Votre coach a partagé de nouveaux conseils personnalisés',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: false,
      priority: 'medium',
      actionUrl: '/app/messages',
      actionLabel: 'Lire'
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    achievements: true,
    reminders: true,
    social: true,
    system: true,
    goals: true,
    wellness: true,
    sound: true,
    desktop: true,
    email: false
  });

  const [activeTab, setActiveTab] = useState('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="h-4 w-4 text-yellow-500" />;
      case 'reminder': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'social': return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'goal': return <Target className="h-4 w-4 text-purple-500" />;
      case 'wellness': return <Heart className="h-4 w-4 text-red-500" />;
      case 'system': return <Settings className="h-4 w-4 text-gray-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50/50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50/50';
      case 'low': return 'border-l-green-500 bg-green-50/50';
      default: return 'border-l-gray-500 bg-gray-50/50';
    }
  };

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
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'important':
        return notifications.filter(n => n.priority === 'high');
      default:
        return notifications;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const importantCount = notifications.filter(n => n.priority === 'high').length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  // Simulation de nouvelles notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% de chance toutes les 30 secondes
        const types: (keyof typeof settings)[] = ['wellness', 'goals', 'achievements'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: randomType,
          title: 'Nouvelle notification',
          message: 'Vous avez une nouvelle activité à découvrir !',
          timestamp: new Date(),
          read: false,
          priority: Math.random() > 0.7 ? 'high' : 'medium'
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">
            Restez informé de vos progrès et activités
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Tout marquer lu
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{notifications.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
            <div className="text-sm text-muted-foreground">Non lues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{importantCount}</div>
            <div className="text-sm text-muted-foreground">Importantes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(settings).filter(Boolean).length}
            </div>
            <div className="text-sm text-muted-foreground">Types activés</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Liste des notifications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">Toutes ({notifications.length})</TabsTrigger>
                  <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
                  <TabsTrigger value="important">Importantes ({importantCount})</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-4">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getFilteredNotifications().map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-l-4 rounded-lg ${getPriorityColor(notification.priority)} ${
                          !notification.read ? 'bg-white shadow-sm' : 'bg-muted/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(notification.timestamp)}
                                </span>
                                {notification.actionUrl && (
                                  <Button 
                                    variant="link" 
                                    size="sm" 
                                    className="h-auto p-0 text-xs"
                                  >
                                    {notification.actionLabel}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Paramètres de notifications */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Types de notifications</h4>
                <div className="space-y-3">
                  {Object.entries(settings).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(key)}
                        <span className="text-sm capitalize">
                          {key === 'achievements' ? 'Succès' :
                           key === 'reminders' ? 'Rappels' :
                           key === 'social' ? 'Social' :
                           key === 'system' ? 'Système' :
                           key === 'goals' ? 'Objectifs' :
                           key === 'wellness' ? 'Bien-être' : key}
                        </span>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Méthodes de livraison</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notifications sonores</span>
                    <Switch
                      checked={settings.sound}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, sound: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notifications bureau</span>
                    <Switch
                      checked={settings.desktop}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, desktop: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notifications email</span>
                    <Switch
                      checked={settings.email}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, email: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres avancés
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SmartNotificationSystem;