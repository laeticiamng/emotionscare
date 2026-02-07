import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Bell, Settings, Clock, Mail, Smartphone, Volume2, 
  Trash2, Check, Pin, Filter, RefreshCw, BellOff, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { useNotifications } from '@/modules/notifications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const B2CNotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    stats,
    loading,
    markAsRead,
    markAllAsRead,
    togglePin,
    deleteNotification,
    deleteAllRead,
    refresh,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'pinned'>('all');
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    reminderNotifications: true,
    achievementNotifications: true,
    marketingNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true
  });

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Paramètre mis à jour');
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    toast.success('Toutes les notifications ont été marquées comme lues');
  };

  const handleDeleteAllRead = async () => {
    await deleteAllRead();
    toast.success('Notifications lues supprimées');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
      case 'badge_unlocked': return '🏆';
      case 'reminder': return '⏰';
      case 'update': return '✨';
      case 'social':
      case 'community': return '👥';
      case 'therapeutic': return '💚';
      case 'challenge': return '🎯';
      case 'goal': return '🎖️';
      case 'badge_progress': return '📈';
      default: return '📬';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-destructive bg-destructive/5';
      case 'high': return 'border-l-orange-500 bg-orange-500/5';
      case 'medium': return 'border-l-primary bg-primary/5';
      default: return 'border-l-muted';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'pinned') return n.pinned;
    return true;
  });

  const isSnoozed = (notif: typeof notifications[0]) => 
    notif.snoozed_until && new Date(notif.snoozed_until) > new Date();

  return (
    <div data-testid="page-root" className="space-y-6">
      <Breadcrumbs />
      
      <div className="mb-2">
        <Link to="/app/home" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Retour à l'accueil">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              Gérez vos alertes et préférences
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {unreadCount} non lues
                </Badge>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
              <Check className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{stats.unread}</div>
              <p className="text-sm text-muted-foreground">Non lues</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">{stats.todayCount}</div>
              <p className="text-sm text-muted-foreground">Aujourd'hui</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-500">
                {notifications.filter(n => n.pinned).length}
              </div>
              <p className="text-sm text-muted-foreground">Épinglées</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des notifications */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDeleteAllRead}
                className="text-muted-foreground"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer les lues
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  Toutes ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread">
                  Non lues ({unreadCount})
                </TabsTrigger>
                <TabsTrigger value="pinned">
                  Épinglées ({notifications.filter(n => n.pinned).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <BellOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucune notification</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    <div className="space-y-3">
                      {filteredNotifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 100 }}
                          className={cn(
                            "flex items-start gap-4 p-4 rounded-lg border-l-4 cursor-pointer transition-colors hover:bg-muted/50",
                            !notification.read && "bg-accent/10 ring-1 ring-primary/20",
                            notification.pinned && "border-l-amber-500",
                            !notification.pinned && getPriorityColor(notification.priority),
                            isSnoozed(notification) && "opacity-60"
                          )}
                          onClick={() => !notification.read && markAsRead(notification.id)}
                        >
                          <div className="flex-shrink-0 text-xl">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn(
                                "font-medium",
                                notification.read && "text-muted-foreground"
                              )}>
                                {notification.title}
                              </span>
                              {!notification.read && (
                                <span className="w-2 h-2 rounded-full bg-primary" />
                              )}
                              {notification.pinned && (
                                <Pin className="h-3 w-3 text-amber-500" />
                              )}
                            </div>
                            
                            {notification.message && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {notification.message}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                                locale: fr,
                              })}
                              <Badge variant="outline" className="text-xs">
                                {notification.type}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePin(notification.id, !notification.pinned);
                              }}
                            >
                              <Pin className={cn(
                                "h-4 w-4",
                                notification.pinned && "fill-amber-500 text-amber-500"
                              )} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Paramètres de notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Canaux de notification */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Canaux de notification</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="push" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Notifications push
                </Label>
                <Switch
                  id="push"
                  checked={settings.pushNotifications}
                  onCheckedChange={() => handleSettingChange('pushNotifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Notifications email
                </Label>
                <Switch
                  id="email"
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleSettingChange('emailNotifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sms" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Notifications SMS
                </Label>
                <Switch
                  id="sms"
                  checked={settings.smsNotifications}
                  onCheckedChange={() => handleSettingChange('smsNotifications')}
                />
              </div>
            </div>

            {/* Types de notifications */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Types de notifications</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="reminders">
                  Rappels quotidiens
                </Label>
                <Switch
                  id="reminders"
                  checked={settings.reminderNotifications}
                  onCheckedChange={() => handleSettingChange('reminderNotifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="achievements">
                  Accomplissements
                </Label>
                <Switch
                  id="achievements"
                  checked={settings.achievementNotifications}
                  onCheckedChange={() => handleSettingChange('achievementNotifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="marketing">
                  Marketing & Promotions
                </Label>
                <Switch
                  id="marketing"
                  checked={settings.marketingNotifications}
                  onCheckedChange={() => handleSettingChange('marketingNotifications')}
                />
              </div>
            </div>

            {/* Options supplémentaires */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Options</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sound" className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Son activé
                </Label>
                <Switch
                  id="sound"
                  checked={settings.soundEnabled}
                  onCheckedChange={() => handleSettingChange('soundEnabled')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="vibration">
                  Vibration activée
                </Label>
                <Switch
                  id="vibration"
                  checked={settings.vibrationEnabled}
                  onCheckedChange={() => handleSettingChange('vibrationEnabled')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aperçu des notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="font-semibold mb-2">Aperçu des notifications</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Voici comment vos notifications apparaîtront sur vos appareils
            </p>
            <div className="bg-muted p-4 rounded-lg max-w-sm mx-auto text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bell className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-sm">EmotionsCare</div>
                  <div className="text-sm">Il est temps de faire votre scan quotidien !</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CNotificationsPage;