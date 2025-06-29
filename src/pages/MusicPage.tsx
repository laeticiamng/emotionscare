
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MusicPlayer from '@/components/music/player/MusicPlayer';
import EmotionMusicGenerator from '@/components/music/EmotionMusicGenerator';
import { MusicTrack } from '@/types/music';
import { useMusicControls } from '@/hooks/useMusicControls';
import { Play, Music, Headphones } from 'lucide-react';

const MusicPage: React.FC = () => {
  const [generatedTrack, setGeneratedTrack] = useState<MusicTrack | null>(null);
  const { playTrack } = useMusicControls();

  const handleTrackGenerated = (track: MusicTrack) => {
    console.log('🎵 New track generated:', track);
    setGeneratedTrack(track);
    
    // Auto-play le nouveau morceau
    setTimeout(() => {
      playTrack(track);
    }, 500);
  };

  // Morceaux de test pour vérifier la lecture
  const testTracks: MusicTrack[] = [
    {
      id: 'test-1',
      title: 'Test Audio 1',
      artist: 'Test Artist',
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 10,
      emotion: 'test',
    },
    {
      id: 'test-2', 
      title: 'Test Audio 2',
      artist: 'Test Artist',
      url: 'https://audio-previews.elements.envatousercontent.com/files/369519426/preview.mp3',
      duration: 30,
      emotion: 'test',
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Music className="h-8 w-8" />
          Thérapie Musicale
        </h1>
        <p className="text-lg text-muted-foreground">
          Génération de musique adaptée à vos émotions avec l'IA
        </p>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Générer</TabsTrigger>
          <TabsTrigger value="player">Lecteur</TabsTrigger>
          <TabsTrigger value="test">Test Audio</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <EmotionMusicGenerator />
            
            {generatedTrack && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5" />
                    Dernier morceau généré
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{generatedTrack.title}</p>
                    <p className="text-sm text-muted-foreground">Par {generatedTrack.artist}</p>
                    <p className="text-sm">Émotion: {generatedTrack.emotion}</p>
                    <Button 
                      onClick={() => playTrack(generatedTrack)}
                      className="w-full mt-4"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Écouter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="player" className="space-y-6">
          <MusicPlayer track={generatedTrack} />
          
          {!generatedTrack && (
            <Card>
              <CardContent className="p-6 text-center">
                <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Aucun morceau chargé. Générez d'abord une piste dans l'onglet "Générer".
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test de lecture audio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Testez la lecture audio avec ces échantillons :
              </p>
              {testTracks.map((track) => (
                <div key={track.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{track.title}</p>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>
                  <Button 
                    onClick={() => playTrack(track)}
                    size="sm"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicPage;
