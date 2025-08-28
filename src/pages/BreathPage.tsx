import React from 'react';
import { Button } from '@/components/ui/button';
import { BreathRing } from '@/components/breath/BreathRing';
import { PatternPicker } from '@/components/breath/PatternPicker';
import { Coach } from '@/components/breath/Coach';
import { HapticToggle } from '@/components/breath/HapticToggle';
import { EndModal } from '@/components/breath/EndModal';
import { useBreathwork } from '@/hooks/useBreathwork';
import { Play, Pause, Square } from 'lucide-react';

const BreathPage: React.FC = () => {
  const { 
    state, 
    start, 
    pause, 
    resume, 
    finish, 
    submit,
    setPattern,
    setDuration
  } = useBreathwork();

  const handleFinish = async () => {
    finish();
    await submit();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="container mx-auto max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Breathwork</h1>
          <p className="text-muted-foreground">
            Exercice de cohérence cardiaque guidé
          </p>
        </header>

        {/* Configuration */}
        {!state.running && (
          <div className="space-y-6 mb-8">
            <PatternPicker
              value={state.pattern}
              onChange={setPattern}
            />
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={state.duration === 60 ? "default" : "outline"}
                onClick={() => setDuration(60)}
                className="h-12"
              >
                1 min
              </Button>
              <Button
                variant={state.duration === 180 ? "default" : "outline"}
                onClick={() => setDuration(180)}
                className="h-12"
              >
                3 min
              </Button>
              <Button
                variant={state.duration === 300 ? "default" : "outline"}
                onClick={() => setDuration(300)}
                className="h-12"
              >
                5 min
              </Button>
            </div>

            <HapticToggle />
          </div>
        )}

        {/* Breath Ring */}
        <div className="flex justify-center mb-8">
          <BreathRing
            phase={state.phase}
            phaseProgress={state.phaseProgress}
            reducedMotion={state.reduceMotion}
            pattern={state.pattern}
            running={state.running}
          />
        </div>

        {/* Coach */}
        <Coach
          phase={state.phase}
          voiceEnabled={state.voiceEnabled}
          running={state.running}
        />

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-8">
          {!state.running ? (
            <Button
              onClick={start}
              size="lg"
              className="h-14 px-8"
              aria-label="Commencer l'exercice"
            >
              <Play className="w-5 h-5 mr-2" />
              Commencer
            </Button>
          ) : (
            <>
              <Button
                onClick={state.paused ? resume : pause}
                variant="outline"
                size="lg"
                className="h-14 px-6"
                aria-label={state.paused ? "Reprendre" : "Mettre en pause"}
              >
                {state.paused ? (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Reprendre
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleFinish}
                variant="secondary"
                size="lg"
                className="h-14 px-6"
                aria-label="Terminer l'exercice"
              >
                <Square className="w-5 h-5 mr-2" />
                Terminer
              </Button>
            </>
          )}
        </div>

        {/* Progress */}
        {state.running && (
          <div className="mt-6 text-center">
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${(state.elapsed / state.duration) * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {Math.floor((state.duration - state.elapsed) / 60)}:{String(Math.floor((state.duration - state.elapsed) % 60)).padStart(2, '0')} restant
            </p>
          </div>
        )}

        {/* End Modal */}
        <EndModal
          isOpen={state.finished}
          onClose={() => window.history.back()}
          badgeId={state.badgeEarned}
        />
      </div>
    </main>
  );
};

export default BreathPage;