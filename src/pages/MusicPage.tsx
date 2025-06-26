
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Shuffle, Repeat, Search, Filter, Download, Settings, Music, Headphones, TrendingUp } from 'lucide-react';
import { MusicPlayer } from '@/components/music/player/MusicPlayer';
import { EmotionMusicRecommendations } from '@/components/music/EmotionMusicRecommendations';
import { RecommendedPresets } from '@/components/music/RecommendedPresets';
import TrackList from '@/components/music/TrackList';
import { MusicMiniPlayer } from '@/components/music/MusicMiniPlayer';
import { MusicTrack, Playlist } from '@/types/music';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const MusicPage: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('calm');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [moodFilter, setMoodFilter] = useState('all');
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [loading, setLoading] = useState(false);

  // Données de démonstration
  const mockTracks: MusicTrack[] = [
    {
      id: '1',
      title: 'Méditation matinale',
      artist: 'Nature Sounds',
      duration: 360,
      url: '/audio/meditation-morning.mp3',
      emotion: 'calm',
      genre: 'ambient',
      bpm: 60,
      energy: 0.2,
      valence: 0.7
    },
    {
      id: '2',
      title: 'Focus Deep Work',
      artist: 'Concentration Masters',
      duration: 1200,
      url: '/audio/focus-deep.mp3',
      emotion: 'focused',
      genre: 'instrumental',
      bpm: 72,
      energy: 0.4,
      valence: 0.6
    },
    {
      id: '3',
      title: 'Énergie Positive',
      artist: 'Happy Vibes',
      duration: 240,
      url: '/audio/positive-energy.mp3',
      emotion: 'happy',
      genre: 'electronic',
      bpm: 128,
      energy: 0.8,
      valence: 0.9
    },
    {
      id: '4',
      title: 'Détente Profonde',
      artist: 'Relaxation Zone',
      duration: 600,
      url: '/audio/deep-relaxation.mp3',
      emotion: 'relaxed',
      genre: 'ambient',
      bpm: 45,
      energy: 0.1,
      valence: 0.8
    }
  ];

  const mockPlaylists: Playlist[] = [
    {
      id: 'playlist-1',
      name: 'Méditation Quotidienne',
      description: 'Sons apaisants pour la méditation',
      tracks: mockTracks.filter(t => t.emotion === 'calm'),
      emotion: 'calm'
    },
    {
      id: 'playlist-2',
      name: 'Concentration Extrême',
      description: 'Musique pour la productivité',
      tracks: mockTracks.filter(t => t.emotion === 'focused'),
      emotion: 'focused'
    },
    {
      id: 'playlist-3',
      name: 'Boost d\'Énergie',
      description: 'Motivation et dynamisme',
      tracks: mockTracks.filter(t => t.emotion === 'happy'),
      emotion: 'happy'
    }
  ];

  const listeningStats = [
    { date: '2024-01-01', minutes: 45, mood: 'calm' },
    { date: '2024-01-02', minutes: 62, mood: 'focused' },
    { date: '2024-01-03', minutes: 38, mood: 'happy' },
    { date: '2024-01-04', minutes: 71, mood: 'calm' },
    { date: '2024-01-05', minutes: 55, mood: 'energetic' },
    { date: '2024-01-06', minutes: 43, mood: 'relaxed' },
    { date: '2024-01-07', minutes: 68, mood: 'focused' }
  ];

  const emotionDistribution = [
    { name: 'Calme', value: 35, color: '#3b82f6' },
    { name: 'Focus', value: 28, color: '#10b981' },
    { name: 'Énergie', value: 22, color: '#f59e0b' },
    { name: 'Détente', value: 15, color: '#8b5cf6' }
  ];

  const genreStats = [
    { genre: 'Ambient', count: 124, avgRating: 4.8 },
    { genre: 'Instrumental', count: 89, avgRating: 4.6 },
    { genre: 'Electronic', count: 67, avgRating: 4.5 },
    { genre: 'Classical', count: 45, avgRating: 4.9 },
    { genre: 'Nature', count: 78, avgRating: 4.7 }
  ];

  useEffect(() => {
    setPlaylists(mockPlaylists);
  }, []);

  const handleTrackSelect = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    toast.success(`Lecture de "${track.title}"`);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleEmotionChange = (emotion: string) => {
    setCurrentEmotion(emotion);
    const recommendedPlaylist = mockPlaylists.find(p => p.emotion === emotion);
    if (recommendedPlaylist && recommendedPlaylist.tracks.length > 0) {
      setCurrentTrack(recommendedPlaylist.tracks[0]);
      toast.success(`Playlist "${recommendedPlaylist.name}" sélectionnée`);
    }
  };

  const exportListeningData = () => {
    setLoading(true);
    setTimeout(() => {
      const dataStr = JSON.stringify(listeningStats, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'listening-stats.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      setLoading(false);
      toast.success('Statistiques d\'écoute exportées !');
    }, 1000);
  };

  const totalListeningTime = listeningStats.reduce((acc, stat) => acc + stat.minutes, 0);
  const avgDailyListening = totalListeningTime / listeningStats.length;
  const favoriteGenre = genreStats.reduce((prev, current) => (prev.count > current.count) ? prev : current);

  const filteredTracks = mockTracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.artist?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'all' || track.genre === genreFilter;
    const matchesMood = moodFilter === 'all' || track.emotion === moodFilter;
    return matchesSearch && matchesGenre && matchesMood;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Music className="h-8 w-8 text-purple-600" />
            Musicothérapie
          </h1>
          <p className="text-muted-foreground">Musique adaptative pour votre bien-être émotionnel</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportListeningData} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            {loading ? 'Export...' : 'Exporter'}
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Statistiques de performance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Headphones className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Temps Total</p>
                <p className="text-2xl font-bold">{totalListeningTime}min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Moyenne/Jour</p>
                <p className="text-2xl font-bold">{avgDailyListening.toFixed(0)}min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Music className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Genre Favori</p>
                <p className="text-lg font-bold">{favoriteGenre.genre}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Mode Adaptatif</p>
                <Switch
                  checked={adaptiveMode}
                  onCheckedChange={setAdaptiveMode}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lecteur principal */}
      {currentTrack && (
        <Card>
          <CardContent className="p-6">
            <MusicPlayer track={currentTrack} />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="browse">Parcourir</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtres et Recherche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Titre, artiste..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Genre</label>
                  <Select value={genreFilter} onValueChange={setGenreFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les genres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="ambient">Ambient</SelectItem>
                      <SelectItem value="instrumental">Instrumental</SelectItem>
                      <SelectItem value="electronic">Electronic</SelectItem>
                      <SelectItem value="classical">Classical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Humeur</label>
                  <Select value={moodFilter} onValueChange={setMoodFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les humeurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="calm">Calme</SelectItem>
                      <SelectItem value="focused">Focus</SelectItem>
                      <SelectItem value="happy">Heureux</SelectItem>
                      <SelectItem value="relaxed">Détente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Actions</label>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setGenreFilter('all');
                    setMoodFilter('all');
                  }}>
                    <Filter className="h-4 w-4 mr-2" />
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bibliothèque Musicale ({filteredTracks.length} pistes)</CardTitle>
            </CardHeader>
            <CardContent>
              <TrackList
                tracks={filteredTracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onTrackSelect={handleTrackSelect}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playlists" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {playlist.name}
                    <Badge variant="outline">{playlist.tracks.length} pistes</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{playlist.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={() => playlist.tracks.length > 0 && handleTrackSelect(playlist.tracks[0])}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Lire la playlist
                    </Button>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Émotion: {playlist.emotion}</span>
                      <span>Durée: {Math.round(playlist.tracks.reduce((acc, track) => acc + track.duration, 0) / 60)}min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <EmotionMusicRecommendations 
            emotion={currentEmotion}
            className="mb-6"
          />
          
          <RecommendedPresets />
          
          <Card>
            <CardHeader>
              <CardTitle>Recommandations Basées sur l'Émotion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {['calm', 'focused', 'happy', 'relaxed'].map((emotion) => (
                  <Button
                    key={emotion}
                    variant={currentEmotion === emotion ? 'default' : 'outline'}
                    onClick={() => handleEmotionChange(emotion)}
                    className="h-12"
                  >
                    {emotion === 'calm' && '🧘'}
                    {emotion === 'focused' && '🎯'}
                    {emotion === 'happy' && '😊'}
                    {emotion === 'relaxed' && '😌'}
                    <span className="ml-2 capitalize">{emotion}</span>
                  </Button>
                ))}
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Recommandation actuelle:</strong> Basé sur votre émotion "{currentEmotion}", 
                  nous suggérons des pistes avec un tempo modéré et une valence positive.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Temps d'Écoute Hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={listeningStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="minutes" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution des Émotions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={emotionDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {emotionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Statistiques par Genre</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={genreStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="genre" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Nombre d'écoutes" />
                    <Bar yAxisId="right" dataKey="avgRating" fill="#82ca9d" name="Note moyenne" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Audio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Volume Principal</label>
                <div className="flex items-center space-x-4">
                  <Volume2 className="h-4 w-4" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">{volume[0]}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Mode Adaptatif</label>
                  <p className="text-xs text-muted-foreground">
                    Ajuste automatiquement la musique selon votre état émotionnel
                  </p>
                </div>
                <Switch
                  checked={adaptiveMode}
                  onCheckedChange={setAdaptiveMode}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Lecture Aléatoire</label>
                  <Switch defaultChecked={false} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Répétition</label>
                  <Switch defaultChecked={false} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Préférences Personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Genres Préférés</label>
                <div className="flex flex-wrap gap-2">
                  {['Ambient', 'Classical', 'Electronic', 'Jazz', 'Nature'].map((genre) => (
                    <Badge key={genre} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Moments d'Écoute Favoris</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Matin', 'Après-midi', 'Soir', 'Nuit'].map((moment) => (
                    <Button key={moment} variant="outline" size="sm">
                      {moment}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicPage;
