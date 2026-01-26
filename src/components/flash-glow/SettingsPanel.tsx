/**
 * SettingsPanel - Configuration Flash Glow
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Settings, Volume2, Vibrate, Clock, Sparkles } from 'lucide-react';
import type { FlashGlowConfig } from './types';
import { GLOW_TYPES } from './types';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  config: FlashGlowConfig;
  onConfigChange: (config: Partial<FlashGlowConfig>) => void;
  disabled?: boolean;
}

const DURATION_PRESETS = [
  { value: 60, label: '1 min', description: 'Express' },
  { value: 90, label: '1.5 min', description: 'Standard' },
  { value: 120, label: '2 min', description: 'Profond' },
  { value: 180, label: '3 min', description: 'Intense' },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  config, 
  onConfigChange, 
  disabled = false 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Type de Glow */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Type de Glow
          </Label>
          <RadioGroup
            value={config.glowType}
            onValueChange={(value) => onConfigChange({ glowType: value })}
            disabled={disabled}
            className="grid grid-cols-2 gap-2"
          >
            {GLOW_TYPES.map((glow) => (
              <Label
                key={glow.id}
                htmlFor={`glow-${glow.id}`}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                  config.glowType === glow.id 
                    ? "border-primary bg-primary/10" 
                    : "border-muted hover:border-primary/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <RadioGroupItem 
                  value={glow.id} 
                  id={`glow-${glow.id}`}
                  className="sr-only"
                />
                <span className="text-xl">{glow.icon}</span>
                <div>
                  <div className="font-medium text-sm">{glow.name}</div>
                  <div className="text-xs text-muted-foreground">{glow.description}</div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Durée */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" aria-hidden="true" />
            Durée
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {DURATION_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => onConfigChange({ duration: preset.value })}
                disabled={disabled}
                className={cn(
                  "p-2 rounded-lg border text-center transition-all",
                  config.duration === preset.value
                    ? "border-primary bg-primary/10"
                    : "border-muted hover:border-primary/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="font-medium text-sm">{preset.label}</div>
                <div className="text-xs text-muted-foreground">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Intensité */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Intensité</Label>
            <span className="text-sm text-muted-foreground">{config.intensity}%</span>
          </div>
          <Slider
            value={[config.intensity]}
            onValueChange={([value]) => onConfigChange({ intensity: value })}
            min={20}
            max={100}
            step={5}
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Doux</span>
            <span>Intense</span>
          </div>
        </div>

        {/* Audio */}
        <div className="flex items-center justify-between">
          <Label htmlFor="audio-toggle" className="flex items-center gap-2 cursor-pointer">
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            Sons de guidage
          </Label>
          <Switch
            id="audio-toggle"
            checked={config.audioEnabled}
            onCheckedChange={(checked) => onConfigChange({ audioEnabled: checked })}
            disabled={disabled}
          />
        </div>

        {/* Haptics */}
        <div className="flex items-center justify-between">
          <Label htmlFor="haptics-toggle" className="flex items-center gap-2 cursor-pointer">
            <Vibrate className="h-4 w-4" aria-hidden="true" />
            Retour haptique
          </Label>
          <Switch
            id="haptics-toggle"
            checked={config.hapticsEnabled}
            onCheckedChange={(checked) => onConfigChange({ hapticsEnabled: checked })}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
