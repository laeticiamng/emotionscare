
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Bell, Shield, Globe, Trash2, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { userMode, changeUserMode } = useUserMode();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      wellnessReminders: true,
      socialUpdates: false,
    },
    privacy: {
      profileVisible: true,
      dataSharing: false,
      analyticsOptIn: true,
    },
    preferences: {
      language: 'fr',
      theme: 'system',
      timeZone: 'Europe/Paris',
    }
  });

  const handleSettingChange = (category: string, setting: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
    toast.success('Paramètre mis à jour');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      // In real app, this would call a delete account API
      toast.error('Fonctionnalité non implémentée - contactez le support');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
          <p className="text-muted-foreground">
            Personnalisez votre expérience EmotionsCare
          </p>
        </header>

        <div className="space-y-8">
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
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-sm font-medium">
                    Notifications par email
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des emails pour les mises à jour importantes
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => 
                    handleSettingChange('notifications', 'email', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="text-sm font-medium">
                    Notifications push
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications instantanées sur votre appareil
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => 
                    handleSettingChange('notifications', 'push', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="wellness-reminders" className="text-sm font-medium">
                    Rappels bien-être
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Rappels pour vos scans émotionnels quotidiens
                  </p>
                </div>
                <Switch
                  id="wellness-reminders"
                  checked={settings.notifications.wellnessReminders}
                  onCheckedChange={(checked) => 
                    handleSettingChange('notifications', 'wellnessReminders', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="social-updates" className="text-sm font-medium">
                    Mises à jour sociales
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications des activités de la communauté
                  </p>
                </div>
                <Switch
                  id="social-updates"
                  checked={settings.notifications.socialUpdates}
                  onCheckedChange={(checked) => 
                    handleSettingChange('notifications', 'socialUpdates', checked)
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
                Contrôlez vos données et votre vie privée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profile-visible" className="text-sm font-medium">
                    Profil visible
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux autres utilisateurs de voir votre profil
                  </p>
                </div>
                <Switch
                  id="profile-visible"
                  checked={settings.privacy.profileVisible}
                  onCheckedChange={(checked) => 
                    handleSettingChange('privacy', 'profileVisible', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-sharing" className="text-sm font-medium">
                    Partage de données
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Partager des données anonymisées pour la recherche
                  </p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={settings.privacy.dataSharing}
                  onCheckedChange={(checked) => 
                    handleSettingChange('privacy', 'dataSharing', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics-opt-in" className="text-sm font-medium">
                    Analyses d'usage
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Aider à améliorer l'application avec des données d'usage
                  </p>
                </div>
                <Switch
                  id="analytics-opt-in"
                  checked={settings.privacy.analyticsOptIn}
                  onCheckedChange={(checked) => 
                    handleSettingChange('privacy', 'analyticsOptIn', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Préférences générales
              </CardTitle>
              <CardDescription>
                Personnalisez l'interface et l'expérience utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select 
                    value={settings.preferences.language}
                    onValueChange={(value) => 
                      handleSettingChange('preferences', 'language', value)
                    }
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
                  <Label htmlFor="theme">Thème</Label>
                  <Select 
                    value={settings.preferences.theme}
                    onValueChange={(value) => 
                      handleSettingChange('preferences', 'theme', value)
                    }
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Select 
                  value={settings.preferences.timeZone}
                  onValueChange={(value) => 
                    handleSettingChange('preferences', 'timeZone', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Actions du compte
              </CardTitle>
              <CardDescription>
                Gérez votre compte et vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/choose-mode')}
                  className="flex-1"
                >
                  Changer de mode utilisateur
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Fonctionnalité bientôt disponible')}
                  className="flex-1"
                >
                  Exporter mes données
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  className="flex-1 gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Se déconnecter
                </Button>
                
                <Button 
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="flex-1 gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer le compte
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
