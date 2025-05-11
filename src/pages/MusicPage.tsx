import React, { useState, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp, Headphones } from 'lucide-react';
import MusicControls from '@/components/music/page/MusicControls';
import MusicDrawer from '@/components/music/MusicDrawer';
import { mockMusicPlaylists } from '@/data/mockMusic';
import { MusicPlaylist } from '@/types/music';

const MusicPage: React.FC = () => {
  const { isPlaying, currentTrack, playTrack, loadPlaylistForEmotion } = useMusic();
  const [activeTab, setActiveTab] = useState('recommended');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<MusicPlaylist | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('featured');
  
  useEffect(() => {
    // Load default playlist on mount
    const loadDefaultPlaylist = async () => {
      await loadPlaylistForEmotion('calm');
    };
    
    loadDefaultPlaylist();
  }, [loadPlaylistForEmotion]);
  
  const handlePlaylistSelect = (playlist: MusicPlaylist) => {
    setSelectedPlaylist(playlist);
    setDrawerOpen(true);
  };
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Bibliothèque musicale</h1>
        <p className="text-muted-foreground">Explorez notre collection de playlists adaptées à vos émotions et besoins</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="recommended">Recommandé</TabsTrigger>
              <TabsTrigger value="emotions">Émotions</TabsTrigger>
              <TabsTrigger value="activities">Activités</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recommended">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-medium">Playlists en vedette</h2>
                    <Button variant="ghost" size="sm" onClick={() => toggleSection('featured')}>
                      {expandedSection === 'featured' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {expandedSection === 'featured' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {mockMusicPlaylists.map((playlist) => (
                        <Card key={playlist.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4" onClick={() => handlePlaylistSelect(playlist)}>
                            <div className="aspect-square rounded-lg bg-muted overflow-hidden mb-3">
                              <img 
                                src={playlist.coverUrl} 
                                alt={playlist.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h3 className="font-medium line-clamp-1">{playlist.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">{playlist.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="emotions">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {['Calme', 'Joyeux', 'Concentré', 'Mélancolique', 'Énergique', 'Relaxant'].map((emotion) => (
                  <Card key={emotion} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Headphones className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-medium text-center">{emotion}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="activities">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {['Méditation', 'Travail', 'Exercice', 'Lecture', 'Sommeil'].map((activity) => (
                  <Card key={activity} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="aspect-video rounded-lg bg-muted flex items-center justify-center mb-3">
                        <Headphones className="h-8 w-8" />
                      </div>
                      <h3 className="font-medium">{activity}</h3>
                      <p className="text-xs text-muted-foreground">Musique adaptée pour {activity.toLowerCase()}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-4">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Lecture en cours</CardTitle>
            </CardHeader>
            <CardContent>
              {currentTrack ? (
                <MusicControls 
                  showProgress={true}
                  showTrackInfo={true}
                  showVolumeControl={true}
                />
              ) : (
                <div className="text-center py-8">
                  <Headphones className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Sélectionnez une playlist pour commencer l'écoute</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <MusicDrawer 
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpenChange={(open: boolean) => setDrawerOpen(open)}
        playlist={selectedPlaylist}
      />
    </div>
  );
};

export default MusicPage;
