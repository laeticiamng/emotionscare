import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Vibrate, Zap, Heart, Volume2, Settings, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface HapticPattern {
  id: string;
  name: string;
  description: string;
  pattern: number[];
  icon: React.ReactNode;
  category: 'meditation' | 'alert' | 'feedback' | 'rhythm';
}

const HAPTIC_PATTERNS: HapticPattern[] = [
  {
    id: 'heartbeat',
    name: 'Battement de cœur',
    description: 'Simulation de rythme cardiaque apaisé',
    pattern: [200, 100, 200, 500],
    icon: <Heart className="h-4 w-4" />,
    category: 'meditation'
  },
  {
    id: 'breath_in',
    name: 'Inspiration',
    description: 'Guide haptique pour l\'inspiration',
    pattern: [100, 50, 150, 50, 200, 50, 250],
    icon: <Vibrate className="h-4 w-4" />,
    category: 'meditation'
  },
  {
    id: 'breath_out',
    name: 'Expiration',
    description: 'Guide haptique pour l\'expiration',
    pattern: [250, 50, 200, 50, 150, 50, 100],
    icon: <Vibrate className="h-4 w-4" />,
    category: 'meditation'
  },
  {
    id: 'success',
    name: 'Succès',
    description: 'Confirmation positive',
    pattern: [50, 50, 100],
    icon: <Zap className="h-4 w-4" />,
    category: 'feedback'
  },
  {
    id: 'gentle_tap',
    name: 'Tap doux',
    description: 'Notification discrète',
    pattern: [30],
    icon: <Smartphone className="h-4 w-4" />,
    category: 'alert'
  },
  {
    id: 'wave',
    name: 'Vague',
    description: 'Pattern ondulant relaxant',
    pattern: [50, 100, 100, 100, 150, 100, 200, 100, 150, 100, 100, 100, 50],
    icon: <Volume2 className="h-4 w-4" />,
    category: 'rhythm'
  }
];

const VRHapticFeedback: React.FC = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [intensity, setIntensity] = useState([75]);
  const [activePattern, setActivePattern] = useState<string | null>(null);
  const [autoHaptics, setAutoHaptics] = useState(true);
  const [breathSyncEnabled, setBreathSyncEnabled] = useState(true);

  useEffect(() => {
    // Vérifier le support de l'API Vibration
    const supported = 'vibrate' in navigator;
    setIsSupported(supported);
    
    if (!supported) {
      toast.info('Votre appareil ne supporte pas le retour haptique');
    }
  }, []);

  const triggerHaptic = useCallback((pattern: number[]) => {
    if (!isSupported || !isEnabled) return;
    
    // Ajuster l'intensité (raccourcir les pauses pour intensité plus forte)
    const intensityFactor = intensity[0] / 100;
    const adjustedPattern = pattern.map((duration, index) => {
      // Les indices pairs sont les vibrations, les impairs sont les pauses
      if (index % 2 === 0) {
        return Math.round(duration * intensityFactor);
      }
      return duration;
    });

    try {
      navigator.vibrate(adjustedPattern);
    } catch {
      toast.error('Erreur lors du retour haptique');
    }
  }, [isSupported, isEnabled, intensity]);

  const playPattern = useCallback((patternId: string) => {
    const pattern = HAPTIC_PATTERNS.find(p => p.id === patternId);
    if (pattern) {
      setActivePattern(patternId);
      triggerHaptic(pattern.pattern);
      
      // Réinitialiser après la durée totale du pattern
      const totalDuration = pattern.pattern.reduce((a, b) => a + b, 0);
      setTimeout(() => setActivePattern(null), totalDuration);
    }
  }, [triggerHaptic]);

  const stopHaptic = useCallback(() => {
    if (isSupported) {
      navigator.vibrate(0);
      setActivePattern(null);
    }
  }, [isSupported]);

  const getCategoryColor = (category: HapticPattern['category']) => {
    switch (category) {
      case 'meditation': return 'bg-purple-500/10 text-purple-500';
      case 'alert': return 'bg-amber-500/10 text-amber-500';
      case 'feedback': return 'bg-green-500/10 text-green-500';
      case 'rhythm': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (!isSupported) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <Smartphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Le retour haptique n'est pas supporté sur cet appareil.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Essayez sur un smartphone ou une tablette compatible.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Haptique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="haptic-enabled">Retour haptique</Label>
              <p className="text-sm text-muted-foreground">
                Activer les vibrations
              </p>
            </div>
            <Switch
              id="haptic-enabled"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Intensité</Label>
              <span className="text-sm font-medium">{intensity[0]}%</span>
            </div>
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              min={10}
              max={100}
              step={5}
              disabled={!isEnabled}
              aria-label="Intensité du retour haptique"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-haptics">Haptique automatique</Label>
              <p className="text-sm text-muted-foreground">
                Déclencher lors des transitions
              </p>
            </div>
            <Switch
              id="auto-haptics"
              checked={autoHaptics}
              onCheckedChange={setAutoHaptics}
              disabled={!isEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="breath-sync">Sync respiration</Label>
              <p className="text-sm text-muted-foreground">
                Vibrer au rythme de la respiration
              </p>
            </div>
            <Switch
              id="breath-sync"
              checked={breathSyncEnabled}
              onCheckedChange={setBreathSyncEnabled}
              disabled={!isEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vibrate className="h-5 w-5" />
            Patterns Haptiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HAPTIC_PATTERNS.map((pattern) => (
              <Button
                key={pattern.id}
                variant={activePattern === pattern.id ? 'default' : 'outline'}
                className="h-auto p-4 justify-start"
                onClick={() => playPattern(pattern.id)}
                disabled={!isEnabled}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className={`p-2 rounded-lg ${getCategoryColor(pattern.category)}`}>
                    {pattern.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{pattern.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {pattern.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pattern.description}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {activePattern && (
            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={stopHaptic}
            >
              Arrêter la vibration
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Test rapide */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Test rapide</p>
              <p className="text-sm text-muted-foreground">
                Vérifiez que votre appareil vibre correctement
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => triggerHaptic([100, 50, 100])}
              disabled={!isEnabled}
            >
              <Vibrate className="h-4 w-4 mr-2" />
              Tester
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VRHapticFeedback;
