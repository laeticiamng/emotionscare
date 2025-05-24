
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, Moon, Globe, Shield, Database, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      reminders: false,
      weekly_report: true
    },
    privacy: {
      data_sharing: false,
      analytics: true,
      marketing: false
    },
    preferences: {
      theme: 'system',
      language: 'fr',
      timezone: 'Europe/Paris'
    }
  });

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    toast.success('Paramètre mis à jour');
  };

  const exportData = () => {
    toast.info('Export des données en cours...');
    // Simulation de l'export
    setTimeout(() => {
      toast.success('Données exportées avec succès');
    }, 2000);
  };

  const deleteAllData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.')) {
      toast.error('Suppression de toutes les données...');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez vos préférences et la confidentialité de votre compte
          </p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des emails pour les mises à jour importantes
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Notifications push</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications dans le navigateur
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reminders">Rappels quotidiens</Label>
                  <p className="text-sm text-muted-foreground">
                    Rappels pour compléter votre journal émotionnel
                  </p>
                </div>
                <Switch
                  id="reminders"
                  checked={settings.notifications.reminders}
                  onCheckedChange={(checked) => updateSetting('notifications', 'reminders', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-report">Rapport hebdomadaire</Label>
                  <p className="text-sm text-muted-foreground">
                    Résumé de votre bien-être chaque semaine
                  </p>
                </div>
                <Switch
                  id="weekly-report"
                  checked={settings.notifications.weekly_report}
                  onCheckedChange={(checked) => updateSetting('notifications', 'weekly_report', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Préférences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Préférences d'affichage
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <Select 
                  value={settings.preferences.theme}
                  onValueChange={(value) => updateSetting('preferences', 'theme', value)}
                >
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
                <Label htmlFor="language">Langue</Label>
                <Select 
                  value={settings.preferences.language}
                  onValueChange={(value) => updateSetting('preferences', 'language', value)}
                >
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
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Select 
                  value={settings.preferences.timezone}
                  onValueChange={(value) => updateSetting('preferences', 'timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Confidentialité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Confidentialité et données
              </CardTitle>
              <CardDescription>
                Contrôlez l'utilisation de vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-sharing">Partage de données anonymisées</Label>
                  <p className="text-sm text-muted-foreground">
                    Aidez-nous à améliorer l'application avec des données anonymes
                  </p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={settings.privacy.data_sharing}
                  onCheckedChange={(checked) => updateSetting('privacy', 'data_sharing', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics">Analyses d'utilisation</Label>
                  <p className="text-sm text-muted-foreground">
                    Collecte de données d'usage pour améliorer l'expérience
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={settings.privacy.analytics}
                  onCheckedChange={(checked) => updateSetting('privacy', 'analytics', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing">Communications marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des informations sur nos nouveautés
                  </p>
                </div>
                <Switch
                  id="marketing"
                  checked={settings.privacy.marketing}
                  onCheckedChange={(checked) => updateSetting('privacy', 'marketing', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Gestion des données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Gestion des données
              </CardTitle>
              <CardDescription>
                Exportez ou supprimez vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Exporter mes données</h4>
                  <p className="text-sm text-muted-foreground">
                    Téléchargez toutes vos données au format JSON
                  </p>
                </div>
                <Button variant="outline" onClick={exportData}>
                  Exporter
                </Button>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-red-600">Supprimer toutes mes données</h4>
                  <p className="text-sm text-muted-foreground">
                    Action irréversible - supprime tout votre historique
                  </p>
                </div>
                <Button variant="destructive" onClick={deleteAllData}>
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
