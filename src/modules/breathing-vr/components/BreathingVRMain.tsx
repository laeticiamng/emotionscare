/**
 * Composant principal du module breathing-vr
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wind } from 'lucide-react';
import { useBreathingVR } from '../useBreathingVR';
import { PatternSelector } from '../ui/PatternSelector';
import { BreathingScene } from '../ui/BreathingScene';
import { BreathingControls } from '../ui/BreathingControls';
import type { BreathingPattern } from '../types';

export function BreathingVRMain() {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>('box');
  
  const {
    status,
    currentPhase,
    phaseProgress,
    cyclesCompleted,
    elapsedTime,
    startBreathing,
    pauseBreathing,
    resumeBreathing,
    completeBreathing
  } = useBreathingVR();

  const handleStart = () => {
    startBreathing(selectedPattern, false);
  };

  const isIdle = status === 'idle';

  return (
    <div className="container max-w-5xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-primary" />
            Respiration Guidée VR
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isIdle && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Choisissez votre technique</h3>
                <PatternSelector
                  selected={selectedPattern}
                  onSelect={setSelectedPattern}
                />
              </div>

              <Button onClick={handleStart} size="lg" className="w-full">
                Démarrer la session
              </Button>
            </>
          )}

          {!isIdle && (
            <>
              <BreathingScene phase={currentPhase} progress={phaseProgress} />
              
              <BreathingControls
                status={status}
                currentPhase={currentPhase}
                cyclesCompleted={cyclesCompleted}
                elapsedTime={elapsedTime}
                onPause={pauseBreathing}
                onResume={resumeBreathing}
                onComplete={() => completeBreathing()}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BreathingVRMain;
