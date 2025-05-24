
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { 
  Settings, Bell, Moon, Sun, Monitor, 
  Shield, Database, Palette, Languages 
} from 'lucide-react';
import { toast } from 'sonner';
import LoadingAnimation from '@/components/ui/loading-animation';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false,
      reminders: true
    },
    privacy: {
      shareData: false,
      showProfile: true,
      analytics: true
    },
    appearance: {
      theme: 'system',
      language: 'fr'
    }
  });

  useEffect(() => {
    // Simuler le chargement des paramètres
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement des paramètres..." />
      </div>
    );
  }

  const isDemo = user?.email?.endsWith('@exemple.fr');

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-4xl">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
            <Settings className="h-8 w-8" />
            Paramètres
          </h1>
          <p className="text-muted-foreground">
            Personnalisez votre expérience EmotionsCare
          </p>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
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
                <Label htmlFor="email-notifications">Notifications par email</Label>
                <p className="text-sm text-muted-foreground">
                  Recevez des rappels et mises à jour par email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.notifications.email}
                onCheckedChange={(checked) => 
                  handleSettingChange('notifications', 'email', checked)
                }
                disabled={isDemo}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Notifications push</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications en temps réel dans votre navigateur
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.notifications.push}
                onCheckedChange={(checked) => 
                  handleSettingChange('notifications', 'push', checked)
                }
                disabled={isDemo}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reminders">Rappels quotidiens</Label>
                <p className="text-sm text-muted-foreground">
                  Rappels pour vos sessions de bien-être
                </p>
              </div>
              <Switch
                id="reminders"
                checked={settings.notifications.reminders}
                onCheckedChange={(checked) => 
                  handleSettingChange('notifications', 'reminders', checked)
                }
                disabled={isDemo}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Apparence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
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
            <div>
              <Label>Thème</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { value: 'light', label: 'Clair', icon: Sun },
                  { value: 'dark', label: 'Sombre', icon: Moon },
                  { value: 'system', label: 'Système', icon: Monitor }
                ].map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <Button
                      key={theme.value}
                      variant={settings.appearance.theme === theme.value ? "default" : "outline"}
                      onClick={() => !isDemo && handleSettingChange('appearance', 'theme', theme.value)}
                      className="flex flex-col items-center gap-2 h-auto p-4"
                      disabled={isDemo}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{theme.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Langue
              </Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { value: 'fr', label: 'Français' },
                  { value: 'en', label: 'English' }
                ].map((lang) => (
                  <Button
                    key={lang.value}
                    variant={settings.appearance.language === lang.value ? "default" : "outline"}
                    onClick={() => !isDemo && handleSettingChange('appearance', 'language', lang.value)}
                    disabled={isDemo}
                  >
                    {lang.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Confidentialité et données */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Confidentialité et données
            </CardTitle>
            <CardDescription>
              Contrôlez vos données personnelles et leur utilisation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="share-data">Partage de données anonymisées</Label>
                <p className="text-sm text-muted-foreground">
                  Contribuer à l'amélioration des services (données anonymes)
                </p>
              </div>
              <Switch
                id="share-data"
                checked={settings.privacy.shareData}
                onCheckedChange={(checked) => 
                  handleSettingChange('privacy', 'shareData', checked)
                }
                disabled={isDemo}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analytics">Analytics et métriques</Label>
                <p className="text-sm text-muted-foreground">
                  Permettre la collecte d'analytics pour votre suivi personnel
                </p>
              </div>
              <Switch
                id="analytics"
                checked={settings.privacy.analytics}
                onCheckedChange={(checked) => 
                  handleSettingChange('privacy', 'analytics', checked)
                }
                disabled={isDemo}
              />
            </div>

            {(userMode === 'b2b_user' || userMode === 'b2b_admin') && (
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-profile">Profil visible aux collègues</Label>
                  <p className="text-sm text-muted-foreground">
                    Rendre votre profil visible aux autres membres de l'équipe
                  </p>
                </div>
                <Switch
                  id="show-profile"
                  checked={settings.privacy.showProfile}
                  onCheckedChange={(checked) => 
                    handleSettingChange('privacy', 'showProfile', checked)
                  }
                  disabled={isDemo}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Gestion des données */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Gestion des données
            </CardTitle>
            <CardDescription>
              Exportez ou supprimez vos données personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" disabled={isDemo}>
                Exporter mes données
              </Button>
              <Button variant="outline" disabled={isDemo}>
                Télécharger mon historique
              </Button>
            </div>
            
            <div className="p-4 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-600 mb-2">Suppression des données</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Supprime définitivement toutes vos données personnelles. Cette action est irréversible.
              </p>
              <Button variant="destructive" size="sm" disabled={isDemo}>
                Supprimer toutes mes données
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {isDemo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <p className="text-sm text-orange-700 text-center">
                ⚠️ Vous êtes en mode démo. Les modifications des paramètres sont désactivées.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default SettingsPage;
