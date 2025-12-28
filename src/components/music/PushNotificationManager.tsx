/**
 * Push Notification Manager - Gestion complète des notifications
 * Demande permission, gestion des préférences, notifications programmées
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Bell,
  BellOff,
  BellRing,
  Clock,
  Music,
  Heart,
  Sparkles,
  Volume2,
  Settings,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMusicSettings } from '@/hooks/music/useMusicSettings';
import { logger } from '@/lib/logger';

interface NotificationPreferences {
  enabled: boolean;
  permission: NotificationPermission | 'default';
  categories: {
    newMusic: boolean;
    recommendations: boolean;
    reminders: boolean;
    achievements: boolean;
    weeklyDigest: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  sound: boolean;
  vibration: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: false,
  permission: 'default',
  categories: {
    newMusic: true,
    recommendations: true,
    reminders: false,
    achievements: true,
    weeklyDigest: true,
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  sound: true,
  vibration: true,
};

interface PushNotificationManagerProps {
  onNotificationSent?: (notification: { title: string; body: string }) => void;
}

export const PushNotificationManager: React.FC<PushNotificationManagerProps> = ({
  onNotificationSent,
}) => {
  const { toast } = useToast();
  const { value: savedPrefs, setValue: setSavedPrefs } = useMusicSettings<NotificationPreferences>({
    key: 'music:push-notifications' as any,
    defaultValue: DEFAULT_PREFERENCES,
  });

  const [preferences, setPreferences] = useState<NotificationPreferences>(savedPrefs || DEFAULT_PREFERENCES);
  const [isSupported, setIsSupported] = useState(false);
  const [testSent, setTestSent] = useState(false);

  // Check browser support
  useEffect(() => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);

    if (supported) {
      setPreferences((prev) => ({
        ...prev,
        permission: Notification.permission,
        enabled: Notification.permission === 'granted',
      }));
    }
  }, []);

  // Sync with saved preferences
  useEffect(() => {
    if (savedPrefs) {
      setPreferences(savedPrefs);
    }
  }, [savedPrefs]);

  // Request permission
  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: '❌ Non supporté',
        description: 'Votre navigateur ne supporte pas les notifications',
        variant: 'destructive',
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      const newPrefs = {
        ...preferences,
        permission,
        enabled: permission === 'granted',
      };
      setPreferences(newPrefs);
      setSavedPrefs(newPrefs);

      if (permission === 'granted') {
        toast({
          title: '🔔 Notifications activées',
          description: 'Vous recevrez des notifications de musique',
        });
        // Send welcome notification
        sendNotification('Bienvenue !', 'Les notifications musicales sont maintenant activées.');
      } else if (permission === 'denied') {
        toast({
          title: '🔕 Notifications bloquées',
          description: 'Activez-les dans les paramètres du navigateur',
          variant: 'destructive',
        });
      }
    } catch (error) {
      logger.error('[PushNotifications] Permission request failed', error as Error, 'MUSIC');
      toast({
        title: 'Erreur',
        description: 'Impossible de demander la permission',
        variant: 'destructive',
      });
    }
  };

  // Send notification
  const sendNotification = useCallback(
    (title: string, body: string, options?: NotificationOptions) => {
      if (!isSupported || preferences.permission !== 'granted') return;

      // Check quiet hours
      if (preferences.quietHours.enabled) {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const { start, end } = preferences.quietHours;

        if (start < end) {
          if (currentTime >= start && currentTime < end) return;
        } else {
          if (currentTime >= start || currentTime < end) return;
        }
      }

      try {
        const notificationOptions: NotificationOptions = {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          silent: !preferences.sound,
          ...options,
        };

        const notification = new Notification(title, notificationOptions);

        // Handle vibration separately if supported
        if (preferences.vibration && 'vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        onNotificationSent?.({ title, body });
        logger.info('[PushNotifications] Notification sent', { title }, 'MUSIC');
      } catch (error) {
        logger.error('[PushNotifications] Failed to send', error as Error, 'MUSIC');
      }
    },
    [isSupported, preferences, onNotificationSent]
  );

  // Update preference
  const updatePreference = <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    setSavedPrefs(newPrefs);
  };

  // Update category
  const updateCategory = (category: keyof NotificationPreferences['categories'], value: boolean) => {
    const newCategories = { ...preferences.categories, [category]: value };
    updatePreference('categories', newCategories);
  };

  // Update quiet hours
  const updateQuietHours = (field: keyof NotificationPreferences['quietHours'], value: any) => {
    const newQuietHours = { ...preferences.quietHours, [field]: value };
    updatePreference('quietHours', newQuietHours);
  };

  // Test notification
  const sendTestNotification = () => {
    sendNotification('🎵 Test de notification', 'Les notifications fonctionnent correctement !');
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
    toast({ title: '✅ Notification test envoyée' });
  };

  const CATEGORIES = [
    { key: 'newMusic' as const, label: 'Nouvelle musique', icon: Music, desc: 'Quand de nouveaux morceaux sont générés' },
    { key: 'recommendations' as const, label: 'Recommandations', icon: Sparkles, desc: 'Suggestions personnalisées' },
    { key: 'reminders' as const, label: 'Rappels', icon: Clock, desc: 'Rappels de session musicale' },
    { key: 'achievements' as const, label: 'Accomplissements', icon: Heart, desc: 'Badges et récompenses débloqués' },
    { key: 'weeklyDigest' as const, label: 'Résumé hebdo', icon: Bell, desc: 'Votre semaine musicale' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications Push
          </div>
          <Badge
            variant={preferences.permission === 'granted' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {preferences.permission === 'granted'
              ? 'Activées'
              : preferences.permission === 'denied'
              ? 'Bloquées'
              : 'Non configurées'}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Browser support warning */}
        {!isSupported && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-xs text-destructive">
              Votre navigateur ne supporte pas les notifications push.
            </p>
          </div>
        )}

        {/* Permission Request */}
        {isSupported && preferences.permission !== 'granted' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-primary/10 border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellRing className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Activer les notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Restez informé de votre musique
                  </p>
                </div>
              </div>
              <Button onClick={requestPermission} size="sm" className="gap-1">
                <Bell className="h-4 w-4" />
                Autoriser
              </Button>
            </div>
          </motion.div>
        )}

        {/* Categories */}
        {preferences.permission === 'granted' && (
          <>
            <div className="space-y-3">
              <p className="text-sm font-medium">Catégories de notifications</p>
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.key}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <cat.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{cat.label}</p>
                      <p className="text-xs text-muted-foreground">{cat.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.categories[cat.key]}
                    onCheckedChange={(v) => updateCategory(cat.key, v)}
                    aria-label={`Activer les notifications ${cat.label}`}
                  />
                </div>
              ))}
            </div>

            {/* Quiet Hours */}
            <div className="space-y-3 p-3 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Heures silencieuses</span>
                </div>
                <Switch
                  checked={preferences.quietHours.enabled}
                  onCheckedChange={(v) => updateQuietHours('enabled', v)}
                />
              </div>
              <AnimatePresence>
                {preferences.quietHours.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="time"
                      value={preferences.quietHours.start}
                      onChange={(e) => updateQuietHours('start', e.target.value)}
                      className="px-2 py-1 rounded border bg-background text-xs"
                    />
                    <span className="text-muted-foreground">à</span>
                    <input
                      type="time"
                      value={preferences.quietHours.end}
                      onChange={(e) => updateQuietHours('end', e.target.value)}
                      className="px-2 py-1 rounded border bg-background text-xs"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sound & Vibration */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Son</span>
                <Switch
                  checked={preferences.sound}
                  onCheckedChange={(v) => updatePreference('sound', v)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Vibration</span>
                <Switch
                  checked={preferences.vibration}
                  onCheckedChange={(v) => updatePreference('vibration', v)}
                />
              </div>
            </div>

            {/* Test Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={sendTestNotification}
              disabled={testSent}
              className="w-full gap-2"
            >
              {testSent ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Envoyée !
                </>
              ) : (
                <>
                  <BellRing className="h-4 w-4" />
                  Tester les notifications
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PushNotificationManager;
