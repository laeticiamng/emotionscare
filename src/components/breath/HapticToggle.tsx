import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  Smartphone, 
  Vibrate, 
  ChevronDown, 
  Settings2,
  Waves,
  Zap,
  Heart
} from 'lucide-react';
import { useBreathStore } from '@/store/breath.store';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type HapticPattern = 'soft' | 'medium' | 'strong' | 'pulse' | 'heartbeat';

interface PatternConfig {
  label: string;
  icon: React.ReactNode;
  pattern: number[];
  description: string;
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

export const HapticToggle: React.FC = () => {
  const { hapticEnabled, setHapticEnabled } = useBreathStore();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [intensity, setIntensity] = useState(50);
  const [selectedPattern, setSelectedPattern] = useState<HapticPattern>('soft');
  
  // Check if device supports vibration
  const supportsHaptic = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  // Test vibration with current settings
  const testVibration = (pattern?: HapticPattern) => {
    if (!supportsHaptic) return;
    
    const patternToUse = pattern || selectedPattern;
    const config = HAPTIC_PATTERNS[patternToUse];
    
    // Scale pattern by intensity
    const scaledPattern = config.pattern.map(v => Math.round(v * (intensity / 50)));
    
    navigator.vibrate(scaledPattern);
    
    toast({
      title: 'Test de vibration',
      description: `Pattern "${config.label}" avec intensité ${intensity}%`,
    });
  };

  const handlePatternSelect = (pattern: HapticPattern) => {
    setSelectedPattern(pattern);
    testVibration(pattern);
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

            {/* Test button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => testVibration()}
            >
              <Vibrate className="h-4 w-4 mr-2" />
              Tester la vibration
            </Button>

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
  );
};

export default HapticToggle;
