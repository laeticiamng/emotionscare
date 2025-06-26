
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { MusicPlayer } from '@/components/audio/MusicPlayer';
import { EmotionMusicRecommendations } from '@/components/music/EmotionMusicRecommendations';
import { RecommendedPresets } from '@/components/music/RecommendedPresets';
import { TrackList } from '@/components/music/TrackList';
import { MusicMiniPlayer } from '@/components/music/MusicMiniPlayer';
import { 
  Music, 
  Heart, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Shuffle, 
  Repeat,
  Download,
  Share2,
  Settings,
  TrendingUp,
  Clock,
  Star,
  Headphones,
  Radio,
  Disc3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MusicPage: React.FC = () => {
  const { toast } = useToast();
  const [currentEmotion, setCurrentEmotion] = useState('calm');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState([70]);
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const [personalizedMode, setPersonalizedMode] = useState(true);
  
  // Mock data for demonstration
  const [listeningHistory] = useState([
    {
      id: '1',
      title: 'Méditation Matinale',
      artist: 'Zen Collective',
      duration: 300,
      emotion: 'calm',
      playCount: 12,
      lastPlayed: '2024-01-15',
      coverUrl: '/images/meditation-cover.jpg'
    },
    {
      id: '2',
      title: 'Énergie Positive',
      artist: 'Mindful Beats',
      duration: 240,
      emotion: 'energetic',
      playCount: 8,
      lastPlayed: '2024-01-14',
      coverUrl: '/images/energy-cover.jpg'
    }
  ]);

  const [emotionalPlaylists] = useState([
    {
      id: 'calm-playlist',
      name: 'Sérénité & Calme',
      emotion: 'calm',
      trackCount: 15,
      duration: '45 min',
      coverUrl: '/images/calm-playlist.jpg',
      description: 'Playlist parfaite pour la méditation et la relaxation',
      isAdaptive: true
    },
    {
      id: 'energetic-playlist',
      name: 'Boost d\'Énergie',
      emotion: 'energetic',
      trackCount: 20,
      duration: '60 min',
      coverUrl: '/images/energy-playlist.jpg',
      description: 'Dynamisme et motivation pour votre journée',
      isAdaptive: true
    },
    {
      id: 'focus-playlist',
      name: 'Concentration Profonde',
      emotion: 'focused',
      trackCount: 12,
      duration: '40 min',
      coverUrl: '/images/focus-playlist.jpg',
      description: 'Musique instrumentale pour le travail et l\'étude',
      isAdaptive: false
    }
  ]);

  const [musicStats] = useState({
    totalListeningTime: 1280, // minutes
    favoriteEmotion: 'calm',
    streakDays: 12,
    tracksDiscovered: 47,
    moodImprovement: 85
  });

  const handlePlayTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    toast({
      title: "Lecture démarrée",
      description: `${track.title} par ${track.artist}`,
    });
  };

  const handleEmotionChange = (emotion: string) => {
    setCurrentEmotion(emotion);
    if (adaptiveMode) {
      toast({
        title: "Playlist adaptée",
        description: `Musique adaptée à votre état : ${emotion}`,
      });
    }
  };

  const handleExportPlaylist = (playlistId: string) => {
    toast({
      title: "Export en cours",
      description: "Votre playlist sera bientôt disponible en téléchargement",
    });
  };

  const handleSharePlaylist = (playlistId: string) => {
    navigator.clipboard.writeText(`https://emotionscare.app/music/playlist/${playlistId}`);
    toast({
      title: "Lien copié",
      description: "Le lien de la playlist a été copié dans le presse-papiers",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header avec lecteur principal */}
        <Card className="overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Music className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Musicothérapie Adaptative</h1>
                  <p className="text-purple-100 mt-1">
                    Découvrez la musique qui s'adapte à vos émotions
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Mode Adaptatif {adaptiveMode ? 'Activé' : 'Désactivé'}
              </Badge>
            </div>

            {currentTrack && (
              <div className="bg-white/10 rounded-lg p-4">
                <MusicPlayer
                  autoPlay={isPlaying}
                  volume={volume[0] / 100}
                  className="bg-transparent"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques et configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Statistiques d'Écoute
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{musicStats.totalListeningTime}</p>
                  <p className="text-sm text-muted-foreground">Minutes d'écoute</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{musicStats.streakDays}</p>
                  <p className="text-sm text-muted-foreground">Jours consécutifs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{musicStats.tracksDiscovered}</p>
                  <p className="text-sm text-muted-foreground">Morceaux découverts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{musicStats.moodImprovement}%</p>
                  <p className="text-sm text-muted-foreground">Amélioration humeur</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Mode Adaptatif</label>
                <Switch
                  checked={adaptiveMode}
                  onCheckedChange={setAdaptiveMode}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Personnalisation IA</label>
                <Switch
                  checked={personalizedMode}
                  onCheckedChange={setPersonalizedMode}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Volume</label>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                État Émotionnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {['calm', 'energetic', 'focused', 'creative', 'relaxed', 'motivated'].map((emotion) => (
                  <Button
                    key={emotion}
                    variant={currentEmotion === emotion ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleEmotionChange(emotion)}
                    className="capitalize"
                  >
                    {emotion}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Sélectionnez votre état actuel pour une musique adaptée
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="playlists" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="playlists" className="flex items-center gap-2">
              <Disc3 className="h-4 w-4" />
              Playlists
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Recommandations
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Historique
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <Radio className="h-4 w-4" />
              Préréglages
            </TabsTrigger>
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              En Direct
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playlists" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Playlists Émotionnelles</h2>
              <Button>
                <Music className="h-4 w-4 mr-2" />
                Créer une Playlist
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emotionalPlaylists.map((playlist) => (
                <Card key={playlist.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="aspect-square bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                      <Music className="h-12 w-12 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{playlist.name}</h3>
                        {playlist.isAdaptive && (
                          <Badge variant="secondary">Adaptative</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{playlist.description}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{playlist.trackCount} morceaux</span>
                        <span>{playlist.duration}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" onClick={() => handlePlayTrack(playlist)}>
                          <Play className="h-3 w-3 mr-1" />
                          Jouer
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSharePlaylist(playlist.id)}>
                          <Share2 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleExportPlaylist(playlist.id)}>
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <EmotionMusicRecommendations
              emotion={currentEmotion}
              autoActivate={adaptiveMode}
              className="mb-6"
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique d'Écoute</CardTitle>
              </CardHeader>
              <CardContent>
                <TrackList
                  tracks={listeningHistory}
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  onTrackSelect={handlePlayTrack}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="presets">
            <RecommendedPresets
              currentMood={currentEmotion}
              className="mb-6"
            />
          </TabsContent>

          <TabsContent value="live" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-red-500" />
                  Sessions Live & Guidées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Méditation Guidée</h3>
                      <Badge variant="destructive">🔴 Live</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Session de méditation en direct avec accompagnement musical
                    </p>
                    <Button size="sm" className="w-full">
                      Rejoindre (12 participants)
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Thérapie Sonore</h3>
                      <Badge variant="secondary">15:30</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Session programmée de thérapie par les sons et vibrations
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Programmer un rappel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Mini lecteur fixe */}
        {currentTrack && (
          <div className="fixed bottom-4 right-4 z-50">
            <MusicMiniPlayer />
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPage;
