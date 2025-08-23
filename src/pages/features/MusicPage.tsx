import React, { memo, useState, useCallback, useMemo, Suspense } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { 
  Music, Play, Pause, SkipForward, SkipBack, Volume2, Heart, 
  Shuffle, Repeat, Download, Share2, Clock, Headphones,
  Radio, Disc, Mic, Brain, Zap, Star, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { EnhancedLoading, OptimizedImage } from '@/components/ui/enhanced-performance';
import { InteractiveCard, Rating } from '@/components/ui/enhanced-user-experience';
import { announce } from '@/components/ui/enhanced-accessibility';

// Types
interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  currentTime: number;
  category: string;
  emotion: string;
  bpm: number;
  liked: boolean;
  premium: boolean;
  cover?: string;
}

interface MusicCategory {
  id: string;
  title: string;
  description: string;
  gradient: string;
  icon: React.ComponentType<any>;
  tracks: Track[];
  color: string;
  emotion: string;
}

// Mock data
const mockCategories: MusicCategory[] = [
  {
    id: 'relaxation',
    title: 'Relaxation',
    description: 'Musiques apaisantes pour la détente profonde',
    gradient: 'from-blue-500 via-blue-600 to-indigo-700',
    icon: Music,
    color: 'blue',
    emotion: 'calme',
    tracks: [
      {
        id: '1',
        title: 'Océan Calme',
        artist: 'Nature Sounds',
        duration: 300,
        currentTime: 0,
        category: 'relaxation',
        emotion: 'sérénité',
        bpm: 60,
        liked: true,
        premium: false,
        cover: '/placeholder.svg'
      },
      {
        id: '2',
        title: 'Forêt Mystique',
        artist: 'Ambient Therapy',
        duration: 420,
        currentTime: 0,
        category: 'relaxation',
        emotion: 'paix',
        bpm: 55,
        liked: false,
        premium: true,
        cover: '/placeholder.svg'
      }
    ]
  },
  {
    id: 'focus',
    title: 'Concentration',
    description: 'Sons optimisés pour améliorer la productivité',
    gradient: 'from-green-500 via-teal-600 to-cyan-700',
    icon: Brain,
    color: 'green',
    emotion: 'focus',
    tracks: [
      {
        id: '3',
        title: 'Bruit Blanc Premium',
        artist: 'Focus Masters',
        duration: 600,
        currentTime: 0,
        category: 'focus',
        emotion: 'concentration',
        bpm: 40,
        liked: true,
        premium: true,
        cover: '/placeholder.svg'
      }
    ]
  },
  {
    id: 'energy',
    title: 'Énergie',
    description: 'Musiques motivantes et dynamisantes',
    gradient: 'from-orange-500 via-red-500 to-pink-600',
    icon: Zap,
    color: 'orange',
    emotion: 'motivation',
    tracks: [
      {
        id: '4',
        title: 'Rythmes Positifs',
        artist: 'Energy Boost',
        duration: 180,
        currentTime: 0,
        category: 'energy',
        emotion: 'motivation',
        bpm: 120,
        liked: false,
        premium: false,
        cover: '/placeholder.svg'
      }
    ]
  }
];

// Memoized Components
const MemoizedPlayer = memo<{
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (value: number[]) => void;
  onTimeChange: (value: number[]) => void;
  onToggleLike: () => void;
  shouldReduceMotion: boolean;
}>(({ 
  currentTrack, 
  isPlaying, 
  volume, 
  onPlayPause, 
  onNext, 
  onPrevious, 
  onVolumeChange, 
  onTimeChange, 
  onToggleLike,
  shouldReduceMotion 
}) => {
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  if (!currentTrack) {
    return (
      <Card className="p-8 text-center bg-muted/30">
        <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground">Sélectionnez une musique pour commencer</p>
      </Card>
    );
  }

  const progress = (currentTrack.currentTime / currentTrack.duration) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.6 }}
    >
      <Card className="p-6 bg-gradient-to-br from-background/95 via-background/90 to-muted/20 backdrop-blur-xl border-0 shadow-premium-lg">
        <div className="flex items-center space-x-6">
          {/* Album Cover */}
          <motion.div 
            className="relative"
            animate={shouldReduceMotion ? {} : isPlaying ? { rotate: 360 } : {}}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-primary/20 to-primary/5">
              <OptimizedImage
                src={currentTrack.cover || '/placeholder.svg'}
                alt={`Couverture de ${currentTrack.title}`}
                className="w-full h-full object-cover"
              />
            </div>
            {isPlaying && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>

          {/* Track Info & Controls */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {currentTrack.title}
                </h3>
                <p className="text-muted-foreground">
                  {currentTrack.artist} • {currentTrack.emotion}
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                  <span>{currentTrack.bpm} BPM</span>
                  <span>{currentTrack.category}</span>
                  {currentTrack.premium && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-2 w-2 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleLike}
                  className={cn(
                    "transition-colors",
                    currentTrack.liked && "text-red-500 hover:text-red-600"
                  )}
                >
                  <Heart className={cn("h-4 w-4", currentTrack.liked && "fill-current")} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={[progress]}
                onValueChange={onTimeChange}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTrack.currentTime)}</span>
                <span>{formatTime(currentTrack.duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onPrevious}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <motion.div whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}>
                  <Button 
                    size="lg"
                    onClick={onPlayPause}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-12 h-12 p-0"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                  </Button>
                </motion.div>
                
                <Button variant="ghost" size="sm" onClick={onNext}>
                  <SkipForward className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Repeat className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[volume]}
                  onValueChange={onVolumeChange}
                  max={100}
                  step={1}
                  className="w-24"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

MemoizedPlayer.displayName = 'MemoizedPlayer';

const MemoizedCategoryCard = memo<{
  category: MusicCategory;
  index: number;
  onTrackSelect: (track: Track) => void;
  shouldReduceMotion: boolean;
}>(({ category, index, onTrackSelect, shouldReduceMotion }) => {
  const cardVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 30,
      scale: shouldReduceMotion ? 1 : 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        delay: shouldReduceMotion ? 0 : index * 0.1,
        type: "spring",
        stiffness: 100
      }
    }
  }), [index, shouldReduceMotion]);

  const handleTrackSelect = useCallback((track: Track) => {
    announce(`Lecture de ${track.title} par ${track.artist}`);
    onTrackSelect(track);
  }, [onTrackSelect]);

  return (
    <motion.div variants={cardVariants}>
      <InteractiveCard
        title={category.title}
        description={category.description}
        className="h-full"
      >
        <div className="space-y-4">
          {/* Category Header */}
          <div className={cn(
            "p-4 rounded-xl bg-gradient-to-br",
            category.gradient,
            "text-white text-center"
          )}>
            <category.icon className="h-8 w-8 mx-auto mb-2" />
            <div className="text-sm opacity-90">
              {category.tracks.length} titre(s) • {category.emotion}
            </div>
          </div>

          {/* Track List */}
          <div className="space-y-2">
            {category.tracks.map((track, trackIndex) => (
              <motion.div
                key={track.id}
                className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => handleTrackSelect(track)}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + trackIndex * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackSelect(track);
                      }}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                    <div>
                      <p className="font-medium text-sm text-foreground">{track.title}</p>
                      <p className="text-xs text-muted-foreground">{track.artist}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-muted-foreground">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </div>
                    {track.premium && (
                      <Star className="h-3 w-3 text-yellow-500" />
                    )}
                    {track.liked && (
                      <Heart className="h-3 w-3 text-red-500 fill-current" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => console.log(`Voir toute la playlist ${category.title}`)}
          >
            Voir toute la playlist
          </Button>
        </div>
      </InteractiveCard>
    </motion.div>
  );
});

MemoizedCategoryCard.displayName = 'MemoizedCategoryCard';

const MusicPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);

  const handleTrackSelect = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
    announce(isPlaying ? 'Musique mise en pause' : 'Lecture de la musique');
  }, [isPlaying]);

  const handleNext = useCallback(() => {
    // Logique pour piste suivante
    announce('Piste suivante');
  }, []);

  const handlePrevious = useCallback(() => {
    // Logique pour piste précédente
    announce('Piste précédente');
  }, []);

  const handleVolumeChange = useCallback((value: number[]) => {
    setVolume(value[0]);
  }, []);

  const handleTimeChange = useCallback((value: number[]) => {
    if (currentTrack) {
      const newTime = (value[0] / 100) * currentTrack.duration;
      setCurrentTrack(prev => prev ? { ...prev, currentTime: newTime } : null);
    }
  }, [currentTrack]);

  const handleToggleLike = useCallback(() => {
    if (currentTrack) {
      setCurrentTrack(prev => prev ? { ...prev, liked: !prev.liked } : null);
      announce(currentTrack.liked ? 'Retiré des favoris' : 'Ajouté aux favoris');
    }
  }, [currentTrack]);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        staggerChildren: shouldReduceMotion ? 0 : 0.1
      }
    }
  }), [shouldReduceMotion]);

  const titleVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : -30
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.8,
        type: "spring",
        stiffness: 100
      }
    }
  }), [shouldReduceMotion]);

  return (
    <div className="space-y-8 container mx-auto px-4 py-8" data-testid="page-root">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={titleVariants} className="text-center space-y-6">
          <div className="flex items-center justify-center mb-4">
            <motion.div 
              className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl border border-primary/20 shadow-lg"
              whileHover={shouldReduceMotion ? {} : { 
                scale: 1.1, 
                rotate: [0, -10, 10, 0] 
              }}
              transition={{ duration: 0.6 }}
            >
              <Headphones className="h-12 w-12 text-primary" />
            </motion.div>
          </div>
          
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Musique Thérapeutique IA
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez des musiques personnalisées analysées par IA pour optimiser votre bien-être émotionnel
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-primary" />
              <span>1000+ titres premium</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span>Analyse biométrique</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Adaptatif en temps réel</span>
            </div>
          </div>
        </motion.div>

        {/* Current Player */}
        <motion.div variants={titleVariants}>
          <MemoizedPlayer
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            volume={volume}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onVolumeChange={handleVolumeChange}
            onTimeChange={handleTimeChange}
            onToggleLike={handleToggleLike}
            shouldReduceMotion={!!shouldReduceMotion}
          />
        </motion.div>

        {/* Music Categories */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {mockCategories.map((category, index) => (
            <MemoizedCategoryCard
              key={category.id}
              category={category}
              index={index}
              onTrackSelect={handleTrackSelect}
              shouldReduceMotion={!!shouldReduceMotion}
            />
          ))}
        </motion.div>

        {/* AI Recommendations */}
        <motion.div variants={titleVariants}>
          <Card className="p-6 bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5 border border-primary/10">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="flex items-center text-xl">
                <Brain className="h-5 w-5 text-primary mr-2" />
                Recommandations IA Personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-background/50 rounded-xl border border-border/50">
                  <h4 className="font-semibold text-lg mb-2 flex items-center">
                    <Heart className="h-4 w-4 text-red-500 mr-2" />
                    Pour votre humeur actuelle
                  </h4>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Basé sur votre dernière analyse émotionnelle et vos préférences
                  </p>
                  <div className="flex items-center justify-between">
                    <Rating value={4.8} readonly size="sm" showValue />
                    <Button variant="outline" size="sm">
                      <Play className="h-3 w-3 mr-2" />
                      Écouter
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-background/50 rounded-xl border border-border/50">
                  <h4 className="font-semibold text-lg mb-2 flex items-center">
                    <Clock className="h-4 w-4 text-blue-500 mr-2" />
                    Moment de la journée
                  </h4>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Playlist adaptée à votre rythme circadien et activités
                  </p>
                  <div className="flex items-center justify-between">
                    <Rating value={4.6} readonly size="sm" showValue />
                    <Button variant="outline" size="sm">
                      <Radio className="h-3 w-3 mr-2" />
                      Explorer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default memo(MusicPage);