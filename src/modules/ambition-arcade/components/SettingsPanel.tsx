/**
 * Panneau de paramètres Ambition Arcade
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, Bell, Volume2, Vibrate, Sparkles, RotateCcw, Save,
  BellRing, Trophy, Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AmbitionSettings {
  // Notifications
  notificationsEnabled: boolean;
  streakReminders: boolean;
  achievementAlerts: boolean;
  dailyDigest: boolean;
  
  // Audio & Haptics
  soundEnabled: boolean;
  soundVolume: number;
  hapticsEnabled: boolean;
  
  // Visual
  confettiEnabled: boolean;
  animationsReduced: boolean;
  
  // Gamification
  showXpGains: boolean;
  autoStartTimer: boolean;
  dailyGoal: number;
}

const DEFAULT_SETTINGS: AmbitionSettings = {
  notificationsEnabled: true,
  streakReminders: true,
  achievementAlerts: true,
  dailyDigest: false,
  soundEnabled: true,
  soundVolume: 70,
  hapticsEnabled: true,
  confettiEnabled: true,
  animationsReduced: false,
  showXpGains: true,
  autoStartTimer: false,
  dailyGoal: 3,
};

const STORAGE_KEY = 'ambition-arcade-settings';

export const SettingsPanel: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AmbitionSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const updateSetting = <K extends keyof AmbitionSettings>(
    key: K, 
    value: AmbitionSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setHasChanges(false);
    toast({
      title: 'Paramètres sauvegardés',
      description: 'Vos préférences ont été enregistrées',
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
          Paramètres
        </CardTitle>
        <CardDescription>Personnalisez votre expérience Ambition Arcade</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="font-medium">Notifications</h3>
          </div>
          
          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex-1">
                <div>Activer les notifications</div>
                <span className="text-xs text-muted-foreground">Recevez des alertes et rappels</span>
              </Label>
              <Switch
                id="notifications"
                checked={settings.notificationsEnabled}
                onCheckedChange={(v) => updateSetting('notificationsEnabled', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="streak-reminders" className="flex-1">
                <div className="flex items-center gap-2">
                  <BellRing className="w-3 h-3" />
                  Rappels de streak
                </div>
                <span className="text-xs text-muted-foreground">Notification quotidienne pour maintenir votre série</span>
              </Label>
              <Switch
                id="streak-reminders"
                checked={settings.streakReminders}
                onCheckedChange={(v) => updateSetting('streakReminders', v)}
                disabled={!settings.notificationsEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="achievement-alerts" className="flex-1">
                <div className="flex items-center gap-2">
                  <Trophy className="w-3 h-3" />
                  Alertes de succès
                </div>
                <span className="text-xs text-muted-foreground">Notification lors d'un nouveau succès débloqué</span>
              </Label>
              <Switch
                id="achievement-alerts"
                checked={settings.achievementAlerts}
                onCheckedChange={(v) => updateSetting('achievementAlerts', v)}
                disabled={!settings.notificationsEnabled}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Audio & Haptics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-primary" />
            <h3 className="font-medium">Audio et vibrations</h3>
          </div>

          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound" className="flex-1">
                Effets sonores
              </Label>
              <Switch
                id="sound"
                checked={settings.soundEnabled}
                onCheckedChange={(v) => updateSetting('soundEnabled', v)}
              />
            </div>

            {settings.soundEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <Label className="text-sm text-muted-foreground">Volume</Label>
                <Slider
                  value={[settings.soundVolume]}
                  onValueChange={([v]) => updateSetting('soundVolume', v)}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <div className="text-xs text-right text-muted-foreground">{settings.soundVolume}%</div>
              </motion.div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="haptics" className="flex-1">
                <div className="flex items-center gap-2">
                  <Vibrate className="w-3 h-3" />
                  Retour haptique
                </div>
                <span className="text-xs text-muted-foreground">Vibrations lors des actions</span>
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

        {/* Visual */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-medium">Effets visuels</h3>
          </div>

          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="confetti" className="flex-1">
                Confettis de célébration
                <span className="text-xs text-muted-foreground block">Animation lors des accomplissements</span>
              </Label>
              <Switch
                id="confetti"
                checked={settings.confettiEnabled}
                onCheckedChange={(v) => updateSetting('confettiEnabled', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion" className="flex-1">
                Réduire les animations
                <span className="text-xs text-muted-foreground block">Pour l'accessibilité ou économie batterie</span>
              </Label>
              <Switch
                id="reduced-motion"
                checked={settings.animationsReduced}
                onCheckedChange={(v) => updateSetting('animationsReduced', v)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Gamification */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="font-medium">Gamification</h3>
          </div>

          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-xp" className="flex-1">
                Afficher les gains d'XP
                <span className="text-xs text-muted-foreground block">Pop-up +XP après chaque quête</span>
              </Label>
              <Switch
                id="show-xp"
                checked={settings.showXpGains}
                onCheckedChange={(v) => updateSetting('showXpGains', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-timer" className="flex-1">
                Démarrage auto du timer
                <span className="text-xs text-muted-foreground block">Lance le chrono au début d'une quête</span>
              </Label>
              <Switch
                id="auto-timer"
                checked={settings.autoStartTimer}
                onCheckedChange={(v) => updateSetting('autoStartTimer', v)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Objectif quotidien de quêtes</Label>
              <Slider
                value={[settings.dailyGoal]}
                onValueChange={([v]) => updateSetting('dailyGoal', v)}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Minimum</span>
                <Badge variant="outline">{settings.dailyGoal} quêtes/jour</Badge>
                <span>Intensif</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={resetSettings}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </Button>
          <Button 
            onClick={saveSettings}
            disabled={!hasChanges}
            className="flex-1 gap-2"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
