
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmotionMusicGenerator from '@/components/music/EmotionMusicGenerator';
import EmotionBasedMusicSelector from '@/components/music/EmotionBasedMusicSelector';
import MusicPlayer from '@/components/music/player/MusicPlayer';
import { useMusicControls } from '@/hooks/useMusicControls';
import { MusicTrack } from '@/types/music';
import { Music, Brain, Sparkles } from 'lucide-react';

const MusicPage: React.FC = () => {
  const { currentTrack } = useMusicControls();
  const [generatedTrack, setGeneratedTrack] = useState<MusicTrack | null>(null);

  const handleTrackGenerated = (track: MusicTrack) => {
    setGeneratedTrack(track);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold gradient-text">
          🎵 Thérapie Musicale Émotionnelle
        </h1>
        <p className="text-muted-foreground text-lg">
          Générez de la musique adaptée à votre état émotionnel
        </p>
      </div>

      <Tabs defaultValue="emotion-scan" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="emotion-scan" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Scanner Émotionnel
          </TabsTrigger>
          <TabsTrigger value="manual-generation" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Génération Manuelle
          </TabsTrigger>
          <TabsTrigger value="player" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Lecteur
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emotion-scan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Analyse Émotionnelle Automatique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmotionBasedMusicSelector onTrackGenerated={handleTrackGenerated} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual-generation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Génération Manuelle
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <EmotionMusicGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="player" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                Lecteur Musical
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MusicPlayer 
                track={currentTrack || generatedTrack} 
                className="w-full max-w-2xl mx-auto"
              />
              
              {!currentTrack && !generatedTrack && (
                <div className="text-center py-8 text-muted-foreground">
                  <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune musique en cours de lecture</p>
                  <p className="text-sm mt-2">
                    Générez de la musique depuis les autres onglets pour commencer
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicPage;
