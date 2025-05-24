
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Music, Play, Pause, SkipForward, SkipBack, Volume2, 
  Heart, Shuffle, Repeat, Download, Share2 
} from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading-animation';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  emotion: string;
  url: string;
  isPlaying?: boolean;
}

const Music: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState([0]);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('calme');

  const emotionCategories = [
    { id: 'calme', label: 'Calme', color: 'bg-blue-100 text-blue-700' },
    { id: 'energique', label: 'Énergique', color: 'bg-orange-100 text-orange-700' },
    { id: 'focus', label: 'Concentration', color: 'bg-purple-100 text-purple-700' },
    { id: 'relaxation', label: 'Relaxation', color: 'bg-green-100 text-green-700' },
    { id: 'motivation', label: 'Motivation', color: 'bg-red-100 text-red-700' },
    { id: 'meditation', label: 'Méditation', color: 'bg-indigo-100 text-indigo-700' }
  ];

  const tracksByEmotion: Record<string, Track[]> = {
    calme: [
      {
        id: '1',
        title: 'Sérénité Matinale',
        artist: 'EmotionsCare AI',
        duration: 180,
        emotion: 'calme',
        url: '/audio/serenite.mp3'
      },
      {
        id: '2',
        title: 'Rivière Apaisante',
        artist: 'Nature Sounds',
        duration: 240,
        emotion: 'calme',
        url: '/audio/riviere.mp3'
      }
    ],
    energique: [
      {
        id: '3',
        title: 'Réveil Dynamique',
        artist: 'EmotionsCare AI',
        duration: 200,
        emotion: 'energique',
        url: '/audio/dynamique.mp3'
      }
    ],
    focus: [
      {
        id: '4',
        title: 'Concentration Profonde',
        artist: 'Focus Beats',
        duration: 300,
        emotion: 'focus',
        url: '/audio/focus.mp3'
      }
    ],
    relaxation: [
      {
        id: '5',
        title: 'Détente Absolue',
        artist: 'Wellness Audio',
        duration: 360,
        emotion: 'relaxation',
        url: '/audio/detente.mp3'
      }
    ],
    motivation: [
      {
        id: '6',
        title: 'Force Intérieure',
        artist: 'Motivation Music',
        duration: 210,
        emotion: 'motivation',
        url: '/audio/motivation.mp3'
      }
    ],
    meditation: [
      {
        id: '7',
        title: 'Méditation Guidée',
        artist: 'Mindfulness Audio',
        duration: 600,
        emotion: 'meditation',
        url: '/audio/meditation.mp3'
      }
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      // Sélectionner le premier track de la catégorie par défaut
      const defaultTracks = tracksByEmotion[selectedEmotion];
      if (defaultTracks.length > 0) {
        setCurrentTrack(defaultTracks[0]);
      }
    }, 1000);
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress([0]);
  };

  const handleEmotionChange = (emotion: string) => {
    setSelectedEmotion(emotion);
    const tracks = tracksByEmotion[emotion];
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
      setIsPlaying(false);
      setProgress([0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateMusic = async () => {
    setIsLoading(true);
    // Simuler la génération de musique
    setTimeout(() => {
      const newTrack: Track = {
        id: Date.now().toString(),
        title: `Musique Personnalisée ${selectedEmotion}`,
        artist: 'EmotionsCare AI Generator',
        duration: 180 + Math.floor(Math.random() * 120),
        emotion: selectedEmotion,
        url: `/audio/generated-${selectedEmotion}.mp3`
      };
      
      // Ajouter à la liste
      tracksByEmotion[selectedEmotion].push(newTrack);
      setCurrentTrack(newTrack);
      setIsLoading(false);
      setIsPlaying(true);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Préparation de votre bibliothèque musicale..." />
      </div>
    );
  }

  const currentTracks = tracksByEmotion[selectedEmotion] || [];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
            <Music className="h-8 w-8 text-purple-600" />
            Musique Thérapeutique
          </h1>
          <p className="text-muted-foreground">
            Découvrez des compositions adaptées à votre état émotionnel
          </p>
        </div>
      </motion.div>

      {/* Sélecteur d'émotions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Choisissez votre ambiance</CardTitle>
            <CardDescription>
              Sélectionnez l'émotion ou l'état d'esprit que vous souhaitez cultiver
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {emotionCategories.map((emotion) => (
                <Button
                  key={emotion.id}
                  variant={selectedEmotion === emotion.id ? "default" : "outline"}
                  onClick={() => handleEmotionChange(emotion.id)}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <span className={`px-2 py-1 rounded-full text-xs ${emotion.color}`}>
                    {emotion.label}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lecteur principal */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Lecteur</CardTitle>
            </CardHeader>
            <CardContent>
              {currentTrack ? (
                <div className="space-y-6">
                  {/* Informations du track */}
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Music className="h-16 w-16 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
                    <p className="text-muted-foreground">{currentTrack.artist}</p>
                  </div>

                  {/* Barre de progression */}
                  <div className="space-y-2">
                    <Slider
                      value={progress}
                      onValueChange={setProgress}
                      max={currentTrack.duration}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatTime(progress[0])}</span>
                      <span>{formatTime(currentTrack.duration)}</span>
                    </div>
                  </div>

                  {/* Contrôles */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button variant="ghost" size="icon">
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={handlePlayPause}
                      size="icon"
                      className="h-12 w-12"
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Repeat className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center space-x-3">
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

                  {/* Actions supplémentaires */}
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Favori
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Music className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez une piste pour commencer l'écoute</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Playlist */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Playlist {emotionCategories.find(e => e.id === selectedEmotion)?.label}</span>
                <Button onClick={generateMusic} size="sm">
                  Générer
                </Button>
              </CardTitle>
              <CardDescription>
                {currentTracks.length} piste{currentTracks.length > 1 ? 's' : ''} disponible{currentTracks.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentTracks.map((track) => (
                  <motion.div
                    key={track.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      currentTrack?.id === track.id 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleTrackSelect(track)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{track.title}</h4>
                        <p className="text-xs text-muted-foreground">{track.artist}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(track.duration)}
                        </span>
                        {currentTrack?.id === track.id && isPlaying && (
                          <div className="flex space-x-1 mt-1">
                            <div className="w-1 h-3 bg-primary rounded-full animate-pulse"></div>
                            <div className="w-1 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Informations sur la musicothérapie */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>🎵 Les bienfaits de la musicothérapie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <h3 className="font-medium mb-1">Bien-être émotionnel</h3>
                <p className="text-sm text-muted-foreground">
                  La musique aide à réguler les émotions et réduire le stress
                </p>
              </div>
              <div className="text-center">
                <Music className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <h3 className="font-medium mb-1">Concentration</h3>
                <p className="text-sm text-muted-foreground">
                  Améliore la focus et la productivité cognitive
                </p>
              </div>
              <div className="text-center">
                <Volume2 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <h3 className="font-medium mb-1">Relaxation</h3>
                <p className="text-sm text-muted-foreground">
                  Favorise la détente et améliore la qualité du sommeil
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Music;
