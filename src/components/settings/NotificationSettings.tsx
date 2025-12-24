// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Clock, 
  Heart,
  Users,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emotionalAlerts, setEmotionalAlerts] = useState(true);
  const [teamUpdates, setTeamUpdates] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [quietHours, setQuietHours] = useState(true);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('08:00');

  // Load settings from Supabase
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: settings } = await supabase
            .from('user_settings')
            .select('notification_preferences')
            .eq('user_id', user.id)
            .single();

          if (settings?.notification_preferences) {
            const prefs = settings.notification_preferences;
            setEmailNotifications(prefs.email ?? true);
            setPushNotifications(prefs.push ?? true);
            setEmotionalAlerts(prefs.emotionalAlerts ?? true);
            setTeamUpdates(prefs.teamUpdates ?? false);
            setWeeklyReports(prefs.weeklyReports ?? true);
            setCriticalAlerts(prefs.criticalAlerts ?? true);
            setQuietHours(prefs.quietHours ?? true);
            setQuietStart(prefs.quietStart ?? '22:00');
            setQuietEnd(prefs.quietEnd ?? '08:00');
          }
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Save settings to Supabase
  const saveSettings = async () => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            notification_preferences: {
              email: emailNotifications,
              push: pushNotifications,
              emotionalAlerts,
              teamUpdates,
              weeklyReports,
              criticalAlerts,
              quietHours,
              quietStart,
              quietEnd
            },
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  // Save on any change
  React.useEffect(() => {
    const timer = setTimeout(saveSettings, 500);
    return () => clearTimeout(timer);
  }, [emailNotifications, pushNotifications, emotionalAlerts, teamUpdates, weeklyReports, criticalAlerts, quietHours, quietStart, quietEnd]);

  return (
    <div className="space-y-6">
      {/* Canaux de notification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Canaux de notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Notifications par email
              </Label>
              <p className="text-sm text-muted-foreground">
                Recevez des mises à jour par email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Notifications push
              </Label>
              <p className="text-sm text-muted-foreground">
                Notifications instantanées sur votre appareil
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Types de notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Types de notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emotional-alerts" className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Alertes émotionnelles
              </Label>
              <p className="text-sm text-muted-foreground">
                Notifications pour votre bien-être émotionnel
              </p>
            </div>
            <Switch
              id="emotional-alerts"
              checked={emotionalAlerts}
              onCheckedChange={setEmotionalAlerts}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="team-updates" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                Mises à jour d'équipe
              </Label>
              <p className="text-sm text-muted-foreground">
                Nouvelles activités et interactions d'équipe
              </p>
            </div>
            <Switch
              id="team-updates"
              checked={teamUpdates}
              onCheckedChange={setTeamUpdates}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-reports" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Rapports hebdomadaires
              </Label>
              <p className="text-sm text-muted-foreground">
                Résumé de vos progrès chaque semaine
              </p>
            </div>
            <Switch
              id="weekly-reports"
              checked={weeklyReports}
              onCheckedChange={setWeeklyReports}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="critical-alerts" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Alertes critiques
              </Label>
              <p className="text-sm text-muted-foreground">
                Notifications importantes pour votre sécurité
              </p>
            </div>
            <Switch
              id="critical-alerts"
              checked={criticalAlerts}
              onCheckedChange={setCriticalAlerts}
            />
          </div>
        </CardContent>
      </Card>

      {/* Heures de silence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Heures de silence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="quiet-hours">Activer les heures de silence</Label>
              <p className="text-sm text-muted-foreground">
                Suspendre les notifications non critiques pendant certaines heures
              </p>
            </div>
            <Switch
              id="quiet-hours"
              checked={quietHours}
              onCheckedChange={setQuietHours}
            />
          </div>

          {quietHours && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Début</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={quietStart}
                    onChange={(e) => setQuietStart(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">Fin</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={quietEnd}
                    onChange={(e) => setQuietEnd(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Les notifications seront suspendues de {quietStart} à {quietEnd}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test de notification */}
      <Card>
        <CardHeader>
          <CardTitle>Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Testez vos paramètres de notification avec un exemple
            </p>
            <Button>Envoyer une notification de test</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
