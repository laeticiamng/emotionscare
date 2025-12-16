import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Settings, 
  Bell, 
  Eye, 
  Palette, 
  Volume2,
  Save,
  RefreshCw
} from 'lucide-react';

export interface SettingsTabProps {
  className?: string;
}

interface DashboardSettings {
  showEmotionalOverview: boolean;
  showRecentActivity: boolean;
  showGoals: boolean;
  showTeamStats: boolean;
  refreshInterval: number;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  compactMode: boolean;
}

const defaultSettings: DashboardSettings = {
  showEmotionalOverview: true,
  showRecentActivity: true,
  showGoals: true,
  showTeamStats: false,
  refreshInterval: 30,
  theme: 'system',
  notificationsEnabled: true,
  soundEnabled: false,
  animationsEnabled: true,
  compactMode: false
};

const SettingsTab: React.FC<SettingsTabProps> = ({ className }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<DashboardSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user.id)
        .eq('setting_key', 'dashboard_preferences')
        .maybeSingle();

      if (error) throw error;

      if (data?.settings) {
        setSettings({ ...defaultSettings, ...(data.settings as Partial<DashboardSettings>) });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          key: 'dashboard_preferences',
          value: JSON.stringify(settings),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,key'
        });

      if (error) throw error;

      toast.success('Paramètres sauvegardés');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = <K extends keyof DashboardSettings>(
    key: K,
    value: DashboardSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paramètres du tableau de bord
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Personnalisez l'affichage et le comportement de votre dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetToDefaults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button 
            size="sm" 
            onClick={saveSettings} 
            disabled={!hasChanges || loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Widgets visibles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Widgets affichés
            </CardTitle>
            <CardDescription>
              Choisissez quels éléments afficher sur votre dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emotional-overview">Aperçu émotionnel</Label>
              <Switch
                id="emotional-overview"
                checked={settings.showEmotionalOverview}
                onCheckedChange={(checked) => updateSetting('showEmotionalOverview', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="recent-activity">Activité récente</Label>
              <Switch
                id="recent-activity"
                checked={settings.showRecentActivity}
                onCheckedChange={(checked) => updateSetting('showRecentActivity', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="goals">Objectifs</Label>
              <Switch
                id="goals"
                checked={settings.showGoals}
                onCheckedChange={(checked) => updateSetting('showGoals', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="team-stats">Statistiques d'équipe</Label>
              <Switch
                id="team-stats"
                checked={settings.showTeamStats}
                onCheckedChange={(checked) => updateSetting('showTeamStats', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Apparence */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Apparence
            </CardTitle>
            <CardDescription>
              Personnalisez l'apparence de l'interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Thème</Label>
              <Select
                value={settings.theme}
                onValueChange={(value: 'light' | 'dark' | 'system') => updateSetting('theme', value)}
              >
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
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="animations">Animations</Label>
              <Switch
                id="animations"
                checked={settings.animationsEnabled}
                onCheckedChange={(checked) => updateSetting('animationsEnabled', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="compact">Mode compact</Label>
              <Switch
                id="compact"
                checked={settings.compactMode}
                onCheckedChange={(checked) => updateSetting('compactMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
            <CardDescription>
              Gérez les alertes et notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notifications activées</Label>
              <Switch
                id="notifications"
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => updateSetting('notificationsEnabled', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="sound">Sons activés</Label>
              </div>
              <Switch
                id="sound"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Rafraîchissement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Actualisation
            </CardTitle>
            <CardDescription>
              Fréquence de mise à jour des données
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Intervalle de rafraîchissement</Label>
                <span className="text-sm font-medium">{settings.refreshInterval}s</span>
              </div>
              <Slider
                value={[settings.refreshInterval]}
                onValueChange={([value]) => updateSetting('refreshInterval', value)}
                min={10}
                max={120}
                step={10}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Les données seront actualisées toutes les {settings.refreshInterval} secondes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsTab;
