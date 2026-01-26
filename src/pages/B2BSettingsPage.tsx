// @ts-nocheck
/**
 * B2BSettingsPage - Paramètres organisation B2B
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, Bell, Target, Globe, Save, Loader2 } from 'lucide-react';
import { useB2BSettings } from '@/hooks/useB2BSettings';
import { useB2BRole } from '@/hooks/useB2BRole';
import { usePageSEO } from '@/hooks/usePageSEO';

const B2BSettingsPage: React.FC = () => {
  const { settings, loading, updateSettings, isUpdating } = useB2BSettings();
  const { isAdmin } = useB2BRole();
  const [localSettings, setLocalSettings] = React.useState(settings);

  usePageSEO({
    title: 'Paramètres B2B - EmotionsCare',
    description: 'Configurez les paramètres de votre organisation',
  });

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings({
      notificationsEnabled: localSettings.notificationsEnabled,
      weeklyReportEnabled: localSettings.weeklyReportEnabled,
      alertThreshold: localSettings.alertThreshold,
      wellnessGoal: localSettings.wellnessGoal,
      timezone: localSettings.timezone,
      language: localSettings.language,
    });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Paramètres
          </h1>
          <p className="text-muted-foreground mt-1">Configurez les paramètres de votre organisation</p>
        </div>
        <Button onClick={handleSave} disabled={isUpdating || !isAdmin}>
          {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Enregistrer
        </Button>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Gérez les notifications de votre organisation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Notifications activées</Label>
              <p className="text-sm text-muted-foreground">Recevoir des alertes sur le bien-être</p>
            </div>
            <Switch
              checked={localSettings.notificationsEnabled}
              onCheckedChange={(checked) => setLocalSettings(s => ({ ...s, notificationsEnabled: checked }))}
              disabled={!isAdmin}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Rapport hebdomadaire</Label>
              <p className="text-sm text-muted-foreground">Envoyer un résumé chaque semaine</p>
            </div>
            <Switch
              checked={localSettings.weeklyReportEnabled}
              onCheckedChange={(checked) => setLocalSettings(s => ({ ...s, weeklyReportEnabled: checked }))}
              disabled={!isAdmin}
            />
          </div>
        </CardContent>
      </Card>

      {/* Objectifs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Objectifs & Seuils
          </CardTitle>
          <CardDescription>Définissez les objectifs de bien-être</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Objectif bien-être</Label>
              <span className="text-sm font-medium">{localSettings.wellnessGoal}%</span>
            </div>
            <Slider
              value={[localSettings.wellnessGoal]}
              onValueChange={([value]) => setLocalSettings(s => ({ ...s, wellnessGoal: value }))}
              min={50}
              max={100}
              step={5}
              disabled={!isAdmin}
            />
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Seuil d'alerte</Label>
              <span className="text-sm font-medium">{localSettings.alertThreshold}%</span>
            </div>
            <Slider
              value={[localSettings.alertThreshold]}
              onValueChange={([value]) => setLocalSettings(s => ({ ...s, alertThreshold: value }))}
              min={40}
              max={80}
              step={5}
              disabled={!isAdmin}
            />
            <p className="text-xs text-muted-foreground">
              Une alerte sera déclenchée si le score descend sous ce seuil
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Localisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Localisation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Langue</Label>
              <Select
                value={localSettings.language}
                onValueChange={(value: 'fr' | 'en') => setLocalSettings(s => ({ ...s, language: value }))}
                disabled={!isAdmin}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fuseau horaire</Label>
              <Select
                value={localSettings.timezone}
                onValueChange={(value) => setLocalSettings(s => ({ ...s, timezone: value }))}
                disabled={!isAdmin}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BSettingsPage;
