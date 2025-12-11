import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Smartphone, Mail, MessageSquare, Heart, Trophy, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { pushNotificationService } from '@/lib/notifications/pushNotifications';

interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  dailyReminder: boolean;
  dailyReminderTime: string;
  weeklyReport: boolean;
  streakAlerts: boolean;
  communityActivity: boolean;
  achievements: boolean;
  crisisAlerts: boolean;
  wearableSync: boolean;
}

export default function NotificationSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    pushEnabled: false,
    emailEnabled: true,
    dailyReminder: true,
    dailyReminderTime: '09:00',
    weeklyReport: true,
    streakAlerts: true,
    communityActivity: false,
    achievements: true,
    crisisAlerts: true,
    wearableSync: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPermissionStatus(pushNotificationService.getPermissionStatus());
    // Load saved preferences from localStorage
    const saved = localStorage.getItem('notification_preferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const handleRequestPermission = async () => {
    const granted = await pushNotificationService.requestPermission();
    setPermissionStatus(pushNotificationService.getPermissionStatus());
    
    if (granted) {
      setPreferences(prev => ({ ...prev, pushEnabled: true }));
      toast({ title: 'Notifications activées', description: 'Vous recevrez des notifications push.' });
    } else {
      toast({ 
        title: 'Permission refusée', 
        description: 'Vous pouvez l\'activer dans les paramètres de votre navigateur.',
        variant: 'destructive'
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Sauvegarder localement
      localStorage.setItem('notification_preferences', JSON.stringify(preferences));
      
      // Sauvegarder dans Supabase pour synchronisation cross-device
      if (user?.id) {
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase.from('user_preferences').upsert({
          user_id: user.id,
          notification_settings: preferences,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
        // Ignorer les erreurs silencieusement (table peut ne pas exister)
        if (error) console.warn('Notification prefs sync failed:', error.message);
      }
      
      // Programmer le rappel quotidien si activé
      if (preferences.dailyReminder && preferences.pushEnabled && permissionStatus === 'granted') {
        scheduleLocalReminder(preferences.dailyReminderTime);
      }
      
      // Test notification if push is enabled
      if (preferences.pushEnabled && permissionStatus === 'granted') {
        await pushNotificationService.showNotification('Préférences sauvegardées ✓', {
          body: 'Vos paramètres de notifications ont été mis à jour.',
          icon: '/favicon.ico',
          tag: 'settings-saved'
        });
      }
      
      toast({ title: 'Sauvegardé', description: 'Vos préférences ont été mises à jour.' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // Planifier un rappel local (simplifié - en prod utiliser Service Worker)
  const scheduleLocalReminder = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }
    
    const delay = reminderTime.getTime() - now.getTime();
    
    // Stocker le timeout ID pour pouvoir l'annuler si nécessaire
    const existingTimeout = localStorage.getItem('reminder_timeout_id');
    if (existingTimeout) {
      clearTimeout(parseInt(existingTimeout));
    }
    
    const timeoutId = setTimeout(() => {
      pushNotificationService.showNotification('🌟 C\'est l\'heure de votre check-in !', {
        body: 'Prenez un moment pour noter comment vous vous sentez aujourd\'hui.',
        icon: '/favicon.ico',
        tag: 'daily-reminder'
      });
      // Reprogrammer pour demain
      scheduleLocalReminder(time);
    }, Math.min(delay, 24 * 60 * 60 * 1000)); // Max 24h
    
    localStorage.setItem('reminder_timeout_id', timeoutId.toString());
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Bell className="h-8 w-8 text-primary" />
          Notifications
        </h1>
        <p className="text-muted-foreground">
          Configurez comment et quand vous souhaitez être notifié.
        </p>
      </div>

      {/* Permission Push */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Notifications Push
          </CardTitle>
          <CardDescription>
            Recevez des notifications directement sur votre appareil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!pushNotificationService.isNotificationSupported() ? (
            <p className="text-sm text-muted-foreground">
              Les notifications push ne sont pas supportées sur ce navigateur.
            </p>
          ) : permissionStatus === 'granted' ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600">
                <Bell className="h-4 w-4" />
                <span className="text-sm">Notifications activées</span>
              </div>
              <Switch 
                checked={preferences.pushEnabled} 
                onCheckedChange={(v) => updatePreference('pushEnabled', v)} 
              />
            </div>
          ) : permissionStatus === 'denied' ? (
            <div className="flex items-center gap-2 text-destructive">
              <BellOff className="h-4 w-4" />
              <span className="text-sm">
                Notifications bloquées. Modifiez les permissions dans les paramètres de votre navigateur.
              </span>
            </div>
          ) : (
            <Button onClick={handleRequestPermission}>
              <Bell className="h-4 w-4 mr-2" />
              Activer les notifications
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Rappels quotidiens */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Rappels quotidiens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="daily-reminder" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Rappel de check-in
            </Label>
            <Switch 
              id="daily-reminder"
              checked={preferences.dailyReminder} 
              onCheckedChange={(v) => updatePreference('dailyReminder', v)} 
            />
          </div>
          
          {preferences.dailyReminder && (
            <div className="flex items-center gap-4 pl-6">
              <Label htmlFor="reminder-time" className="text-sm text-muted-foreground">Heure:</Label>
              <Select 
                value={preferences.dailyReminderTime} 
                onValueChange={(v) => updatePreference('dailyReminderTime', v)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="07:00">07:00</SelectItem>
                  <SelectItem value="08:00">08:00</SelectItem>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="12:00">12:00</SelectItem>
                  <SelectItem value="18:00">18:00</SelectItem>
                  <SelectItem value="20:00">20:00</SelectItem>
                  <SelectItem value="21:00">21:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="weekly-report" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Rapport hebdomadaire par email
            </Label>
            <Switch 
              id="weekly-report"
              checked={preferences.weeklyReport} 
              onCheckedChange={(v) => updatePreference('weeklyReport', v)} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Types de notifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Types de notifications</CardTitle>
          <CardDescription>Choisissez ce qui vous intéresse.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="streak-alerts" className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              Alertes de série (streak)
            </Label>
            <Switch 
              id="streak-alerts"
              checked={preferences.streakAlerts} 
              onCheckedChange={(v) => updatePreference('streakAlerts', v)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              Badges et succès
            </Label>
            <Switch 
              id="achievements"
              checked={preferences.achievements} 
              onCheckedChange={(v) => updatePreference('achievements', v)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="community" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              Activité communautaire
            </Label>
            <Switch 
              id="community"
              checked={preferences.communityActivity} 
              onCheckedChange={(v) => updatePreference('communityActivity', v)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="wearable" className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Sync wearables terminée
            </Label>
            <Switch 
              id="wearable"
              checked={preferences.wearableSync} 
              onCheckedChange={(v) => updatePreference('wearableSync', v)} 
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="crisis" className="flex items-center gap-2 text-destructive">
              <Bell className="h-4 w-4" />
              Alertes de crise (recommandé)
            </Label>
            <Switch 
              id="crisis"
              checked={preferences.crisisAlerts} 
              onCheckedChange={(v) => updatePreference('crisisAlerts', v)} 
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
        </Button>
      </div>
    </div>
  );
}
