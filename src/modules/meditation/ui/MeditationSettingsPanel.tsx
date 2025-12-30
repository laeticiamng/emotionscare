/**
 * Panneau de paramètres méditation
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, Bell, Volume2, Vibrate, Moon,
  RotateCcw, Save, Clock, Music, Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { meditationDurations, type MeditationDuration } from '../types';

interface MeditationSettings {
  // Session defaults
  defaultDuration: MeditationDuration;
  defaultWithGuidance: boolean;
  defaultWithMusic: boolean;
  
  // Audio
  bellSoundEnabled: boolean;
  bellVolume: number;
  ambientVolume: number;
  
  // Notifications
  reminderEnabled: boolean;
  reminderTime: string;
  sessionCompleteNotification: boolean;
  
  // Visual
  darkModeDuringSession: boolean;
  showBreathingGuide: boolean;
  
  // Haptics
  hapticsEnabled: boolean;
}

const DEFAULT_SETTINGS: MeditationSettings = {
  defaultDuration: 10,
  defaultWithGuidance: true,
  defaultWithMusic: true,
  bellSoundEnabled: true,
  bellVolume: 70,
  ambientVolume: 50,
  reminderEnabled: false,
  reminderTime: '08:00',
  sessionCompleteNotification: true,
  darkModeDuringSession: true,
  showBreathingGuide: true,
  hapticsEnabled: true,
};

const STORAGE_KEY = 'meditation-settings';

export const MeditationSettingsPanel: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<MeditationSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch {
        // Ignore
      }
    }
  }, []);

  const updateSetting = <K extends keyof MeditationSettings>(
    key: K,
    value: MeditationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setHasChanges(false);
    toast({
      title: 'Paramètres sauvegardés',
      description: 'Vos préférences de méditation ont été enregistrées',
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
    setHasChanges(false);
    toast({
      title: 'Paramètres réinitialisés',
      description: 'Les valeurs par défaut ont été restaurées',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Paramètres de méditation
        </CardTitle>
        <CardDescription>Personnalisez votre expérience de méditation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Session Defaults */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <h3 className="font-medium">Paramètres de session</h3>
          </div>

          <div className="space-y-4 pl-6">
            <div className="space-y-2">
              <Label className="text-sm">Durée par défaut</Label>
              <div className="flex flex-wrap gap-2">
                {meditationDurations.map(duration => (
                  <Button
                    key={duration}
                    variant={settings.defaultDuration === duration ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('defaultDuration', duration)}
                  >
                    {duration} min
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="guidance" className="flex-1">
                Guidage vocal par défaut
                <span className="text-xs text-muted-foreground block">
                  Activer le guidage pour les nouvelles sessions
                </span>
              </Label>
              <Switch
                id="guidance"
                checked={settings.defaultWithGuidance}
                onCheckedChange={(v) => updateSetting('defaultWithGuidance', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="music" className="flex-1">
                Musique ambiante par défaut
              </Label>
              <Switch
                id="music"
                checked={settings.defaultWithMusic}
                onCheckedChange={(v) => updateSetting('defaultWithMusic', v)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Audio */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-primary" />
            <h3 className="font-medium">Audio</h3>
          </div>

          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="bell" className="flex-1">
                Son de cloche
                <span className="text-xs text-muted-foreground block">
                  Début et fin de session
                </span>
              </Label>
              <Switch
                id="bell"
                checked={settings.bellSoundEnabled}
                onCheckedChange={(v) => updateSetting('bellSoundEnabled', v)}
              />
            </div>

            {settings.bellSoundEnabled && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Volume de la cloche</Label>
                <Slider
                  value={[settings.bellVolume]}
                  onValueChange={([v]) => updateSetting('bellVolume', v)}
                  max={100}
                />
                <div className="text-xs text-right text-muted-foreground">{settings.bellVolume}%</div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Volume des sons ambiants</Label>
              <Slider
                value={[settings.ambientVolume]}
                onValueChange={([v]) => updateSetting('ambientVolume', v)}
                max={100}
              />
              <div className="text-xs text-right text-muted-foreground">{settings.ambientVolume}%</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="font-medium">Rappels</h3>
          </div>

          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="reminder" className="flex-1">
                Rappel quotidien
                <span className="text-xs text-muted-foreground block">
                  Notification pour méditer
                </span>
              </Label>
              <Switch
                id="reminder"
                checked={settings.reminderEnabled}
                onCheckedChange={(v) => updateSetting('reminderEnabled', v)}
              />
            </div>

            {settings.reminderEnabled && (
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => updateSetting('reminderTime', e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="complete-notif" className="flex-1">
                Notification de fin de session
              </Label>
              <Switch
                id="complete-notif"
                checked={settings.sessionCompleteNotification}
                onCheckedChange={(v) => updateSetting('sessionCompleteNotification', v)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Visual & Haptics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-primary" />
            <h3 className="font-medium">Expérience</h3>
          </div>

          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-session" className="flex-1">
                Mode sombre pendant session
                <span className="text-xs text-muted-foreground block">
                  Assombrir l'écran automatiquement
                </span>
              </Label>
              <Switch
                id="dark-session"
                checked={settings.darkModeDuringSession}
                onCheckedChange={(v) => updateSetting('darkModeDuringSession', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="breathing" className="flex-1">
                Guide respiratoire visuel
              </Label>
              <Switch
                id="breathing"
                checked={settings.showBreathingGuide}
                onCheckedChange={(v) => updateSetting('showBreathingGuide', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="haptics" className="flex-1">
                <div className="flex items-center gap-2">
                  <Vibrate className="w-3 h-3" />
                  Retour haptique
                </div>
              </Label>
              <Switch
                id="haptics"
                checked={settings.hapticsEnabled}
                onCheckedChange={(v) => updateSetting('hapticsEnabled', v)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetSettings} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </Button>
          <Button onClick={saveSettings} disabled={!hasChanges} className="flex-1 gap-2">
            <Save className="w-4 h-4" />
            Sauvegarder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationSettingsPanel;
