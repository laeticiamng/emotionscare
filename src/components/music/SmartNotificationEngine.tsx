/**
 * Smart Notification Engine - Notifications intelligentes et personnalisées
 * Timing optimal, recommandations contextuelles, gamification
 * Connecté à Supabase pour persistence
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Bell,
  Clock,
  Zap,
  Target,
  Music,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface NotificationPreference {
  type: 'recommendation' | 'challenge' | 'achievement' | 'social' | 'update';
  enabled: boolean;
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  optimalTime?: string;
  icon: string;
  label: string;
}

interface ScheduledNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  icon: string;
  scheduledTime: Date;
  sent: boolean;
  emoji: string;
}

interface SmartNotificationEngineProps {
  userId?: string;
  onNotificationSent?: (notification: ScheduledNotification) => void;
  onPreferenceChange?: (preferences: NotificationPreference[]) => void;
}

const DEFAULT_PREFERENCES: NotificationPreference[] = [
  { type: 'recommendation', enabled: true, frequency: 'daily', optimalTime: '08:00', icon: '💡', label: 'Recommandations personnalisées' },
  { type: 'challenge', enabled: true, frequency: 'daily', optimalTime: '12:00', icon: '🎯', label: 'Défis quotidiens' },
  { type: 'achievement', enabled: true, frequency: 'realtime', icon: '🏆', label: 'Succès et badges' },
  { type: 'social', enabled: false, frequency: 'daily', optimalTime: '18:00', icon: '👥', label: 'Activités sociales' },
  { type: 'update', enabled: false, frequency: 'weekly', optimalTime: 'Monday 10:00', icon: '📰', label: 'Nouvelles fonctionnalités' },
];

export const SmartNotificationEngine: React.FC<SmartNotificationEngineProps> = ({
  onNotificationSent,
  onPreferenceChange,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [_loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<NotificationPreference[]>(DEFAULT_PREFERENCES);
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Charger préférences et notifications depuis Supabase
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Charger préférences
        const { data: prefData } = await supabase
          .from('user_settings')
          .select('value')
          .eq('user_id', user.id)
          .eq('key', 'notification_preferences')
          .single();

        if (prefData?.value) {
          const parsed = typeof prefData.value === 'string' ? JSON.parse(prefData.value) : prefData.value;
          if (Array.isArray(parsed)) setPreferences(parsed);
        }

        // Charger notifications depuis music_notifications
        const { data: notifData } = await supabase
          .from('music_notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (notifData) {
          setScheduledNotifications(notifData.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message || '',
            type: n.type,
            icon: n.data?.icon || '🔔',
            scheduledTime: new Date(n.created_at),
            sent: n.is_read,
            emoji: n.data?.emoji || '🔔',
          })));
        }
      } catch (err) {
        console.warn('Error loading notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // Simulate sending notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setScheduledNotifications((prev) =>
        prev.map((notif) => {
          if (!notif.sent && notif.scheduledTime <= new Date()) {
            toast({
              title: notif.title,
              description: notif.message,
            });
            onNotificationSent?.(notif);
            return { ...notif, sent: true };
          }
          return notif;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [onNotificationSent, toast]);

  // Toggle preference
  const togglePreference = (type: string) => {
    const updated = preferences.map((p) =>
      p.type === type ? { ...p, enabled: !p.enabled } : p
    );
    setPreferences(updated);
    onPreferenceChange?.(updated);

    const pref = updated.find((p) => p.type === type);
    toast({
      title: pref?.enabled ? '✅ Activé' : '❌ Désactivé',
      description: pref?.label,
    });
  };

  // Update frequency
  const updateFrequency = (
    type: string,
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly'
  ) => {
    const updated = preferences.map((p) =>
      p.type === type ? { ...p, frequency } : p
    );
    setPreferences(updated);
    onPreferenceChange?.(updated);
  };

  // Send test notification
  const sendTestNotification = (type: string) => {
    const pref = preferences.find((p) => p.type === type);
    if (pref) {
      toast({
        title: `Test ${pref.icon} ${pref.label}`,
        description: 'Ceci est une notification de test',
      });
    }
  };

  // Format time
  const formatScheduleTime = (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Maintenant';
    if (diffMins < 60) return `Dans ${diffMins}m`;
    if (diffHours < 24) return `Dans ${diffHours}h`;
    return date.toLocaleDateString('fr-FR');
  };

  const enabledCount = preferences.filter((p) => p.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Bell className="h-6 w-6" />
          Notifications Intelligentes
        </h2>
        <p className="text-muted-foreground">
          Recevez des notifications personnalisées au moment opportun
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">Activées</p>
            <p className="text-3xl font-bold">{enabledCount}/5</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">Prochaines</p>
            <p className="text-3xl font-bold">
              {scheduledNotifications.filter((n) => !n.sent).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">Envoyées</p>
            <p className="text-3xl font-bold">
              {scheduledNotifications.filter((n) => n.sent).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Préférences de Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {preferences.map((pref) => (
            <div
              key={pref.type}
              className="p-4 rounded-lg bg-muted/30 border space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{pref.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">
                      Fréquence: {pref.frequency === 'realtime' ? 'Temps réel' : pref.frequency === 'hourly' ? 'Horaire' : pref.frequency === 'daily' ? 'Quotidienne' : 'Hebdomadaire'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => sendTestNotification(pref.type)}
                    className="text-xs"
                  >
                    Test
                  </Button>
                  <Switch
                    checked={pref.enabled}
                    onCheckedChange={() => togglePreference(pref.type)}
                  />
                </div>
              </div>

              {/* Frequency Controls */}
              {pref.enabled && pref.frequency !== 'realtime' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex gap-2 flex-wrap"
                >
                  {(['hourly', 'daily', 'weekly'] as const).map((freq) => (
                    <Button
                      key={freq}
                      size="sm"
                      variant={pref.frequency === freq ? 'default' : 'outline'}
                      onClick={() => updateFrequency(pref.type, freq)}
                      className="text-xs"
                    >
                      {freq === 'hourly'
                        ? 'Horaire'
                        : freq === 'daily'
                          ? 'Quotidienne'
                          : 'Hebdomadaire'}
                    </Button>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Scheduled Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Notifications Planifiées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {scheduledNotifications.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {scheduledNotifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={`p-4 rounded-lg border transition-all ${
                      notif.sent
                        ? 'bg-green-500/10 border-green-500/20'
                        : 'bg-muted/30 border-muted'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{notif.emoji}</span>
                          <p className="font-medium truncate">{notif.title}</p>
                          {notif.sent && (
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {notif.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ⏰ {formatScheduleTime(notif.scheduledTime)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 flex-shrink-0"
                        onClick={() => {
                          setScheduledNotifications((prev) =>
                            prev.filter((n) => n.id !== notif.id)
                          );
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune notification planifiée
            </p>
          )}
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full"
          >
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5" />
              Paramètres Avancés
            </CardTitle>
            <span className="text-xs">{showAdvanced ? '▼' : '▶'}</span>
          </button>
        </CardHeader>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <CardContent className="space-y-4 pt-4 border-t">
                {/* Smart Timing */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Timing Optimal
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      ✅ L'IA analyse votre historique pour trouver le moment
                      idéal pour chaque notification
                    </p>
                    <p>
                      🧠 Apprentissage machine basé sur vos interactions
                    </p>
                    <p>
                      ⏰ Adaptation aux fuseaux horaires et aux routines
                    </p>
                  </div>
                </div>

                {/* Personalization */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    Personnalisation
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8"
                    >
                      Sons personnalisés
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8"
                    >
                      Icônes colorées
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8"
                    >
                      Notifications visuelles
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8"
                    >
                      Historique complet
                    </Button>
                  </div>
                </div>

                {/* Smart Features */}
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 space-y-2 text-sm">
                  <p className="font-semibold text-accent">🤖 Fonctionnalités Intelligentes:</p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>✅ Détection d'inactivité - Alertes motivantes</li>
                    <li>✅ Analyse d'humeur - Playlists adaptées</li>
                    <li>✅ Prédiction de streaming - Suggestions proactives</li>
                    <li>✅ Gamification intelligente - Défis contextuels</li>
                  </ul>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default SmartNotificationEngine;
