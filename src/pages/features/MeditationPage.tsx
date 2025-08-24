import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Timer, Heart, Brain, 
  Waves, Wind, TreePine, Sun, Moon, Star,
  Volume2, VolumeX, Settings, Award, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MeditationSession {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  instructor: string;
  backgroundColor: string;
  icon: React.ComponentType<any>;
  sounds: string[];
  benefits: string[];
}

interface UserProgress {
  totalMinutes: number;
  sessionsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  badges: string[];
}

const MeditationPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [backgroundSound, setBackgroundSound] = useState('nature');
  const [breathingRate, setBreathingRate] = useState(4);
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const breathingPhaseRef = useRef<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  const [userProgress] = useState<UserProgress>({
    totalMinutes: 1247,
    sessionsCompleted: 89,
    currentStreak: 12,
    longestStreak: 28,
    level: 8,
    badges: ['Premier pas', 'Régulier', 'Concentré', 'Zen Master']
  });

  const meditationSessions: MeditationSession[] = [
    {
      id: '1',
      name: 'Respiration Consciente',
      description: 'Concentrez-vous sur votre respiration pour calmer l\'esprit',
      duration: 10,
      category: 'Respiration',
      difficulty: 'Débutant',
      instructor: 'Marie Dubois',
      backgroundColor: 'from-blue-400 to-cyan-300',
      icon: Wind,
      sounds: ['ocean', 'rain', 'forest'],
      benefits: ['Réduction du stress', 'Amélioration de la concentration', 'Calme mental']
    },
    {
      id: '2',
      name: 'Body Scan Relaxation',
      description: 'Détendez chaque partie de votre corps progressivement',
      duration: 20,
      category: 'Relaxation',
      difficulty: 'Intermédiaire',
      instructor: 'Thomas Martin',
      backgroundColor: 'from-green-400 to-emerald-300',
      icon: Heart,
      sounds: ['birds', 'stream', 'wind'],
      benefits: ['Détente musculaire', 'Réduction des tensions', 'Meilleur sommeil']
    },
    {
      id: '3',
      name: 'Méditation Mindfulness',
      description: 'Développez votre pleine conscience du moment présent',
      duration: 15,
      category: 'Mindfulness',
      difficulty: 'Intermédiaire',
      instructor: 'Sophie Chen',
      backgroundColor: 'from-purple-400 to-pink-300',
      icon: Brain,
      sounds: ['tibetan', 'bells', 'silence'],
      benefits: ['Clarté mentale', 'Présence accrue', 'Réduction de l\'anxiété']
    },
    {
      id: '4',
      name: 'Méditation du Sommeil',
      description: 'Préparez votre esprit pour un sommeil réparateur',
      duration: 30,
      category: 'Sommeil',
      difficulty: 'Débutant',
      instructor: 'Luna Nightingale',
      backgroundColor: 'from-indigo-500 to-purple-400',
      icon: Moon,
      sounds: ['night', 'crickets', 'soft-rain'],
      benefits: ['Endormissement facile', 'Sommeil profond', 'Récupération optimale']
    },
    {
      id: '5',
      name: 'Méditation Énergisante',
      description: 'Réveillez votre énergie intérieure pour commencer la journée',
      duration: 12,
      category: 'Énergie',
      difficulty: 'Avancé',
      instructor: 'Alex Sunrise',
      backgroundColor: 'from-yellow-400 to-orange-300',
      icon: Sun,
      sounds: ['morning-birds', 'flowing-water', 'light-music'],
      benefits: ['Énergie vitale', 'Motivation', 'Clarté d\'esprit']
    }
  ];

  const backgroundSounds = [
    { id: 'nature', name: 'Nature', icon: TreePine },
    { id: 'ocean', name: 'Océan', icon: Waves },
    { id: 'rain', name: 'Pluie', icon: Waves },
    { id: 'silence', name: 'Silence', icon: VolumeX }
  ];

  const startSession = useCallback((session: MeditationSession) => {
    setSelectedSession(session);
    setTotalDuration(session.duration * 60); // Convert to seconds
    setCurrentTime(0);
    setIsPlaying(true);
    setShowBreathingGuide(session.category === 'Respiration');
    
    toast({
      title: "Session démarrée",
      description: `${session.name} - ${session.duration} minutes`,
    });
  }, [toast]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const resetSession = useCallback(() => {
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  // Timer logic
  useEffect(() => {
    if (isPlaying && selectedSession) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            toast({
              title: "Session terminée !",
              description: "Félicitations pour cette méditation complétée",
            });
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, selectedSession, totalDuration, toast]);

  // Breathing guide logic
  useEffect(() => {
    if (showBreathingGuide && isPlaying) {
      const breathingCycle = breathingRate * 1000; // Convert to milliseconds
      const phaseInterval = setInterval(() => {
        setBreathingPhase(prev => {
          switch (prev) {
            case 'inhale': return 'hold';
            case 'hold': return 'exhale';
            case 'exhale': return 'inhale';
            default: return 'inhale';
          }
        });
      }, breathingCycle);

      return () => clearInterval(phaseInterval);
    }
  }, [showBreathingGuide, isPlaying, breathingRate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Inspirez profondément...';
      case 'hold': return 'Retenez votre souffle...';
      case 'exhale': return 'Expirez lentement...';
      default: return 'Respirez naturellement...';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Intermédiaire': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Avancé': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" data-testid="page-root">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/api/placeholder/1920/1080')] opacity-5 bg-cover bg-center" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            🧘‍♀️ Centre de Méditation
          </h1>
          <p className="text-xl text-blue-200 mb-8">
            Trouvez votre paix intérieure à travers la méditation guidée
          </p>

          {/* User Progress Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <Timer className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userProgress.totalMinutes}</div>
                <div className="text-sm text-blue-200">Minutes totales</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userProgress.sessionsCompleted}</div>
                <div className="text-sm text-green-200">Sessions</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <Sparkles className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userProgress.currentStreak}</div>
                <div className="text-sm text-orange-200">Jours consécutifs</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userProgress.level}</div>
                <div className="text-sm text-purple-200">Niveau</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Active Session Player */}
        <AnimatePresence>
          {selectedSession && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className={cn(
                "p-8 backdrop-blur-xl border-0 shadow-2xl bg-gradient-to-br",
                selectedSession.backgroundColor
              )}>
                <div className="text-center space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedSession.name}</h2>
                    <p className="text-white/80 text-lg">{selectedSession.description}</p>
                    <p className="text-white/60 mt-2">Guidé par {selectedSession.instructor}</p>
                  </div>

                  {/* Breathing Guide */}
                  {showBreathingGuide && (
                    <motion.div
                      className="mx-auto"
                      animate={{
                        scale: breathingPhase === 'inhale' ? 1.2 : breathingPhase === 'hold' ? 1.2 : 1
                      }}
                      transition={{ duration: breathingRate, ease: "easeInOut" }}
                    >
                      <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-4">
                        <Wind className="h-16 w-16 text-white" />
                      </div>
                      <p className="text-white text-xl font-medium">{getBreathingInstruction()}</p>
                    </motion.div>
                  )}

                  {/* Progress */}
                  <div className="space-y-3 max-w-md mx-auto">
                    <Progress 
                      value={(currentTime / totalDuration) * 100} 
                      className="h-3 bg-white/20"
                    />
                    <div className="flex justify-between text-white/80 text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(totalDuration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={resetSession}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      size="lg"
                      onClick={togglePlayPause}
                      className="bg-white/20 hover:bg-white/30 text-white w-16 h-16 rounded-full"
                    >
                      {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex items-center justify-center space-x-6 text-white">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="h-5 w-5" />
                      <Slider
                        value={[volume]}
                        onValueChange={(value) => setVolume(value[0])}
                        max={100}
                        step={1}
                        className="w-24"
                      />
                    </div>
                    
                    <Select value={backgroundSound} onValueChange={setBackgroundSound}>
                      <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {backgroundSounds.map(sound => (
                          <SelectItem key={sound.id} value={sound.id}>
                            <div className="flex items-center">
                              <sound.icon className="h-4 w-4 mr-2" />
                              {sound.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Meditation Sessions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Brain className="h-8 w-8 mr-3 text-purple-400" />
            Sessions de Méditation
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meditationSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 backdrop-blur-md hover:border-purple-500/50 transition-all duration-300 group overflow-hidden">
                  <div className={cn("h-2 bg-gradient-to-r", session.backgroundColor)} />
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <session.icon className="h-8 w-8 text-purple-400" />
                      <Badge className={getDifficultyColor(session.difficulty)}>
                        {session.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-xl">{session.name}</CardTitle>
                    <p className="text-gray-300 text-sm">{session.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-400">Durée</div>
                      <div className="text-white font-medium">{session.duration} min</div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-400">Catégorie</div>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                        {session.category}
                      </Badge>
                    </div>
                    
                    <div className="text-sm">
                      <div className="text-gray-400 mb-2">Bénéfices</div>
                      <div className="space-y-1">
                        {session.benefits.slice(0, 2).map((benefit, i) => (
                          <div key={i} className="text-gray-300 text-xs">• {benefit}</div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => startSession(session)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Commencer
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* User Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-yellow-900/60 to-orange-900/60 border-yellow-500/30 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Award className="h-6 w-6 mr-3 text-yellow-400" />
                Vos Badges de Méditation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {userProgress.badges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-300 px-3 py-1"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MeditationPage;