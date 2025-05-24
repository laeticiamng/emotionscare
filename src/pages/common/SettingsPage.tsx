
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Moon, Sun, Bell, Globe, Palette, Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/theme/ThemeProvider';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'fr',
    notifications_enabled: true,
    email_notifications: true,
    push_notifications: false,
    sound_enabled: true,
    auto_save: true
  });

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data?.preferences) {
        setPreferences(prev => ({
          ...prev,
          ...data.preferences
        }));
      }
    } catch (error) {
      console.error('Erreur chargement préférences:', error);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Préférences sauvegardées !');
    } catch (error) {
      console.error('Erreur sauvegarde préférences:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as 'light' | 'dark' | 'system');
    setPreferences(prev => ({ ...prev, theme: newTheme }));
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
          <Settings className="h-8 w-8 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">Personnalisez votre expérience EmotionsCare</p>
        </div>
      </div>

      {/* Apparence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Apparence
          </CardTitle>
          <CardDescription>
            Personnalisez l'apparence de l'interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme">Thème</Label>
              <p className="text-sm text-muted-foreground">
                Choisissez votre thème préféré
              </p>
            </div>
            <Select value={preferences.theme} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Clair
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Sombre
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Système
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="language">Langue</Label>
              <p className="text-sm text-muted-foreground">
                Langue d'affichage de l'interface
              </p>
            </div>
            <Select 
              value={preferences.language} 
              onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Français
                  </div>
                </SelectItem>
                <SelectItem value="en">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    English
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Gérez vos préférences de notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Notifications générales</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications dans l'application
              </p>
            </div>
            <Switch
              id="notifications"
              checked={preferences.notifications_enabled}
              onCheckedChange={() => togglePreference('notifications_enabled')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Notifications par email</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des emails de notification
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.email_notifications}
              onCheckedChange={() => togglePreference('email_notifications')}
              disabled={!preferences.notifications_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Notifications push</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications push sur votre appareil
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences.push_notifications}
              onCheckedChange={() => togglePreference('push_notifications')}
              disabled={!preferences.notifications_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound">Sons</Label>
              <p className="text-sm text-muted-foreground">
                Activer les sons de notification
              </p>
            </div>
            <Switch
              id="sound"
              checked={preferences.sound_enabled}
              onCheckedChange={() => togglePreference('sound_enabled')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Comportement */}
      <Card>
        <CardHeader>
          <CardTitle>Comportement</CardTitle>
          <CardDescription>
            Paramètres de fonctionnement de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-save">Sauvegarde automatique</Label>
              <p className="text-sm text-muted-foreground">
                Sauvegarder automatiquement vos données
              </p>
            </div>
            <Switch
              id="auto-save"
              checked={preferences.auto_save}
              onCheckedChange={() => togglePreference('auto_save')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Button onClick={savePreferences} disabled={isLoading} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
            </Button>
            <Button variant="outline" onClick={loadPreferences}>
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
