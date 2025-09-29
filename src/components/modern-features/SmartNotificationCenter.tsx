/**
 * Smart Notification Center - Centre de notifications intelligent
 * Gestion complète des notifications avec actions, filtres et preferences
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  Check, 
  X, 
  Filter, 
  Search, 
  Settings, 
  BellRing,
  Heart,
  Brain,
  Music,
  Calendar,
  Award,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'alert' | 'update' | 'recommendation' | 'social';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  important: boolean;
  actionable: boolean;
  category: 'wellness' | 'system' | 'social' | 'achievement';
  metadata?: {
    actionType?: 'start_session' | 'view_progress' | 'update_settings';
    actionUrl?: string;
    image?: string;
  };
}

interface NotificationPreferences {
  wellness: boolean;
  achievements: boolean;
  reminders: boolean;
  social: boolean;
  system: boolean;
  sound: boolean;
  push: boolean;
  email: boolean;
  quiet_hours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

const SmartNotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    wellness: true,
    achievements: true,
    reminders: true,
    social: false,
    system: true,
    sound: true,
    push: true,
    email: false,
    quiet_hours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  // Simuler le chargement des notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'achievement',
        title: 'Nouveau badge débloqué !',
        message: 'Félicitations ! Vous avez maintenu une série de 7 jours consécutifs.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        important: true,
        actionable: true,
        category: 'achievement',
        metadata: {
          actionType: 'view_progress',
          actionUrl: '/app/progress'
        }
      },
      {
        id: '2',
        type: 'reminder',
        title: 'Session de méditation',
        message: 'Il est temps pour votre session quotidienne de bien-être.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: false,
        important: false,
        actionable: true,
        category: 'wellness',
        metadata: {
          actionType: 'start_session',
          actionUrl: '/app/meditation'
        }
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Nouvelle fonctionnalité',
        message: 'Découvrez notre nouvelle analyse de patterns émotionnels avec IA avancée.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        important: false,
        actionable: true,
        category: 'system',
        metadata: {
          actionType: 'start_session',
          actionUrl: '/app/ai-analysis'
        }
      },
      {
        id: '4',
        type: 'alert',
        title: 'Période de stress détectée',
        message: 'Nos capteurs ont détecté des signes de stress. Prenez une pause ?',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
        important: true,
        actionable: true,
        category: 'wellness',
        metadata: {
          actionType: 'start_session',
          actionUrl: '/app/breathwork'
        }
      },
      {
        id: '5',
        type: 'update',
        title: 'Mise à jour disponible',
        message: 'Une nouvelle version de l\'application est disponible avec des améliorations.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        read: true,
        important: false,
        actionable: false,
        category: 'system'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  // Filtrage des notifications
  useEffect(() => {
    let filtered = notifications;

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(notif => 
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par statut
    switch (activeFilter) {
      case 'unread':
        filtered = filtered.filter(notif => !notif.read);
        break;
      case 'important':
        filtered = filtered.filter(notif => notif.important);
        break;
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchQuery, activeFilter]);

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

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement': return <Award className="h-4 w-4 text-yellow-600" />;
      case 'reminder': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'recommendation': return <Sparkles className="h-4 w-4 text-purple-600" />;
      case 'update': return <Info className="h-4 w-4 text-green-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: Notification['category']) => {
    switch (category) {
      case 'wellness': return <Heart className="h-4 w-4" />;
      case 'achievement': return <Award className="h-4 w-4" />;
      case 'social': return <Bell className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Hier';
    return `Il y a ${diffInDays} jours`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const importantCount = notifications.filter(n => n.important && !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BellRing className="h-6 w-6" />
            Notifications
          </h2>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} notifications non lues` : 'Toutes les notifications sont lues'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Préférences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Filtres et recherche */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher dans les notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={activeFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('all')}
                  >
                    Toutes ({notifications.length})
                  </Button>
                  <Button
                    variant={activeFilter === 'unread' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('unread')}
                  >
                    Non lues ({unreadCount})
                  </Button>
                  <Button
                    variant={activeFilter === 'important' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('important')}
                  >
                    Importantes ({importantCount})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des notifications */}
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              <AnimatePresence>
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-background'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </h4>
                              {notification.important && (
                                <Badge variant="destructive" className="text-xs">
                                  Important
                                </Badge>
                              )}
                              {!notification.read && (
                                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            <p className={`text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                {getCategoryIcon(notification.category)}
                                <span className="capitalize">{notification.category}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {notification.actionable && notification.metadata?.actionUrl && (
                          <div className="mt-3">
                            <Button variant="outline" size="sm">
                              {notification.metadata.actionType === 'start_session' && 'Démarrer'}
                              {notification.metadata.actionType === 'view_progress' && 'Voir les progrès'}
                              {notification.metadata.actionType === 'update_settings' && 'Paramètres'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredNotifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Aucune notification
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || activeFilter !== 'all' 
                      ? 'Aucune notification ne correspond à vos critères'
                      : 'Vous êtes à jour avec toutes vos notifications'
                    }
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Configurez quand et comment vous souhaitez recevoir des notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Types de notifications */}
              <div className="space-y-4">
                <h4 className="font-medium">Types de notifications</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="font-medium">Bien-être</div>
                        <div className="text-sm text-muted-foreground">Rappels et recommandations de santé</div>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.wellness}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, wellness: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="font-medium">Réussites</div>
                        <div className="text-sm text-muted-foreground">Badges et jalons atteints</div>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.achievements}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, achievements: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">Rappels</div>
                        <div className="text-sm text-muted-foreground">Sessions programmées et habitudes</div>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.reminders}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, reminders: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium">Système</div>
                        <div className="text-sm text-muted-foreground">Mises à jour et maintenance</div>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.system}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, system: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Méthodes de livraison */}
              <div className="space-y-4">
                <h4 className="font-medium">Méthodes de livraison</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {preferences.sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      <div>
                        <div className="font-medium">Son</div>
                        <div className="text-sm text-muted-foreground">Notifications sonores</div>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.sound}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, sound: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Push</div>
                        <div className="text-sm text-muted-foreground">Notifications push du navigateur</div>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.push}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, push: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Heures de silence */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Heures de silence</h4>
                    <p className="text-sm text-muted-foreground">Suspendre les notifications non urgentes</p>
                  </div>
                  <Switch
                    checked={preferences.quiet_hours.enabled}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ 
                        ...prev, 
                        quiet_hours: { ...prev.quiet_hours, enabled: checked }
                      }))
                    }
                  />
                </div>
                
                {preferences.quiet_hours.enabled && (
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Début</label>
                      <Input
                        type="time"
                        value={preferences.quiet_hours.start}
                        onChange={(e) => 
                          setPreferences(prev => ({ 
                            ...prev, 
                            quiet_hours: { ...prev.quiet_hours, start: e.target.value }
                          }))
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">Fin</label>
                      <Input
                        type="time"
                        value={preferences.quiet_hours.end}
                        onChange={(e) => 
                          setPreferences(prev => ({ 
                            ...prev, 
                            quiet_hours: { ...prev.quiet_hours, end: e.target.value }
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartNotificationCenter; // Fixed export