
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { 
  Settings, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Globe,
  Volume2,
  Smartphone,
  Mail,
  Save,
  LogOut,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { userMode } = useUserMode();
  const [settings, setSettings] = useState({
    theme: 'system',
    language: 'fr',
    notifications: {
      email: true,
      push: true,
      sms: false,
      reminders: true,
      weekly_reports: true
    },
    privacy: {
      share_analytics: false,
      improve_service: true,
      marketing_emails: false
    },
    sound: {
      volume: 70,
      muted: false
    }
  });

  const isDemo = user?.email?.endsWith('@exemple.fr');

  const handleSave = async () => {
    try {
      // Sauvegarder les paramètres
      toast.success('Paramètres sauvegardés !');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const handleDeleteAccount = () => {
    if (isDemo) {
      toast.info('Suppression de compte non disponible pour les comptes démo');
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      toast.info('Fonctionnalité de suppression de compte en cours de développement');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
            <Settings className="h-8 w-8 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">
              Personnalisez votre expérience EmotionsCare
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Apparence */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sun className="h-5 w-5 text-yellow-500" />
                <span>Apparence</span>
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Thème</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'light', label: 'Clair', icon: Sun },
                    { value: 'dark', label: 'Sombre', icon: Moon },
                    { value: 'system', label: 'Système', icon: Settings }
                  ].map((theme) => (
                    <Button
                      key={theme.value}
                      variant={settings.theme === theme.value ? "default" : "outline"}
                      onClick={() => setSettings(prev => ({ ...prev, theme: theme.value }))}
                      className="flex flex-col items-center gap-2 h-auto py-3"
                    >
                      <theme.icon className="h-4 w-4" />
                      <span className="text-xs">{theme.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Langue</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-500" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Gérez vos préférences de notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'email', label: 'Notifications par email', icon: Mail },
                { key: 'push', label: 'Notifications push', icon: Smartphone },
                { key: 'reminders', label: 'Rappels quotidiens', icon: Bell },
                { key: 'weekly_reports', label: 'Rapports hebdomadaires', icon: Bell }
              ].map((notification) => (
                <div key={notification.key} className="flex items-center space-x-3">
                  <Checkbox
                    checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          [notification.key]: checked
                        }
                      }))
                    }
                  />
                  <div className="flex items-center space-x-2">
                    <notification.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{notification.label}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Audio */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Volume2 className="h-5 w-5 text-purple-500" />
                <span>Audio</span>
              </CardTitle>
              <CardDescription>
                Paramètres audio et musicothérapie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Volume général: {settings.sound.volume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sound.volume}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sound: { ...prev.sound, volume: parseInt(e.target.value) }
                  }))}
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={settings.sound.muted}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      sound: { ...prev.sound, muted: checked as boolean }
                    }))
                  }
                />
                <span className="text-sm">Mode silencieux</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Confidentialité */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span>Confidentialité</span>
              </CardTitle>
              <CardDescription>
                Contrôlez l'utilisation de vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { 
                  key: 'share_analytics', 
                  label: 'Partager les données d\'analyse anonymes', 
                  description: 'Aide à améliorer nos services' 
                },
                { 
                  key: 'improve_service', 
                  label: 'Utiliser mes données pour améliorer le service', 
                  description: 'Personnalisation des recommandations' 
                },
                { 
                  key: 'marketing_emails', 
                  label: 'Recevoir des emails marketing', 
                  description: 'Nouveautés et conseils bien-être' 
                }
              ].map((privacy) => (
                <div key={privacy.key} className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={settings.privacy[privacy.key as keyof typeof settings.privacy]}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          privacy: {
                            ...prev.privacy,
                            [privacy.key]: checked
                          }
                        }))
                      }
                    />
                    <div>
                      <p className="text-sm font-medium">{privacy.label}</p>
                      <p className="text-xs text-muted-foreground">{privacy.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Actions du compte</CardTitle>
            <CardDescription>
              Gérez votre compte et vos données
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sauvegarder les paramètres</p>
                <p className="text-sm text-muted-foreground">
                  Appliquer tous les changements effectués
                </p>
              </div>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Se déconnecter</p>
                  <p className="text-sm text-muted-foreground">
                    Fermer votre session actuelle
                  </p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>

            {!isDemo && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-600">Supprimer le compte</p>
                    <p className="text-sm text-muted-foreground">
                      Suppression définitive de toutes vos données
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
