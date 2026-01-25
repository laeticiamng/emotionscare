import React, { useCallback } from 'react';
import { Settings, Volume2, VolumeX, Monitor, Eye, Sparkles, Gauge, Timer, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface GalaxySettings {
  soundEnabled: boolean;
  volume: number;
  particleDensity: 'low' | 'medium' | 'high';
  motionIntensity: 'gentle' | 'moderate' | 'immersive';
  autoSessionEnd: boolean;
  sessionDuration: number; // minutes
  hapticFeedback: boolean;
  reducedMotion: boolean;
  galaxyTheme: 'nebula' | 'constellation' | 'cosmic' | 'aurora';
  breathingGuide: boolean;
}

interface GalaxySettingsPanelProps {
  settings: GalaxySettings;
  onSettingsChange: (settings: GalaxySettings) => void;
  className?: string;
}

const GALAXY_THEMES = [
  { value: 'nebula', label: 'Nébuleuse', description: 'Couleurs douces et apaisantes' },
  { value: 'constellation', label: 'Constellation', description: 'Étoiles connectées' },
  { value: 'cosmic', label: 'Cosmique', description: 'Voyage interstellaire' },
  { value: 'aurora', label: 'Aurore', description: 'Ondes de lumière' },
];

const MOTION_LEVELS = [
  { value: 'gentle', label: 'Doux', icon: '🌙' },
  { value: 'moderate', label: 'Modéré', icon: '✨' },
  { value: 'immersive', label: 'Immersif', icon: '🌌' },
];

export const GalaxySettingsPanel: React.FC<GalaxySettingsPanelProps> = ({
  settings,
  onSettingsChange,
  className
}) => {
  const updateSetting = useCallback(<K extends keyof GalaxySettings>(
    key: K,
    value: GalaxySettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  }, [settings, onSettingsChange]);

  return (
    <Card className={cn('bg-card/80 backdrop-blur-sm border-border/50', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Paramètres VR Galaxy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Audio */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            Audio
          </h4>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-enabled">Sons d'ambiance</Label>
              <Switch
                id="sound-enabled"
                checked={settings.soundEnabled}
                onCheckedChange={(v) => updateSetting('soundEnabled', v)}
              />
            </div>
            {settings.soundEnabled && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Volume</span>
                  <span>{settings.volume}%</span>
                </div>
                <Slider
                  value={[settings.volume]}
                  onValueChange={([v]) => updateSetting('volume', v)}
                  max={100}
                  step={5}
                />
              </div>
            )}
          </div>
        </div>

        {/* Thème de galaxie */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Thème visuel
          </h4>
          <Select
            value={settings.galaxyTheme}
            onValueChange={(v) => updateSetting('galaxyTheme', v as GalaxySettings['galaxyTheme'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GALAXY_THEMES.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  <div className="flex flex-col">
                    <span>{theme.label}</span>
                    <span className="text-xs text-muted-foreground">{theme.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Intensité du mouvement */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Intensité du mouvement
          </h4>
          <div className="flex gap-2">
            {MOTION_LEVELS.map((level) => (
              <Button
                key={level.value}
                variant={settings.motionIntensity === level.value ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => updateSetting('motionIntensity', level.value as GalaxySettings['motionIntensity'])}
              >
                <span className="mr-1">{level.icon}</span>
                {level.label}
              </Button>
            ))}
          </div>
          {settings.motionIntensity === 'immersive' && (
            <p className="text-xs text-amber-500 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Mode intense - prenez des pauses régulières
            </p>
          )}
        </div>

        {/* Densité des particules */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Performance
          </h4>
          <div className="space-y-2 pl-6">
            <Label className="text-sm text-muted-foreground">Densité des particules</Label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <Badge
                  key={level}
                  variant={settings.particleDensity === level ? 'default' : 'outline'}
                  className="cursor-pointer flex-1 justify-center"
                  onClick={() => updateSetting('particleDensity', level)}
                >
                  {level === 'low' ? 'Légère' : level === 'medium' ? 'Moyenne' : 'Dense'}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Session */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Session
          </h4>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-end">Fin automatique</Label>
              <Switch
                id="auto-end"
                checked={settings.autoSessionEnd}
                onCheckedChange={(v) => updateSetting('autoSessionEnd', v)}
              />
            </div>
            {settings.autoSessionEnd && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Durée max</span>
                  <span>{settings.sessionDuration} min</span>
                </div>
                <Slider
                  value={[settings.sessionDuration]}
                  onValueChange={([v]) => updateSetting('sessionDuration', v)}
                  min={1}
                  max={15}
                  step={1}
                />
              </div>
            )}
          </div>
        </div>

        {/* Accessibilité */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Accessibilité
          </h4>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion">Réduire les mouvements</Label>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(v) => updateSetting('reducedMotion', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="breathing-guide">Guide de respiration</Label>
              <Switch
                id="breathing-guide"
                checked={settings.breathingGuide}
                onCheckedChange={(v) => updateSetting('breathingGuide', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="haptic">Retour haptique</Label>
              <Switch
                id="haptic"
                checked={settings.hapticFeedback}
                onCheckedChange={(v) => updateSetting('hapticFeedback', v)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
