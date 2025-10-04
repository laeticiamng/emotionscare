/**
 * MeditationMain - Composant principal du module meditation
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Pause, Play, Square, Sparkles } from 'lucide-react';
import { useMeditation } from '../useMeditation';
import { MeditationTimer } from '../ui/MeditationTimer';
import { TechniqueSelector } from '../ui/TechniqueSelector';
import { MeditationProgress } from '../ui/MeditationProgress';
import type { MeditationConfig, MeditationTechnique } from '../types';

export function MeditationMain() {
  const [selectedTechnique, setSelectedTechnique] = useState<MeditationTechnique>('mindfulness');
  const [selectedDuration, setSelectedDuration] = useState<number>(10);
  const [moodBefore, setMoodBefore] = useState<number>(50);

  const meditation = useMeditation({
    autoLoadStats: true,
    autoLoadRecent: true,
  });

  const handleStart = async () => {
    const config: MeditationConfig = {
      technique: selectedTechnique,
      duration: selectedDuration,
      withGuidance: true,
      withMusic: true,
      volume: 50,
    };

    meditation.setConfig(config);
    await meditation.startSession(moodBefore);
  };

  const isIdle = meditation.state === 'idle';

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Méditation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isIdle && (
            <>
              <TechniqueSelector
                selected={selectedTechnique}
                onSelect={setSelectedTechnique}
              />
              
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Durée : {selectedDuration} minutes
                </label>
                <Slider
                  value={[selectedDuration]}
                  onValueChange={([value]) => setSelectedDuration(value)}
                  min={5}
                  max={30}
                  step={5}
                />
              </div>

              <Button onClick={handleStart} size="lg" className="w-full">
                <Play className="h-5 w-5 mr-2" />
                Démarrer
              </Button>
            </>
          )}

          {meditation.state === 'active' && (
            <>
              <MeditationTimer
                elapsedSeconds={meditation.elapsedSeconds}
                totalSeconds={meditation.config?.duration ? meditation.config.duration * 60 : 0}
              />
              <MeditationProgress progress={meditation.progress} />
              <Button onClick={meditation.completeSession} className="w-full">
                <Square className="h-4 w-4 mr-2" />
                Terminer
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MeditationMain;
