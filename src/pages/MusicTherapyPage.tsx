
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Music, Headphones, Clock } from 'lucide-react';
import MusicPlayer from './music/MusicPlayer';
import PlaylistManager from './music/PlaylistManager';
import MoodBasedRecommendations from './music/MoodBasedRecommendations';

const MusicTherapyPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(45);

  const playlists = [
    {
      id: 1,
      name: 'Relaxation Profonde',
      description: 'Sons apaisants pour la détente',
      tracks: 12,
      duration: '47 min',
      color: 'bg-blue-500',
      emotion: 'Calme'
    },
    {
      id: 2,
      name: 'Énergie Positive',
      description: 'Musiques pour booster votre moral',
      tracks: 15,
      duration: '52 min',
      color: 'bg-yellow-500',
      emotion: 'Joie'
    },
    {
      id: 3,
      name: 'Focus & Concentration',
      description: 'Ambiances pour le travail',
      tracks: 18,
      duration: '68 min',
      color: 'bg-purple-500',
      emotion: 'Concentration'
    },
    {
      id: 4,
      name: 'Sommeil Réparateur',
      description: 'Mélodies douces pour l\'endormissement',
      tracks: 10,
      duration: '38 min',
      color: 'bg-indigo-500',
      emotion: 'Sérénité'
    }
  ];

  const currentPlaylist = playlists[0];
  const tracks = [
    { name: 'Ocean Waves', artist: 'Nature Sounds', duration: '4:32' },
    { name: 'Forest Rain', artist: 'Ambient Collection', duration: '3:45' },
    { name: 'Mountain Breeze', artist: 'Meditation Masters', duration: '5:12' },
    { name: 'Gentle Stream', artist: 'Peaceful Moments', duration: '4:18' }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Musicothérapie</h1>
        <p className="text-muted-foreground">
          Playlists personnalisées adaptées à votre état émotionnel
        </p>
      </div>

      {/* Current Player */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Music className="h-8 w-8 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Ocean Waves</h3>
              <p className="text-muted-foreground">Nature Sounds • Relaxation Profonde</p>
              
              <div className="flex items-center gap-4 mt-4">
                <Button variant="outline" size="sm">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button variant="outline" size="sm">
                  <SkipForward className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">2:08</span>
                  <Progress value={progress} className="flex-1" />
                  <span className="text-sm text-muted-foreground">4:32</span>
                </div>
                
                <Button variant="outline" size="sm">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Playlists */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Playlists Recommandées</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-lg ${playlist.color} flex items-center justify-center mb-3`}>
                      <Music className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline">{playlist.emotion}</Badge>
                  </div>
                  <CardTitle className="text-lg">{playlist.name}</CardTitle>
                  <CardDescription>{playlist.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{playlist.tracks} morceaux</span>
                    <span>{playlist.duration}</span>
                  </div>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Écouter
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Current Playlist Tracks */}
          <Card>
            <CardHeader>
              <CardTitle>Relaxation Profonde</CardTitle>
              <CardDescription>4 morceaux • 17 min 47 sec</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tracks.map((track, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 p-3 rounded-lg hover:bg-muted cursor-pointer ${
                      index === currentTrack ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                      {index === currentTrack && isPlaying ? (
                        <Pause className="h-4 w-4 text-primary" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{track.name}</p>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{track.duration}</span>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Recommandations du Jour
              </CardTitle>
              <CardDescription>
                Basées sur votre scan émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-sm mb-1">État détecté: Calme</h4>
                <p className="text-xs text-muted-foreground">
                  Playlist "Relaxation Profonde" recommandée
                </p>
              </div>
              <Button variant="outline" className="w-full">
                Voir plus de recommandations
              </Button>
            </CardContent>
          </Card>

          {/* Listening Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Vos Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Temps d'écoute cette semaine</span>
                <Badge variant="secondary">2h 34min</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Genre préféré</span>
                <Badge variant="secondary">Ambient</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Morceaux favoris</span>
                <Badge variant="secondary">12</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Mood Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Choisir par Humeur</CardTitle>
              <CardDescription>
                Trouvez la playlist parfaite
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {['Stressé', 'Triste', 'Énergique', 'Concentré', 'Heureux'].map((mood) => (
                <Button key={mood} variant="outline" className="w-full justify-start">
                  {mood}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Listening Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Objectif Quotidien
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>15 min de relaxation</span>
                  <span>67%</span>
                </div>
                <Progress value={67} />
                <p className="text-xs text-muted-foreground">
                  Plus que 5 minutes pour atteindre votre objectif !
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MusicTherapyPage;
