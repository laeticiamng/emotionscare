/**
 * MusicPage - Module Musicothérapie (/app/music)
 * Génération musicale IA adaptée aux émotions
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  Download,
  Share2,
  Headphones,
  Waves,
  Zap,
  Moon,
  Sun,
  Coffee,
  ArrowLeft,
  Settings,
  Timer,
  List,
  Radio,
  Sparkles
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  mood: string;
  duration: string;
  emotion: string;
  color: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trackCount: number;
  color: string;
  tracks: Track[];
}

const MusicPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');

  // Playlists prédéfinies
  const playlists: Playlist[] = [
    {
      id: 'energy',
      name: 'Boost Énergétique',
      description: 'Sons dynamisants pour retrouver sa motivation',
      icon: Zap,
      trackCount: 12,
      color: 'text-orange-600',
      tracks: [
        { id: '1', title: 'Morning Power', mood: 'Énergique', duration: '3:24', emotion: 'Motivation', color: 'bg-orange-100' },
        { id: '2', title: 'Dynamic Flow', mood: 'Dynamique', duration: '4:12', emotion: 'Enthousiasme', color: 'bg-red-100' },
      ]
    },
    {
      id: 'calm',
      name: 'Sérénité Profonde',
      description: 'Compositions apaisantes pour la relaxation',
      icon: Moon,
      trackCount: 15,
      color: 'text-blue-600',
      tracks: [
        { id: '3', title: 'Ocean Whispers', mood: 'Apaisant', duration: '5:33', emotion: 'Tranquillité', color: 'bg-blue-100' },
        { id: '4', title: 'Forest Dreams', mood: 'Relaxant', duration: '6:18', emotion: 'Paix', color: 'bg-green-100' },
      ]
    },
    {
      id: 'focus',
      name: 'Concentration Zen',
      description: 'Ambiances pour la productivité et la concentration',
      icon: Coffee,
      trackCount: 10,
      color: 'text-purple-600',
      tracks: [
        { id: '5', title: 'Deep Focus', mood: 'Concentré', duration: '7:45', emotion: 'Clarté', color: 'bg-purple-100' },
        { id: '6', title: 'Mindful Work', mood: 'Focalisé', duration: '5:20', emotion: 'Efficacité', color: 'bg-indigo-100' },
      ]
    },
    {
      id: 'healing',
      name: 'Guérison Émotionnelle',
      description: 'Thérapie sonore pour les moments difficiles',
      icon: Heart,
      trackCount: 8,
      color: 'text-pink-600',
      tracks: [
        { id: '7', title: 'Gentle Healing', mood: 'Réconfortant', duration: '4:55', emotion: 'Apaisement', color: 'bg-pink-100' },
        { id: '8', title: 'Inner Peace', mood: 'Curatif', duration: '6:12', emotion: 'Résilience', color: 'bg-rose-100' },
      ]
    }
  ];

  const moods = [
    { id: 'joyful', name: 'Joyeux', icon: Sun, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'calm', name: 'Calme', icon: Moon, color: 'bg-blue-100 text-blue-700' },
    { id: 'energetic', name: 'Énergique', icon: Zap, color: 'bg-orange-100 text-orange-700' },
    { id: 'focused', name: 'Concentré', icon: Coffee, color: 'bg-purple-100 text-purple-700' },
    { id: 'healing', name: 'Guérison', icon: Heart, color: 'bg-pink-100 text-pink-700' },
    { id: 'creative', name: 'Créatif', icon: Sparkles, color: 'bg-green-100 text-green-700' }
  ];

  const generateCustomTrack = (mood: string) => {
    setIsGenerating(true);
    setSelectedMood(mood);
    
    // Simulation de génération IA
    setTimeout(() => {
      setIsGenerating(false);
      const newTrack: Track = {
        id: Date.now().toString(),
        title: `Composition IA - ${mood}`,
        mood: mood,
        duration: '4:32',
        emotion: mood,
        color: 'bg-gradient-to-r from-primary/10 to-secondary/10'
      };
      setCurrentTrack(newTrack);
      setIsPlaying(true);
    }, 3000);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const selectTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Simulation de progression
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Music className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">Musicothérapie IA</h1>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Waves className="h-3 w-3" />
                Adaptatif
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Préférences
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="space-y-6">
          {/* Introduction */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                  Musicothérapie Personnalisée par IA
                </h2>
                <p className="text-muted-foreground">
                  Générez des compositions uniques adaptées à votre état émotionnel actuel
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="generate" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="generate">Générer</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            {/* GÉNÉRATION IA */}
            <TabsContent value="generate" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Générateur IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isGenerating ? (
                      <>
                        <div className="space-y-3">
                          <h4 className="font-medium">Choisissez votre humeur cible :</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {moods.map(mood => {
                              const Icon = mood.icon;
                              return (
                                <Button
                                  key={mood.id}
                                  variant="outline"
                                  className={`h-16 flex-col gap-2 ${mood.color} hover:scale-105 transition-transform`}
                                  onClick={() => generateCustomTrack(mood.name)}
                                >
                                  <Icon className="h-6 w-6" />
                                  <span className="text-sm">{mood.name}</span>
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            L'IA analysera votre choix et composera une mélodie unique
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-4 py-8">
                        <div className="relative mx-auto w-20 h-20">
                          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <Music className="absolute inset-0 m-auto h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium">Composition en cours...</h3>
                          <p className="text-sm text-muted-foreground">
                            L'IA crée votre mélodie "{selectedMood}"
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Comment ça marche ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Analyse émotionnelle</h4>
                          <p className="text-muted-foreground">L'IA analyse votre état émotionnel souhaité</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Composition adaptative</h4>
                          <p className="text-muted-foreground">Génération de mélodies, harmonies et rythmes personnalisés</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Thérapie sonore</h4>
                          <p className="text-muted-foreground">Fréquences et timbres choisis pour leur effet thérapeutique</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* PLAYLISTS */}
            <TabsContent value="playlists" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {playlists.map(playlist => {
                  const Icon = playlist.icon;
                  return (
                    <Card key={playlist.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-muted`}>
                            <Icon className={`h-6 w-6 ${playlist.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{playlist.name}</h3>
                            <p className="text-sm text-muted-foreground">{playlist.trackCount} pistes</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {playlist.description}
                        </p>
                        
                        <div className="space-y-2">
                          {playlist.tracks.slice(0, 2).map(track => (
                            <div 
                              key={track.id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => selectTrack(track)}
                            >
                              <div className={`w-10 h-10 ${track.color} rounded flex items-center justify-center`}>
                                <Music className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{track.title}</div>
                                <div className="text-xs text-muted-foreground">{track.emotion}</div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {track.duration}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <Button className="w-full gap-2">
                          <Play className="h-4 w-4" />
                          Écouter la playlist
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* HISTORIQUE */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <List className="h-5 w-5" />
                    Vos Compositions Récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                          <Music className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Composition IA - Calme</div>
                          <div className="text-sm text-muted-foreground">Il y a 2h • 4:32</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                          <Music className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium">Composition IA - Énergique</div>
                          <div className="text-sm text-muted-foreground">Hier • 3:45</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Lecteur Audio */}
          {currentTrack && (
            <Card className="sticky bottom-6 shadow-lg animate-slide-in-right">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${currentTrack.color} rounded-lg flex items-center justify-center`}>
                    <Music className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{currentTrack.title}</div>
                        <div className="text-sm text-muted-foreground">{currentTrack.emotion}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {currentTrack.duration}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Progress value={progress} className="h-1" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <SkipBack className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={togglePlay}>
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="outline">
                            <SkipForward className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setIsMuted(!isMuted)}>
                            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </Button>
                          <div className="w-20">
                            <Slider
                              value={volume}
                              onValueChange={setVolume}
                              max={100}
                              step={1}
                              className="cursor-pointer"
                            />
                          </div>
                          <Button size="sm" variant="ghost">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default MusicPage;