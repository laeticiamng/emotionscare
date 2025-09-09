import React from 'react';
import SmartMusicPlayer from '@/components/features/SmartMusicPlayer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Volume2,
  Heart,
  Shuffle,
  Repeat,
  Download,
  Headphones,
  Zap,
  Brain
} from 'lucide-react';

const MusicPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState(0);
  const [volume, setVolume] = React.useState([75]);
  const [progress, setProgress] = React.useState(45);

  const musicCategories = [
    {
      name: 'Relaxation Profonde',
      description: 'Sons apaisants pour réduire le stress',
      tracks: 12,
      duration: '45 min',
      color: 'from-blue-500 to-cyan-500',
      mood: 'Calme'
    },
    {
      name: 'Focus & Concentration',
      description: 'Musique binaurale pour la productivité',
      tracks: 8,
      duration: '32 min',
      color: 'from-purple-500 to-pink-500',
      mood: 'Concentration'
    },
    {
      name: 'Énergie Positive',
      description: 'Rythmes motivants pour le moral',
      tracks: 15,
      duration: '58 min',
      color: 'from-orange-500 to-red-500',
      mood: 'Motivation'
    },
    {
      name: 'Méditation Guidée',
      description: 'Sessions avec instructions vocales',
      tracks: 6,
      duration: '28 min',
      color: 'from-green-500 to-emerald-500',
      mood: 'Sérénité'
    }
  ];

  const currentPlaylist = [
    {
      title: 'Ocean Waves Therapy',
      artist: 'EmotionsCare AI',
      duration: '5:23',
      mood: 'Relaxation',
      frequency: '432 Hz'
    },
    {
      title: 'Forest Meditation',
      artist: 'Nature Sounds',
      duration: '7:12',
      mood: 'Sérénité',
      frequency: '528 Hz'
    },
    {
      title: 'Binaural Focus',
      artist: 'Cognitive Enhancement',
      duration: '4:45',
      mood: 'Concentration',
      frequency: '40 Hz'
    }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="container mx-auto py-8 px-4" data-testid="page-root">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Music className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Musique Thérapeutique</h1>      
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            <Brain className="h-3 w-3 mr-1" />
            IA Adaptive
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Compositions personnalisées basées sur votre état émotionnel
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lecteur principal */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Lecteur Adaptatif
              </CardTitle>
              <CardDescription>
                Musique générée en temps réel selon votre humeur
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Info du morceau actuel */}
              <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                  <Music className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{currentPlaylist[currentTrack].title}</h3>
                  <p className="text-muted-foreground">{currentPlaylist[currentTrack].artist}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {currentPlaylist[currentTrack].mood}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentPlaylist[currentTrack].frequency}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    {currentPlaylist[currentTrack].duration}
                  </div>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="space-y-2 mb-6">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>2:23</span>
                  <span>{currentPlaylist[currentTrack].duration}</span>
                </div>
              </div>

              {/* Contrôles de lecture */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <Button variant="ghost" size="sm">
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  className="rounded-full w-14 h-14"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <SkipForward className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Repeat className="h-4 w-4" />
                </Button>
              </div>

              {/* Contrôle du volume */}
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-8">
                  {volume[0]}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Catégories de musique */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {musicCategories.map((category, index) => (
              <Card key={category.name} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span>{category.tracks} morceaux</span>
                    <span>{category.duration}</span>
                  </div>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {category.mood}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Playlist et recommandations */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Playlist Actuelle
              </CardTitle>
              <CardDescription>
                Adaptée à votre humeur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentPlaylist.map((track, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      index === currentTrack 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setCurrentTrack(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        {index === currentTrack && isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{track.title}</div>
                        <div className="text-xs text-muted-foreground">{track.artist}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {track.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Brain className="h-4 w-4 mr-2" />
                Générer nouvelle playlist
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Télécharger hors-ligne
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Heart className="h-4 w-4 mr-2" />
                Favoris personnels
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;