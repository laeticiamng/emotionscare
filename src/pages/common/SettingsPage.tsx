
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Settings, 
  Bell, 
  Palette, 
  Globe, 
  Volume2, 
  Shield, 
  Download,
  Trash2,
  RefreshCw,
  Database,
  Key
} from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: true,
      sms: false,
      reminders: true
    },
    audio: {
      volume: [75],
      soundEffects: true,
      voiceGuidance: true
    },
    privacy: {
      analytics: true,
      dataSharing: false,
      profileVisibility: 'private'
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      screenReader: false
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Simuler la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    toast.success('Export des données lancé');
  };

  const clearCache = () => {
    localStorage.clear();
    toast.success('Cache vidé avec succès');
  };

  const resetSettings = () => {
    setSettings({
      notifications: {
        push: true,
        email: true,
        sms: false,
        reminders: true
      },
      audio: {
        volume: [75],
        soundEffects: true,
        voiceGuidance: true
      },
      privacy: {
        analytics: true,
        dataSharing: false,
        profileVisibility: 'private'
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        screenReader: false
      }
    });
    toast.success('Paramètres réinitialisés');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Configurez EmotionsCare selon vos préférences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button onClick={saveSettings} disabled={isLoading}>
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Apparence
          </CardTitle>
          <CardDescription>
            Personnalisez l'apparence de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Thème</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem>
                <SelectItem value="system">Système</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Contraste élevé</Label>
              <p className="text-sm text-muted-foreground">
                Améliore la lisibilité pour les malvoyants
              </p>
            </div>
            <Switch
              checked={settings.accessibility.highContrast}
              onCheckedChange={(checked) => 
                handleSettingChange('accessibility', 'highContrast', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Texte large</Label>
              <p className="text-sm text-muted-foreground">
                Augmente la taille du texte
              </p>
            </div>
            <Switch
              checked={settings.accessibility.largeText}
              onCheckedChange={(checked) => 
                handleSettingChange('accessibility', 'largeText', checked)
              }
            />
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
            Gérez vos préférences de notification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications push</Label>
              <p className="text-sm text-muted-foreground">
                Notifications en temps réel dans l'application
              </p>
            </div>
            <Switch
              checked={settings.notifications.push}
              onCheckedChange={(checked) => 
                handleSettingChange('notifications', 'push', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications email</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des emails de rappel et d'information
              </p>
            </div>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked) => 
                handleSettingChange('notifications', 'email', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rappels quotidiens</Label>
              <p className="text-sm text-muted-foreground">
                Rappels pour vos sessions bien-être
              </p>
            </div>
            <Switch
              checked={settings.notifications.reminders}
              onCheckedChange={(checked) => 
                handleSettingChange('notifications', 'reminders', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications SMS</Label>
              <p className="text-sm text-muted-foreground">
                Alertes importantes par SMS
              </p>
            </div>
            <Switch
              checked={settings.notifications.sms}
              onCheckedChange={(checked) => 
                handleSettingChange('notifications', 'sms', checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Audio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Audio
          </CardTitle>
          <CardDescription>
            Paramètres audio et son
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Volume général ({settings.audio.volume[0]}%)</Label>
            <Slider
              value={settings.audio.volume}
              onValueChange={(value) => handleSettingChange('audio', 'volume', value)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Effets sonores</Label>
              <p className="text-sm text-muted-foreground">
                Sons d'interface et de feedback
              </p>
            </div>
            <Switch
              checked={settings.audio.soundEffects}
              onCheckedChange={(checked) => 
                handleSettingChange('audio', 'soundEffects', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Guidage vocal</Label>
              <p className="text-sm text-muted-foreground">
                Instructions vocales pendant les sessions
              </p>
            </div>
            <Switch
              checked={settings.audio.voiceGuidance}
              onCheckedChange={(checked) => 
                handleSettingChange('audio', 'voiceGuidance', checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Confidentialité et sécurité
          </CardTitle>
          <CardDescription>
            Contrôlez vos données et votre confidentialité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Analytics anonymes</Label>
              <p className="text-sm text-muted-foreground">
                Aider à améliorer l'application avec des données anonymisées
              </p>
            </div>
            <Switch
              checked={settings.privacy.analytics}
              onCheckedChange={(checked) => 
                handleSettingChange('privacy', 'analytics', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Partage de données</Label>
              <p className="text-sm text-muted-foreground">
                Partager des données avec des partenaires de recherche
              </p>
            </div>
            <Switch
              checked={settings.privacy.dataSharing}
              onCheckedChange={(checked) => 
                handleSettingChange('privacy', 'dataSharing', checked)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Visibilité du profil</Label>
            <Select 
              value={settings.privacy.profileVisibility}
              onValueChange={(value) => 
                handleSettingChange('privacy', 'profileVisibility', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Privé</SelectItem>
                <SelectItem value="team">Équipe seulement</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Langue et région
          </CardTitle>
          <CardDescription>
            Paramètres de localisation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Langue</Label>
            <Select defaultValue="fr">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fuseau horaire</Label>
            <Select defaultValue="europe/paris">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="europe/paris">Europe/Paris (GMT+1)</SelectItem>
                <SelectItem value="europe/london">Europe/London (GMT+0)</SelectItem>
                <SelectItem value="america/new_york">America/New_York (GMT-5)</SelectItem>
                <SelectItem value="asia/tokyo">Asia/Tokyo (GMT+9)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Format de date</Label>
            <Select defaultValue="dd/mm/yyyy">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Gestion des données
          </CardTitle>
          <CardDescription>
            Exportez, sauvegardez ou supprimez vos données
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Exporter mes données</h4>
              <p className="text-sm text-muted-foreground">
                Télécharger toutes vos données au format JSON
              </p>
            </div>
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Vider le cache</h4>
              <p className="text-sm text-muted-foreground">
                Supprimer les données en cache de l'application
              </p>
            </div>
            <Button variant="outline" onClick={clearCache}>
              <Trash2 className="h-4 w-4 mr-2" />
              Vider
            </Button>
          </div>

          {(userMode === 'b2b_admin' || userMode === 'b2b_user') && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Clés API</h4>
                <p className="text-sm text-muted-foreground">
                  Gérer les clés d'accès pour les intégrations
                </p>
              </div>
              <Button variant="outline">
                <Key className="h-4 w-4 mr-2" />
                Gérer
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
            <div>
              <h4 className="font-medium text-red-700">Zone de danger</h4>
              <p className="text-sm text-muted-foreground">
                Actions irréversibles qui affectent votre compte
              </p>
            </div>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer le compte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
