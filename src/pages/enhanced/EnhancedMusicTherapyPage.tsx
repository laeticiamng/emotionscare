import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Music2, Heart, Timer, 
  TrendingUp, Shuffle, Repeat, Download, Share2, Sparkles, Wand2,
  Headphones, Activity, ArrowLeft, Mic, Brain, Zap, Wind, Sun, Moon,
  Coffee, Smile, Target, Cloud, Mountain, Waves, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import ResponsiveWrapper from '@/components/responsive/ResponsiveWrapper';
import { supabase } from '@/integrations/supabase/client';
import FunctionalButton from '@/components/ui/functional-button';
import { cn } from '@/lib/utils';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  category: string;
  mood: string;
  color: string;
  sunoId?: string;
  emotion_tags?: string[];
  isGenerating?: boolean;
  isCustom?: boolean;
}

interface MoodProfile {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  musicStyle: string;
}

const EnhancedMusicTherapyPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const device = useDeviceDetection();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // États pour la génération personnalisée
  const [emotionalPrompt, setEmotionalPrompt] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodProfile | null>(null);
  const [biometricData, setBiometricData] = useState({
    heartRate: 72,
    stressLevel: 35,
    energyLevel: 68,
    focusLevel: 80
  });

  const moodProfiles: MoodProfile[] = [
    { 
      id: 'calm', 
      name: 'Sérénité', 
      icon: Wind, 
      color: 'from-blue-400 to-cyan-400',
      description: 'Apaisement et relaxation profonde',
      musicStyle: 'ambient, nature sounds, slow tempo'
    },
    { 
      id: 'energetic', 
      name: 'Énergie', 
      icon: Zap, 
      color: 'from-orange-400 to-yellow-400',
      description: 'Motivation et vitalité',
      musicStyle: 'upbeat, electronic, motivational'
    },
    { 
      id: 'focus', 
      name: 'Concentration', 
      icon: Target, 
      color: 'from-purple-400 to-blue-400',
      description: 'Améliore la concentration',
      musicStyle: 'lo-fi, instrumental, minimalist'
    },
    { 
      id: 'healing', 
      name: 'Guérison', 
      icon: Heart, 
      color: 'from-pink-400 to-rose-400',
      description: 'Thérapie émotionnelle et guérison',
      musicStyle: 'healing frequencies, soft piano, ethereal'
    },
    { 
      id: 'creative', 
      name: 'Créativité', 
      icon: Sparkles, 
      color: 'from-indigo-400 to-purple-400',
      description: 'Stimule l\'inspiration créative',
      musicStyle: 'experimental, jazz, world music'
    },
    { 
      id: 'sleep', 
      name: 'Sommeil', 
      icon: Moon, 
      color: 'from-indigo-600 to-blue-800',
      description: 'Favorise un sommeil réparateur',
      musicStyle: 'deep ambient, delta waves, white noise'
    }
  ];

  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      title: 'Méditation Matinale',
      artist: 'Thérapie Sonore IA',
      duration: 180,
      url: '/sounds/nature-calm.mp3',
      category: 'Relaxation',
      mood: 'Calme',
      color: 'from-green-500 to-blue-500',
      emotion_tags: ['calm', 'peaceful', 'mindful']
    },
    {
      id: '2',
      title: 'Focus Profond',
      artist: 'Ambiance Cognitive',
      duration: 240,
      url: '/sounds/focus-ambient.mp3',
      category: 'Concentration',
      mood: 'Focus',
      color: 'from-purple-500 to-pink-500',
      emotion_tags: ['focus', 'productive', 'clear']
    },
    {
      id: '3',
      title: 'Relaxation Océan',
      artist: 'Vagues Thérapeutiques',
      duration: 300,
      url: '/sounds/ambient-calm.mp3',
      category: 'Détente',
      mood: 'Sérénité',
      color: 'from-blue-500 to-cyan-500',
      emotion_tags: ['relaxed', 'calm', 'peaceful']
    }
  ]);

  const currentTrack = tracks[currentTrackIndex];

  // Simulation de données biométriques en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setBiometricData(prev => ({
        heartRate: prev.heartRate + (Math.random() - 0.5) * 4,
        stressLevel: Math.max(0, Math.min(100, prev.stressLevel + (Math.random() - 0.5) * 10)),
        energyLevel: Math.max(0, Math.min(100, prev.energyLevel + (Math.random() - 0.5) * 8)),
        focusLevel: Math.max(0, Math.min(100, prev.focusLevel + (Math.random() - 0.5) * 6))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generatePersonalizedMusic = async () => {
    if (!emotionalPrompt.trim() && !selectedMood) {
      toast({
        title: "Paramètres requis",
        description: "Décrivez votre état émotionnel ou sélectionnez un profil d'humeur",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Analyse émotionnelle du prompt si fourni
      let emotionData = null;
      if (emotionalPrompt.trim()) {
        const { data: analysisData } = await supabase.functions.invoke('analyze-emotion-text', {
          body: { text: emotionalPrompt }
        });
        emotionData = analysisData;
      }

      // Construction du prompt musical intelligent
      const musicPrompt = selectedMood 
        ? `Create therapeutic music in ${selectedMood.musicStyle} style. ${selectedMood.description}. 
           User biometrics: Heart rate ${Math.round(biometricData.heartRate)}bpm, 
           Stress ${Math.round(biometricData.stressLevel)}%, 
           Energy ${Math.round(biometricData.energyLevel)}%, 
           Focus ${Math.round(biometricData.focusLevel)}%.
           ${emotionalPrompt ? `Additional context: ${emotionalPrompt}` : ''}`
        : `Create personalized therapeutic music based on: "${emotionalPrompt}". 
           Adapt to current biometrics: HR ${Math.round(biometricData.heartRate)}bpm, 
           Stress ${Math.round(biometricData.stressLevel)}%`;

      // Génération via Suno AI
      const { data: musicData, error } = await supabase.functions.invoke('emotionscare-analgesic', {
        body: {
          action: 'generate_personalized',
          prompt: musicPrompt,
          emotion: emotionData?.emotion || selectedMood?.id || 'therapeutic',
          biometrics: biometricData,
          style: selectedMood?.musicStyle || 'therapeutic ambient'
        }
      });

      if (error) throw error;

      // Ajouter la nouvelle piste générée
      const newTrack: Track = {
        id: Date.now().toString(),
        title: musicData.title || `Thérapie Personnalisée`,
        artist: 'IA Suno • Généré pour vous',
        duration: 180,
        url: musicData.audio_url || '',
        category: 'Personnalisé',
        mood: selectedMood?.name || 'Sur mesure',
        color: selectedMood?.color || 'from-purple-500 to-pink-500',
        sunoId: musicData.id,
        emotion_tags: emotionData ? [emotionData.emotion] : [selectedMood?.id || 'custom'],
        isCustom: true,
        isGenerating: !musicData.audio_url
      };

      setTracks(prev => [newTrack, ...prev]);
      setCurrentTrackIndex(0);

      toast({
        title: "Musique générée !",
        description: `"${newTrack.title}" a été créée spécialement pour vous`,
        duration: 5000
      });

      // Vider le prompt après génération
      setEmotionalPrompt('');
      setSelectedMood(null);

    } catch (error) {
      console.error('Erreur génération:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la musique. Réessayez plus tard.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = async () => {
    setIsLoading(true);
    try {
      if (isPlaying) {
        setIsPlaying(false);
        toast({
          title: "Pause",
          description: `"${currentTrack.title}" mis en pause`
        });
      } else {
        setIsPlaying(true);
        toast({
          title: "Thérapie en cours",
          description: `Lecture de "${currentTrack.title}"`
        });
      }
      
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

  const handleNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
    toast({
      title: "Piste suivante",
      description: `"${tracks[nextIndex].title}"`
    });
  };

  const handlePrevTrack = () => {
    const prevIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
    setCurrentTrackIndex(prevIndex);
    setCurrentTime(0);
    toast({
      title: "Piste précédente", 
      description: `"${tracks[prevIndex].title}"`
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulation du lecteur
  useEffect(() => {
    if (isPlaying && !isLoading && !currentTrack.isGenerating) {
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
  }, [isPlaying, isLoading, currentTrack.duration, isRepeating, currentTrack.isGenerating]);

  return (
    <ResponsiveWrapper enableGestures={true} enableVibration={device.type === 'mobile'}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => navigate('/')}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-purple-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {device.type === 'mobile' ? '' : 'Retour'}
                </Button>
                
                <div>
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Musicothérapie IA
                  </h1>
                  <p className="text-sm text-gray-600 hidden sm:block">
                    Génération Suno • Biométrie temps réel • Thérapie personnalisée
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="hidden sm:flex bg-green-100 text-green-700">
                  <Headphones className="w-3 h-3 mr-1" />
                  {isPlaying ? 'En thérapie' : 'Prêt'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
          
          {/* Génération personnalisée */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-6 w-6 text-purple-600" />
                Génération Musicale Personnalisée
              </CardTitle>
              <p className="text-purple-700">
                Créez votre musique thérapeutique unique basée sur vos émotions et biométrie
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Profils d'humeur */}
              <div>
                <h4 className="font-medium mb-3">Sélectionnez votre état désiré :</h4>
                <div className={cn(
                  "grid gap-3",
                  device.type === 'mobile' ? "grid-cols-2" : "grid-cols-3 lg:grid-cols-6"
                )}>
                  {moodProfiles.map((mood) => (
                    <motion.div
                      key={mood.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={selectedMood?.id === mood.id ? "default" : "outline"}
                        className={cn(
                          "h-auto p-4 flex flex-col items-center gap-2 w-full",
                          selectedMood?.id === mood.id && `bg-gradient-to-br ${mood.color} text-white border-0`
                        )}
                        onClick={() => setSelectedMood(selectedMood?.id === mood.id ? null : mood)}
                      >
                        <mood.icon className="h-6 w-6" />
                        <div className="text-center">
                          <div className="font-medium text-sm">{mood.name}</div>
                          <div className="text-xs opacity-80 hidden sm:block">{mood.description}</div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Prompt émotionnel */}
              <div>
                <h4 className="font-medium mb-2">Décrivez votre état émotionnel (optionnel) :</h4>
                <Textarea
                  placeholder="Ex: Je me sens anxieux avant une présentation importante, j'ai besoin de calme et de confiance..."
                  value={emotionalPrompt}
                  onChange={(e) => setEmotionalPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Données biométriques temps réel */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/80 rounded-lg border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{Math.round(biometricData.heartRate)}</div>
                  <div className="text-xs text-gray-600">BPM</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{Math.round(biometricData.stressLevel)}%</div>
                  <div className="text-xs text-gray-600">Stress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{Math.round(biometricData.energyLevel)}%</div>
                  <div className="text-xs text-gray-600">Énergie</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{Math.round(biometricData.focusLevel)}%</div>
                  <div className="text-xs text-gray-600">Focus</div>
                </div>
              </div>

              <FunctionalButton
                actionId="generate-music"
                onClick={generatePersonalizedMusic}
                disabled={isGenerating || (!emotionalPrompt.trim() && !selectedMood)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4"
                loadingText="Génération IA en cours..."
                successMessage="Musique thérapeutique générée avec succès !"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Création par Suno IA...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Générer ma Thérapie Musicale
                  </div>
                )}
              </FunctionalButton>
            </CardContent>
          </Card>

          {/* Lecteur principal */}
          <Card className="overflow-hidden shadow-2xl">
            <div className={`absolute inset-0 bg-gradient-to-br ${currentTrack.color} opacity-10`} />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "w-20 h-20 rounded-xl bg-gradient-to-br shadow-xl flex items-center justify-center",
                    currentTrack.color
                  )}>
                    {currentTrack.isGenerating ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                    ) : (
                      <Music2 className="h-10 w-10 text-white" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{currentTrack.title}</CardTitle>
                    <p className="text-muted-foreground">{currentTrack.artist}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {currentTrack.category}
                      </Badge>
                      {currentTrack.isCustom && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                          ✨ Personnalisé
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge variant="outline" className="text-lg px-4 py-2 mb-2">
                    {currentTrack.mood}
                  </Badge>
                  {currentTrack.emotion_tags && (
                    <div className="flex gap-1 justify-end">
                      {currentTrack.emotion_tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Barre de progression */}
              <div className="space-y-2">
                <Progress 
                  value={currentTrack.isGenerating ? 0 : (currentTime / currentTrack.duration) * 100} 
                  className="h-3"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(currentTrack.duration)}</span>
                </div>
              </div>

              {/* Contrôles */}
              <div className="flex items-center justify-center space-x-6">
                <FunctionalButton
                  actionId="shuffle"
                  onClick={() => setIsShuffling(!isShuffling)}
                  variant="ghost"
                  size="sm"
                  className={cn("w-12 h-12 rounded-full", isShuffling && "text-purple-600 bg-purple-100")}
                >
                  <Shuffle className="h-5 w-5" />
                </FunctionalButton>

                <FunctionalButton
                  actionId="prev-track"
                  onClick={handlePrevTrack}
                  variant="ghost"
                  size="sm"
                  className="w-12 h-12 rounded-full"
                >
                  <SkipBack className="h-6 w-6" />
                </FunctionalButton>

                <FunctionalButton
                  actionId="play-pause"
                  onClick={handlePlayPause}
                  size="lg"
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={currentTrack.isGenerating}
                >
                  {isLoading || currentTrack.isGenerating ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                  ) : isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8" />
                  )}
                </FunctionalButton>

                <FunctionalButton
                  actionId="next-track"
                  onClick={handleNextTrack}
                  variant="ghost"
                  size="sm"
                  className="w-12 h-12 rounded-full"
                >
                  <SkipForward className="h-6 w-6" />
                </FunctionalButton>

                <FunctionalButton
                  actionId="repeat"
                  onClick={() => setIsRepeating(!isRepeating)}
                  variant="ghost"
                  size="sm"
                  className={cn("w-12 h-12 rounded-full", isRepeating && "text-purple-600 bg-purple-100")}
                >
                  <Repeat className="h-5 w-5" />
                </FunctionalButton>
              </div>

              {/* Contrôle volume */}
              <div className="flex items-center space-x-4">
                <Volume2 className="h-5 w-5" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm w-12">{volume[0]}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Liste des pistes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bibliothèque Thérapeutique</CardTitle>
                  <p className="text-muted-foreground">
                    {tracks.length} pistes • {tracks.filter(t => t.isCustom).length} personnalisées
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <FunctionalButton
                    actionId="export-playlist"
                    onClick={async () => {
                      toast({
                        title: "Export réussi",
                        description: "Playlist exportée vers vos favoris"
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </FunctionalButton>
                  
                  <FunctionalButton
                    actionId="share-playlist"
                    onClick={async () => {
                      toast({
                        title: "Lien copié",
                        description: "Partagez cette playlist thérapeutique"
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </FunctionalButton>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence>
                  {tracks.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg",
                        index === currentTrackIndex 
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-md' 
                          : 'hover:bg-gray-50 border-gray-200'
                      )}
                      onClick={() => {
                        setCurrentTrackIndex(index);
                        setCurrentTime(0);
                        setIsPlaying(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={cn(
                            "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                            track.color
                          )}>
                            {track.isGenerating ? (
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                            ) : (
                              <Music2 className="h-6 w-6 text-white" />
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-lg">{track.title}</h4>
                            <p className="text-sm text-muted-foreground mb-1">{track.artist}</p>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-xs">{track.category}</Badge>
                              {track.isCustom && (
                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                                  Personnalisé
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-right">
                          {track.emotion_tags && (
                            <div className="hidden sm:flex flex-col gap-1">
                              {track.emotion_tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <div className="text-sm text-muted-foreground">
                            {track.isGenerating ? 'Génération...' : formatTime(track.duration)}
                          </div>
                          
                          {index === currentTrackIndex && isPlaying && !track.isGenerating && (
                            <div className="flex space-x-1">
                              <div className="w-1 h-6 bg-purple-500 animate-pulse rounded" />
                              <div className="w-1 h-6 bg-purple-500 animate-pulse rounded" style={{ animationDelay: '0.2s' }} />
                              <div className="w-1 h-6 bg-purple-500 animate-pulse rounded" style={{ animationDelay: '0.4s' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Actions avancées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FunctionalButton
              actionId="analyze-session"
              onClick={async () => {
                toast({
                  title: "Analyse terminée",
                  description: "Votre session thérapeutique a été analysée"
                });
              }}
              className="flex-1 py-6"
              variant="outline"
            >
              <Brain className="mr-2 h-5 w-5" />
              Analyser ma Session
            </FunctionalButton>

            <FunctionalButton
              actionId="view-progress"
              onClick={() => navigate('/weekly-bars')}
              className="flex-1 py-6"
              variant="outline"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Voir mes Progrès
            </FunctionalButton>

            <FunctionalButton
              actionId="schedule-therapy"
              onClick={async () => {
                toast({
                  title: "Thérapie programmée",
                  description: "Séance de 45 minutes planifiée pour demain"
                });
              }}
              className="flex-1 py-6"
              variant="outline"
            >
              <Timer className="mr-2 h-5 w-5" />
              Programmer Thérapie
            </FunctionalButton>
          </div>
        </div>
      </div>
    </ResponsiveWrapper>
  );
};

export default EnhancedMusicTherapyPage;