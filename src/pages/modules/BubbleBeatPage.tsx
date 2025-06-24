
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, Circle } from 'lucide-react';

const BubbleBeatPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState([80]);
  const [intensity, setIntensity] = useState([60]);

  const bubbles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 40 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bubble Beat</h1>
          <p className="text-muted-foreground">Relaxation rythmée avec visualisation de bulles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Circle className="h-5 w-5" />
                Visualisation Bubble
              </CardTitle>
              <CardDescription>Suivez les bulles pour vous détendre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden">
                {bubbles.map((bubble) => (
                  <div
                    key={bubble.id}
                    className={`absolute rounded-full bg-blue-400/30 border border-blue-300/50 ${
                      isPlaying ? 'animate-bounce' : ''
                    }`}
                    style={{
                      width: `${bubble.size}px`,
                      height: `${bubble.size}px`,
                      left: `${bubble.x}%`,
                      top: `${bubble.y}%`,
                      animationDelay: `${bubble.delay}s`,
                      animationDuration: `${2000 / tempo[0]}s`
                    }}
                  />
                ))}
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="rounded-full h-16 w-16"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Contrôles de Session
              </CardTitle>
              <CardDescription>Personnalisez votre expérience de relaxation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Tempo de Respiration</label>
                <Slider
                  value={tempo}
                  onValueChange={setTempo}
                  min={40}
                  max={120}
                  step={5}
                />
                <span className="text-xs text-muted-foreground">{tempo[0]} BPM</span>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Intensité Visuelle</label>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  min={20}
                  max={100}
                  step={10}
                />
                <span className="text-xs text-muted-foreground">{intensity[0]}%</span>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Session en cours</span>
                  <span className="text-primary">{isPlaying ? '2:34' : '0:00'}</span>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {isPlaying 
                      ? "Respirez au rythme des bulles..." 
                      : "Cliquez sur play pour commencer"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BubbleBeatPage;
