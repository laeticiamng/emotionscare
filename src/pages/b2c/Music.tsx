
import React, { useState } from 'react';
import UnifiedLayout from '@/components/unified/UnifiedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Music as MusicIcon, Play, Pause, SkipForward, SkipBack, Volume2, Search, Wand2, List, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import useMusicGen from '@/hooks/api/useMusicGen';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string;
}

const B2CMusic: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const { generateMusic, isGenerating } = useMusicGen();

  // Playlists prédéfinies
  const playlists = [
    {
      id: 'relaxation',
      title: 'Relaxation profonde',
      description: 'Musiques douces pour la détente',
      coverUrl: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      tracks: 12
    },
    {
      id: 'focus',
      title: 'Concentration',
      description: 'Améliorez votre focus et productivité',
      coverUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.0.3',
      tracks: 15
    },
    {
      id: 'meditation',
      title: 'Méditation guidée',
      description: 'Accompagnement pour la pleine conscience',
      coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2502&auto=format&fit=crop&ixlib=rb-4.0.3',
      tracks: 8
    },
    {
      id: 'sleep',
      title: 'Sommeil réparateur',
      description: 'Sons apaisants pour mieux dormir',
      coverUrl: 'https://images.unsplash.com/photo-1455642305367-68834a9d8516?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      tracks: 10
    }
  ];

  // Titres de musique
  const tracks = [
    {
      id: '1',
      title: 'Mindful Moment',
      artist: 'Zen Masters',
      duration: 183,
      coverUrl: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?q=80&w=2674&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    {
      id: '2',
      title: 'Ocean Waves',
      artist: 'Nature Sounds',
      duration: 240,
      coverUrl: 'https://images.unsplash.com/photo-1609538937372-4e10533aed50?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    {
      id: '3',
      title: 'Forest Serenity',
      artist: 'Ambient Melodies',
      duration: 210,
      coverUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    {
      id: '4',
      title: 'Deep Focus',
      artist: 'Concentration Space',
      duration: 195,
      coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    {
      id: '5',
      title: 'Morning Light',
      artist: 'Dawn Chorus',
      duration: 225,
      coverUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    }
  ];

  // Fonctions pour le lecteur audio
  const playTrack = (track: Track) => {
    setLoadingTrack(true);
    // Simuler le chargement
    setTimeout(() => {
      setCurrentTrack(track);
      setIsPlaying(true);
      setLoadingTrack(false);
      toast.success(`Lecture de "${track.title}" par ${track.artist}`);
      
      // Simuler la progression
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + (100 / track.duration) * 0.5;
        });
      }, 500);
    }, 1500);
  };

  const togglePlayPause = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
      toast(`${isPlaying ? 'Pause' : 'Lecture'} de "${currentTrack.title}"`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Génération de musique avec IA
  const handleGenerateMusic = async () => {
    if (!generationPrompt) {
      toast.error('Veuillez entrer une description pour générer de la musique');
      return;
    }

    try {
      const result = await generateMusic({ prompt: generationPrompt });
      if (result) {
        toast.success('Musique générée avec succès');
        // Simuler l'ajout d'une piste générée
        const generatedTrack = {
          id: `gen-${Date.now()}`,
          title: `Généré: ${generationPrompt.slice(0, 20)}...`,
          artist: 'IA Composer',
          duration: 180,
          coverUrl: 'https://images.unsplash.com/photo-1527380992061-b126c88cbb41?q=80&w=3015&auto=format&fit=crop&ixlib=rb-4.0.3'
        };
        playTrack(generatedTrack);
      }
    } catch (error) {
      console.error('Error generating music:', error);
      toast.error('Erreur lors de la génération de musique');
    }
  };

  return (
    <UnifiedLayout>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Thérapie Musicale</h1>
            <p className="text-muted-foreground">
              Découvrez des musiques adaptées à votre état émotionnel
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('generate')}
              className="flex items-center gap-2"
            >
              <Wand2 className="h-4 w-4" />
              <span className="hidden md:inline">Générer avec l'IA</span>
              <span className="inline md:hidden">IA</span>
            </Button>
            <Button 
              onClick={() => setActiveTab('favorites')}
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              <span className="hidden md:inline">Favoris</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="discover">Découvrir</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="generate">Générer</TabsTrigger>
            <TabsTrigger value="favorites">Favoris</TabsTrigger>
          </TabsList>

          {/* Découvrir */}
          <TabsContent value="discover" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher des titres, ambiances ou émotions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">Titres recommandés</h2>
            <div className="space-y-2">
              {tracks.map(track => (
                <Card key={track.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-4">
                      <img 
                        src={track.coverUrl} 
                        alt={track.title} 
                        className="h-12 w-12 object-cover rounded" 
                      />
                      <div className="flex-grow">
                        <div className="font-medium">{track.title}</div>
                        <div className="text-sm text-muted-foreground">{track.artist}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(track.duration)}
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => playTrack(track)}
                        disabled={loadingTrack}
                      >
                        {loadingTrack && currentTrack?.id === track.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">Playlists par humeur</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {playlists.map(playlist => (
                <Card key={playlist.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img 
                      src={playlist.coverUrl} 
                      alt={playlist.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button 
                        size="icon" 
                        className="rounded-full bg-white text-black hover:bg-white/90"
                        onClick={() => {
                          toast.success(`Lecture de la playlist "${playlist.title}"`);
                          playTrack(tracks[0]);
                        }}
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="font-medium">{playlist.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {playlist.tracks} titres
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Playlists */}
          <TabsContent value="playlists" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {playlists.map(playlist => (
                <Card key={playlist.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img 
                      src={playlist.coverUrl} 
                      alt={playlist.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button 
                        size="icon" 
                        className="rounded-full bg-white text-black hover:bg-white/90"
                        onClick={() => {
                          toast.success(`Lecture de la playlist "${playlist.title}"`);
                          playTrack(tracks[0]);
                        }}
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <CardTitle>{playlist.title}</CardTitle>
                    <CardDescription>{playlist.description}</CardDescription>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="secondary">{playlist.tracks} titres</Badge>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          toast('Ajouté aux favoris');
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Générer */}
          <TabsContent value="generate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Générer de la musique avec l'IA</CardTitle>
                <CardDescription>
                  Décrivez l'ambiance ou l'émotion souhaitée et notre IA créera une musique adaptée
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Par exemple: Une mélodie calme et apaisante pour méditer..."
                    value={generationPrompt}
                    onChange={(e) => setGenerationPrompt(e.target.value)}
                  />
                  <Button 
                    className="w-full" 
                    onClick={handleGenerateMusic}
                    disabled={isGenerating || !generationPrompt}
                  >
                    {isGenerating ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Générer
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-sm font-medium">Suggestions</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Relaxation profonde avec sons de la nature",
                      "Ambiance de concentration pour le travail",
                      "Mélodie joyeuse et énergisante",
                      "Sons apaisants pour méditer",
                      "Musique d'ambiance pour la lecture"
                    ].map((suggestion, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setGenerationPrompt(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historique des générations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MusicIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aucune musique générée récemment
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setGenerationPrompt("Méditation calme avec sons aquatiques")}
                  >
                    Essayer un exemple
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favoris */}
          <TabsContent value="favorites" className="space-y-4">
            {user ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Vous n'avez pas encore de favoris
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('discover')}
                >
                  Découvrir des musiques
                </Button>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="mb-4">Connectez-vous pour sauvegarder vos morceaux favoris</p>
                  <Button>Se connecter</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Lecteur audio */}
        {currentTrack && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 z-10">
            <div className="container mx-auto">
              <div className="flex items-center gap-4">
                <img 
                  src={currentTrack.coverUrl} 
                  alt={currentTrack.title}
                  className="h-12 w-12 object-cover rounded" 
                />
                <div className="hidden sm:block flex-grow-0 w-48">
                  <div className="font-medium truncate">{currentTrack.title}</div>
                  <div className="text-sm text-muted-foreground truncate">{currentTrack.artist}</div>
                </div>
                <div className="flex-grow flex flex-col">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toast('Titre précédent')}
                      disabled={loadingTrack}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={togglePlayPause}
                      disabled={loadingTrack}
                    >
                      {loadingTrack ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toast('Titre suivant')}
                      disabled={loadingTrack}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <div className="hidden sm:flex flex-grow items-center gap-2">
                      <div className="text-xs w-12">
                        {formatTime((progress / 100) * currentTrack.duration)}
                      </div>
                      <div className="flex-grow">
                        <Slider
                          value={[progress]}
                          max={100}
                          step={1}
                          onValueChange={(value) => setProgress(value[0])}
                        />
                      </div>
                      <div className="text-xs w-12">
                        {formatTime(currentTrack.duration)}
                      </div>
                    </div>
                  </div>
                  <div className="sm:hidden w-full mt-2">
                    <Slider
                      value={[progress]}
                      max={100}
                      step={1}
                      onValueChange={(value) => setProgress(value[0])}
                    />
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 w-32">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0])}
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-auto md:ml-0"
                  onClick={() => {
                    toast('Ajouté aux favoris');
                  }}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setCurrentTrack(null);
                    setIsPlaying(false);
                    setProgress(0);
                  }}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UnifiedLayout>
  );
};

export default B2CMusic;
