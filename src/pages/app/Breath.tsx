import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { SessionResultComponent } from '@/components/modules/SessionResult';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useModuleSession } from '@/hooks/useModuleSession';
import { useRewards } from '@/hooks/useRewards';
import { Wind } from 'lucide-react';

const Breath: React.FC = () => {
  const { state, isActive, startSession, endSession } = useModuleSession();
  const { unlockReward } = useRewards();
  const [sessionResult, setSessionResult] = useState<any>(null);
  const [cycles, setCycles] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [preset, setPreset] = useState<'normal' | 'sleep'>('normal');
  const [timeLeft, setTimeLeft] = useState(60);

  const totalCycles = preset === 'sleep' ? 8 : 6;
  const phaseSeconds = preset === 'sleep' ? { inhale: 4, hold: 2, exhale: 6 } : { inhale: 4, hold: 1, exhale: 4 };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && cycles < totalCycles) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Move to next phase/cycle
            setPhase(currentPhase => {
              if (currentPhase === 'inhale') return 'hold';
              if (currentPhase === 'hold') return 'exhale';
              
              // End of exhale - complete cycle
              setCycles(prev => prev + 1);
              return 'inhale';
            });
            
            return phaseSeconds[phase];
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, cycles, phase, totalCycles, phaseSeconds]);

  useEffect(() => {
    if (cycles >= totalCycles && isActive) {
      handleComplete();
    }
  }, [cycles, totalCycles, isActive]);

  const handleStart = async (selectedPreset: 'normal' | 'sleep' = 'normal') => {
    setPreset(selectedPreset);
    setTimeLeft(phaseSeconds.inhale);
    
    await startSession({
      id: 'breath',
      name: 'Respiration guidée',
      duration: selectedPreset === 'sleep' ? 120 : 90,
      preset: selectedPreset
    });
  };

  const handleComplete = async () => {
    // Submit STAI-6 responses (simulated)
    const responses = Array.from({ length: 6 }, (_, i) => ({
      questionId: `stai_${i + 1}`,
      value: Math.floor(Math.random() * 4) + 1
    }));

    const result = await endSession({
      id: 'breath',
      name: 'Respiration guidée',
      duration: preset === 'sleep' ? 120 : 90,
      preset
    }, responses);

    // Unlock aura for sleep preset
    const reward = preset === 'sleep' ? unlockReward({
      type: 'aura',
      name: 'Brise du soir',
      description: 'Aura apaisante pour les moments calmes'
    }) : undefined;

    setSessionResult({
      ...result,
      reward
    });
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inspire';
      case 'hold': return 'Retiens';
      case 'exhale': return 'Expire';
    }
  };

  const getOrbScale = () => {
    switch (phase) {
      case 'inhale': return 'scale-125';
      case 'hold': return 'scale-125';
      case 'exhale': return 'scale-75';
    }
  };

  if (state === 'verbal-feedback' && sessionResult) {
    return (
      <ModuleLayout 
        title="Respiration guidée"
        state={state}
        showBack={false}
      >
        <SessionResultComponent result={sessionResult} />
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout 
      title="Respiration guidée"
      subtitle="On suit l'orbe"
      state={state}
    >
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {!isActive && (
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Wind className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-medium text-foreground mb-4">
              Respirer ensemble
            </h2>
            <p className="text-muted-foreground mb-8">
              Quelques cycles pour se poser
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={() => handleStart('normal')}
                size="lg"
                className="w-full"
              >
                Respiration douce
                <Badge variant="secondary" className="ml-2">1 min</Badge>
              </Button>
              <Button 
                onClick={() => handleStart('sleep')}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Preset sommeil
                <Badge variant="secondary" className="ml-2">2 min</Badge>
              </Button>
            </div>
          </div>
        )}

        {isActive && (
          <div className="text-center">
            {/* Breathing Orb */}
            <div className="relative mb-12">
              <div 
                className={`w-32 h-32 bg-gradient-primary rounded-full transition-transform duration-1000 ease-in-out ${getOrbScale()}`}
                style={{
                  boxShadow: '0 0 40px rgba(var(--primary-hsl), 0.4)'
                }}
              />
              <div className="absolute inset-0 w-32 h-32 border-2 border-primary/30 rounded-full animate-pulse" />
            </div>

            {/* Phase & Progress */}
            <div className="space-y-4">
              <h3 className="text-2xl font-light text-foreground">
                {getPhaseText()}
              </h3>
              
              <div className="text-sm text-muted-foreground">
                Cycle {cycles + 1} / {totalCycles}
              </div>
              
              {preset === 'sleep' && cycles === 0 && (
                <p className="text-sm text-primary italic">
                  Épaules relâchées, on prend son temps
                </p>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-8 w-full max-w-xs mx-auto">
              <div className="w-full bg-card rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(cycles / totalCycles) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

export default Breath;