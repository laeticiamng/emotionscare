/**
 * FlashGlowSettingsPanel - Paramètres personnalisés pour Flash Glow
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings, Volume2, Vibrate, Eye, Clock, Palette, Bell, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FlashGlowSettings {
  defaultDuration: number;
  defaultIntensity: number;
  defaultGlowType: string;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  reducedMotion: boolean;
  autoStart: boolean;
  reminderEnabled: boolean;
  reminderTime: string;
  darkModePreferred: boolean;
}

const STORAGE_KEY = 'flash-glow-settings';

const defaultSettings: FlashGlowSettings = {
  defaultDuration: 120,
  defaultIntensity: 75,
  defaultGlowType: 'energy',
  soundEnabled: true,
  hapticEnabled: true,
  reducedMotion: false,
  autoStart: false,
  reminderEnabled: false,
  reminderTime: '08:00',
  darkModePreferred: true,
};

export const FlashGlowSettingsPanel: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<FlashGlowSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSettings({ ...defaultSettings, ...JSON.parse(stored) });
    }
  }, []);

  const handleChange = <K extends keyof FlashGlowSettings>(
    key: K,
    value: FlashGlowSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setHasChanges(false);
    toast({
      title: 'Paramètres sauvegardés',
      description: 'Vos préférences Flash Glow ont été mises à jour.',
    });
    onClose?.();
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  const glowTypes = [
    { value: 'energy', label: 'Énergie', emoji: '⚡' },
    { value: 'calm', label: 'Calme', emoji: '🌊' },
    { value: 'creativity', label: 'Créativité', emoji: '🎨' },
    { value: 'confidence', label: 'Confiance', emoji: '💪' },
    { value: 'love', label: 'Amour', emoji: '💖' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Paramètres Flash Glow</h2>
            <p className="text-sm text-muted-foreground">Personnalisez votre expérience</p>
          </div>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Sauvegarder
          </Button>
        )}
      </div>

      {/* Session par défaut */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Session par défaut
          </CardTitle>
          <CardDescription>
            Configurez les paramètres de vos sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Durée par défaut</Label>
              <span className="text-sm text-muted-foreground">
                {Math.floor(settings.defaultDuration / 60)}:{(settings.defaultDuration % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <Slider
              value={[settings.defaultDuration]}
              onValueChange={([v]) => handleChange('defaultDuration', v)}
              min={60}
              max={600}
              step={30}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 min</span>
              <span>5 min</span>
              <span>10 min</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Intensité par défaut</Label>
              <span className="text-sm text-muted-foreground">{settings.defaultIntensity}%</span>
            </div>
            <Slider
              value={[settings.defaultIntensity]}
              onValueChange={([v]) => handleChange('defaultIntensity', v)}
              min={20}
              max={100}
              step={5}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Type de glow préféré
            </Label>
            <Select
              value={settings.defaultGlowType}
              onValueChange={(v) => handleChange('defaultGlowType', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {glowTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center gap-2">
                      <span>{type.emoji}</span>
                      {type.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audio & Haptics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Volume2 className="h-5 w-5" />
            Audio & Retours tactiles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sons d'ambiance</Label>
              <p className="text-xs text-muted-foreground">
                Musique douce pendant la session
              </p>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(v) => handleChange('soundEnabled', v)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Vibrate className="h-4 w-4" />
                Retour haptique
              </Label>
              <p className="text-xs text-muted-foreground">
                Vibrations subtiles aux transitions
              </p>
            </div>
            <Switch
              checked={settings.hapticEnabled}
              onCheckedChange={(v) => handleChange('hapticEnabled', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Accessibilité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5" />
            Accessibilité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Animations réduites</Label>
              <p className="text-xs text-muted-foreground">
                Moins d'effets visuels pour le confort
              </p>
            </div>
            <Switch
              checked={settings.reducedMotion}
              onCheckedChange={(v) => handleChange('reducedMotion', v)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mode sombre préféré</Label>
              <p className="text-xs text-muted-foreground">
                Interface optimisée pour les sessions
              </p>
            </div>
            <Switch
              checked={settings.darkModePreferred}
              onCheckedChange={(v) => handleChange('darkModePreferred', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rappels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            Rappels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rappel quotidien</Label>
              <p className="text-xs text-muted-foreground">
                Notification pour pratiquer
              </p>
            </div>
            <Switch
              checked={settings.reminderEnabled}
              onCheckedChange={(v) => handleChange('reminderEnabled', v)}
            />
          </div>

          {settings.reminderEnabled && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Heure du rappel</Label>
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => handleChange('reminderTime', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          Réinitialiser
        </Button>
        <div className="flex gap-2">
          {onClose && (
            <Button variant="ghost" onClick={onClose}>
              Annuler
            </Button>
          )}
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlashGlowSettingsPanel;
