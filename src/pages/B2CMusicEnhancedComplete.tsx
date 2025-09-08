import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Heart, 
  Share2, 
  Download,
  Music2,
  Waves,
  Brain,
  Zap,
  Headphones,
  Activity,
  Target,
  TrendingUp,
  Star,
  Clock,
  Users
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  genre: string;
  mood: 'calm' | 'energizing' | 'focus' | 'sleep' | 'anxiety-relief' | 'motivation';
  bpm: number;
  key: string;
  therapyType: string[];
  cover: string;
  audioUrl: string;
  isAiGenerated: boolean;
  biometricOptimized: boolean;
}

interface BiometricData {
  heartRate: number;
  stressLevel: number;
  focusScore: number;
  energyLevel: number;
}

export default function B2CMusicEnhancedComplete() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRate: 72,
    stressLevel: 35,
    focusScore: 78,
    energyLevel: 65
  });
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const tracks: Track[] = [
    {
      id: '1',
      title: 'Océan Serein',
      artist: 'IA Thérapeutique',
      duration: '8:30',
      genre: 'Ambient',
      mood: 'calm',
      bpm: 60,
      key: 'C Major',
      therapyType: ['Relaxation', 'Anxiété', 'Sommeil'],
      cover: '/placeholder.svg',
      audioUrl: '/audio/ocean-serein.mp3',
      isAiGenerated: true,
      biometricOptimized: true
    },
    {
      id: '2',
      title: 'Focus Flow',
      artist: 'Émotions Care',
      duration: '12:15',
      genre: 'Neurofeedback',
      mood: 'focus',
      bpm: 72,
      key: 'A Minor',
      therapyType: ['Concentration', 'Productivité'],
      cover: '/placeholder.svg',
      audioUrl: '/audio/focus-flow.mp3',
      isAiGenerated: true,
      biometricOptimized: true
    },
    {
      id: '3',
      title: 'Réveil Énergisant',
      artist: 'IA Motivation',
      duration: '6:45',
      genre: 'Motivational',
      mood: 'energizing',
      bpm: 120,
      key: 'E Major',
      therapyType: ['Énergie', 'Motivation', 'Éveil'],
      cover: '/placeholder.svg',
      audioUrl: '/audio/reveil-energisant.mp3',
      isAiGenerated: true,
      biometricOptimized: true
    }
  ];

  const moods = [
    { id: 'all', label: 'Tout', icon: Music2, color: 'hsl(var(--primary))' },
    { id: 'calm', label: 'Calme', icon: Waves, color: 'hsl(142 76% 36%)' },
    { id: 'focus', label: 'Focus', icon: Target, color: 'hsl(221.2 83.2% 53.3%)' },
    { id: 'energizing', label: 'Énergie', icon: Zap, color: 'hsl(45 93% 47%)' },
    { id: 'sleep', label: 'Sommeil', icon: Clock, color: 'hsl(250 100% 60%)' },
    { id: 'anxiety-relief', label: 'Anti-stress', icon: Heart, color: 'hsl(0 84.2% 60.2%)' }
  ];

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Simulated biometric updates
  useEffect(() => {
    if (isPlaying && adaptiveMode) {
      const interval = setInterval(() => {
        setBiometrics(prev => ({
          heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)),
          stressLevel: Math.max(0, Math.min(100, prev.stressLevel + (Math.random() - 0.7) * 5)),
          focusScore: Math.max(0, Math.min(100, prev.focusScore + (Math.random() - 0.3) * 3)),
          energyLevel: Math.max(0, Math.min(100, prev.energyLevel + (Math.random() - 0.4) * 4))
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, adaptiveMode]);

  // Progress simulation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => (prev + 1) % 100);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const filteredTracks = selectedMood === 'all' 
    ? tracks 
    : tracks.filter(track => track.mood === selectedMood);

  const handlePlay = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // Audio implementation would go here
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBiometricStatus = (value: number, type: 'stress' | 'focus' | 'energy' | 'hr') => {
    if (type === 'stress') {
      return value < 30 ? 'excellent' : value < 60 ? 'good' : 'needs-attention';
    }
    if (type === 'focus' || type === 'energy') {
      return value > 70 ? 'excellent' : value > 40 ? 'good' : 'needs-attention';
    }
    if (type === 'hr') {
      return value >= 60 && value <= 90 ? 'excellent' : 'good';
    }
    return 'good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'hsl(142 76% 36%)';
      case 'good': return 'hsl(45 93% 47%)';
      case 'needs-attention': return 'hsl(0 84.2% 60.2%)';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-primary/10 backdrop-blur-sm">
              <Headphones className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Thérapie Musicale IA
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Musique thérapeutique personnalisée avec adaptation biométrique temps réel
          </p>
          
          {/* Session Stats */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>Session: {formatTime(sessionTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>12.4k utilisateurs actifs</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-primary" />
              <span>98% efficacité</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Track Player */}
            <motion.div
              layout
              className="premium-card p-8"
            >
              {currentTrack ? (
                <div className="space-y-6">
                  {/* Track Info */}
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <img 
                        src={currentTrack.cover} 
                        alt={`${currentTrack.title} cover`}
                        className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                      />
                      {currentTrack.isAiGenerated && (
                        <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500">
                          <Brain className="h-3 w-3 mr-1" />
                          IA
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <h3 className="text-2xl font-bold">{currentTrack.title}</h3>
                      <p className="text-lg text-muted-foreground">{currentTrack.artist}</p>
                      
                      {/* Track Properties */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant="outline">{currentTrack.bpm} BPM</Badge>
                        <Badge variant="outline">{currentTrack.key}</Badge>
                        <Badge variant="outline">{currentTrack.genre}</Badge>
                        {currentTrack.biometricOptimized && (
                          <Badge className="bg-green-500">
                            <Activity className="h-3 w-3 mr-1" />
                            Biométrie
                          </Badge>
                        )}
                      </div>

                      {/* Therapy Types */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {currentTrack.therapyType.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Slider
                      value={[progress]}
                      onValueChange={([value]) => setProgress(value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatTime(Math.floor(progress * 8.5))}</span>
                      <span>{currentTrack.duration}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-6">
                    <Button size="lg" variant="outline" className="rounded-full p-4">
                      <SkipBack className="h-6 w-6" />
                    </Button>
                    
                    <Button 
                      size="lg" 
                      onClick={togglePlayPause}
                      className="rounded-full p-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                    >
                      {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                    </Button>
                    
                    <Button size="lg" variant="outline" className="rounded-full p-4">
                      <SkipForward className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      onValueChange={([value]) => {
                        setVolume(value);
                        if (value > 0) setIsMuted(false);
                      }}
                      max={100}
                      step={1}
                      className="flex-1 max-w-xs"
                    />
                    <span className="text-sm text-muted-foreground min-w-[3ch]">
                      {isMuted ? 0 : volume}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <Music2 className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="text-xl text-muted-foreground">
                    Sélectionnez une piste pour commencer votre session thérapeutique
                  </p>
                </div>
              )}
            </motion.div>

            {/* Mood Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="premium-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Sélectionner l'ambiance</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {moods.map((mood) => {
                  const Icon = mood.icon;
                  return (
                    <Button
                      key={mood.id}
                      variant={selectedMood === mood.id ? "default" : "outline"}
                      onClick={() => setSelectedMood(mood.id)}
                      className="flex-col h-auto py-4 gap-2"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{mood.label}</span>
                    </Button>
                  );
                })}
              </div>
            </motion.div>

            {/* Track List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="premium-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Bibliothèque Thérapeutique</h3>
                <Badge variant="outline">
                  {filteredTracks.length} pistes disponibles
                </Badge>
              </div>

              <ScrollArea className="h-96">
                <div className="space-y-3">
                  <AnimatePresence mode="sync">
                    {filteredTracks.map((track, index) => (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:bg-accent/50 ${
                          currentTrack?.id === track.id ? 'bg-primary/10 border-primary' : 'bg-card'
                        }`}
                        onClick={() => handlePlay(track)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img 
                              src={track.cover} 
                              alt={`${track.title} cover`}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            {track.isAiGenerated && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                <Brain className="h-2 w-2 text-white" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{track.title}</h4>
                            <p className="text-sm text-muted-foreground">{track.artist}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {track.bpm} BPM
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {track.mood}
                              </Badge>
                              {track.biometricOptimized && (
                                <Badge className="text-xs bg-green-500">
                                  Bio
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span className="text-sm text-muted-foreground">{track.duration}</span>
                            <Button size="sm" variant="ghost" className="rounded-full p-2">
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </motion.div>
          </div>

          {/* Sidebar - Biometrics & Controls */}
          <div className="space-y-6">
            {/* Adaptive Mode Toggle */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="premium-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Mode Adaptatif</h3>
                <Button
                  variant={adaptiveMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAdaptiveMode(!adaptiveMode)}
                >
                  {adaptiveMode ? "Actif" : "Inactif"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                La musique s'adapte automatiquement à vos données biométriques pour optimiser l'efficacité thérapeutique.
              </p>
            </motion.div>

            {/* Biometric Monitoring */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="premium-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Monitoring Biométrique</h3>
              </div>

              <div className="space-y-4">
                {/* Heart Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fréquence Cardiaque</span>
                    <Badge style={{ backgroundColor: getStatusColor(getBiometricStatus(biometrics.heartRate, 'hr')) }}>
                      {biometrics.heartRate} BPM
                    </Badge>
                  </div>
                </div>

                {/* Stress Level */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Niveau de Stress</span>
                    <Badge style={{ backgroundColor: getStatusColor(getBiometricStatus(biometrics.stressLevel, 'stress')) }}>
                      {Math.round(biometrics.stressLevel)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${biometrics.stressLevel}%`,
                        backgroundColor: getStatusColor(getBiometricStatus(biometrics.stressLevel, 'stress'))
                      }}
                    />
                  </div>
                </div>

                {/* Focus Score */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Score de Concentration</span>
                    <Badge style={{ backgroundColor: getStatusColor(getBiometricStatus(biometrics.focusScore, 'focus')) }}>
                      {Math.round(biometrics.focusScore)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${biometrics.focusScore}%`,
                        backgroundColor: getStatusColor(getBiometricStatus(biometrics.focusScore, 'focus'))
                      }}
                    />
                  </div>
                </div>

                {/* Energy Level */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Niveau d'Énergie</span>
                    <Badge style={{ backgroundColor: getStatusColor(getBiometricStatus(biometrics.energyLevel, 'energy')) }}>
                      {Math.round(biometrics.energyLevel)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${biometrics.energyLevel}%`,
                        backgroundColor: getStatusColor(getBiometricStatus(biometrics.energyLevel, 'energy'))
                      }}
                    />
                  </div>
                </div>
              </div>

              {adaptiveMode && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Adaptation en cours...
                    </span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    La musique s'ajuste à vos métriques pour optimiser l'effet thérapeutique.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Session Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="premium-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Insights de Session</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Durée de session</span>
                  <span className="font-medium">{formatTime(sessionTime)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Réduction de stress</span>
                  <span className="font-medium text-green-600">-15%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Amélioration focus</span>
                  <span className="font-medium text-blue-600">+22%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Efficacité globale</span>
                  <span className="font-medium text-purple-600">94%</span>
                </div>
              </div>

              <Button className="w-full mt-4" variant="outline">
                Voir le rapport complet
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Audio Element (hidden) */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => {
          if (currentTrack) {
            const audio = e.currentTarget;
            const progress = (audio.currentTime / audio.duration) * 100;
            setProgress(progress);
          }
        }}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}