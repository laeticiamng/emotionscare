
import React, { useState, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Sparkles } from 'lucide-react';
import EnhancedMusicVisualizer from '@/components/music/EnhancedMusicVisualizer';
import AudioEqualizer from '@/components/music/AudioEqualizer';
import { useToast } from '@/hooks/use-toast';
import { useActivityLogging } from '@/hooks/useActivityLogging';
import ProtectedLayout from '@/components/ProtectedLayout';

interface MusicMoodVisualizationProps {
  mood: string;
}

const MusicMoodVisualization: React.FC<MusicMoodVisualizationProps> = ({ mood }) => {
  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 p-4">
      <h3 className="font-medium mb-3">Visualisation pour ambiance "{mood}"</h3>
      <div className="h-[180px]">
        <EnhancedMusicVisualizer 
          emotion={mood}
          height={160}
          showControls={false}
        />
      </div>
    </div>
  );
};

const MusicLibrary = () => {
  const { playlists, loadPlaylistById } = useMusic();
  const { toast } = useToast();
  
  const handlePlayPlaylist = (id: string) => {
    loadPlaylistById(id);
    toast({
      title: "Playlist chargée",
      description: "Lecture de la playlist démarrée",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-primary/20 flex items-center justify-center">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 p-4">
                  <h3 className="font-medium">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground">{playlist.tracks.length} morceaux</p>
                </div>
                <div className="pr-4">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="rounded-full h-10 w-10 p-0" 
                    onClick={() => handlePlayPlaylist(playlist.id)}
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const MusicMixer = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mixage audio</CardTitle>
          <CardDescription>Ajustez les paramètres audio pour une expérience personnalisée</CardDescription>
        </CardHeader>
        <CardContent>
          <AudioEqualizer />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MusicMoodVisualization mood="calm" />
        <MusicMoodVisualization mood="focused" />
      </div>
    </div>
  );
};

const MusicPage = () => {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    pauseTrack, 
    nextTrack, 
    previousTrack,
    volume,
    setVolume
  } = useMusic();
  const { logUserAction } = useActivityLogging('music');
  const [activeTab, setActiveTab] = useState('player');
  
  useEffect(() => {
    logUserAction('visit_music_page');
  }, [logUserAction]);
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };
  
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
      logUserAction('pause_music');
    } else if (currentTrack) {
      playTrack(currentTrack);
      logUserAction('play_music');
    }
  };
  
  return (
    <ProtectedLayout>
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Musique Thérapeutique</h1>
        </div>
        
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 bg-muted/20 p-6 flex flex-col justify-center items-center">
                <div className="rounded-full h-32 w-32 bg-primary/10 flex items-center justify-center mb-4">
                  <Music className="h-12 w-12 text-primary/80" />
                </div>
                <h2 className="text-xl font-medium text-center">
                  {currentTrack?.title || "Aucune piste sélectionnée"}
                </h2>
                <p className="text-muted-foreground text-center">
                  {currentTrack?.artist || "Sélectionnez une piste pour commencer"}
                </p>
              </div>
              
              <div className="flex-1 p-6">
                <div className="h-[180px] mb-6">
                  <EnhancedMusicVisualizer 
                    showControls={false}
                    height={180}
                  />
                </div>
                
                <div className="flex justify-center space-x-2 mb-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10"
                    onClick={previousTrack}
                    disabled={!currentTrack}
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    variant="default" 
                    size="icon"
                    className="h-12 w-12" 
                    onClick={togglePlayPause}
                    disabled={!currentTrack}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10"
                    onClick={nextTrack}
                    disabled={!currentTrack}
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    defaultValue={[volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="player">Lecteur</TabsTrigger>
            <TabsTrigger value="library">Bibliothèque</TabsTrigger>
            <TabsTrigger value="mixer">Mixage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="player">
            <Card>
              <CardHeader>
                <CardTitle>Lecteur musical</CardTitle>
                <CardDescription>Écoutez de la musique adaptée à votre état émotionnel</CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedMusicVisualizer 
                  showControls={true}
                  height={200}
                  className="mb-4"
                />
                
                <Card className="bg-muted/20 p-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Musique adaptative</h3>
                      <p className="text-sm text-muted-foreground">
                        La musique s'adapte automatiquement à votre état émotionnel détecté lors des scans
                      </p>
                    </div>
                  </div>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="library">
            <Card>
              <CardHeader>
                <CardTitle>Bibliothèque musicale</CardTitle>
                <CardDescription>Explorez notre collection de playlists thérapeutiques</CardDescription>
              </CardHeader>
              <CardContent>
                <MusicLibrary />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mixer">
            <MusicMixer />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
};

export default MusicPage;
