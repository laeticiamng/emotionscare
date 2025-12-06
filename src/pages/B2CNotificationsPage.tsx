// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, Clock, Mail, Smartphone, Volume2 } from 'lucide-react';
import { LoadingState, ErrorState, useLoadingStates } from '@/components/ui/LoadingStates';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { toast } from 'sonner';

const B2CNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Session de méditation recommandée', time: '2h', type: 'recommendation', read: false },
    { id: 2, title: 'Votre score de bien-être s\'améliore !', time: '4h', type: 'achievement', read: false },
    { id: 3, title: 'Rappel: Scan émotionnel quotidien', time: '1j', type: 'reminder', read: true },
    { id: 4, title: 'Nouvelle fonctionnalité disponible: Flash Glow', time: '2j', type: 'feature', read: true },
    { id: 5, title: 'Résumé hebdomadaire de votre progression', time: '3j', type: 'summary', read: true }
  ]);

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

  const { loadingState } = usePageMetadata();

  if (loadingState === 'loading') return <LoadingState type="list" count={3} />;
  if (loadingState === 'error') return <ErrorState error="Erreur de chargement" />;

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Paramètre mis à jour');
  };

  const markAsRead = (id: number) => {
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
    toast.success('Toutes les notifications ont été marquées comme lues');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return '💡';
      case 'achievement': return '🏆';
      case 'reminder': return '⏰';
      case 'feature': return '✨';
      case 'summary': return '📊';
      default: return '📬';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'recommendation': return 'bg-blue-500';
      case 'achievement': return 'bg-yellow-500';
      case 'reminder': return 'bg-green-500';
      case 'feature': return 'bg-purple-500';
      case 'summary': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div data-testid="page-root" className="space-y-6">
      <Breadcrumbs />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-blue-500" />
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
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des notifications */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                    !notification.read ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${getNotificationColor(notification.type)} ${!notification.read ? '' : 'opacity-50'}`}></div>
                  </div>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        il y a {notification.time}
                      </div>
                    </div>
                  </div>
                  {!notification.read && (
                    <Badge variant="default" className="text-xs">
                      Nouveau
                    </Badge>
                  )}
                </div>
              ))}
            </div>
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