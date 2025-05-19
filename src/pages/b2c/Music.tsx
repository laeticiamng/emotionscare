
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { useMusic } from '@/hooks/useMusic';
import MusicLibrary from '@/components/music/page/LibraryTab';
import MusicControls from '@/components/music/page/MusicControls';
import MusicDrawer from '@/components/music/MusicDrawer';
import { Music as MusicIcon, Heart, Clock, Headphones, Search, PlaySquare } from 'lucide-react';
import { mockPlaylists } from '@/data/mockMusic';

const B2CMusic: React.FC = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<MusicPlaylist | null>(null);
  
  const { toast } = useToast();
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    pauseTrack,
    nextTrack,
    previousTrack,
    volume,
    setVolume,
    playlists,
    loadPlaylistForEmotion
  } = useMusic();

  useEffect(() => {
    // Load some default content on mount
    const loadInitialMusic = async () => {
      try {
        await loadPlaylistForEmotion('calm');
      } catch (error) {
        console.error("Failed to load initial music:", error);
      }
    };
    
    loadInitialMusic();
  }, [loadPlaylistForEmotion]);

  const handlePlaylistSelect = (playlist: MusicPlaylist) => {
    setSelectedPlaylist(playlist);
    setDrawerOpen(true);
    
    // If the playlist has tracks, play the first one
    if (playlist.tracks && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  };

  const handleTrackSelect = (track: MusicTrack) => {
    playTrack(track);
  };

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bibliothèque musicale</h1>
          <p className="text-muted-foreground">
            Découvrez des compositions adaptées à vos émotions et besoins
          </p>
        </div>
        
        <div className="flex items-center w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher une musique..." 
              className="pl-8" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="library">Bibliothèque</TabsTrigger>
              <TabsTrigger value="moods">Émotions</TabsTrigger>
              <TabsTrigger value="favorites">Favoris</TabsTrigger>
            </TabsList>
            
            <TabsContent value="library" className="space-y-6">
              <MusicLibrary 
                playlists={mockPlaylists}
                onSelectTrack={handleTrackSelect}
                onSelectPlaylist={handlePlaylistSelect}
              />
            </TabsContent>
            
            <TabsContent value="moods">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {['Calme', 'Joyeux', 'Concentré', 'Énergique', 'Mélancolique', 'Motivé', 'Relaxé', 'Paisible'].map((mood) => (
                  <Button 
                    key={mood} 
                    variant="outline" 
                    className="h-auto py-6 flex flex-col gap-2"
                    onClick={() => {
                      toast({
                        title: `Mode ${mood} activé`,
                        description: `Chargement des musiques pour l'ambiance ${mood.toLowerCase()}...`,
                      });
                      loadPlaylistForEmotion(mood.toLowerCase());
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Headphones className="h-6 w-6 text-primary" />
                    </div>
                    <span>{mood}</span>
                  </Button>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recommandé pour votre humeur actuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockPlaylists[0]?.tracks.slice(0, 3).map((track) => (
                      <div 
                        key={track.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => handleTrackSelect(track)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mr-3">
                            <MusicIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{track.title}</p>
                            <p className="text-xs text-muted-foreground">{track.artist}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="ghost">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <PlaySquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="favorites">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Pas encore de favoris</h3>
                <p className="text-muted-foreground mb-6">
                  Ajoutez des morceaux à vos favoris pour les retrouver ici
                </p>
                <Button onClick={() => setActiveTab('library')}>
                  Parcourir la bibliothèque
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1 order-1 lg:order-2">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Lecture en cours</CardTitle>
            </CardHeader>
            <CardContent>
              {currentTrack ? (
                <MusicControls 
                  track={currentTrack}
                  isPlaying={isPlaying}
                  volume={volume * 100}
                  onPlay={() => playTrack(currentTrack)}
                  onPause={pauseTrack}
                  onNext={nextTrack}
                  onPrevious={previousTrack}
                  onVolumeChange={(value) => setVolume(value / 100)}
                  progress={0} // This should be connected to real progress
                  duration={currentTrack.duration || 0}
                  currentTime={0} // This should be connected to real current time
                  onSeek={() => {}} // This should be connected to real seek function
                />
              ) : (
                <div className="text-center py-8">
                  <MusicIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Sélectionnez une musique pour commencer l'écoute
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <MusicDrawer 
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpenChange={(open) => setDrawerOpen(open)}
        playlist={selectedPlaylist}
        currentTrack={currentTrack}
      />
    </div>
  );
};

export default B2CMusic;
