
import React, { useState, useEffect } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMusic } from '@/contexts/MusicContext';
import { useActivityLogging } from '@/hooks/useActivityLogging';
import { useCoach } from '@/hooks/coach/useCoach';
import { useMusicalCreation } from '@/hooks/useMusicalCreation';
import EnhancedMusicVisualizer from '@/components/music/EnhancedMusicVisualizer';
import AudioEqualizer from '@/components/music/AudioEqualizer';
import MusicPlayer from '@/components/music/MusicPlayer';
import { Button } from '@/components/ui/button';
import { Music, Sparkles, ListMusic, Headphones, Plus } from 'lucide-react';
import MusicMoodVisualization from '@/components/music/MusicMoodVisualization';

const MusicPage = () => {
  const { loadPlaylistForEmotion, openDrawer, currentTrack } = useMusic();
  const { lastEmotion } = useCoach();
  const { creations, loadUserCreations } = useMusicalCreation();
  const { logUserAction } = useActivityLogging('music');
  const [isLoadingCreations, setIsLoadingCreations] = useState(false);
  
  // Charger les créations musicales au chargement de la page
  useEffect(() => {
    const fetchUserCreations = async () => {
      setIsLoadingCreations(true);
      try {
        await loadUserCreations();
        logUserAction('view_music_library');
      } catch (error) {
        console.error('Error loading music creations:', error);
      } finally {
        setIsLoadingCreations(false);
      }
    };
    
    fetchUserCreations();
  }, [loadUserCreations, logUserAction]);
  
  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Expérience Musicale</h1>
          <p className="text-muted-foreground">Écoutez, ajustez et créez votre ambiance sonore</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="player" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="player">Lecteur</TabsTrigger>
                <TabsTrigger value="library">Bibliothèque</TabsTrigger>
                <TabsTrigger value="mood">Humeur</TabsTrigger>
              </TabsList>
              
              <TabsContent value="player">
                <Card className="shadow-lg overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Music className="h-5 w-5 text-primary" />
                      Lecteur musical
                    </CardTitle>
                    <CardDescription>Écoutez et ajustez votre musique</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 grid gap-6">
                    {currentTrack ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        <EnhancedMusicVisualizer 
                          emotion={lastEmotion || 'neutral'} 
                          height={200}
                          showControls={false}
                        />
                        <MusicPlayer />
                      </div>
                    ) : (
                      <div className="text-center p-12 bg-muted/20 rounded-lg border border-dashed">
                        <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">Aucune musique en cours</h3>
                        <p className="text-muted-foreground mb-6">
                          Sélectionnez un morceau pour commencer à écouter
                        </p>
                        <Button onClick={() => loadPlaylistForEmotion('neutral')}>
                          Charger une playlist
                        </Button>
                      </div>
                    )}
                    
                    <AudioEqualizer className="mt-6" />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="library">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ListMusic className="h-5 w-5 text-primary" />
                        <span>Bibliothèque musicale</span>
                      </div>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle création
                      </Button>
                    </CardTitle>
                    <CardDescription>Vos morceaux et playlists personnalisés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingCreations ? (
                      <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {creations.map((creation) => (
                          <div 
                            key={creation.id} 
                            className="flex items-center p-3 bg-muted/30 hover:bg-muted/40 rounded-md cursor-pointer"
                          >
                            <div className="h-12 w-12 bg-primary/20 flex items-center justify-center rounded-md mr-3">
                              <Music className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium">{creation.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                Créé le {new Date(creation.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" className="ml-2">
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        
                        {creations.length === 0 && (
                          <div className="text-center p-8 bg-muted/20 rounded-md border border-dashed">
                            <p>Aucune création musicale pour le moment</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="mood">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span>Musique & Humeur</span>
                    </CardTitle>
                    <CardDescription>Découvrez comment la musique influence vos émotions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-lg mb-4">Visualisation des émotions</h3>
                      <MusicMoodVisualization />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {['calm', 'focused', 'energetic'].map((emotion) => (
                        <Button
                          key={emotion}
                          variant="outline"
                          className="flex flex-col h-auto py-4"
                          onClick={() => {
                            loadPlaylistForEmotion(emotion);
                            logUserAction('select_mood_playlist', { emotion });
                            openDrawer();
                          }}
                        >
                          <Headphones className="h-8 w-8 mb-2" />
                          <span className="capitalize">{emotion}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <EnhancedMusicVisualizer 
              emotion={lastEmotion || 'neutral'} 
              showControls={true}
              className="shadow-lg"
            />
            
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Playlists recommandées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {['happy', 'calm', 'focused', 'energetic', 'melancholic'].map((emotion) => (
                    <div 
                      key={emotion}
                      className="flex items-center p-2 hover:bg-muted/30 rounded-md cursor-pointer"
                      onClick={() => {
                        loadPlaylistForEmotion(emotion);
                        logUserAction('select_emotion_playlist', { emotion });
                        openDrawer();
                      }}
                    >
                      <div className={`h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3`}>
                        <Music className="h-4 w-4 text-primary" />
                      </div>
                      <span className="capitalize">{emotion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default MusicPage;
