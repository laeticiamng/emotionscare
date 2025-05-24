
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { 
  Settings, 
  Bell, 
  Moon, 
  Globe, 
  Volume2, 
  Shield, 
  Mail,
  Smartphone,
  Clock,
  Palette,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    reminderFrequency: 'daily',
    reminderTime: '09:00',
    weekendReminders: false,
    
    // Appearance
    theme: 'system',
    language: 'fr',
    fontSize: 'medium',
    
    // Privacy
    dataCollection: true,
    analytics: true,
    publicProfile: false,
    
    // Audio
    soundEffects: true,
    volume: [75],
    voiceGender: 'female',
    
    // Advanced
    autoSave: true,
    offlineMode: false,
    debugMode: false
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Here you would save settings to Supabase
      toast.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const settingSections = [
    {
      title: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications par email</p>
              <p className="text-sm text-muted-foreground">Recevoir des emails de rappel et d'actualités</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications push</p>
              <p className="text-sm text-muted-foreground">Notifications sur votre appareil</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Rappels le weekend</p>
              <p className="text-sm text-muted-foreground">Continuer les rappels le weekend</p>
            </div>
            <Switch
              checked={settings.weekendReminders}
              onCheckedChange={(checked) => handleSettingChange('weekendReminders', checked)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Fréquence des rappels</label>
            <Select value={settings.reminderFrequency} onValueChange={(value) => handleSettingChange('reminderFrequency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Jamais</SelectItem>
                <SelectItem value="daily">Quotidien</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Heure des rappels</label>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Apparence',
      icon: <Palette className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Thème</label>
            <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
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
            <label className="text-sm font-medium">Langue</label>
            <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
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
            <label className="text-sm font-medium">Taille de police</label>
            <Select value={settings.fontSize} onValueChange={(value) => handleSettingChange('fontSize', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Petite</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      title: 'Audio et Voix',
      icon: <Volume2 className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Effets sonores</p>
              <p className="text-sm text-muted-foreground">Sons de notification et de feedback</p>
            </div>
            <Switch
              checked={settings.soundEffects}
              onCheckedChange={(checked) => handleSettingChange('soundEffects', checked)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Volume général</label>
            <Slider
              value={settings.volume}
              onValueChange={(value) => handleSettingChange('volume', value)}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>{settings.volume[0]}%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Voix du coach IA</label>
            <Select value={settings.voiceGender} onValueChange={(value) => handleSettingChange('voiceGender', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Voix féminine</SelectItem>
                <SelectItem value="male">Voix masculine</SelectItem>
                <SelectItem value="neutral">Voix neutre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      title: 'Confidentialité',
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Collecte de données</p>
              <p className="text-sm text-muted-foreground">Aider à améliorer l'application</p>
            </div>
            <Switch
              checked={settings.dataCollection}
              onCheckedChange={(checked) => handleSettingChange('dataCollection', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Analytics</p>
              <p className="text-sm text-muted-foreground">Statistiques d'utilisation anonymes</p>
            </div>
            <Switch
              checked={settings.analytics}
              onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profil public</p>
              <p className="text-sm text-muted-foreground">Visible par les autres utilisateurs</p>
            </div>
            <Switch
              checked={settings.publicProfile}
              onCheckedChange={(checked) => handleSettingChange('publicProfile', checked)}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Avancé',
      icon: <Settings className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sauvegarde automatique</p>
              <p className="text-sm text-muted-foreground">Sauvegarder automatiquement vos données</p>
            </div>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mode hors ligne</p>
              <p className="text-sm text-muted-foreground">Utiliser l'app sans connexion internet</p>
            </div>
            <Switch
              checked={settings.offlineMode}
              onCheckedChange={(checked) => handleSettingChange('offlineMode', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mode développeur</p>
              <p className="text-sm text-muted-foreground">Afficher les informations de débogage</p>
            </div>
            <Switch
              checked={settings.debugMode}
              onCheckedChange={(checked) => handleSettingChange('debugMode', checked)}
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
            <p className="text-muted-foreground mt-1">
              Personnalisez votre expérience EmotionsCare
            </p>
          </div>
          
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {section.icon}
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {section.content}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Zone de danger</CardTitle>
            <CardDescription>
              Actions irréversibles sur votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Réinitialiser tous les paramètres
            </Button>
            
            <Button variant="outline" className="w-full">
              Exporter mes données
            </Button>
            
            <Button variant="destructive" className="w-full">
              Supprimer mon compte
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
