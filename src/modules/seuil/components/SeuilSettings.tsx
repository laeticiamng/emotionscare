/**
 * Paramètres du module SEUIL
 * Personnalisation des rappels, seuils et préférences
 * Avec persistance réelle des données
 */
import React, { memo, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Volume2, 
  Vibrate, 
  Target,
  Palette,
  Save,
  RotateCcw
} from 'lucide-react';
import { useSeuilSettings, useSaveSeuilSettings } from '../hooks/useSeuilSettings';

export interface SeuilUserSettings {
  remindersEnabled: boolean;
  reminderTimes: string[];
  reminderDays: number[];
  soundEnabled: boolean;
  hapticEnabled: boolean;
  soundVolume: number;
  customThresholds: {
    intermediate: number;
    critical: number;
    closure: number;
  };
  showInsights: boolean;
  showTrends: boolean;
  compactMode: boolean;
}

const DEFAULT_SETTINGS: SeuilUserSettings = {
  remindersEnabled: false,
  reminderTimes: ['09:00', '20:00'],
  reminderDays: [1, 2, 3, 4, 5],
  soundEnabled: true,
  hapticEnabled: true,
  soundVolume: 50,
  customThresholds: {
    intermediate: 31,
    critical: 61,
    closure: 86,
  },
  showInsights: true,
  showTrends: true,
  compactMode: false,
};

interface SeuilSettingsProps {
  onSave?: (settings: SeuilUserSettings) => void;
}

export const SeuilSettings: React.FC<SeuilSettingsProps> = memo(({ onSave }) => {
  const { data: savedSettings } = useSeuilSettings();
  const saveSettings = useSaveSeuilSettings();
  
  const [settings, setSettings] = useState<SeuilUserSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, [savedSettings]);

  const updateSetting = useCallback(<K extends keyof SeuilUserSettings>(
    key: K, 
    value: SeuilUserSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    saveSettings.mutate(settings);
    setHasChanges(false);
    onSave?.(settings);
  }, [settings, saveSettings, onSave]);

  const handleReset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
  }, []);

  const DAYS = [
    { value: 1, label: 'Lun' },
    { value: 2, label: 'Mar' },
    { value: 3, label: 'Mer' },
    { value: 4, label: 'Jeu' },
    { value: 5, label: 'Ven' },
    { value: 6, label: 'Sam' },
    { value: 0, label: 'Dim' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Rappels */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Rappels
          </CardTitle>
          <CardDescription>
            Configure des rappels pour penser à faire le point
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="reminders-enabled">Activer les rappels</Label>
            <Switch
              id="reminders-enabled"
              checked={settings.remindersEnabled}
              onCheckedChange={(checked) => updateSetting('remindersEnabled', checked)}
            />
          </div>

          {settings.remindersEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-2"
            >
              <div>
                <Label className="text-sm mb-2 block">Jours actifs</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <Button
                      key={day.value}
                      variant={settings.reminderDays.includes(day.value) ? 'default' : 'outline'}
                      size="sm"
                      className="w-10 h-10 p-0"
                      onClick={() => {
                        const newDays = settings.reminderDays.includes(day.value)
                          ? settings.reminderDays.filter(d => d !== day.value)
                          : [...settings.reminderDays, day.value];
                        updateSetting('reminderDays', newDays);
                      }}
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Heures de rappel</Label>
                <div className="flex flex-wrap gap-2">
                  {['08:00', '09:00', '12:00', '14:00', '18:00', '20:00', '22:00'].map(time => (
                    <Badge
                      key={time}
                      variant={settings.reminderTimes.includes(time) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const newTimes = settings.reminderTimes.includes(time)
                          ? settings.reminderTimes.filter(t => t !== time)
                          : [...settings.reminderTimes, time].sort();
                        updateSetting('reminderTimes', newTimes);
                      }}
                    >
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="sound-enabled">Sons</Label>
            </div>
            <Switch
              id="sound-enabled"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
            />
          </div>

          {settings.soundEnabled && (
            <div className="pl-6">
              <Label className="text-sm mb-2 block">Volume</Label>
              <Slider
                value={[settings.soundVolume]}
                onValueChange={([v]) => updateSetting('soundVolume', v)}
                min={0}
                max={100}
                step={10}
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Vibrate className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="haptic-enabled">Vibrations</Label>
            </div>
            <Switch
              id="haptic-enabled"
              checked={settings.hapticEnabled}
              onCheckedChange={(checked) => updateSetting('hapticEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Seuils personnalisés */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4" />
            Seuils personnalisés
          </CardTitle>
          <CardDescription>
            Ajuste les limites des zones selon ta sensibilité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                Début zone intermédiaire
              </span>
              <span className="font-medium">{settings.customThresholds.intermediate}%</span>
            </div>
            <Slider
              value={[settings.customThresholds.intermediate]}
              onValueChange={([v]) => updateSetting('customThresholds', {
                ...settings.customThresholds,
                intermediate: v,
              })}
              min={20}
              max={40}
              step={1}
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                Début zone critique
              </span>
              <span className="font-medium">{settings.customThresholds.critical}%</span>
            </div>
            <Slider
              value={[settings.customThresholds.critical]}
              onValueChange={([v]) => updateSetting('customThresholds', {
                ...settings.customThresholds,
                critical: v,
              })}
              min={50}
              max={70}
              step={1}
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                Début zone de clôture
              </span>
              <span className="font-medium">{settings.customThresholds.closure}%</span>
            </div>
            <Slider
              value={[settings.customThresholds.closure]}
              onValueChange={([v]) => updateSetting('customThresholds', {
                ...settings.customThresholds,
                closure: v,
              })}
              min={75}
              max={95}
              step={1}
            />
          </div>
        </CardContent>
      </Card>

      {/* Affichage */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Affichage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-insights">Afficher les insights</Label>
            <Switch
              id="show-insights"
              checked={settings.showInsights}
              onCheckedChange={(checked) => updateSetting('showInsights', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-trends">Afficher les tendances</Label>
            <Switch
              id="show-trends"
              checked={settings.showTrends}
              onCheckedChange={(checked) => updateSetting('showTrends', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="compact-mode">Mode compact</Label>
            <Switch
              id="compact-mode"
              checked={settings.compactMode}
              onCheckedChange={(checked) => updateSetting('compactMode', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1 gap-2"
          onClick={handleReset}
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </Button>
        <Button 
          className="flex-1 gap-2"
          onClick={handleSave}
          disabled={!hasChanges}
        >
          <Save className="w-4 h-4" />
          Enregistrer
        </Button>
      </div>
    </motion.div>
  );
});

SeuilSettings.displayName = 'SeuilSettings';

export default SeuilSettings;
