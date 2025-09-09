import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const BreathingPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [rhythm, setRhythm] = useState('moderate');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Rythmes de respiration
  const rhythms = {
    gentle: { inhale: 4, hold: 2, exhale: 6, pause: 2, label: 'Doux' },
    moderate: { inhale: 4, hold: 4, exhale: 6, pause: 2, label: 'Modéré' },
    sustained: { inhale: 6, hold: 2, exhale: 8, pause: 2, label: 'Soutenu' }
  };

  // Détecter prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  // Gestion du cycle de respiration
  useEffect(() => {
    if (!isActive) return;

    const currentRhythm = rhythms[rhythm as keyof typeof rhythms];
    let phaseTimer: number;
    let duration: number;

    switch (phase) {
      case 'inhale':
        duration = currentRhythm.inhale * 1000;
        break;
      case 'hold':
        duration = currentRhythm.hold * 1000;
        break;
      case 'exhale':
        duration = currentRhythm.exhale * 1000;
        break;
      case 'pause':
        duration = currentRhythm.pause * 1000;
        break;
    }

    phaseTimer = setTimeout(() => {
      setPhase(current => {
        switch (current) {
          case 'inhale': return 'hold';
          case 'hold': return 'exhale';
          case 'exhale': return 'pause';
          case 'pause': return 'inhale';
          default: return 'inhale';
        }
      });
    }, duration);

    return () => clearTimeout(phaseTimer);
  }, [isActive, phase, rhythm]);

  // Timer de session
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const startSession = () => {
    setIsActive(true);
    setSessionTime(0);
    setPhase('inhale');
    toast.success('Session de respiration démarrée', {
      description: 'Suivez le cercle et respirez calmement'
    });
  };

  const pauseSession = () => {
    setIsActive(false);
    toast.info('Session mise en pause');
  };

  const resetSession = () => {
    setIsActive(false);
    setSessionTime(0);
    setPhase('inhale');
    toast.success('Vous êtes plus détendu', {
      description: 'Session terminée avec succès'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseMessage = () => {
    switch (phase) {
      case 'inhale': return 'Inspirez doucement...';
      case 'hold': return 'Retenez...';
      case 'exhale': return 'Expirez lentement...';
      case 'pause': return 'Pause...';
    }
  };

  const getCircleScale = () => {
    if (prefersReducedMotion) return 'scale-100';
    
    switch (phase) {
      case 'inhale': return 'scale-150';
      case 'hold': return 'scale-150';
      case 'exhale': return 'scale-100';
      case 'pause': return 'scale-100';
    }
  };

  // Gestion Échap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        resetSession();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Respiration Guidée
          </h1>
          <p className="text-muted-foreground">
            Suivez le cercle et respirez à votre rythme
          </p>
          {sessionTime > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Session : {formatTime(sessionTime)}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Cercle de respiration */}
          <div className="flex items-center justify-center">
            <Card className="p-8 w-full max-w-md aspect-square flex flex-col items-center justify-center bg-card/50 backdrop-blur-sm border-muted">
              <div className="relative mb-6">
                <div 
                  className={`w-32 h-32 rounded-full bg-gradient-to-r from-primary/30 to-primary/60 transition-transform duration-1000 ease-in-out ${getCircleScale()}`}
                />
                <div className="absolute inset-0 w-32 h-32 rounded-full border-2 border-primary/40" />
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-primary">
                  {getPhaseMessage()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Rythme {rhythms[rhythm as keyof typeof rhythms].label}
                </p>
              </div>
            </Card>
          </div>

          {/* Contrôles */}
          <div className="space-y-6">
            {/* Paramètres de session */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-muted">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Paramètres</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Rythme de respiration
                    </label>
                    <Select value={rhythm} onValueChange={setRhythm} disabled={isActive}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(rhythms).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label} ({config.inhale}-{config.hold}-{config.exhale}-{config.pause})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Son d'accompagnement
                    </label>
                    <Switch 
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Contrôles de session */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-muted">
              <div className="space-y-4">
                <h3 className="font-semibold">Contrôles</h3>
                
                <div className="flex gap-3">
                  {!isActive ? (
                    <Button onClick={startSession} className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      Commencer
                    </Button>
                  ) : (
                    <Button onClick={pauseSession} variant="secondary" className="flex-1">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  <Button onClick={resetSession} variant="outline" className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Terminer
                  </Button>
                </div>

                {isActive && (
                  <p className="text-xs text-muted-foreground text-center">
                    Appuyez sur Échap pour sortir
                  </p>
                )}
              </div>
            </Card>

            {/* Conseils */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-muted">
              <h3 className="font-semibold mb-3">Conseils</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Asseyez-vous confortablement</li>
                <li>• Respirez par le nez de préférence</li>
                <li>• Ne forcez pas, suivez votre rythme naturel</li>
                <li>• Concentrez-vous sur le mouvement du cercle</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingPage;