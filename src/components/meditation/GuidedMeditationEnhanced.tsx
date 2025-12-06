import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock, Heart, Download, Sparkles, Volume2, VolumeX, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface Meditation {
  id: string;
  title: string;
  theme: string;
  duration: number;
  script: Array<{ title: string; content: string; duration: number }>;
  benefits: string[];
  difficulty: string;
  completed_count?: number;
  total_duration?: number;
}

export default function GuidedMeditationEnhanced() {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [currentMeditation, setCurrentMeditation] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestSession: 0,
  });

  const themes = [
    { value: 'relaxation', label: 'Relaxation profonde', icon: '🌊' },
    { value: 'stress', label: 'Gestion du stress', icon: '🧘' },
    { value: 'sommeil', label: 'Préparation au sommeil', icon: '😴' },
    { value: 'focus', label: 'Concentration', icon: '🎯' },
    { value: 'gratitude', label: 'Gratitude', icon: '🙏' },
  ];

  const durations = [
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' },
    { value: 900, label: '15 minutes' },
    { value: 1200, label: '20 minutes' },
  ];

  const [selectedTheme, setSelectedTheme] = useState('relaxation');
  const [selectedDuration, setSelectedDuration] = useState(600);
  const [selectedVoice, setSelectedVoice] = useState('alloy');

  useEffect(() => {
    loadMeditations();
    loadStats();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentMeditation) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= currentMeditation.duration) {
            setIsPlaying(false);
            handleMeditationComplete();
            return 0;
          }

          // Calculer la section actuelle
          let accumulated = 0;
          for (let i = 0; i < currentMeditation.script.length; i++) {
            accumulated += currentMeditation.script[i].duration;
            if (newTime < accumulated) {
              setCurrentSection(i);
              break;
            }
          }

          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentMeditation]);

  const loadMeditations = async () => {
    const { data, error } = await supabase
      .from('guided_meditations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      logger.error('Error loading meditations', error, 'UI');
      return;
    }

    setMeditations(data || []);
  };

  const loadStats = async () => {
    // Simuler les stats
    setStats({
      totalSessions: 47,
      totalMinutes: 423,
      currentStreak: 5,
      longestSession: 20,
    });
  };

  const generateMeditation = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('guided-meditation', {
        body: {
          theme: selectedTheme,
          duration: selectedDuration,
          voice: selectedVoice,
          language: 'fr',
          includeAudio: true,
        },
      });

      if (error) throw error;

      toast({
        title: '🧘 Méditation générée',
        description: 'Votre méditation guidée est prête',
      });

      if (data.audioContent) {
        setAudioBase64(data.audioContent);
      }

      await loadMeditations();
      if (data.meditation) {
        setCurrentMeditation(data.meditation);
      }
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!currentMeditation) {
      toast({
        title: 'Aucune méditation sélectionnée',
        description: 'Générez ou sélectionnez une méditation pour commencer',
      });
      return;
    }

    if (audioRef.current && audioBase64) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }

    setIsPlaying(!isPlaying);
  };

  const resetMeditation = () => {
    setCurrentTime(0);
    setCurrentSection(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleMeditationComplete = async () => {
    if (!currentMeditation) return;

    toast({
      title: '✨ Méditation terminée',
      description: 'Bravo pour avoir complété cette session !',
    });

    // Sauvegarder l'analytics
    await supabase.from('meditation_analytics').insert({
      meditation_id: currentMeditation.id,
      action: 'completed',
      duration_seconds: currentMeditation.duration,
    });

    loadStats();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <span className="text-4xl">🧘</span>
            Méditation Guidée
          </h1>
          <p className="text-muted-foreground">
            Pratiques personnalisées pour votre bien-être mental
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sessions totales</p>
                  <p className="text-2xl font-bold">{stats.totalSessions}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Minutes méditées</p>
                  <p className="text-2xl font-bold">{stats.totalMinutes}</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Série actuelle</p>
                  <p className="text-2xl font-bold">{stats.currentStreak} jours</p>
                </div>
                <Award className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Plus longue session</p>
                  <p className="text-2xl font-bold">{stats.longestSession}m</p>
                </div>
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="player" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="player">Méditation</TabsTrigger>
            <TabsTrigger value="generate">Créer</TabsTrigger>
            <TabsTrigger value="library">Bibliothèque</TabsTrigger>
          </TabsList>

          {/* Player */}
          <TabsContent value="player" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentMeditation ? currentMeditation.title : 'Sélectionnez une méditation'}
                </CardTitle>
                {currentMeditation && (
                  <CardDescription>
                    {currentMeditation.theme} • {Math.floor(currentMeditation.duration / 60)} minutes
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Breathing Animation */}
                <div className="relative h-64 flex items-center justify-center">
                  <motion.div
                    animate={isPlaying ? {
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    } : {}}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute w-32 h-32 rounded-full bg-primary/20"
                  />
                  <motion.div
                    animate={isPlaying ? {
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.8, 0.3],
                    } : {}}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute w-40 h-40 rounded-full bg-primary/10"
                  />
                  <div className="relative text-center z-10">
                    <p className="text-4xl font-bold">{formatTime(currentTime)}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {currentMeditation && currentMeditation.script[currentSection]?.title}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <Progress 
                    value={currentMeditation ? (currentTime / currentMeditation.duration) * 100 : 0} 
                    className="h-2" 
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{currentMeditation ? formatTime(currentMeditation.duration) : '0:00'}</span>
                  </div>
                </div>

                {/* Current Section Text */}
                <AnimatePresence mode="wait">
                  {currentMeditation && currentMeditation.script[currentSection] && (
                    <motion.div
                      key={currentSection}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-6 bg-muted/50 rounded-lg text-center"
                    >
                      <p className="text-lg leading-relaxed">
                        {currentMeditation.script[currentSection].content.split('[...]')[0]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="icon" onClick={resetMeditation} aria-label="Réinitialiser la méditation">
                    <RotateCcw className="h-5 w-5" aria-hidden="true" />
                  </Button>
                  <Button size="lg" onClick={togglePlay} className="h-16 w-16 rounded-full" aria-label={isPlaying ? "Mettre en pause" : "Démarrer"}>
                    {isPlaying ? <Pause className="h-8 w-8" aria-hidden="true" /> : <Play className="h-8 w-8 ml-1" aria-hidden="true" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setIsMuted(!isMuted)} aria-label={isMuted ? "Activer le son" : "Couper le son"}>
                    {isMuted ? <VolumeX className="h-5 w-5" aria-hidden="true" /> : <Volume2 className="h-5 w-5" aria-hidden="true" />}
                  </Button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-4">
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12">{volume[0]}%</span>
                </div>

                {/* Benefits */}
                {currentMeditation && (
                  <div className="pt-4 border-t space-y-3">
                    <p className="text-sm font-medium">Bienfaits:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentMeditation.benefits.map((benefit, i) => (
                        <Badge key={i} variant="secondary">{benefit}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hidden audio element */}
            {audioBase64 && (
              <audio
                ref={audioRef}
                src={`data:audio/mp3;base64,${audioBase64}`}
                onEnded={handleMeditationComplete}
              />
            )}
          </TabsContent>

          {/* Generate */}
          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Créer une méditation personnalisée</CardTitle>
                <CardDescription>Générez une méditation adaptée à vos besoins</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Thème</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {themes.map((theme) => (
                      <Button
                        key={theme.value}
                        variant={selectedTheme === theme.value ? 'default' : 'outline'}
                        onClick={() => setSelectedTheme(theme.value)}
                        className="h-auto flex-col gap-2 p-4"
                      >
                        <span className="text-2xl">{theme.icon}</span>
                        <span className="text-sm">{theme.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Durée</label>
                  <Select value={selectedDuration.toString()} onValueChange={(v) => setSelectedDuration(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((d) => (
                        <SelectItem key={d.value} value={d.value.toString()}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Voix</label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alloy">Alloy (Neutre)</SelectItem>
                      <SelectItem value="echo">Echo (Masculine)</SelectItem>
                      <SelectItem value="nova">Nova (Féminine)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateMeditation}
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Générer la méditation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Library */}
          <TabsContent value="library" className="space-y-6">
            <div className="grid gap-4">
              {meditations.map((meditation) => (
                <motion.div
                  key={meditation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4 flex-1">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setCurrentMeditation(meditation);
                            resetMeditation();
                          }}
                          aria-label={`Lancer la méditation ${meditation.title}`}
                        >
                          <Play className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <div className="flex-1">
                          <p className="font-medium">{meditation.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{meditation.theme}</Badge>
                            <Badge variant="outline">{Math.floor(meditation.duration / 60)}min</Badge>
                            <Badge variant="outline">{meditation.difficulty}</Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" aria-label={`Télécharger ${meditation.title}`}>
                        <Download className="h-5 w-5" aria-hidden="true" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
