import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Smartphone, 
  Vibrate, 
  ChevronDown, 
  Settings2,
  Waves,
  Zap,
  Heart,
  Save,
  RotateCcw,
  Star,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useBreathStore } from '@/store/breath.store';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PatternConfig {
  label: string;
  icon: React.ReactNode;
  pattern: number[];
  description: string;
}

interface HapticPreset {
  name: string;
  pattern: HapticPattern;
  intensity: number;
  isFavorite: boolean;
}

interface HapticStats {
  totalUses: number;
  favoritePattern: HapticPattern | null;
  avgIntensity: number;
  lastUsed: string | null;
}

const HAPTIC_PATTERNS: Record<HapticPattern, PatternConfig> = {
  soft: {
    label: 'Doux',
    icon: <Waves className="h-4 w-4" />,
    pattern: [50],
    description: 'Vibration légère et discrète',
  },
  medium: {
    label: 'Moyen',
    icon: <Vibrate className="h-4 w-4" />,
    pattern: [100],
    description: 'Vibration standard',
  },
  strong: {
    label: 'Fort',
    icon: <Zap className="h-4 w-4" />,
    pattern: [150],
    description: 'Vibration intense',
  },
  pulse: {
    label: 'Pulsé',
    icon: <Vibrate className="h-4 w-4" />,
    pattern: [50, 50, 50],
    description: 'Double vibration rapide',
  },
  heartbeat: {
    label: 'Battement',
    icon: <Heart className="h-4 w-4" />,
    pattern: [100, 100, 200],
    description: 'Imite un battement de cœur',
  },
};

const STORAGE_KEY = 'haptic-settings';
const PRESETS_KEY = 'haptic-presets';
const STATS_KEY = 'haptic-stats';

type HapticPattern = 'soft' | 'medium' | 'strong' | 'pulse' | 'heartbeat';

export const HapticToggle: React.FC = () => {
  const { user } = useAuth();
  const { hapticEnabled, setHapticEnabled } = useBreathStore();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [intensity, setIntensity] = useState(50);
  const [selectedPattern, setSelectedPattern] = useState<HapticPattern>('soft');
  const [presets, setPresets] = useState<HapticPreset[]>([]);
  const [customPresetName, setCustomPresetName] = useState('');
  const [stats, setStats] = useState<HapticStats>({
    totalUses: 0,
    favoritePattern: null,
    avgIntensity: 50,
    lastUsed: null,
  });
  
  // Check if device supports vibration
  const supportsHaptic = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  // Load settings from Supabase or localStorage
  useEffect(() => {
    const loadSettings = async () => {
      if (user) {
        const { data } = await supabase
          .from('user_settings')
          .select('value')
          .eq('user_id', user.id)
          .eq('key', 'haptic_settings')
          .maybeSingle();
        
        if (data?.value) {
          const settings = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          setIntensity(settings.intensity || 50);
          setSelectedPattern(settings.pattern || 'soft');
          setPresets(settings.presets || []);
          setStats(settings.stats || { totalUses: 0, favoritePattern: null, avgIntensity: 50, lastUsed: null });
          return;
        }
      }
      // Fallback localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        setIntensity(settings.intensity || 50);
        setSelectedPattern(settings.pattern || 'soft');
      }
      const storedPresets = localStorage.getItem(PRESETS_KEY);
      if (storedPresets) setPresets(JSON.parse(storedPresets));
      const storedStats = localStorage.getItem(STATS_KEY);
      if (storedStats) setStats(JSON.parse(storedStats));
    };
    loadSettings();
  }, [user]);

  // Save settings when they change
  const saveSettings = async () => {
    const settings = { intensity, pattern: selectedPattern, presets, stats };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ intensity, pattern: selectedPattern }));
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    
    if (user) {
      await supabase.from('user_settings').upsert({
        user_id: user.id,
        key: 'haptic_settings',
        value: JSON.stringify(settings),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,key' });
    }
  };

  useEffect(() => {
    if (intensity !== 50 || selectedPattern !== 'soft') {
      saveSettings();
    }
  }, [intensity, selectedPattern]);

  // Update stats
  const updateStats = (pattern: HapticPattern, usedIntensity: number) => {
    const newStats: HapticStats = {
      totalUses: stats.totalUses + 1,
      favoritePattern: pattern, // Simplified - could track most used
      avgIntensity: Math.round((stats.avgIntensity * stats.totalUses + usedIntensity) / (stats.totalUses + 1)),
      lastUsed: new Date().toISOString(),
    };
    setStats(newStats);
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  };

  // Test vibration with current settings
  const testVibration = (pattern?: HapticPattern) => {
    if (!supportsHaptic) return;
    
    const patternToUse = pattern || selectedPattern;
    const config = HAPTIC_PATTERNS[patternToUse];
    
    // Scale pattern by intensity
    const scaledPattern = config.pattern.map(v => Math.round(v * (intensity / 50)));
    
    navigator.vibrate(scaledPattern);
    updateStats(patternToUse, intensity);
    
    toast({
      title: 'Test de vibration',
      description: `Pattern "${config.label}" avec intensité ${intensity}%`,
    });
  };

  const handlePatternSelect = (pattern: HapticPattern) => {
    setSelectedPattern(pattern);
    testVibration(pattern);
  };

  // Save custom preset
  const savePreset = () => {
    if (!customPresetName.trim()) return;

    const newPreset: HapticPreset = {
      name: customPresetName,
      pattern: selectedPattern,
      intensity,
      isFavorite: false,
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(updated));
    setCustomPresetName('');

    toast({
      title: 'Preset sauvegardé',
      description: `"${customPresetName}" - ${HAPTIC_PATTERNS[selectedPattern].label} @ ${intensity}%`,
    });
  };

  // Toggle favorite preset
  const toggleFavorite = (index: number) => {
    const updated = presets.map((p, i) => 
      i === index ? { ...p, isFavorite: !p.isFavorite } : p
    );
    setPresets(updated);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(updated));
  };

  // Delete preset
  const deletePreset = (index: number) => {
    const updated = presets.filter((_, i) => i !== index);
    setPresets(updated);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(updated));
  };

  // Apply preset
  const applyPreset = (preset: HapticPreset) => {
    setSelectedPattern(preset.pattern);
    setIntensity(preset.intensity);
    testVibration(preset.pattern);
  };

  // Reset to defaults
  const resetSettings = () => {
    setIntensity(50);
    setSelectedPattern('soft');
    toast({
      title: 'Paramètres réinitialisés',
      description: 'Les valeurs par défaut ont été restaurées',
    });
  };

  if (!supportsHaptic) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
        <div className="flex items-center gap-3">
          <Smartphone className="w-4 h-4 text-muted-foreground" />
          <div>
            <Label className="font-medium text-muted-foreground">
              Vibrations non supportées
            </Label>
            <p className="text-xs text-muted-foreground">
              Votre appareil ne supporte pas les vibrations
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="border rounded-lg overflow-hidden">
          {/* Main toggle row */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-full transition-colors',
                hapticEnabled ? 'bg-primary/10' : 'bg-muted'
              )}>
                <Vibrate className={cn(
                  'w-4 h-4 transition-colors',
                  hapticEnabled ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>
              <div>
                <Label 
                  htmlFor="haptic-toggle"
                  className="font-medium cursor-pointer"
                >
                  Vibrations légères
                </Label>
                <p className="text-xs text-muted-foreground">
                  Feedback haptique au changement de phase
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Quick stats badge */}
              {stats.totalUses > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stats.totalUses}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {stats.totalUses} utilisations
                  </TooltipContent>
                </Tooltip>
              )}

              <Switch
                id="haptic-toggle"
                checked={hapticEnabled}
                onCheckedChange={setHapticEnabled}
                aria-label="Activer les vibrations légères"
              />
              
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  disabled={!hapticEnabled}
                  aria-label="Paramètres avancés"
                >
                  <Settings2 className={cn(
                    'h-4 w-4 transition-transform',
                    isOpen && 'rotate-180'
                  )} />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* Advanced settings */}
          <CollapsibleContent>
            <div className="border-t p-4 space-y-4 bg-muted/30">
              {/* Intensity slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Intensité</Label>
                  <span className="text-xs text-muted-foreground font-medium">
                    {intensity}%
                  </span>
                </div>
                <Slider
                  value={[intensity]}
                  onValueChange={([val]) => setIntensity(val)}
                  min={10}
                  max={100}
                  step={10}
                  className="w-full"
                  aria-label="Intensité des vibrations"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Léger</span>
                  <span>Fort</span>
                </div>
              </div>

              {/* Pattern selection */}
              <div className="space-y-2">
                <Label className="text-sm">Type de vibration</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {(Object.entries(HAPTIC_PATTERNS) as [HapticPattern, PatternConfig][]).map(
                    ([key, config]) => (
                      <button
                        key={key}
                        onClick={() => handlePatternSelect(key)}
                        className={cn(
                          'flex flex-col items-center gap-1 p-3 rounded-lg border transition-all',
                          selectedPattern === key
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50 hover:bg-muted'
                        )}
                      >
                        <div className={cn(
                          'transition-colors',
                          selectedPattern === key ? 'text-primary' : 'text-muted-foreground'
                        )}>
                          {config.icon}
                        </div>
                        <span className="text-xs font-medium">{config.label}</span>
                      </button>
                    )
                  )}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {HAPTIC_PATTERNS[selectedPattern].description}
                </p>
              </div>

              {/* Custom presets */}
              {presets.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Mes presets</Label>
                  <div className="flex flex-wrap gap-2">
                    {presets.map((preset, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => applyPreset(preset)}
                        >
                          {preset.isFavorite && <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />}
                          {preset.name}
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => toggleFavorite(index)}
                            >
                              <Star className={cn(
                                'h-3 w-3',
                                preset.isFavorite && 'fill-amber-500 text-amber-500'
                              )} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {preset.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save new preset */}
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-sm text-muted-foreground">Sauvegarder comme preset</Label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPresetName}
                    onChange={(e) => setCustomPresetName(e.target.value)}
                    placeholder="Nom du preset"
                    className="flex-1 px-3 py-1.5 text-sm border rounded-md bg-background"
                  />
                  <Button
                    size="sm"
                    onClick={savePreset}
                    disabled={!customPresetName.trim()}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats section */}
              {stats.totalUses > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <Label className="text-sm text-muted-foreground">Statistiques</Label>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-background rounded-lg p-2">
                      <div className="text-lg font-bold text-primary">{stats.totalUses}</div>
                      <div className="text-xs text-muted-foreground">Utilisations</div>
                    </div>
                    <div className="bg-background rounded-lg p-2">
                      <div className="text-lg font-bold text-primary">{stats.avgIntensity}%</div>
                      <div className="text-xs text-muted-foreground">Intensité moy.</div>
                    </div>
                    <div className="bg-background rounded-lg p-2">
                      <div className="text-lg font-bold text-primary">
                        {stats.favoritePattern ? HAPTIC_PATTERNS[stats.favoritePattern].label : '-'}
                      </div>
                      <div className="text-xs text-muted-foreground">Favori</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => testVibration()}
                >
                  <Vibrate className="h-4 w-4 mr-2" />
                  Tester
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetSettings}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Current config badge */}
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {HAPTIC_PATTERNS[selectedPattern].label} • {intensity}%
                </Badge>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </TooltipProvider>
  );
};

export default HapticToggle;
