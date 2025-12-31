/**
 * VR Settings Modal - Paramètres utilisateur VR
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVRSettings, VRSettings } from '@/hooks/useVRSettings';
import { RotateCcw, Volume2, Vibrate, Eye, Target, Bell } from 'lucide-react';

interface VRSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SCENE_OPTIONS = [
  { value: 'galaxy', label: 'Galaxie' },
  { value: 'ocean', label: 'Océan' },
  { value: 'forest', label: 'Forêt' },
  { value: 'space', label: 'Espace' },
  { value: 'aurora', label: 'Aurore boréale' },
  { value: 'cosmos', label: 'Cosmos' },
];

const PATTERN_OPTIONS = [
  { value: 'box', label: 'Box Breathing (4-4-4-4)' },
  { value: 'coherence', label: 'Cohérence cardiaque (5-5)' },
  { value: 'relax', label: 'Relaxation (4-7-8)' },
  { value: 'energize', label: 'Énergisant (3-0-5)' },
  { value: 'calm', label: 'Calme (6-6)' },
];

const DURATION_OPTIONS = [
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30 minutes' },
];

export function VRSettingsModal({ open, onOpenChange }: VRSettingsModalProps) {
  const { settings, saveSettings, resetSettings, isLoaded } = useVRSettings();

  if (!isLoaded) return null;

  const handleChange = <K extends keyof VRSettings>(key: K, value: VRSettings[K]) => {
    saveSettings({ [key]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Paramètres VR
          </DialogTitle>
          <DialogDescription>
            Personnalisez votre expérience de réalité virtuelle
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Scène par défaut */}
          <div className="space-y-2">
            <Label htmlFor="defaultScene">Scène par défaut</Label>
            <Select
              value={settings.defaultScene}
              onValueChange={(v) => handleChange('defaultScene', v as VRSettings['defaultScene'])}
            >
              <SelectTrigger id="defaultScene">
                <SelectValue placeholder="Choisir une scène" />
              </SelectTrigger>
              <SelectContent>
                {SCENE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pattern par défaut */}
          <div className="space-y-2">
            <Label htmlFor="defaultPattern">Pattern de respiration</Label>
            <Select
              value={settings.defaultPattern}
              onValueChange={(v) => handleChange('defaultPattern', v as VRSettings['defaultPattern'])}
            >
              <SelectTrigger id="defaultPattern">
                <SelectValue placeholder="Choisir un pattern" />
              </SelectTrigger>
              <SelectContent>
                {PATTERN_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Durée par défaut */}
          <div className="space-y-2">
            <Label htmlFor="defaultDuration">Durée de session par défaut</Label>
            <Select
              value={settings.defaultDuration.toString()}
              onValueChange={(v) => handleChange('defaultDuration', parseInt(v))}
            >
              <SelectTrigger id="defaultDuration">
                <SelectValue placeholder="Choisir une durée" />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value.toString()}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Objectif hebdomadaire */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Objectif hebdomadaire
              </Label>
              <span className="text-sm font-medium">{settings.weeklyGoalMinutes} min</span>
            </div>
            <Slider
              value={[settings.weeklyGoalMinutes]}
              onValueChange={([v]) => handleChange('weeklyGoalMinutes', v)}
              min={15}
              max={180}
              step={15}
              className="w-full"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="vrMode" className="flex items-center gap-2 cursor-pointer">
                <Eye className="h-4 w-4" />
                Mode VR activé
              </Label>
              <Switch
                id="vrMode"
                checked={settings.vrModeEnabled}
                onCheckedChange={(v) => handleChange('vrModeEnabled', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="audio" className="flex items-center gap-2 cursor-pointer">
                <Volume2 className="h-4 w-4" />
                Audio activé
              </Label>
              <Switch
                id="audio"
                checked={settings.audioEnabled}
                onCheckedChange={(v) => handleChange('audioEnabled', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="haptic" className="flex items-center gap-2 cursor-pointer">
                <Vibrate className="h-4 w-4" />
                Retour haptique
              </Label>
              <Switch
                id="haptic"
                checked={settings.hapticFeedback}
                onCheckedChange={(v) => handleChange('hapticFeedback', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reducedMotion" className="flex items-center gap-2 cursor-pointer">
                Mouvements réduits (accessibilité)
              </Label>
              <Switch
                id="reducedMotion"
                checked={settings.reducedMotion}
                onCheckedChange={(v) => handleChange('reducedMotion', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reminder" className="flex items-center gap-2 cursor-pointer">
                <Bell className="h-4 w-4" />
                Rappels quotidiens
              </Label>
              <Switch
                id="reminder"
                checked={settings.reminderEnabled}
                onCheckedChange={(v) => handleChange('reminderEnabled', v)}
              />
            </div>
          </div>

          {/* Reset button */}
          <Button
            variant="outline"
            onClick={resetSettings}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser les paramètres
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VRSettingsModal;
