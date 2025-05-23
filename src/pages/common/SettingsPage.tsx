
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Shield, Moon, Sun, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      daily: false,
      weekly: true,
    },
    privacy: {
      shareData: false,
      analytics: true,
      publicProfile: false,
    },
    preferences: {
      darkMode: false,
      language: 'fr',
      autoSave: true,
    }
  });

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été mises à jour",
      variant: "default"
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">
            Configurez votre expérience EmotionsCare
          </p>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Gérez vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notif">Notifications par email</Label>
                <p className="text-sm text-muted-foreground">Recevez des emails pour les événements importants</p>
              </div>
              <Switch
                id="email-notif"
                checked={settings.notifications.email}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, email: checked }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notif">Notifications push</Label>
                <p className="text-sm text-muted-foreground">Notifications dans le navigateur</p>
              </div>
              <Switch
                id="push-notif"
                checked={settings.notifications.push}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, push: checked }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="daily-notif">Rappels quotidiens</Label>
                <p className="text-sm text-muted-foreground">Rappel pour faire votre scan émotionnel</p>
              </div>
              <Switch
                id="daily-notif"
                checked={settings.notifications.daily}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, daily: checked }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-notif">Résumé hebdomadaire</Label>
                <p className="text-sm text-muted-foreground">Rapport de votre progression</p>
              </div>
              <Switch
                id="weekly-notif"
                checked={settings.notifications.weekly}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, weekly: checked }
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Confidentialité
            </CardTitle>
            <CardDescription>
              Contrôlez vos données personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="share-data">Partage de données anonymisées</Label>
                <p className="text-sm text-muted-foreground">Aider à améliorer l'IA EmotionsCare</p>
              </div>
              <Switch
                id="share-data"
                checked={settings.privacy.shareData}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, shareData: checked }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analytics">Analytics et performance</Label>
                <p className="text-sm text-muted-foreground">Données d'utilisation de l'application</p>
              </div>
              <Switch
                id="analytics"
                checked={settings.privacy.analytics}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, analytics: checked }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="public-profile">Profil public</Label>
                <p className="text-sm text-muted-foreground">Visible par les autres utilisateurs</p>
              </div>
              <Switch
                id="public-profile"
                checked={settings.privacy.publicProfile}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, publicProfile: checked }
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Préférences
            </CardTitle>
            <CardDescription>
              Personnalisez votre interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Mode sombre</Label>
                <p className="text-sm text-muted-foreground">Interface en thème sombre</p>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.preferences.darkMode}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, darkMode: checked }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-save">Sauvegarde automatique</Label>
                <p className="text-sm text-muted-foreground">Enregistrer automatiquement vos données</p>
              </div>
              <Switch
                id="auto-save"
                checked={settings.preferences.autoSave}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, autoSave: checked }
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">
          Sauvegarder les paramètres
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
