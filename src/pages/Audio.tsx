
import React from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayCircle, PauseCircle, SkipForward, SkipBack, Volume2, Music, Headphones, Mic, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Audio: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('discover');
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(80);
  const [currentTrack, setCurrentTrack] = React.useState<{
    title: string;
    artist: string;
    duration: string;
    progress: number;
  }>({
    title: "Méditation guidée",
    artist: "Sophie Marceau",
    duration: "10:30",
    progress: 35
  });

  // Simulated audio tracks
  const featuredTracks = [
    {
      id: "1",
      title: "Méditation guidée",
      artist: "Sophie Marceau",
      duration: "10:30",
      category: "Méditation"
    },
    {
      id: "2",
      title: "Sons de la forêt",
      artist: "Nature Sounds",
      duration: "15:45",
      category: "Ambiance"
    },
    {
      id: "3",
      title: "Relaxation profonde",
      artist: "Jean Dujardin",
      duration: "20:15",
      category: "Relaxation"
    },
    {
      id: "4",
      title: "Focus au travail",
      artist: "Concentration",
      duration: "45:00",
      category: "Productivité"
    }
  ];

  const recentTracks = [
    {
      id: "5",
      title: "Sommeil réparateur",
      artist: "Nuit Calme",
      duration: "8:30",
      category: "Sommeil"
    },
    {
      id: "6",
      title: "Éveil matinal",
      artist: "Énergie Positive",
      duration: "5:45",
      category: "Énergie"
    }
  ];

  const playlists = [
    {
      id: "p1",
      title: "Méditations",
      trackCount: 12,
      duration: "2h 30m"
    },
    {
      id: "p2",
      title: "Sons naturels",
      trackCount: 8,
      duration: "1h 45m"
    },
    {
      id: "p3",
      title: "Pour dormir",
      trackCount: 5,
      duration: "50m"
    }
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newValue: number[]) => {
    setVolume(newValue[0]);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Thérapie Audio</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            Favoris
          </Button>
        </div>
      </div>

      <div className="bg-muted/40 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="bg-primary/10 rounded-lg p-4 flex items-center justify-center min-w-[100px] min-h-[100px]">
            <Music className="h-12 w-12 text-primary" />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between mb-2">
              <div>
                <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
                <p className="text-muted-foreground">{currentTrack.artist}</p>
              </div>
              <div className="text-sm text-muted-foreground mt-2 md:mt-0">
                {currentTrack.duration}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${currentTrack.progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <div className="w-24">
                    <Slider
                      value={[volume]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="h-1.5"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-10 w-10"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <PauseCircle className="h-6 w-6 text-primary" />
                    ) : (
                      <PlayCircle className="h-6 w-6 text-primary" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="discover" className="flex items-center gap-2">
            <Headphones className="h-4 w-4" />
            Découvrir
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Bibliothèque
          </TabsTrigger>
          <TabsTrigger value="record" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Enregistrer
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="discover" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mt-4">Recommandé pour vous</h2>
            <p className="text-muted-foreground">
              Basé sur votre profil émotionnel et vos préférences d'écoute
            </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["Réduire l\'anxiété", "Améliorer le sommeil", "Focus au travail", "Relaxation profonde"].map((title) => (
              <Card key={title} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                    <Headphones className="h-10 w-10 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Écouter</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <h2 className="text-2xl font-semibold mt-8">Sélections populaires</h2>
          <div className="space-y-2">
            {featuredTracks.map(track => (
              <Card key={track.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                    >
                      <PlayCircle className="h-5 w-5" />
                    </Button>
                    <div>
                      <p className="font-medium">{track.title}</p>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{track.category}</Badge>
                    <span className="text-sm text-muted-foreground">{track.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </div>
        </TabsContent>
        
        <TabsContent value="library" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mt-4">Vos playlists</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map(playlist => (
                <Card key={playlist.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{playlist.title}</CardTitle>
                        <CardDescription>
                          {playlist.trackCount} pistes · {playlist.duration}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <PlayCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-24 bg-muted rounded-md flex items-center justify-center">
                      <Music className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="border-dashed hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col items-center justify-center h-full py-8">
                  <Music className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Créer une nouvelle playlist</h3>
                  <Button>Créer</Button>
                </CardContent>
              </Card>
            </div>
            
            <h2 className="text-2xl font-semibold mt-8">Écouté récemment</h2>
            <div className="space-y-2">
              {recentTracks.map(track => (
                <Card key={track.id} className="hover:bg-accent/50 transition-colors">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                      >
                        <PlayCircle className="h-5 w-5" />
                      </Button>
                      <div>
                        <p className="font-medium">{track.title}</p>
                        <p className="text-sm text-muted-foreground">{track.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{track.category}</Badge>
                      <span className="text-sm text-muted-foreground">{track.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="record" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enregistrer votre voix</CardTitle>
              <CardDescription>
                Enregistrez votre voix pour une analyse émotionnelle ou pour créer un journal audio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-40 bg-muted rounded-md flex flex-col items-center justify-center">
                <Mic className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">
                  Appuyez sur le bouton ci-dessous pour commencer l'enregistrement
                </p>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button className="rounded-full h-16 w-16 flex items-center justify-center">
                  <Mic className="h-8 w-8" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground w-full text-center mb-2">
                Les enregistrements sont stockés localement et ne sont jamais partagés sans votre consentement
              </p>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">Enregistrements</Button>
                <Button variant="outline" className="flex-1">Paramètres</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Audio;
