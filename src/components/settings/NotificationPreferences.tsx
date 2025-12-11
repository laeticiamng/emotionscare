// @ts-nocheck

import React, { useState, useMemo } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, BellOff, Clock, Zap, Moon, Volume2, VolumeX, Send, Settings2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface NotificationSetting {
  label: string;
  key: string;
  description?: string;
  category: 'essential' | 'social' | 'activity' | 'marketing';
}

interface NotificationsPreferencesProps {
  notifications: {
    system?: boolean;
    emotion?: boolean;
    badge?: boolean;
    challenge?: boolean;
    message?: boolean;
    update?: boolean;
    mention?: boolean;
    team?: boolean;
    report?: boolean;
    reminder?: boolean;
    activity?: boolean;
    comment?: boolean;
    reaction?: boolean;
    friend?: boolean;
    coach?: boolean;
    community?: boolean;
    achievement?: boolean;
  };
  onChange: (key: string, value: boolean) => void;
}

const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  { label: 'Système', key: 'system', description: 'Informations importantes et mises à jour', category: 'essential' },
  { label: 'Émotions', key: 'emotion', description: 'Rapports et analyses émotionnelles', category: 'essential' },
  { label: 'Badges', key: 'badge', description: 'Quand vous gagnez de nouveaux badges', category: 'activity' },
  { label: 'Récompenses', key: 'achievement', description: 'Nouveaux objectifs atteints', category: 'activity' },
  { label: 'Défis', key: 'challenge', description: 'Nouveau défis disponibles', category: 'activity' },
  { label: 'Messages', key: 'message', description: 'Messages privés reçus', category: 'social' },
  { label: 'Mises à jour', key: 'update', description: 'Nouvelles fonctionnalités', category: 'marketing' },
  { label: 'Mentions', key: 'mention', description: 'Quand quelqu\'un vous mentionne', category: 'social' },
  { label: 'Équipe', key: 'team', description: 'Activités de votre équipe', category: 'social' },
  { label: 'Rapports', key: 'report', description: 'Rapports hebdomadaires', category: 'essential' },
  { label: 'Rappels', key: 'reminder', description: 'Rappels quotidiens', category: 'essential' },
  { label: 'Activités', key: 'activity', description: 'Résumés de vos activités', category: 'activity' },
  { label: 'Commentaires', key: 'comment', description: 'Réponses à vos publications', category: 'social' },
  { label: 'Réactions', key: 'reaction', description: 'Likes et réactions', category: 'social' },
  { label: 'Amis', key: 'friend', description: 'Demandes d\'amitié', category: 'social' },
  { label: 'Coach', key: 'coach', description: 'Conseils du coach', category: 'essential' },
  { label: 'Communauté', key: 'community', description: 'Événements et groupes', category: 'social' },
];

const PRESETS = [
  { id: 'all', label: 'Tout activer', icon: Bell, description: 'Toutes les notifications' },
  { id: 'essential', label: 'Essentiel', icon: Zap, description: 'Seulement l\'important' },
  { id: 'quiet', label: 'Mode silencieux', icon: BellOff, description: 'Aucune notification' },
];

const CATEGORY_LABELS = {
  essential: { label: 'Essentiel', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  social: { label: 'Social', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  activity: { label: 'Activité', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
  marketing: { label: 'Marketing', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
};

export const NotificationsPreferences: React.FC<NotificationsPreferencesProps> = ({ 
  notifications, 
  onChange 
}) => {
  const [showQuietHours, setShowQuietHours] = useState(false);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(() => 
    localStorage.getItem('quiet-hours-enabled') === 'true'
  );
  const [quietHours, setQuietHours] = useState(() => {
    const saved = localStorage.getItem('quiet-hours');
    return saved ? JSON.parse(saved) : { start: '22:00', end: '07:00' };
  });
  const [soundEnabled, setSoundEnabled] = useState(() => 
    localStorage.getItem('notification-sound') !== 'false'
  );

  // Group settings by category
  const groupedSettings = useMemo(() => {
    const groups: Record<string, NotificationSetting[]> = {};
    NOTIFICATION_SETTINGS.forEach(setting => {
      if (!groups[setting.category]) groups[setting.category] = [];
      groups[setting.category].push(setting);
    });
    return groups;
  }, []);

  // Count enabled notifications
  const enabledCount = useMemo(() => {
    return Object.values(notifications).filter(Boolean).length;
  }, [notifications]);

  const applyPreset = (presetId: string) => {
    NOTIFICATION_SETTINGS.forEach(setting => {
      if (presetId === 'all') {
        onChange(setting.key, true);
      } else if (presetId === 'quiet') {
        onChange(setting.key, false);
      } else if (presetId === 'essential') {
        onChange(setting.key, setting.category === 'essential');
      }
    });
    toast.success(`Préréglage "${PRESETS.find(p => p.id === presetId)?.label}" appliqué`);
  };

  const handleQuietHoursChange = (field: 'start' | 'end', value: string) => {
    const newHours = { ...quietHours, [field]: value };
    setQuietHours(newHours);
    localStorage.setItem('quiet-hours', JSON.stringify(newHours));
  };

  const toggleQuietHours = (enabled: boolean) => {
    setQuietHoursEnabled(enabled);
    localStorage.setItem('quiet-hours-enabled', String(enabled));
    toast.success(enabled ? 'Heures calmes activées' : 'Heures calmes désactivées');
  };

  const toggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('notification-sound', String(enabled));
    toast.success(enabled ? 'Sons activés' : 'Sons désactivés');
  };

  const sendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Test EmotionsCare', {
        body: 'Ceci est une notification de test ! 🔔',
        icon: '/favicon.ico',
      });
    } else if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Test EmotionsCare', {
            body: 'Notifications activées avec succès ! 🎉',
            icon: '/favicon.ico',
          });
        }
      });
    }
    toast.success('Notification de test envoyée');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Préférences de notifications
              </CardTitle>
              <CardDescription>
                {enabledCount} notification{enabledCount > 1 ? 's' : ''} activée{enabledCount > 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowQuietHours(true)} className="gap-2">
                <Moon className="h-4 w-4" />
                Heures calmes
              </Button>
              <Button variant="outline" size="sm" onClick={sendTestNotification} className="gap-2">
                <Send className="h-4 w-4" />
                Tester
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick presets */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Préréglages rapides</Label>
            <div className="flex gap-2 flex-wrap">
              {PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset.id)}
                  className="gap-2"
                >
                  <preset.icon className="h-4 w-4" />
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Sound toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="h-5 w-5 text-primary" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
              <div>
                <Label>Sons de notification</Label>
                <p className="text-sm text-muted-foreground">Jouer un son pour les nouvelles notifications</p>
              </div>
            </div>
            <Switch checked={soundEnabled} onCheckedChange={toggleSound} />
          </div>

          {/* Quiet hours indicator */}
          {quietHoursEnabled && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Moon className="h-4 w-4 text-indigo-500" />
              <span className="text-sm">
                Heures calmes: <strong>{quietHours.start}</strong> - <strong>{quietHours.end}</strong>
              </span>
            </div>
          )}

          <Separator />

          {/* Notification settings by category */}
          <Tabs defaultValue="essential">
            <TabsList className="grid grid-cols-4">
              {Object.entries(CATEGORY_LABELS).map(([key, { label }]) => (
                <TabsTrigger key={key} value={key} className="text-xs">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(groupedSettings).map(([category, settings]) => (
              <TabsContent key={category} value={category} className="space-y-3 mt-4">
                {settings.map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor={`notification-${setting.key}`} className="font-medium cursor-pointer">
                        {setting.label}
                      </Label>
                      {setting.description && (
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      )}
                    </div>
                    <Switch
                      id={`notification-${setting.key}`}
                      checked={notifications[setting.key as keyof typeof notifications] || false}
                      onCheckedChange={(checked) => onChange(setting.key, checked)}
                    />
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>

          {/* Enable all / Disable all buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => applyPreset('all')}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Tout activer
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => applyPreset('quiet')}
            >
              <BellOff className="h-4 w-4 mr-2" />
              Tout désactiver
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours Dialog */}
      <Dialog open={showQuietHours} onOpenChange={setShowQuietHours}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Heures calmes
            </DialogTitle>
            <DialogDescription>
              Aucune notification pendant ces heures
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Activer les heures calmes</Label>
                <p className="text-sm text-muted-foreground">Suspendre les notifications automatiquement</p>
              </div>
              <Switch checked={quietHoursEnabled} onCheckedChange={toggleQuietHours} />
            </div>

            {quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label>Début</Label>
                  <input
                    type="time"
                    value={quietHours.start}
                    onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fin</Label>
                  <input
                    type="time"
                    value={quietHours.end}
                    onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>
              </div>
            )}

            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                💡 Pendant les heures calmes, les notifications urgentes (sécurité, rappels importants) seront toujours envoyées.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationsPreferences;
