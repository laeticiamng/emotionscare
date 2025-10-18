import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Wind, Play, Pause, RotateCcw, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  cycles: number;
}

const patterns: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Respiration carrée',
    description: 'Équilibre et calme',
    inhale: 4,
    hold: 4,
    exhale: 4,
    cycles: 8
  },
  {
    id: '478',
    name: 'Respiration 4-7-8',
    description: 'Détente profonde',
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 6
  },
  {
    id: 'coherence',
    name: 'Cohérence cardiaque',
    description: 'Équilibre émotionnel',
    inhale: 5,
    hold: 0,
    exhale: 5,
    cycles: 18
  }
];

export const BreathingExerciseDashboard: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(patterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [moodBefore, setMoodBefore] = useState(5);
  const [moodAfter, setMoodAfter] = useState(5);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    loadInsights();
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev > 1) return prev - 1;

        // Phase transition
        if (currentPhase === 'inhale') {
          setCurrentPhase(selectedPattern.hold > 0 ? 'hold' : 'exhale');
          return selectedPattern.hold > 0 ? selectedPattern.hold : selectedPattern.exhale;
        } else if (currentPhase === 'hold') {
          setCurrentPhase('exhale');
          return selectedPattern.exhale;
        } else {
          setCycleCount(prev => {
            const newCount = prev + 1;
            if (newCount >= selectedPattern.cycles) {
              completeSession();
              return prev;
            }
            return newCount;
          });
          setCurrentPhase('inhale');
          return selectedPattern.inhale;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, currentPhase, selectedPattern, cycleCount]);

  const loadInsights = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('breathing-exercises', {
        body: { action: 'get-insights' }
      });

      if (error) throw error;
      if (data.insights) {
        setInsights(data.insights);
      }
    } catch (error) {
      logger.error('Error loading insights', error as Error, 'UI');
    }
  };

  const startSession = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('breathing-exercises', {
        body: {
          action: 'start-session',
          sessionData: {
            pattern: selectedPattern.id,
            moodBefore
          }
        }
      });

      if (error) throw error;
      
      setSessionId(data.session.id);
      setIsActive(true);
      setCurrentPhase('inhale');
      setCountdown(selectedPattern.inhale);
      setCycleCount(0);
      
      toast.success('Session démarrée');
    } catch (error) {
      toast.error('Erreur lors du démarrage');
      logger.error('Error starting session', error as Error, 'UI');
    }
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resumeSession = () => {
    setIsActive(true);
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setCountdown(0);
    setCycleCount(0);
    setSessionId(null);
  };

  const completeSession = async () => {
    if (!sessionId) return;

    setIsActive(false);

    try {
      const { data, error } = await supabase.functions.invoke('breathing-exercises', {
        body: {
          action: 'complete-session',
          sessionId,
          sessionData: {
            durationSeconds: selectedPattern.cycles * (selectedPattern.inhale + selectedPattern.hold + selectedPattern.exhale),
            cyclesCompleted: selectedPattern.cycles,
            averagePace: (selectedPattern.inhale + selectedPattern.hold + selectedPattern.exhale) / 3,
            moodAfter,
            notes: `Completed ${selectedPattern.name}`
          }
        }
      });

      if (error) throw error;
      
      toast.success('Session terminée !');
      loadInsights();
      resetSession();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      logger.error('Error completing session', error as Error, 'UI');
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'from-blue-500 to-cyan-500';
      case 'hold': return 'from-purple-500 to-pink-500';
      case 'exhale': return 'from-green-500 to-emerald-500';
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Wind className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Exercices de respiration guidée</h1>
      </div>

      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{insights.totalSessions}</div>
              <div className="text-sm text-muted-foreground">Sessions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{insights.totalMinutes} min</div>
              <div className="text-sm text-muted-foreground">Temps total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold flex items-center gap-1">
                <TrendingUp className="h-5 w-5 text-green-500" />
                +{insights.avgMoodImprovement}
              </div>
              <div className="text-sm text-muted-foreground">Amélioration humeur</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{insights.streak} jours</div>
              <div className="text-sm text-muted-foreground">Série actuelle</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Choisir un exercice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patterns.map(pattern => (
                <button
                  key={pattern.id}
                  onClick={() => !isActive && setSelectedPattern(pattern)}
                  disabled={isActive}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPattern.id === pattern.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  } ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="font-semibold">{pattern.name}</div>
                  <div className="text-sm text-muted-foreground">{pattern.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {pattern.inhale}s inspirez • {pattern.hold > 0 ? `${pattern.hold}s retenez • ` : ''}{pattern.exhale}s expirez • {pattern.cycles} cycles
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {!sessionId && (
            <Card>
              <CardHeader>
                <CardTitle>Humeur avant la session</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodBefore}
                  onChange={(e) => setMoodBefore(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-muted-foreground mt-2">
                  {moodBefore}/10
                </div>
              </CardContent>
            </Card>
          )}

          {sessionId && !isActive && cycleCount >= selectedPattern.cycles && (
            <Card>
              <CardHeader>
                <CardTitle>Humeur après la session</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodAfter}
                  onChange={(e) => setMoodAfter(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-muted-foreground mt-2">
                  {moodAfter}/10
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Visualisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative h-64 flex items-center justify-center">
              <div 
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPhaseColor()} opacity-20 transition-all duration-1000 ${
                  isActive ? 'scale-100' : 'scale-75'
                }`}
                style={{
                  transform: isActive 
                    ? currentPhase === 'inhale' 
                      ? 'scale(1.1)' 
                      : currentPhase === 'exhale' 
                        ? 'scale(0.8)' 
                        : 'scale(1)'
                    : 'scale(0.75)'
                }}
              />
              <div className="relative z-10 text-center">
                <div className="text-6xl font-bold mb-2">{countdown || selectedPattern.inhale}</div>
                <div className="text-lg text-muted-foreground">{getPhaseText()}</div>
                <div className="text-sm text-muted-foreground mt-4">
                  Cycle {cycleCount}/{selectedPattern.cycles}
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              {!sessionId ? (
                <Button onClick={startSession} size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  Commencer
                </Button>
              ) : (
                <>
                  {isActive ? (
                    <Button onClick={pauseSession} variant="outline" size="lg" className="gap-2">
                      <Pause className="h-5 w-5" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={resumeSession} size="lg" className="gap-2">
                      <Play className="h-5 w-5" />
                      Reprendre
                    </Button>
                  )}
                  <Button onClick={resetSession} variant="outline" size="lg" className="gap-2">
                    <RotateCcw className="h-5 w-5" />
                    Réinitialiser
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BreathingExerciseDashboard;
