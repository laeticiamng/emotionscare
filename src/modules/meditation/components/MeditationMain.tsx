/**
 * MeditationMain - Composant principal du module meditation
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Pause, Play, Square, Sparkles } from 'lucide-react';
import { useMeditation } from '../useMeditation';
import { MeditationTimer } from '../ui/MeditationTimer';
import { TechniqueSelector } from '../ui/TechniqueSelector';
import { MeditationProgress } from '../ui/MeditationProgress';
import { MeditationStats } from '../ui/MeditationStats';
import { MeditationHistory } from '../ui/MeditationHistory';
import type { MeditationConfig, MeditationTechnique } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Méditation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="session" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="session">Session</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="session" className="space-y-6 mt-6">
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
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => meditation.pauseSession()} 
                      variant="outline"
                      className="flex-1"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                    <Button 
                      onClick={() => meditation.completeSession()} 
                      className="flex-1"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Terminer
                    </Button>
                  </div>
                </>
              )}

              {meditation.state === 'paused' && (
                <>
                  <MeditationTimer
                    elapsedSeconds={meditation.elapsedSeconds}
                    totalSeconds={meditation.config?.duration ? meditation.config.duration * 60 : 0}
                  />
                  <MeditationProgress progress={meditation.progress} />
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => meditation.resumeSession()} 
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Reprendre
                    </Button>
                    <Button 
                      onClick={() => meditation.cancelSession()} 
                      variant="destructive"
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="stats" className="mt-6">
              <MeditationStats 
                stats={meditation.stats || {
                  totalSessions: 0,
                  totalDuration: 0,
                  averageDuration: 0,
                  favoriteTechnique: null,
                  completionRate: 0,
                  currentStreak: 0,
                  longestStreak: 0,
                  avgMoodDelta: null,
                }}
                isLoading={meditation.statsLoading}
              />
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <MeditationHistory 
                sessions={meditation.recentSessions || []}
                isLoading={meditation.sessionsLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default MeditationMain;
