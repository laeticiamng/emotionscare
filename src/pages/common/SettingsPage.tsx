
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    analysis: true,
    community: false,
    weekly: true
  });

  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'fr',
    timezone: 'Europe/Paris'
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    analysisSharing: false,
    dataExport: true
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success("Paramètres de notification mis à jour");
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    toast.success("Préférences mises à jour");
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    toast.success("Paramètres de confidentialité mis à jour");
  };

  const handleDeleteAccount = () => {
    toast.error("Fonctionnalité de suppression de compte en développement");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Personnalisez votre expérience EmotionsCare
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
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
                <p className="text-sm text-muted-foreground">
                  Recevez des emails pour les événements importants
                </p>
              </div>
              <Switch
                id="email-notif"
                checked={notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notif">Notifications push</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications dans le navigateur
                </p>
              </div>
              <Switch
                id="push-notif"
                checked={notifications.push}
                onCheckedChange={(checked) => handleNotificationChange('push', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analysis-notif">Rappels d'analyse</Label>
                <p className="text-sm text-muted-foreground">
                  Rappels pour vos analyses quotidiennes
                </p>
              </div>
              <Switch
                id="analysis-notif"
                checked={notifications.analysis}
                onCheckedChange={(checked) => handleNotificationChange('analysis', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="community-notif">Activité communautaire</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications des interactions sociales
                </p>
              </div>
              <Switch
                id="community-notif"
                checked={notifications.community}
                onCheckedChange={(checked) => handleNotificationChange('community', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-notif">Rapport hebdomadaire</Label>
                <p className="text-sm text-muted-foreground">
                  Résumé de votre bien-être chaque semaine
                </p>
              </div>
              <Switch
                id="weekly-notif"
                checked={notifications.weekly}
                onCheckedChange={(checked) => handleNotificationChange('weekly', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="mr-2 h-5 w-5" />
              Préférences d'affichage
            </CardTitle>
            <CardDescription>
              Personnalisez l'apparence de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Thème</Label>
              <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange('theme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="system">Système</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Langue</Label>
              <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fuseau horaire</Label>
              <Select value={preferences.timezone} onValueChange={(value) => handlePreferenceChange('timezone', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Paris">Paris (UTC+1)</SelectItem>
                  <SelectItem value="Europe/London">Londres (UTC+0)</SelectItem>
                  <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Confidentialité
            </CardTitle>
            <CardDescription>
              Contrôlez la visibilité de vos données
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="profile-visible">Profil public</Label>
                <p className="text-sm text-muted-foreground">
                  Votre profil est visible dans la communauté
                </p>
              </div>
              <Switch
                id="profile-visible"
                checked={privacy.profileVisible}
                onCheckedChange={(checked) => handlePrivacyChange('profileVisible', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analysis-sharing">Partage des analyses</Label>
                <p className="text-sm text-muted-foreground">
                  Permettre le partage anonyme pour la recherche
                </p>
              </div>
              <Switch
                id="analysis-sharing"
                checked={privacy.analysisSharing}
                onCheckedChange={(checked) => handlePrivacyChange('analysisSharing', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="data-export">Export de données</Label>
                <p className="text-sm text-muted-foreground">
                  Autoriser l'export de vos données personnelles
                </p>
              </div>
              <Switch
                id="data-export"
                checked={privacy.dataExport}
                onCheckedChange={(checked) => handlePrivacyChange('dataExport', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Gestion des données
            </CardTitle>
            <CardDescription>
              Gérez vos données personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <Database className="mr-2 h-4 w-4" />
                Exporter mes données
              </Button>
              <Button variant="outline" className="w-full">
                <Globe className="mr-2 h-4 w-4" />
                Télécharger l'historique
              </Button>
              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Sauvegarder les préférences
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-red-600 mb-2">Zone de danger</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Actions irréversibles qui affecteront définitivement votre compte.
              </p>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer mon compte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
