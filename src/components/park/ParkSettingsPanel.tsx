/**
 * ParkSettingsPanel - Paramètres du Parc Émotionnel
 * Configure les préférences utilisateur pour l'expérience du parc
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Volume2, Eye, Palette, Zap, Moon, Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUserPreference } from '@/hooks/useSupabaseStorage';
import { toast } from 'sonner';

interface ParkSettings {
  notifications: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  animations: boolean;
  autoplay: boolean;
  energyReminders: boolean;
  dailyChallengeNotif: boolean;
  questAlerts: boolean;
  animationSpeed: number;
  volume: number;
}

const defaultSettings: ParkSettings = {
  notifications: true,
  soundEffects: true,
  hapticFeedback: true,
  animations: true,
  autoplay: false,
  energyReminders: true,
  dailyChallengeNotif: true,
  questAlerts: true,
  animationSpeed: 50,
  volume: 70
};

export const ParkSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useUserPreference<ParkSettings>('park-settings', defaultSettings);

  const updateSetting = <K extends keyof ParkSettings>(key: K, value: ParkSettings[K]) => {
    setSettings({ ...settings, [key]: value });
    toast.success('Paramètre mis à jour');
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    toast.success('Paramètres réinitialisés');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Settings className="h-6 w-6 text-primary" />
        </motion.div>
        <h2 className="text-xl font-bold">Paramètres du Parc</h2>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="flex flex-col gap-1">
              <span>Notifications push</span>
              <span className="text-xs text-muted-foreground">Rappels et alertes générales</span>
            </Label>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSetting('notifications', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="dailyChallengeNotif" className="flex flex-col gap-1">
              <span>Défis quotidiens</span>
              <span className="text-xs text-muted-foreground">Notification du défi du jour</span>
            </Label>
            <Switch
              id="dailyChallengeNotif"
              checked={settings.dailyChallengeNotif}
              onCheckedChange={(checked) => updateSetting('dailyChallengeNotif', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="questAlerts" className="flex flex-col gap-1">
              <span>Alertes de quête</span>
              <span className="text-xs text-muted-foreground">Progression et accomplissements</span>
            </Label>
            <Switch
              id="questAlerts"
              checked={settings.questAlerts}
              onCheckedChange={(checked) => updateSetting('questAlerts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="energyReminders" className="flex flex-col gap-1">
              <span>Rappels d'énergie</span>
              <span className="text-xs text-muted-foreground">Quand l'énergie est rechargée</span>
            </Label>
            <Switch
              id="energyReminders"
              checked={settings.energyReminders}
              onCheckedChange={(checked) => updateSetting('energyReminders', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audio & Haptic */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Volume2 className="h-5 w-5 text-primary" />
            Audio & Retour tactile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="soundEffects" className="flex flex-col gap-1">
              <span>Effets sonores</span>
              <span className="text-xs text-muted-foreground">Sons du parc et interactions</span>
            </Label>
            <Switch
              id="soundEffects"
              checked={settings.soundEffects}
              onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex justify-between">
              <span>Volume</span>
              <span className="text-muted-foreground">{settings.volume}%</span>
            </Label>
            <Slider
              value={[settings.volume]}
              onValueChange={([value]) => updateSetting('volume', value)}
              max={100}
              step={5}
              className="w-full"
              disabled={!settings.soundEffects}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="hapticFeedback" className="flex flex-col gap-1">
              <span>Retour haptique</span>
              <span className="text-xs text-muted-foreground">Vibrations lors des actions</span>
            </Label>
            <Switch
              id="hapticFeedback"
              checked={settings.hapticFeedback}
              onCheckedChange={(checked) => updateSetting('hapticFeedback', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Visuels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5 text-primary" />
            Apparence & Animations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="animations" className="flex flex-col gap-1">
              <span>Animations</span>
              <span className="text-xs text-muted-foreground">Effets visuels et transitions</span>
            </Label>
            <Switch
              id="animations"
              checked={settings.animations}
              onCheckedChange={(checked) => updateSetting('animations', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex justify-between">
              <span>Vitesse des animations</span>
              <span className="text-muted-foreground">{settings.animationSpeed}%</span>
            </Label>
            <Slider
              value={[settings.animationSpeed]}
              onValueChange={([value]) => updateSetting('animationSpeed', value)}
              max={100}
              step={10}
              className="w-full"
              disabled={!settings.animations}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="autoplay" className="flex flex-col gap-1">
              <span>Lecture automatique</span>
              <span className="text-xs text-muted-foreground">Démarrer les médias automatiquement</span>
            </Label>
            <Switch
              id="autoplay"
              checked={settings.autoplay}
              onCheckedChange={(checked) => updateSetting('autoplay', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reset */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={resetSettings}>
          Réinitialiser les paramètres
        </Button>
      </div>
    </motion.div>
  );
};

export default ParkSettingsPanel;
