import React, { useState } from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Music, Play, Pause, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';
import { useMoodMixer } from '@/hooks/useMoodMixer';
import MoodControls from '@/components/mood-mixer/MoodControls';
import PresetSelector from '@/components/mood-mixer/PresetSelector';

const MoodMixerPage: React.FC = () => {
  const { 
    currentMix, 
    isGenerating, 
    isPlaying,
    progress,
    generateMix, 
    playMix, 
    pauseMix,
    skipSegment 
  } = useMoodMixer();
  
  const [currentMood, setCurrentMood] = useState('stressed');
  const [targetMood, setTargetMood] = useState('calm');

  const handleGenerateMix = async () => {
    await generateMix(currentMood, targetMood, 180, 'smooth');
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Mood Mixer</h1>
              <p className="text-muted-foreground">Mixage musical adaptatif pour votre état émotionnel</p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Music className="h-3 w-3 mr-1" />
              IA Musicale
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contrôles d'humeur */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Configuration du Mix
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <MoodControls 
                  currentMood={currentMood}
                  targetMood={targetMood}
                  onCurrentMoodChange={setCurrentMood}
                  onTargetMoodChange={setTargetMood}
                />
                
                <PresetSelector onPresetSelect={(preset) => {
                  setCurrentMood(preset.from);
                  setTargetMood(preset.to);
                }} />

                <Button 
                  onClick={handleGenerateMix}
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Shuffle className="h-4 w-4 mr-2" />
                      Générer le Mix
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Lecteur principal */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Lecteur Adaptatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentMix ? (
                  <>
                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-semibold">
                        {currentMix.playlist[0]?.title || 'Mix Personnalisé'}
                      </h3>
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant="outline">{currentMood}</Badge>
                        <span className="text-muted-foreground">→</span>
                        <Badge variant="default">{targetMood}</Badge>
                      </div>
                    </div>

                    {/* Visualisation de forme d'onde */}
                    <div className="relative h-32 bg-muted rounded-lg p-4 overflow-hidden">
                      <div className="flex items-center justify-center h-full space-x-1">
                        {currentMix.visualization?.waveform?.map((value, i) => (
                          <div
                            key={i}
                            className="bg-primary/60 rounded-full transition-all duration-200"
                            style={{
                              height: `${Math.max(4, value * 0.8)}px`,
                              width: '2px',
                              opacity: isPlaying ? 0.8 : 0.4
                            }}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 pointer-events-none" />
                    </div>

                    {/* Barre de progression */}
                    <div className="space-y-2">
                      <Progress value={progress} className="w-full" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>2:15</span>
                        <span>Transition émotionnelle</span>
                        <span>6:30</span>
                      </div>
                    </div>

                    {/* Contrôles de lecture */}
                    <div className="flex items-center justify-center gap-4">
                      <Button variant="outline" size="icon">
                        <Repeat className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => skipSegment(-1)}
                      >
                        <SkipForward className="h-4 w-4 rotate-180" />
                      </Button>
                      <Button 
                        size="lg"
                        onClick={isPlaying ? pauseMix : playMix}
                        className="rounded-full w-16 h-16"
                      >
                        {isPlaying ? 
                          <Pause className="h-6 w-6" /> : 
                          <Play className="h-6 w-6 ml-1" />
                        }
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => skipSegment(1)}
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Segments du mix */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Segments de transition</h4>
                      <div className="grid gap-2">
                        {currentMix.playlist[0]?.segments?.map((segment, i) => (
                          <div 
                            key={i}
                            className="flex items-center justify-between p-2 bg-muted/50 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {segment.mood}
                              </Badge>
                              <span className="text-sm">{segment.duration}s</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Vol. {segment.volume}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Music className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p>Générez votre premier mix adaptatif pour commencer</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Fonctionnalités avancées */}
          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités Adaptatives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Music className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Crossfade Intelligent</h3>
                  <p className="text-sm text-muted-foreground">
                    Transitions fluides entre les états émotionnels
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Volume2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Réglage en Temps Réel</h3>
                  <p className="text-sm text-muted-foreground">
                    Adaptation continue selon votre ressenti
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Repeat className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Système Particulaire</h3>
                  <p className="text-sm text-muted-foreground">
                    Visualisation immersive de l'état émotionnel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </UnifiedShell>
    </div>
  );
};

export default MoodMixerPage;