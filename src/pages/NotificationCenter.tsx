import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellOff, 
  Check, 
  CheckCheck, 
  Trash2, 
  Settings, 
  Filter,
  Mail,
  Smartphone,
  Monitor,
  Clock
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Centre de notifications complet
 * Point 9: Notifications System - Centre de notifications
 */
const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    preferences,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updatePreferences,
    requestPermission,
    hasPermission,
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filtrer les notifications
  const filteredNotifications = notifications.filter((notif) => {
    const matchesReadStatus = 
      filter === 'all' || 
      (filter === 'unread' && !notif.read) || 
      (filter === 'read' && notif.read);
    
    const matchesCategory = 
      categoryFilter === 'all' || notif.category === categoryFilter;

    return matchesReadStatus && matchesCategory;
  });

  // Obtenir les catégories disponibles
  const categories = Array.from(new Set(notifications.map(notif => notif.category)));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system': return '⚙️';
      case 'scan': return '🧠';
      case 'journal': return '📖';
      case 'coach': return '🤖';
      case 'music': return '🎵';
      case 'vr': return '🥽';
      case 'gamification': return '🏆';
      case 'insights': return '💡';
      case 'community': return '👥';
      default: return '📢';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true, 
      locale: fr 
    });
  };

  const getDeliveryMethodIcon = (method: string) => {
    switch (method) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'push': return <Smartphone className="h-4 w-4" />;
      case 'in_app': return <Monitor className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="h-8 w-8" />
            Centre de notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-sm">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Gérez vos notifications et préférences
          </p>
        </div>

        <div className="flex gap-2">
          {!hasPermission && (
            <Button onClick={requestPermission} variant="outline">
              <Smartphone className="h-4 w-4 mr-2" />
              Activer les notifications push
            </Button>
          )}
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <CheckCheck className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
        </TabsList>

        {/* Onglet Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filtres:</span>
                </div>
                
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="unread">Non lues</SelectItem>
                    <SelectItem value="read">Lues</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {getCategoryIcon(category)} {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="text-sm text-muted-foreground">
                  {filteredNotifications.length} notification(s)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications récentes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {isLoading ? (
                  <div className="p-6 text-center text-muted-foreground">
                    Chargement des notifications...
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <BellOff className="h-12 w-12 mx-auto mb-4" />
                    <p>Aucune notification à afficher</p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {filteredNotifications.map((notif, index) => (
                      <div key={notif.id}>
                        <div 
                          className={`p-4 hover:bg-muted/50 transition-colors ${
                            !notif.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              {/* Icône de catégorie */}
                              <div className="text-2xl">
                                {getCategoryIcon(notif.category)}
                              </div>

                              <div className="flex-1 space-y-2">
                                {/* Titre et priorité */}
                                <div className="flex items-center gap-2">
                                  <h3 className={`font-medium ${!notif.read ? 'font-semibold' : ''}`}>
                                    {notif.title}
                                  </h3>
                                  <span className="text-sm">
                                    {getPriorityIcon(notif.priority)}
                                  </span>
                                  <Badge 
                                    variant={getPriorityColor(notif.priority) as any}
                                    className="text-xs"
                                  >
                                    {notif.priority}
                                  </Badge>
                                  {!notif.read && (
                                    <div className="h-2 w-2 bg-primary rounded-full" />
                                  )}
                                </div>

                                {/* Message */}
                                <p className="text-sm text-muted-foreground">
                                  {notif.message}
                                </p>

                                {/* Métadonnées */}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTimeAgo(notif.created_at)}
                                  </span>
                                  
                                  <span className="capitalize">
                                    {notif.category}
                                  </span>

                                  {notif.delivery_method && (
                                    <div className="flex items-center gap-1">
                                      {notif.delivery_method.map((method) => (
                                        <span key={method} title={method}>
                                          {getDeliveryMethodIcon(method)}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Actions */}
                                {notif.action_text && notif.action_link && (
                                  <Button 
                                    variant="link" 
                                    size="sm" 
                                    className="p-0 h-auto"
                                    onClick={() => window.location.href = notif.action_link!}
                                  >
                                    {notif.action_text}
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Actions de notification */}
                            <div className="flex items-center gap-2">
                              {!notif.read && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => markAsRead([notif.id])}
                                  title="Marquer comme lu"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteNotification(notif.id)}
                                title="Supprimer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {index < filteredNotifications.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Préférences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Préférences de notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notifications push */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span className="font-medium">Notifications push</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications push sur cet appareil
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {hasPermission ? (
                    <Badge variant="default">Activées</Badge>
                  ) : (
                    <Button onClick={requestPermission} size="sm">
                      Activer
                    </Button>
                  )}
                </div>
              </div>

              {/* Préférences par catégorie */}
              <div className="space-y-4">
                <h3 className="font-medium">Préférences par catégorie</h3>
                
                {categories.map((category) => {
                  const pref = preferences.find((p) => p.category === category) || {
                    category,
                    delivery_methods: ['in_app'],
                    enabled: true,
                    frequency: 'immediate' as const,
                  };

                  return (
                    <div key={category} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getCategoryIcon(category)}</span>
                          <span className="font-medium capitalize">{category}</span>
                        </div>
                        <Switch
                          checked={pref.enabled}
                          onCheckedChange={(enabled) => 
                            updatePreferences(category, { ...pref, enabled })
                          }
                        />
                      </div>

                      {pref.enabled && (
                        <>
                          <div className="space-y-2">
                            <span className="text-sm font-medium">Méthodes de livraison:</span>
                            <div className="flex gap-2">
                              {['in_app', 'push', 'email'].map((method) => (
                                <Button
                                  key={method}
                                  size="sm"
                                  variant={
                                    pref.delivery_methods.includes(method) 
                                      ? 'default' 
                                      : 'outline'
                                  }
                                  onClick={() => {
                                    const methods = pref.delivery_methods.includes(method)
                                      ? pref.delivery_methods.filter(m => m !== method)
                                      : [...pref.delivery_methods, method];
                                    updatePreferences(category, { ...pref, delivery_methods: methods });
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  {getDeliveryMethodIcon(method)}
                                  <span className="capitalize">{method.replace('_', ' ')}</span>
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-sm font-medium">Fréquence:</span>
                            <Select
                              value={pref.frequency}
                              onValueChange={(frequency: any) =>
                                updatePreferences(category, { ...pref, frequency })
                              }
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="immediate">Immédiate</SelectItem>
                                <SelectItem value="daily">Quotidienne</SelectItem>
                                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenter;