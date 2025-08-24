import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2, Heart, Timer, TrendingUp, Shuffle, Repeat } from 'lucide-react';
import PageLayout from '@/components/common/PageLayout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import FunctionalButton from '@/components/ui/functional-button';

const MusicPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const tracks = [
    {
      id: 1,
      title: 'Méditation Matinale',
      artist: 'Sons de la Nature',
      duration: 180, // 3:00
      url: '/sounds/nature-calm.mp3',
      category: 'Relaxation',
      mood: 'Calme',
      color: 'from-green-500 to-blue-500'
    },
    {
      id: 2,
      title: 'Focus Profond',
      artist: 'Ambiance Zen',
      duration: 240, // 4:00
      url: '/sounds/focus-ambient.mp3',
      category: 'Concentration',
      mood: 'Focus',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      title: 'Relaxation Océan',
      artist: 'Vagues Apaisantes',
      duration: 300, // 5:00
      url: '/sounds/ambient-calm.mp3',
      category: 'Détente',
      mood: 'Sérénité',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 4,
      title: 'Énergie Positive',
      artist: 'Harmonies Vitales',
      duration: 220,
      url: '/sounds/energy-boost.mp3',
      category: 'Motivation',
      mood: 'Énergique',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const currentTrack = tracks[currentTrackIndex];

  const handlePlayPause = async () => {
    setIsLoading(true);
    try {
      if (isPlaying) {
        setIsPlaying(false);
        toast({
          title: "Pause",
          description: `"${currentTrack.title}" mis en pause`,
          duration: 2000
        });
      } else {
        setIsPlaying(true);
        toast({
          title: "Lecture",
          description: `Lecture de "${currentTrack.title}"`,
          duration: 2000
        });
      }
      
      // Simulate audio loading
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de lire cette piste",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextTrack = async () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
    
    toast({
      title: "Piste suivante",
      description: `"${tracks[nextIndex].title}" sélectionnée`,
      duration: 2000
    });
  };

  const handlePrevTrack = async () => {
    const prevIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
    setCurrentTrackIndex(prevIndex);
    setCurrentTime(0);
    
    toast({
      title: "Piste précédente",
      description: `"${tracks[prevIndex].title}" sélectionnée`,
      duration: 2000
    });
  };

  const handleTrackSelect = async (index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setIsPlaying(false);
    
    toast({
      title: "Piste sélectionnée",
      description: `"${tracks[index].title}" prête à être lue`,
      duration: 2000
    });
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
    toast({
      title: isShuffling ? "Lecture aléatoire désactivée" : "Lecture aléatoire activée",
      description: isShuffling ? "Lecture séquentielle" : "Les pistes seront mélangées",
      duration: 2000
    });
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
    toast({
      title: isRepeating ? "Répétition désactivée" : "Répétition activée",
      description: isRepeating ? "Lecture normale" : "La piste actuelle sera répétée",
      duration: 2000
    });
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate progress
  useEffect(() => {
    if (isPlaying && !isLoading) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            if (isRepeating) {
              return 0;
            } else {
              handleNextTrack();
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, isLoading, currentTrack.duration, isRepeating]);

  return (
    <PageLayout
      title="Musicothérapie"
      description="Explorez notre collection de musiques thérapeutiques adaptées à vos besoins émotionnels"
    >
      <div className="space-y-8">
        {/* Current Track Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Card className="overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${currentTrack.color} opacity-10`} />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${currentTrack.color} flex items-center justify-center shadow-lg`}>
                    <Music2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{currentTrack.title}</CardTitle>
                    <p className="text-muted-foreground">{currentTrack.artist}</p>
                    <Badge variant="secondary" className="mt-1">
                      {currentTrack.category}
                    </Badge>
                  </div>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {currentTrack.mood}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress 
                  value={(currentTime / currentTrack.duration) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(currentTrack.duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <FunctionalButton
                  actionId="shuffle"
                  onClick={toggleShuffle}
                  variant="ghost"
                  size="sm"
                  className={isShuffling ? "text-primary" : ""}
                  successMessage="Mode aléatoire mis à jour"
                >
                  <Shuffle className="h-4 w-4" />
                </FunctionalButton>

                <FunctionalButton
                  actionId="prev-track"
                  onClick={handlePrevTrack}
                  variant="ghost"
                  size="sm"
                  loadingMessage="Changement de piste..."
                >
                  <SkipBack className="h-5 w-5" />
                </FunctionalButton>

                <FunctionalButton
                  actionId="play-pause"
                  onClick={handlePlayPause}
                  size="lg"
                  className="w-16 h-16 rounded-full"
                  loadingText=""
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  ) : isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </FunctionalButton>

                <FunctionalButton
                  actionId="next-track"
                  onClick={handleNextTrack}
                  variant="ghost"
                  size="sm"
                  loadingMessage="Changement de piste..."
                >
                  <SkipForward className="h-5 w-5" />
                </FunctionalButton>

                <FunctionalButton
                  actionId="repeat"
                  onClick={toggleRepeat}
                  variant="ghost"
                  size="sm"
                  className={isRepeating ? "text-primary" : ""}
                  successMessage="Mode répétition mis à jour"
                >
                  <Repeat className="h-4 w-4" />
                </FunctionalButton>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-4">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={volume}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm w-12">{volume[0]}%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Track List */}
        <Card>
          <CardHeader>
            <CardTitle>Playlist Thérapeutique</CardTitle>
            <p className="text-muted-foreground">
              Sélectionnez une piste adaptée à votre état émotionnel
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    index === currentTrackIndex ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleTrackSelect(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${track.color} flex items-center justify-center`}>
                        <Music2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{track.title}</h4>
                        <p className="text-sm text-muted-foreground">{track.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{track.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatTime(track.duration)}
                      </span>
                      {index === currentTrackIndex && isPlaying && (
                        <div className="flex space-x-1">
                          <div className="w-1 h-4 bg-primary animate-pulse rounded" />
                          <div className="w-1 h-4 bg-primary animate-pulse rounded" style={{ animationDelay: '0.2s' }} />
                          <div className="w-1 h-4 bg-primary animate-pulse rounded" style={{ animationDelay: '0.4s' }} />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <FunctionalButton
            actionId="generate-playlist"
            onClick={async () => {
              await new Promise(resolve => setTimeout(resolve, 2000));
              return "Playlist générée avec succès";
            }}
            className="flex-1"
            successMessage="Nouvelle playlist personnalisée créée"
            loadingMessage="Génération en cours..."
            loadingText="Génération IA..."
          >
            <Heart className="mr-2 h-4 w-4" />
            Générer Playlist IA
          </FunctionalButton>

          <FunctionalButton
            actionId="view-analytics"
            onClick={() => navigate('/weekly-bars')}
            variant="outline"
            className="flex-1"
            successMessage="Redirection vers les analyses"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Voir mes Analyses
          </FunctionalButton>

          <FunctionalButton
            actionId="timer-session"
            onClick={async () => {
              toast({
                title: "Session programmée",
                description: "Session de 30 minutes démarrée",
                duration: 3000
              });
            }}
            variant="outline"
            className="flex-1"
            successMessage="Session programmée avec succès"
          >
            <Timer className="mr-2 h-4 w-4" />
            Session 30min
          </FunctionalButton>
        </div>
      </div>
    </PageLayout>
  );
};

export default MusicPage;