import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Music, Play, Pause, SkipForward, SkipBack, Volume2, 
  Heart, Share2, Download, Shuffle, Repeat, Radio,
  Headphones, Zap, Brain, Sparkles, Star, TrendingUp, Clock
} from 'lucide-react';
import PremiumBackground from '@/components/premium/PremiumBackground';
import AnimatedButton from '@/components/premium/AnimatedButton';
import QuickActions from '@/components/premium/QuickActions';
import SmartRecommendations from '@/components/premium/SmartRecommendations';
import { cn } from '@/lib/utils';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  currentTime: number;
  coverUrl: string;
  emotion: string;
  bpm: number;
  genre: string;
  isFavorite: boolean;
  energy: number;
  valence: number;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  trackCount: number;
  duration: number;
  coverUrl: string;
  mood: string;
  isPersonalized: boolean;
}

export default function B2CMusicEnhanced() {
  const [currentTrack, setCurrentTrack] = useState<Track>({
    id: '1',
    title: 'Sérénité Matinale',
    artist: 'EmotionsCare AI',
    album: 'Collection Bien-être',
    duration: 245,
    currentTime: 67,
    coverUrl: '/api/placeholder/300/300',
    emotion: 'calm',
    bpm: 72,
    genre: 'Ambient Healing',
    isFavorite: false,
    energy: 0.3,
    valence: 0.8
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [currentPlaylist, setCurrentPlaylist] = useState('personalized');

  const playlists: Playlist[] = [
    {
      id: 'personalized',
      name: 'Playlist Personnalisée',
      description: 'Adaptée à votre profil émotionnel',
      trackCount: 12,
      duration: 2847,
      coverUrl: '/api/placeholder/200/200',
      mood: 'adaptatif',
      isPersonalized: true
    },
    {
      id: 'focus',
      name: 'Concentration Profonde',
      description: 'Pour optimiser votre productivité',
      trackCount: 18,
      duration: 3621,
      coverUrl: '/api/placeholder/200/200',
      mood: 'focus',
      isPersonalized: false
    },
    {
      id: 'relax',
      name: 'Détente Absolue',
      description: 'Libérez vos tensions',
      trackCount: 15,
      duration: 2943,
      coverUrl: '/api/placeholder/200/200',
      mood: 'relax',
      isPersonalized: false
    }
  ];

  const [audioAnalysis, setAudioAnalysis] = useState({
    emotionalImpact: 87,
    stressReduction: 92,
    focusBoost: 45,
    energyLevel: 34
  });

  // Simulation de l'analyseur audio temps réel
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTrack(prev => ({
          ...prev,
          currentTime: Math.min(prev.currentTime + 1, prev.duration)
        }));

        // Simulation de l'analyse émotionnelle temps réel
        setAudioAnalysis(prev => ({
          emotionalImpact: Math.max(80, prev.emotionalImpact + (Math.random() - 0.5) * 4),
          stressReduction: Math.max(85, prev.stressReduction + (Math.random() - 0.5) * 3),
          focusBoost: Math.max(40, prev.focusBoost + (Math.random() - 0.5) * 5),
          energyLevel: Math.max(30, prev.energyLevel + (Math.random() - 0.5) * 3)
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFavorite = () => {
    setCurrentTrack(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
  };

  const progressPercentage = (currentTrack.currentTime / currentTrack.duration) * 100;

  return (
    <PremiumBackground variant="waves" intensity="medium">
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header avec visualiseur */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Musicothérapie IA
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Musique adaptative personnalisée pour votre bien-être émotionnel
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lecteur principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Lecteur audio premium */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-background/95 to-blue-500/10 border-purple-500/20">
                {/* Visualiseur audio animé */}
                {showVisualizer && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="flex items-end justify-center h-full gap-1 p-8">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="bg-gradient-to-t from-purple-500/30 to-blue-500/30 rounded-t"
                          style={{ width: '4px' }}
                          animate={{
                            height: isPlaying 
                              ? [`${Math.random() * 60 + 10}px`, `${Math.random() * 80 + 20}px`, `${Math.random() * 60 + 10}px`]
                              : '10px'
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: i * 0.05
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-6">
                    {/* Pochette d'album */}
                    <motion.div
                      animate={{ rotate: isPlaying ? 360 : 0 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="relative"
                    >
                      <img
                        src={currentTrack.coverUrl}
                        alt="Album cover"
                        className="w-32 h-32 rounded-xl shadow-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                    </motion.div>

                    {/* Informations de la piste */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-purple-400 mb-1">
                          {currentTrack.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {currentTrack.artist} • {currentTrack.album}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30">
                            {currentTrack.emotion}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30">
                            {currentTrack.bpm} BPM
                          </Badge>
                          <Badge variant="outline" className="bg-green-500/10 border-green-500/30">
                            {currentTrack.genre}
                          </Badge>
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{formatTime(currentTrack.currentTime)}</span>
                          <span>{formatTime(currentTrack.duration)}</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      {/* Contrôles */}
                      <div className="flex items-center justify-center gap-3">
                        <AnimatedButton
                          variant="default"
                          size="sm"
                          className="rounded-full w-12 h-12"
                        >
                          <SkipBack className="w-5 h-5" />
                        </AnimatedButton>

                        <AnimatedButton
                          variant="premium"
                          animation="pulse"
                          onClick={togglePlayPause}
                          className="rounded-full w-16 h-16"
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </AnimatedButton>

                        <AnimatedButton
                          variant="default"
                          size="sm"
                          className="rounded-full w-12 h-12"
                        >
                          <SkipForward className="w-5 h-5" />
                        </AnimatedButton>
                      </div>

                      {/* Contrôles secondaires */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleFavorite}
                            className={currentTrack.isFavorite ? 'text-red-500' : ''}
                          >
                            <Heart className={`w-4 h-4 ${currentTrack.isFavorite ? 'fill-current' : ''}`} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-3">
                          <Volume2 className="w-4 h-4 text-muted-foreground" />
                          <Slider
                            value={[volume]}
                            onValueChange={(value) => setVolume(value[0])}
                            max={100}
                            step={1}
                            className="w-24"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analyse émotionnelle temps réel */}
              <Card className="bg-gradient-to-br from-background/95 to-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Analyse Émotionnelle Temps Réel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: 'Impact Émotionnel', value: audioAnalysis.emotionalImpact, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                      { label: 'Réduction Stress', value: audioAnalysis.stressReduction, color: 'text-green-400', bg: 'bg-green-500/10' },
                      { label: 'Boost Focus', value: audioAnalysis.focusBoost, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                      { label: 'Niveau Énergie', value: audioAnalysis.energyLevel, color: 'text-amber-400', bg: 'bg-amber-500/10' }
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl ${metric.bg}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{metric.label}</span>
                          <span className={`text-lg font-bold ${metric.color}`}>
                            {Math.round(metric.value)}%
                          </span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions rapides musique */}
              <QuickActions context="music" />
            </div>

            {/* Sidebar avec playlists et recommandations */}
            <div className="space-y-6">
              {/* Playlists */}
              <Card className="bg-gradient-to-br from-background/95 to-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-primary" />
                    Mes Playlists
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {playlists.map((playlist, index) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg",
                        currentPlaylist === playlist.id 
                          ? "border-primary bg-primary/10" 
                          : "border-transparent bg-accent/5 hover:bg-accent/10"
                      )}
                      onClick={() => setCurrentPlaylist(playlist.id)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={playlist.coverUrl}
                          alt={playlist.name}
                          className="w-12 h-12 rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm">{playlist.name}</h4>
                            {playlist.isPersonalized && (
                              <Badge variant="outline" className="text-xs bg-amber-500/10 border-amber-500/30">
                                <Sparkles className="w-3 h-3 mr-1" />
                                IA
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{playlist.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{playlist.trackCount} pistes</span>
                            <span>•</span>
                            <span>{formatTime(playlist.duration)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Recommandations musicales */}
              <SmartRecommendations 
                maxRecommendations={2} 
                currentEmotion="calm"
                timeOfDay="afternoon"
              />

              {/* Statistiques d'écoute */}
              <Card className="bg-gradient-to-br from-background/95 to-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Vos Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Temps d'écoute aujourd'hui", value: "2h 34min", icon: Clock },
                      { label: "Pistes découvertes", value: "23", icon: Radio },
                      { label: "Amélioration bien-être", value: "+15%", icon: TrendingUp }
                    ].map((stat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <stat.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{stat.label}</span>
                        </div>
                        <span className="font-semibold text-primary">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PremiumBackground>
  );
}