
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Clock,
  Leaf,
  Heart,
  Brain,
  Waves,
  Sun,
  Moon,
  Wind,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: 'breathing' | 'mindfulness' | 'visualization' | 'mantra' | 'body-scan';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  icon: React.ReactElement;
  benefits: string[];
  audioUrl?: string;
}

const MeditationPage: React.FC = () => {
  const [activeSession, setActiveSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  const meditationSessions: MeditationSession[] = [
    {
      id: '1',
      title: 'Respiration Consciente',
      description: 'Technique de respiration 4-7-8 pour la relaxation profonde',
      duration: 10,
      type: 'breathing',
      difficulty: 'beginner',
      instructor: 'Marie Dubois',
      icon: <Wind className="h-8 w-8" />,
      benefits: ['Réduction du stress', 'Amélioration du sommeil', 'Clarté mentale']
    },
    {
      id: '2',
      title: 'Pleine Conscience du Moment',
      description: 'Méditation mindfulness pour ancrer votre attention dans le présent',
      duration: 15,
      type: 'mindfulness',
      difficulty: 'beginner',
      instructor: 'Jean Martin',
      icon: <Leaf className="h-8 w-8" />,
      benefits: ['Présence accrue', 'Réduction de l\'anxiété', 'Paix intérieure']
    },
    {
      id: '3',
      title: 'Visualisation Océan',
      description: 'Voyage mental au bord d\'un océan calme et ressourçant',
      duration: 20,
      type: 'visualization',
      difficulty: 'intermediate',
      instructor: 'Sophie Laurent',
      icon: <Waves className="h-8 w-8" />,
      benefits: ['Relaxation profonde', 'Créativité stimulée', 'Évasion mentale']
    },
    {
      id: '4',
      title: 'Mantra de Gratitude',
      description: 'Répétition de mantras pour cultiver la reconnaissance',
      duration: 12,
      type: 'mantra',
      difficulty: 'beginner',
      instructor: 'Luc Moreau',
      icon: <Heart className="h-8 w-8" />,
      benefits: ['Attitude positive', 'Bonheur accru', 'Connexion spirituelle']
    },
    {
      id: '5',
      title: 'Scan Corporel Complet',
      description: 'Exploration consciente de chaque partie de votre corps',
      duration: 25,
      type: 'body-scan',
      difficulty: 'intermediate',
      instructor: 'Anne Petit',
      icon: <Sparkles className="h-8 w-8" />,
      benefits: ['Conscience corporelle', 'Relâchement des tensions', 'Ancrage']
    },
    {
      id: '6',
      title: 'Méditation Matinale',
      description: 'Commencez votre journée avec intention et énergie positive',
      duration: 8,
      type: 'mindfulness',
      difficulty: 'beginner',
      instructor: 'Paul Durand',
      icon: <Sun className="h-8 w-8" />,
      benefits: ['Énergie matinale', 'Intention claire', 'Motivation quotidienne']
    },
    {
      id: '7',
      title: 'Relaxation Nocturne',
      description: 'Préparation douce pour un sommeil réparateur',
      duration: 18,
      type: 'visualization',
      difficulty: 'beginner',
      instructor: 'Claire Rousseau',
      icon: <Moon className="h-8 w-8" />,
      benefits: ['Qualité du sommeil', 'Détente musculaire', 'Esprit apaisé']
    },
    {
      id: '8',
      title: 'Focus Mental Avancé',
      description: 'Développement de la concentration et de la clarté mentale',
      duration: 30,
      type: 'mindfulness',
      difficulty: 'advanced',
      instructor: 'Marc Bernard',
      icon: <Brain className="h-8 w-8" />,
      benefits: ['Concentration accrue', 'Productivité améliorée', 'Maîtrise mentale']
    }
  ];

  const typeColors = {
    breathing: 'bg-blue-100 text-blue-800',
    mindfulness: 'bg-green-100 text-green-800',
    visualization: 'bg-purple-100 text-purple-800',
    mantra: 'bg-orange-100 text-orange-800',
    'body-scan': 'bg-pink-100 text-pink-800'
  };

  const difficultyColors = {
    beginner: 'bg-gray-100 text-gray-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeSession) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= activeSession.duration * 60) {
            setIsPlaying(false);
            toast.success('Session de méditation terminée ! 🧘‍♀️');
            return activeSession.duration * 60;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeSession]);

  // Breathing pattern for breathing meditations
  useEffect(() => {
    if (activeSession?.type === 'breathing' && isPlaying) {
      const breathingCycle = () => {
        setBreathingPhase('inhale');
        setTimeout(() => setBreathingPhase('hold'), 4000);
        setTimeout(() => setBreathingPhase('exhale'), 11000);
        setTimeout(() => setBreathingPhase('inhale'), 19000);
      };
      
      breathingCycle();
      const interval = setInterval(breathingCycle, 19000);
      return () => clearInterval(interval);
    }
  }, [activeSession, isPlaying]);

  const startSession = (session: MeditationSession) => {
    setActiveSession(session);
    setCurrentTime(0);
    setIsPlaying(true);
    toast.success(`Session "${session.title}" commencée`);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast.info(isPlaying ? 'Session en pause' : 'Session reprise');
  };

  const stopSession = () => {
    setActiveSession(null);
    setIsPlaying(false);
    setCurrentTime(0);
    toast.info('Session arrêtée');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingInstructions = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Inspirez lentement par le nez (4 sec)';
      case 'hold':
        return 'Retenez votre souffle (7 sec)';
      case 'exhale':
        return 'Expirez lentement par la bouche (8 sec)';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Méditation Guidée
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez la paix intérieure avec nos sessions de méditation guidée. 
            Cultivez la pleine conscience et le bien-être mental.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Active Session Player */}
          <AnimatePresence>
            {activeSession && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-8"
              >
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 text-white overflow-hidden">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <motion.div
                        animate={{ 
                          scale: isPlaying ? [1, 1.1, 1] : 1,
                        }}
                        transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
                        className="mb-4 flex justify-center"
                      >
                        {activeSession.icon}
                      </motion.div>
                      <h2 className="text-3xl font-bold mb-2">{activeSession.title}</h2>
                      <p className="text-white/80 mb-2">{activeSession.description}</p>
                      <p className="text-white/60">Guidé par {activeSession.instructor}</p>
                    </div>

                    {/* Breathing Guide */}
                    {activeSession.type === 'breathing' && isPlaying && (
                      <motion.div className="text-center mb-8">
                        <motion.div
                          animate={{
                            scale: breathingPhase === 'inhale' ? [1, 1.5] : 
                                   breathingPhase === 'hold' ? 1.5 : 
                                   [1.5, 1]
                          }}
                          transition={{
                            duration: breathingPhase === 'inhale' ? 4 : 
                                     breathingPhase === 'hold' ? 0 : 8,
                            ease: "easeInOut"
                          }}
                          className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center"
                        >
                          <div className="w-16 h-16 rounded-full bg-white/40"></div>
                        </motion.div>
                        <p className="text-xl font-medium">{getBreathingInstructions()}</p>
                      </motion.div>
                    )}

                    {/* Progress */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(activeSession.duration * 60)}</span>
                      </div>
                      
                      <Progress 
                        value={(currentTime / (activeSession.duration * 60)) * 100} 
                        className="h-3"
                      />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={togglePlayPause}
                            variant="ghost"
                            size="lg"
                            className="text-white hover:bg-white/10"
                          >
                            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                          </Button>
                          
                          <Button
                            onClick={stopSession}
                            variant="ghost"
                            className="text-white hover:bg-white/10"
                          >
                            <RotateCcw className="h-5 w-5 mr-2" />
                            Arrêter
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <VolumeX className="h-4 w-4" />
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="w-24"
                          />
                          <Volume2 className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Session Grid */}
          {!activeSession && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {meditationSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="p-3 bg-gradient-to-br from-green-100 to-blue-100 rounded-full text-green-600"
                        >
                          {session.icon}
                        </motion.div>
                        <div className="flex gap-2">
                          <Badge className={typeColors[session.type]}>
                            {session.type}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">{session.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {session.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{session.duration} min</span>
                          </div>
                          <Badge variant="outline" className={difficultyColors[session.difficulty]}>
                            {session.difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-500">
                          Guidé par {session.instructor}
                        </p>
                        
                        <Button
                          onClick={() => startSession(session)}
                          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Commencer
                        </Button>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-xs font-medium text-gray-700 mb-2">Bienfaits:</h4>
                        <div className="flex flex-wrap gap-1">
                          {session.benefits.slice(0, 2).map((benefit, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                          {session.benefits.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{session.benefits.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Tips */}
          {!activeSession && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Conseils pour une méditation efficace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-2">Régularité</h3>
                    <p className="text-sm text-gray-600">Méditez à la même heure chaque jour</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-2">Environnement</h3>
                    <p className="text-sm text-gray-600">Choisissez un lieu calme et confortable</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-2">Bienveillance</h3>
                    <p className="text-sm text-gray-600">Soyez patient et indulgent avec vous-même</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-3">
                      <Brain className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-2">Progression</h3>
                    <p className="text-sm text-gray-600">Commencez par de courtes sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeditationPage;
