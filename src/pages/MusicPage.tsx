
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Heart, Clock, TrendingUp, Play, Shuffle, Repeat } from 'lucide-react';
import MusicPlayer from '@/components/music/MusicPlayer';
import EnhancedMusicRecommendations from '@/components/music/EnhancedMusicRecommendations';
import MoodBasedRecommendations from '@/components/music/MoodBasedRecommendations';
import { useToast } from '@/hooks/use-toast';

const MusicPage: React.FC = () => {
  const { toast } = useToast();
  const [currentMood, setCurrentMood] = useState('calm');
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock listening history
  const listeningHistory = [
    { title: 'Sérénité Matinale', artist: 'Ambient Dreams', duration: '4:20', date: '2024-01-15' },
    { title: 'Focus Flow', artist: 'Concentration', duration: '5:15', date: '2024-01-15' },
    { title: 'Énergie Positive', artist: 'Motivation', duration: '3:45', date: '2024-01-14' },
  ];

  // Mock favorites
  const favorites = [
    { title: 'Calme Profond', artist: 'Relaxation Masters', duration: '6:30' },
    { title: 'Méditation Guidée', artist: 'Mindfulness', duration: '10:00' },
    { title: 'Pluie Apaisante', artist: 'Nature Sounds', duration: '12:00' },
  ];

  const weeklyStats = {
    totalListeningTime: '12h 30min',
    favoriteGenre: 'Ambient',
    mostPlayedArtist: 'Relaxation Masters',
    streakDays: 7
  };

  const handlePlayMusic = (title: string) => {
    setIsPlaying(true);
    toast({
      title: 'Lecture en cours',
      description: `Lecture de "${title}"`,
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Musique Adaptative</h1>
          <p className="text-muted-foreground">
            Découvrez une musique personnalisée selon votre état émotionnel
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button variant="outline" size="sm">
            <Shuffle className="mr-2 h-4 w-4" />
            Lecture aléatoire
          </Button>
          <Button variant="outline" size="sm">
            <Repeat className="mr-2 h-4 w-4" />
            Répéter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="player" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="player">Lecteur</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="player" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MusicPlayer />
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contrôles Rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => handlePlayMusic('Mix du jour')}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Mix du jour
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handlePlayMusic('Relaxation Express')}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Relaxation Express
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handlePlayMusic('Focus & Concentration')}
                  >
                    <Music className="mr-2 h-4 w-4" />
                    Focus & Concentration
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <EnhancedMusicRecommendations currentMood={currentMood} />
            <MoodBasedRecommendations mood={currentMood} />
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Mes Favoris
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {favorites.map((track, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20"
                      onClick={() => handlePlayMusic(track.title)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <h4 className="font-medium">{track.title}</h4>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {track.duration}
                    </div>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Historique d'Écoute
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {listeningHistory.map((track, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20"
                      onClick={() => handlePlayMusic(track.title)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <h4 className="font-medium">{track.title}</h4>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(track.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {track.duration}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temps d'écoute</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{weeklyStats.totalListeningTime}</div>
                <p className="text-xs text-muted-foreground">
                  Cette semaine
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Genre favori</CardTitle>
                <Music className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{weeklyStats.favoriteGenre}</div>
                <p className="text-xs text-muted-foreground">
                  Le plus écouté
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Artiste préféré</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-truncate">{weeklyStats.mostPlayedArtist}</div>
                <p className="text-xs text-muted-foreground">
                  Cette semaine
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Série</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{weeklyStats.streakDays} jours</div>
                <p className="text-xs text-muted-foreground">
                  Écoute quotidienne
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Insights Musicaux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Tendances découvertes</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Vous préférez la musique relaxante en fin de journée</li>
                  <li>• Votre concentration améliore avec la musique ambient</li>
                  <li>• Les mornings nécessitent des mélodies plus énergiques</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicPage;
