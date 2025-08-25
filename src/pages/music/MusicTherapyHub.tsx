import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Music, Play, Pause, SkipForward, SkipBack, Volume2, 
  Heart, Shuffle, Repeat, PlusCircle, Share, Download,
  Headphones, Waves, Sparkles, Mic, Settings, BarChart3,
  Library, Radio, Disc3, Clock, TrendingUp, Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  genre: string;
  mood: string;
  bpm: number;
  isLiked: boolean;
  isGenerated: boolean;
  thumbnailUrl?: string;
  audioUrl?: string;
  tags: string[];
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  trackCount: number;
  duration: number;
  mood: string;
  isPublic: boolean;
  thumbnailUrl?: string;
}

interface GenerationSession {
  id: string;
  prompt: string;
  mood: string;
  style: string;
  duration: number;
  timestamp: Date;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  resultTrackId?: string;
}

export const MusicTherapyHub: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const recentTracks: Track[] = [
    {
      id: '1',
      title: 'Sérénité Matinale',
      artist: 'IA Thérapeutique',
      duration: 240,
      genre: 'Ambient',
      mood: 'Calme',
      bpm: 60,
      isLiked: true,
      isGenerated: true,
      tags: ['méditation', 'réveil', 'zen']
    },
    {
      id: '2',
      title: 'Focus Profond',
      artist: 'IA Concentration',
      duration: 300,
      genre: 'Instrumental',
      mood: 'Concentration',
      bpm: 80,
      isLiked: false,
      isGenerated: true,
      tags: ['travail', 'concentration', 'productivité']
    },
    {
      id: '3',
      title: 'Détente Nocturne',
      artist: 'IA Sommeil',
      duration: 420,
      genre: 'Nature Sounds',
      mood: 'Relaxation',
      bpm: 45,
      isLiked: true,
      isGenerated: true,
      tags: ['sommeil', 'détente', 'nuit']
    }
  ];

  const playlists: Playlist[] = [
    {
      id: '1',
      name: 'Ma Collection Zen',
      description: 'Musiques apaisantes pour la méditation',
      trackCount: 12,
      duration: 3600,
      mood: 'Calme',
      isPublic: false
    },
    {
      id: '2',
      name: 'Boost Matinal',
      description: 'Énergie positive pour commencer la journée',
      trackCount: 8,
      duration: 2400,
      mood: 'Énergique',
      isPublic: true
    },
    {
      id: '3',
      name: 'Focus Zone',
      description: 'Concentration maximale pour le travail',
      trackCount: 15,
      duration: 4500,
      mood: 'Concentration',
      isPublic: false
    }
  ];

  const moods = [
    { id: 'calme', name: 'Calme', color: 'from-blue-400 to-blue-600', icon: '🧘‍♀️' },
    { id: 'energique', name: 'Énergique', color: 'from-orange-400 to-red-500', icon: '⚡' },
    { id: 'concentration', name: 'Concentration', color: 'from-purple-400 to-indigo-600', icon: '🎯' },
    { id: 'detente', name: 'Détente', color: 'from-green-400 to-teal-500', icon: '🌿' },
    { id: 'creativite', name: 'Créativité', color: 'from-pink-400 to-purple-500', icon: '🎨' },
    { id: 'sommeil', name: 'Sommeil', color: 'from-indigo-500 to-purple-700', icon: '🌙' }
  ];

  const musicGenres = [
    'Ambient', 'Classical', 'Nature Sounds', 'Binaural Beats', 
    'Lo-fi', 'Instrumental', 'New Age', 'Meditation'
  ];

  const [sessionStats] = useState({
    totalListening: 1247,
    averageSessionDuration: 28,
    favoriteGenre: 'Ambient',
    moodImprovement: 23,
    generatedTracks: 34
  });

  const generateMusic = async (prompt: string, mood: string, style: string) => {
    setIsGenerating(true);
    
    try {
      // Simulation de la génération
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Musique générée !",
        description: "Votre thérapie musicale personnalisée est prête.",
      });
      
      // Ajouter la nouvelle piste
      const newTrack: Track = {
        id: Date.now().toString(),
        title: `Thérapie ${mood}`,
        artist: 'IA Personnalisée',
        duration: 180 + Math.random() * 240,
        genre: style,
        mood: mood,
        bpm: 60 + Math.random() * 60,
        isLiked: false,
        isGenerated: true,
        tags: [mood.toLowerCase(), style.toLowerCase(), 'personnalisé']
      };
      
      setCurrentTrack(newTrack);
    } catch (error) {
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer la musique. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulation du progrès audio
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          setProgress((newTime / currentTrack.duration) * 100);
          
          if (newTime >= currentTrack.duration) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack]);

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2">
          <Music className="w-5 h-5 text-primary" />
          <span className="font-medium text-primary">Musicothérapie IA</span>
        </div>
        <h1 className="text-4xl font-bold">Centre de Thérapie Musicale</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Créez, écoutez et personnalisez votre thérapie musicale avec notre IA avancée. 
          Chaque mélodie est adaptée à votre état émotionnel et vos besoins du moment.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-5"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{sessionStats.totalListening}min</p>
            <p className="text-xs text-muted-foreground">Temps d'écoute</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{sessionStats.averageSessionDuration}min</p>
            <p className="text-xs text-muted-foreground">Session moyenne</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Disc3 className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{sessionStats.generatedTracks}</p>
            <p className="text-xs text-muted-foreground">Pistes créées</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
            <p className="text-2xl font-bold">{sessionStats.favoriteGenre}</p>
            <p className="text-xs text-muted-foreground">Genre favori</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">+{sessionStats.moodImprovement}%</p>
            <p className="text-xs text-muted-foreground">Amélioration</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lecteur audio */}
      {currentTrack && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl p-6 border"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <Music className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{currentTrack.title}</h3>
              <p className="text-muted-foreground">{currentTrack.artist}</p>
              
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm">{formatTime(currentTime)}</span>
                <Progress value={progress} className="flex-1 h-2" />
                <span className="text-sm">{formatTime(currentTrack.duration)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button onClick={togglePlayPause} size="icon" className="w-12 h-12">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              
              <Button variant="ghost" size="icon">
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-24"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Contenu principal */}
      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generator">Générateur IA</TabsTrigger>
          <TabsTrigger value="library">Ma Bibliothèque</TabsTrigger>
          <TabsTrigger value="discover">Découvrir</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Générateur */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Créer une thérapie musicale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Décrivez votre état ou besoin</label>
                    <textarea
                      placeholder="Ex: Je me sens stressé après une longue journée de travail et j'aimerais me détendre..."
                      className="w-full p-3 border rounded-lg resize-none h-20"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-3 block">Choisissez votre humeur cible</label>
                    <div className="grid grid-cols-2 gap-2">
                      {moods.map((mood) => (
                        <Button
                          key={mood.id}
                          variant="outline"
                          className="justify-start"
                          onClick={() => {}}
                        >
                          <span className="mr-2">{mood.icon}</span>
                          {mood.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Style musical</label>
                    <select className="w-full p-2 border rounded-lg">
                      <option value="">Sélectionner un style</option>
                      {musicGenres.map((genre) => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <Button 
                  onClick={() => generateMusic('', 'calme', 'Ambient')}
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Waves className="w-4 h-4 mr-2 animate-pulse" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Générer ma musique thérapeutique
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Suggestions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Suggestions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: 'Méditation matinale', mood: 'calme', style: 'Ambient' },
                  { title: 'Boost de concentration', mood: 'concentration', style: 'Instrumental' },
                  { title: 'Relaxation profonde', mood: 'detente', style: 'Nature Sounds' },
                  { title: 'Créativité spontanée', mood: 'creativite', style: 'Lo-fi' },
                ].map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-between h-auto p-4"
                    onClick={() => generateMusic('', suggestion.mood, suggestion.style)}
                  >
                    <div className="text-left">
                      <p className="font-medium">{suggestion.title}</p>
                      <p className="text-sm text-muted-foreground">{suggestion.style}</p>
                    </div>
                    <Play className="w-4 h-4" />
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Pistes récentes */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Mes créations récentes</h2>
                <Button onClick={() => navigate('/music/library')} variant="outline">
                  <Library className="w-4 h-4 mr-2" />
                  Voir tout
                </Button>
              </div>
              
              <div className="space-y-3">
                {recentTracks.map((track) => (
                  <Card key={track.id} className="cursor-pointer hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Button
                          onClick={() => playTrack(track)}
                          size="icon"
                          variant="ghost"
                          className="w-12 h-12 bg-primary/10 hover:bg-primary/20"
                        >
                          <Play className="w-5 h-5" />
                        </Button>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{track.title}</h3>
                          <p className="text-sm text-muted-foreground">{track.artist}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">{track.mood}</Badge>
                            <Badge variant="outline" className="text-xs">{track.genre}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(track.duration)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="icon">
                            {track.isLiked ? (
                              <Heart className="w-4 h-4 text-red-500 fill-current" />
                            ) : (
                              <Heart className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Share className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Playlists */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Mes playlists</h2>
                <Button size="sm" onClick={() => navigate('/music/playlists/new')}>
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Nouvelle
                </Button>
              </div>
              
              <div className="space-y-3">
                {playlists.map((playlist) => (
                  <Card key={playlist.id} className="cursor-pointer hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">{playlist.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{playlist.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{playlist.trackCount} pistes</span>
                        <span>{formatTime(playlist.duration)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="discover" className="space-y-6">
          <div className="grid gap-6">
            <h2 className="text-2xl font-semibold">Découvrez de nouvelles thérapies</h2>
            
            {/* Stations par humeur */}
            <div className="grid gap-4 md:grid-cols-3">
              {moods.map((mood) => (
                <Card key={mood.id} className="cursor-pointer hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${mood.color} flex items-center justify-center mb-4 mx-auto`}>
                      <span className="text-2xl">{mood.icon}</span>
                    </div>
                    <h3 className="font-semibold text-center mb-2">{mood.name}</h3>
                    <Button variant="ghost" className="w-full">
                      <Radio className="w-4 h-4 mr-2" />
                      Écouter la station
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Tendances */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Tendances communautaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { title: 'Ambiance Forêt Tropicale', plays: '2.3k', trend: '+15%' },
                    { title: 'Battements Binauraux Focus', plays: '1.8k', trend: '+22%' },
                    { title: 'Mélodie Cristalline Zen', plays: '1.5k', trend: '+8%' },
                    { title: 'Rythmes Cardiaques Apaisants', plays: '1.2k', trend: '+31%' }
                  ].map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <h4 className="font-medium">{trend.title}</h4>
                        <p className="text-sm text-muted-foreground">{trend.plays} écoutes</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="text-green-600">{trend.trend}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Habitudes d'écoute</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-8 border-2 border-dashed rounded-lg">
                    <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Graphique d'activité musicale</p>
                    <p className="text-sm text-muted-foreground">
                      Heures d'écoute par jour/semaine
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact thérapeutique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Amélioration du bien-être</span>
                    <span className="text-green-600 font-bold">+23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Basé sur vos scans émotionnels post-écoute
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Réduction du stress</span>
                    <span className="text-blue-600 font-bold">-18%</span>
                  </div>
                  <Progress value={18} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Mesuré via variabilité cardiaque
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Amélioration du sommeil</span>
                    <span className="text-purple-600 font-bold">+31%</span>
                  </div>
                  <Progress value={31} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Qualité du sommeil après sessions nocturnes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicTherapyHub;