import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Timer, Target, RotateCcw, Play, Pause, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Session {
  id: string;
  type: 'energy' | 'focus' | 'calm' | 'motivation';
  duration: number;
  intensity: number;
  completed: boolean;
  date: Date;
  improvement: number;
}

const B2CFlashGlowPageEnhanced: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentIntensity, setCurrentIntensity] = useState(5);
  const [selectedType, setSelectedType] = useState<Session['type']>('energy');
  const [glowIntensity, setGlowIntensity] = useState(50);
  const [autoAdaptation, setAutoAdaptation] = useState(true);
  const [emotionalState, setEmotionalState] = useState('neutral');
  
  const { toast } = useToast();

  const sessionTypes = [
    {
      type: 'energy' as const,
      title: 'Boost d\'Énergie',
      description: 'Augmente votre vitalité instantanément',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-orange-400 to-red-500',
      duration: 180,
      benefits: ['Énergie +40%', 'Motivation +30%', 'Confiance +25%']
    },
    {
      type: 'focus' as const,
      title: 'Hyper-Focus',
      description: 'Maximise votre concentration',
      icon: <Target className="w-6 h-6" />,
      color: 'from-blue-400 to-purple-500',
      duration: 300,
      benefits: ['Focus +50%', 'Productivité +45%', 'Clarté +35%']
    },
    {
      type: 'calm' as const,
      title: 'Sérénité Instantanée',
      description: 'Apaise et relaxe profondément',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-green-400 to-teal-500',
      duration: 240,
      benefits: ['Stress -60%', 'Tension -45%', 'Paix +40%']
    },
    {
      type: 'motivation' as const,
      title: 'Motivation Ultime',
      description: 'Décuple votre drive intérieur',
      icon: <RotateCcw className="w-6 h-6" />,
      color: 'from-yellow-400 to-orange-500',
      duration: 210,
      benefits: ['Drive +55%', 'Ambition +40%', 'Action +35%']
    }
  ];

  const recentSessions: Session[] = [
    {
      id: '1',
      type: 'energy',
      duration: 180,
      intensity: 7,
      completed: true,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      improvement: 42
    },
    {
      id: '2',
      type: 'focus',
      duration: 300,
      intensity: 6,
      completed: true,
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
      improvement: 38
    }
  ];

  // Timer principal
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  // Adaptation automatique de l'intensité
  useEffect(() => {
    if (autoAdaptation && isActive) {
      const adaptInterval = setInterval(() => {
        // Simule l'adaptation basée sur l'état émotionnel
        const adaptation = Math.random() * 2 - 1; // -1 à +1
        setCurrentIntensity(prev => Math.max(1, Math.min(10, prev + adaptation)));
      }, 10000); // Toutes les 10 secondes

      return () => clearInterval(adaptInterval);
    }
  }, [autoAdaptation, isActive]);

  const startSession = (type: Session['type']) => {
    const sessionConfig = sessionTypes.find(s => s.type === type);
    if (!sessionConfig) return;

    const newSession: Session = {
      id: Date.now().toString(),
      type,
      duration: sessionConfig.duration,
      intensity: currentIntensity,
      completed: false,
      date: new Date(),
      improvement: 0
    };

    setCurrentSession(newSession);
    setTimeRemaining(sessionConfig.duration);
    setIsActive(true);
    
    toast({
      title: "Session démarrée",
      description: `Session ${sessionConfig.title} de ${Math.floor(sessionConfig.duration/60)} minutes activée`,
    });
  };

  const pauseSession = () => {
    setIsActive(!isActive);
  };

  const stopSession = () => {
    setIsActive(false);
    setTimeRemaining(0);
    setCurrentSession(null);
  };

  const handleSessionComplete = () => {
    if (currentSession) {
      const improvement = Math.floor(20 + Math.random() * 40);
      
      toast({
        title: "Session terminée !",
        description: `Amélioration de ${improvement}% de votre état émotionnel`,
      });
      
      setCurrentSession(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionColor = (type: Session['type']) => {
    return sessionTypes.find(s => s.type === type)?.color || 'from-gray-400 to-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            ⚡ Flash Glow
          </h1>
          <p className="text-xl text-gray-300">
            Transformations émotionnelles instantanées par micro-interventions
          </p>
        </motion.div>

        {/* Session Active */}
        <AnimatePresence>
          {currentSession && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6"
            >
              <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${getSessionColor(currentSession.type)} mb-6 flex items-center justify-center`}>
                    <motion.div
                      animate={{ 
                        scale: isActive ? [1, 1.1, 1] : 1,
                        opacity: isActive ? [0.8, 1, 0.8] : 0.8
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: isActive ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                      className="text-white text-4xl"
                    >
                      {sessionTypes.find(s => s.type === currentSession.type)?.icon}
                    </motion.div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {sessionTypes.find(s => s.type === currentSession.type)?.title}
                  </h2>
                  
                  <div className="text-6xl font-mono text-white mb-6">
                    {formatTime(timeRemaining)}
                  </div>
                  
                  <div className="flex justify-center gap-4 mb-6">
                    <Button 
                      onClick={pauseSession}
                      variant="outline" 
                      size="lg"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                    <Button 
                      onClick={stopSession}
                      variant="destructive" 
                      size="lg"
                    >
                      Arrêter
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-white/80">
                      <span>Intensité Actuelle</span>
                      <span>{currentIntensity}/10</span>
                    </div>
                    <Progress 
                      value={currentIntensity * 10} 
                      className="bg-white/20"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sélection de session (quand pas active) */}
        {!currentSession && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {sessionTypes.map((session, index) => (
              <motion.div
                key={session.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
                onClick={() => startSession(session.type)}
              >
                <Card className="bg-black/30 border-white/10 backdrop-blur-xl hover:bg-black/40 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${session.color} mb-4 flex items-center justify-center text-white`}>
                      {session.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{session.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{session.description}</p>
                    <Badge className="bg-white/20 text-white border-white/30 mb-4">
                      {Math.floor(session.duration / 60)} min
                    </Badge>
                    <div className="space-y-1">
                      {session.benefits.map((benefit, i) => (
                        <div key={i} className="text-xs text-gray-400">
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Paramètres */}
        {!currentSession && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Paramètres de Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-white mb-2 block">Intensité de Base: {currentIntensity}</label>
                      <Slider
                        value={[currentIntensity]}
                        onValueChange={(value) => setCurrentIntensity(value[0])}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-white mb-2 block">Intensité du Glow: {glowIntensity}%</label>
                      <Slider
                        value={[glowIntensity]}
                        onValueChange={(value) => setGlowIntensity(value[0])}
                        max={100}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-white">Adaptation Automatique</label>
                      <Switch
                        checked={autoAdaptation}
                        onCheckedChange={setAutoAdaptation}
                      />
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      L'IA ajuste automatiquement l'intensité selon votre réponse émotionnelle
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Historique récent */}
        {recentSessions.length > 0 && !currentSession && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Sessions Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getSessionColor(session.type)} flex items-center justify-center text-white text-sm`}>
                          {sessionTypes.find(s => s.type === session.type)?.icon}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {sessionTypes.find(s => s.type === session.type)?.title}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {Math.floor(session.duration / 60)}min • Intensité {session.intensity}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-medium">+{session.improvement}%</div>
                        <div className="text-gray-400 text-sm">
                          {session.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default B2CFlashGlowPageEnhanced;