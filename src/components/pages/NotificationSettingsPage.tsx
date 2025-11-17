import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bell, Mail, Clock, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface NotificationSettings {
  session_reminders: boolean;
  daily_goals: boolean;
  achievements: boolean;
  weekly_summary: boolean;
  personalized_tips: boolean;
  product_updates: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

export const NotificationSettingsPage: React.FC<{ 'data-testid'?: string }> = ({
  'data-testid': testId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [settings, setSettings] = useState<NotificationSettings>({
    session_reminders: true,
    daily_goals: true,
    achievements: true,
    weekly_summary: true,
    personalized_tips: false,
    product_updates: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
        throw error;
      }

      if (data) {
        setSettings({
          session_reminders: data.session_reminders ?? true,
          daily_goals: data.daily_goals ?? true,
          achievements: data.achievements ?? true,
          weekly_summary: data.weekly_summary ?? true,
          personalized_tips: data.personalized_tips ?? false,
          product_updates: data.product_updates ?? false,
          quiet_hours_start: data.quiet_hours_start || '22:00',
          quiet_hours_end: data.quiet_hours_end || '08:00',
        });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos paramètres',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('user_notification_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setHasChanges(false);
      toast({
        title: 'Paramètres sauvegardés',
        description: 'Vos préférences de notification ont été mises à jour',
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder vos paramètres',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid={testId || "page-root"}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid={testId || "page-root"}>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Paramètres de notifications
            </h1>
          </div>
          <p className="text-muted-foreground">
            Gérez comment et quand vous souhaitez être notifié
          </p>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Push Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications push
              </CardTitle>
              <CardDescription>
                Notifications instantanées sur votre appareil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="session_reminders" className="text-base font-medium">
                    Rappels de session
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un rappel pour vos sessions de bien-être
                  </p>
                </div>
                <Switch
                  id="session_reminders"
                  checked={settings.session_reminders}
                  onCheckedChange={(checked) => handleSettingChange('session_reminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="daily_goals" className="text-base font-medium">
                    Objectifs quotidiens
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications pour vos objectifs de bien-être
                  </p>
                </div>
                <Switch
                  id="daily_goals"
                  checked={settings.daily_goals}
                  onCheckedChange={(checked) => handleSettingChange('daily_goals', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="achievements" className="text-base font-medium">
                    Achievements
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Être notifié des nouvelles réalisations
                  </p>
                </div>
                <Switch
                  id="achievements"
                  checked={settings.achievements}
                  onCheckedChange={(checked) => handleSettingChange('achievements', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Notifications par email
              </CardTitle>
              <CardDescription>
                Emails périodiques et informations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="weekly_summary" className="text-base font-medium">
                    Résumé hebdomadaire
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un résumé de votre progression
                  </p>
                </div>
                <Switch
                  id="weekly_summary"
                  checked={settings.weekly_summary}
                  onCheckedChange={(checked) => handleSettingChange('weekly_summary', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="personalized_tips" className="text-base font-medium">
                    Conseils personnalisés
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des conseils basés sur votre profil
                  </p>
                </div>
                <Switch
                  id="personalized_tips"
                  checked={settings.personalized_tips}
                  onCheckedChange={(checked) => handleSettingChange('personalized_tips', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="product_updates" className="text-base font-medium">
                    Mises à jour produit
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Être informé des nouvelles fonctionnalités
                  </p>
                </div>
                <Switch
                  id="product_updates"
                  checked={settings.product_updates}
                  onCheckedChange={(checked) => handleSettingChange('product_updates', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horaires de notification
              </CardTitle>
              <CardDescription>
                Définissez une période sans notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quiet_hours_start">
                  Ne pas déranger - Début
                </Label>
                <Input
                  id="quiet_hours_start"
                  type="time"
                  value={settings.quiet_hours_start}
                  onChange={(e) => handleSettingChange('quiet_hours_start', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quiet_hours_end">
                  Ne pas déranger - Fin
                </Label>
                <Input
                  id="quiet_hours_end"
                  type="time"
                  value={settings.quiet_hours_end}
                  onChange={(e) => handleSettingChange('quiet_hours_end', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          {hasChanges && (
            <Card className="border-primary bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Vous avez des modifications non sauvegardées</span>
                  </div>
                  <Button onClick={saveSettings} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Sauvegarder les paramètres
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
