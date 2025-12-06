import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useWebAudio } from '@/hooks/useWebAudio';
import { useWebBluetooth } from '@/hooks/useWebBluetooth';
import { supabase } from '@/integrations/supabase/client';

interface BreathingSession {
  phase: 'inhale' | 'hold' | 'exhale' | 'pause';
  duration: number;
  currentTime: number;
  cycleCount: number;
  totalCycles: number;
}

export default function FlashGlow() {
  const { playTone, stopAll } = useWebAudio();
  const { isConnected: hrConnected, heartRate } = useWebBluetooth();
  
  const [session, setSession] = useState<BreathingSession>({
    phase: 'inhale',
    duration: 4,
    currentTime: 0,
    cycleCount: 0,
    totalCycles: 8
  });
  
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const phases = {
    inhale: { duration: 4, color: 'from-blue-400 to-blue-600', instruction: 'Inspirez' },
    hold: { duration: 7, color: 'from-purple-400 to-purple-600', instruction: 'Retenez' },
    exhale: { duration: 8, color: 'from-green-400 to-green-600', instruction: 'Expirez' },
    pause: { duration: 1, color: 'from-gray-400 to-gray-600', instruction: 'Pause' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setSession(prev => {
          const newTime = prev.currentTime + 0.1;
          const phaseDuration = phases[prev.phase].duration;
          
          if (newTime >= phaseDuration) {
            // Passer à la phase suivante
            const nextPhase = getNextPhase(prev.phase);
            
            // Si on termine un cycle complet
            if (nextPhase === 'inhale' && prev.phase === 'pause') {
              const newCycleCount = prev.cycleCount + 1;
              
              if (newCycleCount >= prev.totalCycles) {
                // Session terminée
                setIsActive(false);
                saveSession();
                return { ...prev, currentTime: 0, cycleCount: newCycleCount };
              }
              
              return {
                ...prev,
                phase: nextPhase,
                currentTime: 0,
                cycleCount: newCycleCount
              };
            }
            
            return {
              ...prev,
              phase: nextPhase,
              currentTime: 0
            };
          }
          
          return { ...prev, currentTime: newTime };
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    const phaseProgress = (session.currentTime / phases[session.phase].duration) * 100;
    setProgress(phaseProgress);
    
    // Effet sonore de guidage
    if (session.currentTime === 0 && isActive) {
      const frequency = {
        inhale: 220,
        hold: 330,
        exhale: 165,
        pause: 110
      };
      
      playTone(frequency[session.phase], 0.3, 0.5);
    }
  }, [session.currentTime, session.phase, isActive, playTone]);

  const getNextPhase = (currentPhase: string): 'inhale' | 'hold' | 'exhale' | 'pause' => {
    const sequence: Array<'inhale' | 'hold' | 'exhale' | 'pause'> = ['inhale', 'hold', 'exhale', 'pause'];
    const currentIndex = sequence.indexOf(currentPhase as any);
    return sequence[(currentIndex + 1) % sequence.length];
  };

  const saveSession = async () => {
    try {
      const sessionData = {
        phase_completed: session.cycleCount,
        total_cycles: session.totalCycles,
        hr_avg: heartRate || null,
        hr_connected: hrConnected
      };

      await supabase.functions.invoke('metrics/flash_glow', {
        body: {
          session_id: crypto.randomUUID(),
          payload: sessionData
        }
      });
    } catch (error) {
      console.error('Erreur sauvegarde session:', error);
    }
  };

  const startSession = () => {
    setIsActive(true);
    setSession(prev => ({ ...prev, currentTime: 0, cycleCount: 0 }));
  };

  const pauseSession = () => {
    setIsActive(false);
    stopAll();
  };

  const resetSession = () => {
    setIsActive(false);
    setSession(prev => ({ 
      ...prev, 
      phase: 'inhale', 
      currentTime: 0, 
      cycleCount: 0 
    }));
    stopAll();
  };

  const currentPhase = phases[session.phase];
  const overallProgress = (session.cycleCount / session.totalCycles) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Flash Glow</CardTitle>
            <p className="text-muted-foreground">
              Technique de respiration 4-7-8 pour la relaxation profonde
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Visualisation de la respiration */}
            <div className="relative flex justify-center">
              <div 
                className={`w-48 h-48 rounded-full bg-gradient-to-br ${currentPhase.color} 
                          transform transition-all duration-300 flex items-center justify-center
                          shadow-2xl ${isActive ? 'animate-pulse scale-105' : 'scale-100'}`}
                style={{
                  boxShadow: `0 0 ${progress * 2}px rgba(59, 130, 246, 0.4)`
                }}
              >
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-2">
                    {currentPhase.instruction}
                  </div>
                  <div className="text-lg">
                    {Math.ceil(phases[session.phase].duration - session.currentTime)}s
                  </div>
                </div>
              </div>
            </div>

            {/* Barres de progression */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Phase actuelle</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progression totale</span>
                  <span>{session.cycleCount}/{session.totalCycles} cycles</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
            </div>

            {/* Données biométriques */}
            {hrConnected && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{heartRate}</div>
                <div className="text-sm text-muted-foreground">BPM (Bluetooth)</div>
              </div>
            )}

            {/* Contrôles */}
            <div className="flex justify-center gap-4">
              {!isActive ? (
                <Button onClick={startSession} size="lg" className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Commencer
                </Button>
              ) : (
                <Button onClick={pauseSession} size="lg" variant="outline" className="flex items-center gap-2">
                  <Pause className="h-5 w-5" />
                  Pause
                </Button>
              )}
              
              <Button onClick={resetSession} size="lg" variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Reset
              </Button>
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>Suivez le rythme de la sphère lumineuse</p>
              <p>4 secondes d'inspiration • 7 secondes de rétention • 8 secondes d'expiration</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}