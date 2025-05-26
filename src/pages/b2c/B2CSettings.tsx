
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Bell, Shield, Palette, Globe, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2CSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Profil
    name: 'Utilisateur Demo',
    email: 'user@exemple.fr',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    
    // Préférences
    theme: 'system',
    language: 'fr',
    soundEnabled: true,
    autoplay: false,
    
    // Confidentialité
    dataSharing: false,
    analytics: true,
    publicProfile: false
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Ici on sauvegarderait les paramètres
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été mises à jour avec succès.",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">Personnalisez votre expérience EmotionsCare</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => handleSettingChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                  />
                </div>
              </div>
              <Button>Modifier le mot de passe</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notif">Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications importantes par email
                  </p>
                </div>
                <Switch
                  id="email-notif"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notif">Notifications push</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des rappels pour vos sessions
                  </p>
                </div>
                <Switch
                  id="push-notif"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-report">Rapport hebdomadaire</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un résumé de vos progrès chaque semaine
                  </p>
                </div>
                <Switch
                  id="weekly-report"
                  checked={settings.weeklyReport}
                  onCheckedChange={(checked) => handleSettingChange('weeklyReport', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Préférences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Préférences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme">Thème</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => handleSettingChange('theme', value)}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="system">Système</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="language">Langue</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleSettingChange('language', value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound">Sons activés</Label>
                  <p className="text-sm text-muted-foreground">
                    Jouer les sons d'interface et de notification
                  </p>
                </div>
                <Switch
                  id="sound"
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoplay">Lecture automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Démarrer automatiquement la musique recommandée
                  </p>
                </div>
                <Switch
                  id="autoplay"
                  checked={settings.autoplay}
                  onCheckedChange={(checked) => handleSettingChange('autoplay', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Confidentialité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Confidentialité et Données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-sharing">Partage de données</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre le partage anonyme de données pour améliorer l'IA
                  </p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={settings.dataSharing}
                  onCheckedChange={(checked) => handleSettingChange('dataSharing', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics">Analytiques</Label>
                  <p className="text-sm text-muted-foreground">
                    Collecter des données d'usage pour améliorer l'expérience
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={settings.analytics}
                  onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public-profile">Profil public</Label>
                  <p className="text-sm text-muted-foreground">
                    Rendre votre profil visible aux autres utilisateurs
                  </p>
                </div>
                <Switch
                  id="public-profile"
                  checked={settings.publicProfile}
                  onCheckedChange={(checked) => handleSettingChange('publicProfile', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  Télécharger mes données
                </Button>
                <Button variant="destructive" size="sm">
                  Supprimer mon compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panneau latéral */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleSaveSettings} className="w-full">
                Sauvegarder les modifications
              </Button>
              <Button variant="outline" className="w-full">
                Réinitialiser les paramètres
              </Button>
              <Button variant="outline" className="w-full">
                Exporter les préférences
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full">
                Centre d'aide
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Contacter le support
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Signaler un problème
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Version</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                EmotionsCare v1.0.0
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Vérifier les mises à jour
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CSettings;
