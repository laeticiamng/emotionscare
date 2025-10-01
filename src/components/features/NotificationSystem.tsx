// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  Heart, 
  Calendar,
  MessageCircle,
  Target,
  Sparkles,
  Clock,
  User,
  Settings,
  CheckCircle,
  Filter
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'insight' | 'social' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
  metadata?: {
    sessionId?: string;
    userId?: string;
    category?: string;
  };
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'reminder',
      title: 'Session de méditation',
      message: 'Il est temps de prendre votre pause bien-être quotidienne.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      priority: 'high',
      actionRequired: true
    },
    {
      id: '2',
      type: 'achievement',
      title: 'Nouveau badge débloqué!',
      message: 'Félicitations! Vous avez débloqué "Constance Hebdomadaire" pour 7 jours consécutifs.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'insight',
      title: 'Analyse IA disponible',
      message: 'Votre rapport hebdomadaire d\'émotions est prêt. Découvrez vos patterns.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'social',
      title: 'Nouveau message de votre coach',
      message: 'Nyvée a partagé de nouveaux conseils personnalisés basés sur vos progrès.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false,
      priority: 'low'
    },
    {
      id: '5',
      type: 'system',
      title: 'Mise à jour disponible',
      message: 'Une nouvelle version d\'EmotionsCare est disponible avec de nouvelles fonctionnalités.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      priority: 'low'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'priority'>('all');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const notificationTypes = {
    reminder: { label: 'Rappels', icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-100' },
    achievement: { label: 'Succès', icon: Sparkles, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    insight: { label: 'Insights', icon: Heart, color: 'text-red-500', bgColor: 'bg-red-100' },
    social: { label: 'Social', icon: MessageCircle, color: 'text-green-500', bgColor: 'bg-green-100' },
    system: { label: 'Système', icon: Settings, color: 'text-gray-500', bgColor: 'bg-gray-100' }
  };

  const priorityColors = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-yellow-500 bg-yellow-50',
    low: 'border-l-gray-500 bg-gray-50'
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

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread' && notif.read) return false;
    if (filter === 'priority' && notif.priority === 'low') return false;
    if (selectedType && notif.type !== selectedType) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays}j`;
  };

  const getNotificationIcon = (type: string) => {
    return notificationTypes[type as keyof typeof notificationTypes]?.icon || Bell;
  };

  // Simulation de nouvelles notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Ajout aléatoire de nouvelles notifications pour démo
      if (Math.random() < 0.3 && notifications.length < 10) {
        const types = Object.keys(notificationTypes);
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: randomType as any,
          title: `Nouvelle notification ${randomType}`,
          message: 'Ceci est une notification de démonstration générée automatiquement.',
          timestamp: new Date(),
          read: false,
          priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
        };

        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 30000); // Nouvelle notification toutes les 30s pour la démo

    return () => clearInterval(interval);
  }, [notifications.length]);

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <Card className="border-primary/20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-8 w-8 text-primary" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">Centre de Notifications</CardTitle>
                <p className="text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} nouvelle(s) notification(s)` : 'Toutes les notifications sont lues'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} variant="outline" size="sm" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Tout marquer comme lu
                </Button>
              )}
              
              {highPriorityCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {highPriorityCount} priorité haute
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Toutes ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Non lues ({unreadCount})
              </Button>
              <Button
                variant={filter === 'priority' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('priority')}
              >
                Prioritaires
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {Object.entries(notificationTypes).map(([key, config]) => (
                  <Button
                    key={key}
                    variant={selectedType === key ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedType(selectedType === key ? null : key)}
                    className="gap-1"
                  >
                    <config.icon className="h-3 w-3" />
                    {config.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des notifications */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredNotifications.map((notification, index) => {
            const NotificationIcon = getNotificationIcon(notification.type);
            const typeConfig = notificationTypes[notification.type as keyof typeof notificationTypes];
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <Card 
                  className={`border-l-4 transition-all duration-200 hover:shadow-md ${
                    priorityColors[notification.priority]
                  } ${
                    !notification.read ? 'shadow-sm' : 'opacity-75'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${typeConfig?.bgColor || 'bg-gray-100'}`}>
                        <NotificationIcon className={`h-5 w-5 ${typeConfig?.color || 'text-gray-500'}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="h-2 w-2 bg-primary rounded-full" />
                              )}
                              {notification.actionRequired && (
                                <Badge variant="destructive" className="text-xs">Action requise</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{getTimeAgo(notification.timestamp)}</span>
                              <Badge variant="outline" className="text-xs capitalize">
                                {typeConfig?.label || notification.type}
                              </Badge>
                              <Badge 
                                variant={notification.priority === 'high' ? 'destructive' : 'secondary'} 
                                className="text-xs"
                              >
                                {notification.priority === 'high' ? 'Haute' : 
                                 notification.priority === 'medium' ? 'Moyenne' : 'Basse'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {notification.actionRequired && (
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" className="gap-2">
                              <Target className="h-3 w-3" />
                              Démarrer la session
                            </Button>
                            <Button size="sm" variant="outline">
                              Plus tard
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredNotifications.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-semibold mb-2">Aucune notification</h3>
              <p className="text-muted-foreground">
                {filter === 'unread' 
                  ? 'Toutes vos notifications sont lues' 
                  : 'Vous n\'avez aucune notification correspondant aux filtres sélectionnés'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NotificationSystem;