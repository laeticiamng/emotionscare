import React from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Play, Pause, Square } from 'lucide-react';
import GlowRing from '@/components/glow/GlowRing';
import PatternSelector from '@/components/glow/PatternSelector';
import BreathCoach from '@/components/glow/BreathCoach';
import { useFlashGlow } from '@/hooks/useFlashGlow';

const FlashGlowPage: React.FC = () => {
  const { state, start, pause, resume, stop, submit } = useFlashGlow();

  const handleFinish = () => {
    stop();
    submit();
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Zap className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Flash Glow</h1>
              </div>
              <p className="text-muted-foreground">
                Respiration express pour un pic d'énergie et un recentrage rapide
              </p>
              {state.badgeId && (
                <Badge variant="secondary" className="animate-fade-in">
                  ✨ Instant Glow
                </Badge>
              )}
            </div>

            {/* Pattern Selector */}
            {!state.running && (
              <Card className="animate-fade-in">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-center">Choisis ton rythme</h3>
                    <PatternSelector 
                      value={state.pattern} 
                      onChange={(pattern) => state.setPattern(pattern)} 
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Glow Interface */}
            <div className="relative">
              <GlowRing 
                phase={state.phase} 
                pattern={state.pattern}
                reduceMotion={state.reduceMotion} 
              />
              
              {/* Breath Coach Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <BreathCoach phase={state.phase} />
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {!state.running ? (
                <Button 
                  onClick={start} 
                  size="lg"
                  className="min-w-32"
                  aria-label="Commencer la session de respiration"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Commencer
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button 
                    onClick={state.paused ? resume : pause}
                    variant="outline"
                    size="lg"
                    aria-label={state.paused ? "Reprendre" : "Mettre en pause"}
                  >
                    {state.paused ? (
                      <><Play className="h-4 w-4 mr-2" />Reprendre</>
                    ) : (
                      <><Pause className="h-4 w-4 mr-2" />Pause</>
                    )}
                  </Button>
                  <Button 
                    onClick={handleFinish}
                    variant="secondary"
                    size="lg"
                    aria-label="Terminer la session"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Terminer
                  </Button>
                </div>
              )}
            </div>

            {/* Settings */}
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Réduire les animations</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => state.setReduceMotion(!state.reduceMotion)}
                    aria-pressed={state.reduceMotion}
                  >
                    {state.reduceMotion ? 'Activé' : 'Désactivé'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Success State */}
            {state.phase === 'finished' && (
              <Card className="border-primary/20 bg-primary/5 animate-fade-in">
                <CardContent className="p-6 text-center">
                  <div className="space-y-3">
                    <div className="text-4xl">✨</div>
                    <h3 className="font-semibold text-primary">Bien joué !</h3>
                    <p className="text-sm text-muted-foreground">
                      Tu as terminé ta session Flash Glow
                    </p>
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="outline" 
                      size="sm"
                    >
                      Nouvelle session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </UnifiedShell>
    </div>
  );
};

export default FlashGlowPage;