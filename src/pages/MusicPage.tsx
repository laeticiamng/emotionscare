import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Heart,
  Shuffle,
  Repeat,
  Music,
  Headphones,
  Waves,
  Sparkles
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { toast } from 'sonner';

const MusicPage: React.FC = () => {
  const { currentTrack, isPlaying } = useMusicControls();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Thérapie Musicale IA
          </h1>
          <p className="text-lg text-muted-foreground">
            Génération musicale personnalisée basée sur vos émotions
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <EmotionMusicGenerator />
            
            <Card>
              <CardHeader>
                <CardTitle>Comment ça marche ?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Choisissez votre émotion actuelle</li>
                  <li>• Ajoutez une description personnalisée (optionnel)</li>
                  <li>• Cliquez sur "Générer" pour créer votre musique</li>
                  <li>• La musique sera générée par IA et jouée automatiquement</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <MusicPlayer track={currentTrack} />
            
            {currentTrack && (
              <Card>
                <CardHeader>
                  <CardTitle>Piste actuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{currentTrack.title}</p>
                    <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                    <p className="text-sm text-muted-foreground">
                      Émotion: {currentTrack.emotion}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-sm">{isPlaying ? 'En cours' : 'En pause'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
