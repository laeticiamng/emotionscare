// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Clock, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface NotificationSettings {
  enabled: boolean;
  dailyReminders: boolean;
  emotionalCheckins: boolean;
  coachSuggestions: boolean;
  communityUpdates: boolean;
  timeSlot: string;
}

const PWANotifications: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    dailyReminders: true,
    emotionalCheckins: true,
    coachSuggestions: true,
    communityUpdates: false,
    timeSlot: '09:00'
  });

  useEffect(() => {
    // Vérifier le support des notifications
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Charger les préférences depuis localStorage
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Non supporté",
        description: "Les notifications ne sont pas supportées sur cet appareil.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setSettings(prev => ({ ...prev, enabled: true }));
        
        // Envoyer une notification de test
        new Notification('EmotionsCare', {
          body: 'Les notifications sont maintenant activées !',
          icon: '/icon-192.png',
          tag: 'welcome'
        });
        
        toast({
          title: "Notifications activées",
          description: "Vous recevrez des rappels personnalisés.",
        });
        
        // Programmer les notifications
        scheduleNotifications();
      } else {
        toast({
          title: "Permission refusée",
          description: "Vous pouvez activer les notifications dans les paramètres de votre navigateur.",
          variant: "destructive"
        });
      }
    } catch (error) {
      logger.error('Erreur permission notifications', error as Error, 'SYSTEM');
    }
  };

  const scheduleNotifications = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        
        // Programmer une notification quotidienne
        if (settings.dailyReminders) {
          const now = new Date();
          const [hours, minutes] = settings.timeSlot.split(':');
          const scheduledTime = new Date();
          scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
          }
          
          const delay = scheduledTime.getTime() - now.getTime();
          
          setTimeout(() => {
            new Notification('EmotionsCare - Check-in quotidien', {
              body: 'Comment vous sentez-vous aujourd\'hui ? Prenez un moment pour vous.',
              icon: '/icon-192.png',
              tag: 'daily-checkin',
              actions: [
                { action: 'checkin', title: 'Faire le check-in' },
                { action: 'later', title: 'Plus tard' }
              ]
            });
          }, delay);
        }
      } catch (error) {
        logger.error('Erreur programmation notifications', error as Error, 'SYSTEM');
      }
    }
  };

  const updateSettings = (key: keyof NotificationSettings, value: boolean | string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notification-settings', JSON.stringify(newSettings));
    
    if (permission === 'granted' && newSettings.enabled) {
      scheduleNotifications();
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('EmotionsCare - Test', {
        body: 'Ceci est une notification de test. Tout fonctionne parfaitement !',
        icon: '/icon-192.png',
        tag: 'test'
      });
      
      toast({
        title: "Notification envoyée",
        description: "Vérifiez votre barre de notifications.",
      });
    }
  };

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge className="bg-green-500">Activées</Badge>;
      case 'denied':
        return <Badge variant="destructive">Refusées</Badge>;
      default:
        return <Badge variant="secondary">En attente</Badge>;
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Notifications non supportées</h3>
          <p className="text-muted-foreground">
            Votre navigateur ne supporte pas les notifications push.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications Push
            </div>
            {getPermissionBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {permission !== 'granted' ? (
            <div className="text-center p-6 border rounded-lg">
              <Bell className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Activez les notifications</h3>
              <p className="text-muted-foreground mb-4">
                Recevez des rappels personnalisés pour votre bien-être émotionnel.
              </p>
              <Button onClick={requestPermission} className="w-full">
                Activer les notifications
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications-enabled">Notifications actives</Label>
                <Switch
                  id="notifications-enabled"
                  checked={settings.enabled}
                  onCheckedChange={(checked) => updateSettings('enabled', checked)}
                />
              </div>

              {settings.enabled && (
                <div className="space-y-4 pl-4 border-l-2 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="daily-reminders">Rappels quotidiens</Label>
                    </div>
                    <Switch
                      id="daily-reminders"
                      checked={settings.dailyReminders}
                      onCheckedChange={(checked) => updateSettings('dailyReminders', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <Label htmlFor="emotional-checkins">Check-ins émotionnels</Label>
                    </div>
                    <Switch
                      id="emotional-checkins"
                      checked={settings.emotionalCheckins}
                      onCheckedChange={(checked) => updateSettings('emotionalCheckins', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <Label htmlFor="coach-suggestions">Suggestions du coach</Label>
                    </div>
                    <Switch
                      id="coach-suggestions"
                      checked={settings.coachSuggestions}
                      onCheckedChange={(checked) => updateSettings('coachSuggestions', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-purple-500" />
                      <Label htmlFor="community-updates">Mises à jour communauté</Label>
                    </div>
                    <Switch
                      id="community-updates"
                      checked={settings.communityUpdates}
                      onCheckedChange={(checked) => updateSettings('communityUpdates', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time-slot">Heure des rappels quotidiens</Label>
                    <input
                      type="time"
                      id="time-slot"
                      value={settings.timeSlot}
                      onChange={(e) => updateSettings('timeSlot', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <Button
                    variant="outline"
                    onClick={sendTestNotification}
                    className="w-full"
                  >
                    Envoyer une notification de test
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PWANotifications;
