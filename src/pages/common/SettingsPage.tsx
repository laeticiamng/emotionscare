
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Bell, Globe, Shield, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

interface SettingsData {
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
    reminders: boolean;
  };
  privacy: {
    analytics: boolean;
    sharing: boolean;
    publicProfile: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
  };
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      email: true,
      push: false,
      marketing: false,
      reminders: true
    },
    privacy: {
      analytics: true,
      sharing: false,
      publicProfile: false
    },
    preferences: {
      language: 'fr',
      timezone: 'Europe/Paris',
      dateFormat: 'DD/MM/YYYY'
    }
  });

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (user.email?.endsWith('@exemple.fr')) {
        // Paramètres de démo
        setSettings({
          notifications: {
            email: true,
            push: false,
            marketing: false,
            reminders: true
          },
          privacy: {
            analytics: true,
            sharing: false,
            publicProfile: false
          },
          preferences: {
            language: 'fr',
            timezone: 'Europe/Paris',
            dateFormat: 'DD/MM/YYYY'
          }
        });
      } else {
        // Charger les vrais paramètres depuis Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data?.preferences) {
          setSettings(data.preferences);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos paramètres",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      if (user.email?.endsWith('@exemple.fr')) {
        // Simulation pour les comptes démo
        setTimeout(() => {
          toast({
            title: "Paramètres mis à jour",
            description: "Vos préférences ont été sauvegardées (démo)",
          });
          setIsSaving(false);
        }, 1000);
        return;
      }

      // Sauvegarder les vrais paramètres
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          preferences: settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Paramètres mis à jour",
        description: "Vos préférences ont été sauvegardées avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos paramètres",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateNotificationSetting = (key: keyof SettingsData['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const updatePrivacySetting = (key: keyof SettingsData['privacy'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const updatePreferenceSetting = (key: keyof SettingsData['preferences'], value: string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-gray-600">
            Personnalisez votre expérience sur EmotionsCare
          </p>
        </div>

        {/* Thème */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              Apparence
            </CardTitle>
            <CardDescription>
              Choisissez le thème de l'interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="flex items-center space-x-2"
              >
                <Sun className="h-4 w-4" />
                <span>Clair</span>
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="flex items-center space-x-2"
              >
                <Moon className="h-4 w-4" />
                <span>Sombre</span>
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => setTheme('system')}
                className="flex items-center space-x-2"
              >
                <Monitor className="h-4 w-4" />
                <span>Système</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
            <CardDescription>
              Gérez vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications par email</Label>
                <div className="text-sm text-gray-500">
                  Recevez des notifications importantes par email
                </div>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => updateNotificationSetting('email', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications push</Label>
                <div className="text-sm text-gray-500">
                  Recevez des notifications directement dans votre navigateur
                </div>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) => updateNotificationSetting('push', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rappels quotidiens</Label>
                <div className="text-sm text-gray-500">
                  Rappels pour vos scans émotionnels quotidiens
                </div>
              </div>
              <Switch
                checked={settings.notifications.reminders}
                onCheckedChange={(checked) => updateNotificationSetting('reminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Communications marketing</Label>
                <div className="text-sm text-gray-500">
                  Recevez des nouvelles sur les fonctionnalités et conseils
                </div>
              </div>
              <Switch
                checked={settings.notifications.marketing}
                onCheckedChange={(checked) => updateNotificationSetting('marketing', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Confidentialité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Confidentialité
            </CardTitle>
            <CardDescription>
              Contrôlez comment vos données sont utilisées
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Données analytiques</Label>
                <div className="text-sm text-gray-500">
                  Permettre l'utilisation de vos données pour améliorer la plateforme
                </div>
              </div>
              <Switch
                checked={settings.privacy.analytics}
                onCheckedChange={(checked) => updatePrivacySetting('analytics', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Partage de données</Label>
                <div className="text-sm text-gray-500">
                  Autoriser le partage anonymisé de vos données à des fins de recherche
                </div>
              </div>
              <Switch
                checked={settings.privacy.sharing}
                onCheckedChange={(checked) => updatePrivacySetting('sharing', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Profil public</Label>
                <div className="text-sm text-gray-500">
                  Rendre votre profil visible aux autres utilisateurs
                </div>
              </div>
              <Switch
                checked={settings.privacy.publicProfile}
                onCheckedChange={(checked) => updatePrivacySetting('publicProfile', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Préférences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Préférences
            </CardTitle>
            <CardDescription>
              Personnalisez votre expérience utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select 
                  value={settings.preferences.language}
                  onValueChange={(value) => updatePreferenceSetting('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Select 
                  value={settings.preferences.timezone}
                  onValueChange={(value) => updatePreferenceSetting('timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un fuseau horaire" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Paris">Europe/Paris (GMT+1)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Format de date</Label>
                <Select 
                  value={settings.preferences.dateFormat}
                  onValueChange={(value) => updatePreferenceSetting('dateFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={loadSettings}>
            Réinitialiser
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
