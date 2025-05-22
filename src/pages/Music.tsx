
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music2, Library, Headphones, RefreshCw } from 'lucide-react';
import { MusicProvider, useMusic } from '@/providers/MusicProvider';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import defaultPlaylists from '@/data/musicPlaylists';

const MusicPlayerComponent: React.FC = () => {
  const [playlists] = useState<MusicPlaylist[]>(defaultPlaylists);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Set initial playlist
  useEffect(() => {
    if (playlists.length > 0 && !currentPlaylist) {
      setCurrentPlaylist(playlists[0]);
    }
  }, [playlists, currentPlaylist]);

  // Play a track
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Musicothérapie</h1>
          <p className="text-muted-foreground">
            Explorez des sons et des mélodies pour améliorer votre bien-être émotionnel
          </p>
        </div>
      </div>

      <Tabs defaultValue="recommended">
        <TabsList>
          <TabsTrigger value="recommended" className="flex items-center gap-2">
            <Music2 className="h-4 w-4" /> Recommandations
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Library className="h-4 w-4" /> Bibliothèque
          </TabsTrigger>
          <TabsTrigger value="mood" className="flex items-center gap-2">
            <Headphones className="h-4 w-4" /> Par humeur
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Personnalisé
          </TabsTrigger>
        </TabsList>

        {/* Recommended tab */}
        <TabsContent value="recommended" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Playlists recommandées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {playlists.map((playlist) => (
                  <Card key={playlist.id} className="overflow-hidden">
                    <div className="bg-gradient-to-br from-primary/20 to-muted h-32 flex items-center justify-center">
                      <Music2 className="h-16 w-16 text-primary/50" />
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="text-lg font-semibold">{playlist.name}</h3>
                      <p className="text-sm text-muted-foreground">{playlist.description}</p>
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => setCurrentPlaylist(playlist)}
                          className="w-full"
                        >
                          Écouter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Library tab */}
        <TabsContent value="library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Votre bibliothèque</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Vous n'avez pas encore de playlists dans votre bibliothèque.
              </p>
              <div className="flex justify-center mt-4">
                <Button>Découvrir des playlists</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mood tab */}
        <TabsContent value="mood" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Musique par émotion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {['Calme', 'Énergique', 'Concentration', 'Méditation', 'Motivation'].map((mood) => (
                  <Button key={mood} variant="outline" className="h-24 flex flex-col gap-2">
                    <span>{mood}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom tab */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Musique personnalisée</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Créez votre propre ambiance musicale adaptée à vos besoins émotionnels.
              </p>
              <div className="flex justify-center mt-4">
                <Button>Créer une composition</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {currentPlaylist && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{currentPlaylist.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentPlaylist.tracks.map((track, index) => (
                <div 
                  key={track.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    currentTrack?.id === track.id ? 'bg-primary/10' : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => playTrack(track)}
                    >
                      {currentTrack?.id === track.id && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <div>
                      <p className="font-medium">{track.title}</p>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simple music player control bar */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-primary/20 rounded-md flex items-center justify-center">
              <Music2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{currentTrack.title}</p>
              <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={togglePlay}>
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrap component with MusicProvider if needed
const Music: React.FC = () => {
  return (
    <MusicProvider>
      <MusicPlayerComponent />
    </MusicProvider>
  );
};

export default Music;
