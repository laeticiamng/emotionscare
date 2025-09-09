import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { SessionResultComponent } from '@/components/modules/SessionResult';
import { ArtifactReward } from '@/components/universe/ArtifactReward';
import { UniverseAmbiance } from '@/components/universe/UniverseAmbiance';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useModuleSession } from '@/hooks/useModuleSession';
import { useRewards } from '@/hooks/useRewards';
import { UNIVERSES } from '@/types/universes';
import { Wind, Sparkles } from 'lucide-react';

const Breath: React.FC = () => {
  const { state, isActive, startSession, endSession } = useModuleSession();
  const { unlockReward } = useRewards();
  const [sessionResult, setSessionResult] = useState<any>(null);
  const [cycles, setCycles] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [preset, setPreset] = useState<'normal' | 'sleep'>('normal');
  const [timeLeft, setTimeLeft] = useState(60);
  const [showArtifact, setShowArtifact] = useState(false);

  const breathUniverse = UNIVERSES.breath;

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

    // Show artifact for sleep preset
    if (preset === 'sleep') {
      setShowArtifact(true);
      setTimeout(() => {
        setSessionResult(result);
        setShowArtifact(false);
      }, 3000);
    } else {
      setSessionResult(result);
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inspire';
      case 'hold': return 'Retiens';
      case 'exhale': return 'Expire';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return breathUniverse.ambiance.colors.primary;
      case 'hold': return breathUniverse.ambiance.colors.accent;
      case 'exhale': return breathUniverse.ambiance.colors.secondary;
    }
  };

  if (showArtifact) {
    return (
      <div className="min-h-screen relative" style={{ background: breathUniverse.ambiance.background }}>
        <UniverseAmbiance universe={breathUniverse} intensity={0.9} />
        <ArtifactReward 
          universe={breathUniverse}
          onComplete={() => {
            setShowArtifact(false);
            setSessionResult({ badge: "Souffle apaisé ✨" });
          }}
        />
      </div>
    );
  }

  if (state === 'verbal-feedback' && sessionResult) {
    return (
      <ModuleLayout 
        title={breathUniverse.name}
        state={state}
        showBack={false}
      >
        <div className="relative">
          <UniverseAmbiance universe={breathUniverse} intensity={0.6} />
          <SessionResultComponent result={sessionResult} />
        </div>
      </ModuleLayout>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: breathUniverse.ambiance.background }}>
      <UniverseAmbiance universe={breathUniverse} intensity={0.8} interactive />
      
      <ModuleLayout 
        title={breathUniverse.name}
        subtitle="La Salle des Souffles"
        state={state}
        className="bg-transparent"
      >
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {!isActive && (
          <div className="text-center max-w-sm relative z-10">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-elegant"
              style={{
                background: `linear-gradient(135deg, ${breathUniverse.ambiance.colors.primary}, ${breathUniverse.ambiance.colors.secondary})`,
                boxShadow: `0 8px 32px ${breathUniverse.ambiance.colors.primary}40`
              }}
            >
              <Wind className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-medium text-foreground mb-4">
              Respirer ensemble
            </h2>
            <p className="text-muted-foreground mb-8">
              {breathUniverse.ambiance.metaphor}
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={() => handleStart('normal')}
                size="lg"
                className="w-full"
                style={{
                  background: `linear-gradient(135deg, ${breathUniverse.ambiance.colors.primary}, ${breathUniverse.ambiance.colors.accent})`
                }}
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
          <div className="text-center relative z-10">
            {/* Breathing Orbs */}
            <div className="relative mb-12">
              {/* Main breathing orb */}
              <div 
                className={`w-40 h-40 rounded-full transition-all duration-4000 ease-in-out ${
                  phase === 'inhale' ? 'scale-125' : phase === 'hold' ? 'scale-125' : 'scale-75'
                }`}
                style={{
                  background: `radial-gradient(circle, ${getPhaseColor()}80, ${getPhaseColor()}40)`,
                  boxShadow: `0 0 60px ${getPhaseColor()}50`
                }}
              />
              
              {/* Secondary orbs */}
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className={`absolute w-16 h-16 rounded-full transition-all duration-3000 ease-in-out ${
                    phase === 'exhale' ? 'scale-110 opacity-70' : 'scale-90 opacity-40'
                  }`}
                  style={{
                    background: `radial-gradient(circle, ${breathUniverse.ambiance.colors.accent}60, transparent)`,
                    left: `${30 + i * 20}%`,
                    top: `${20 + i * 30}%`,
                    animationDelay: `${i * 0.5}s`
                  }}
                />
              ))}
              
              {/* Sparkle effects */}
              <Sparkles 
                className="absolute inset-0 m-auto w-8 h-8 text-white animate-pulse"
                style={{ 
                  color: getPhaseColor(),
                  filter: 'drop-shadow(0 0 8px currentColor)'
                }}
              />
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
                <p className="text-sm italic" style={{ color: breathUniverse.ambiance.colors.accent }}>
                  Ton souffle fait vibrer l'espace ✨
                </p>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-8 w-full max-w-xs mx-auto">
              <div className="w-full bg-card/50 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(cycles / totalCycles) * 100}%`,
                    background: `linear-gradient(90deg, ${breathUniverse.ambiance.colors.primary}, ${breathUniverse.ambiance.colors.accent})`
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Breath;