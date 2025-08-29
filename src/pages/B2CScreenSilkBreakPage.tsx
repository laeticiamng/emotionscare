import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Eye, EyeOff, Monitor, Smartphone, Tablet, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { useToast } from '@/hooks/use-toast';

interface BreakSession {
  id: string;
  duration: number;
  type: 'micro' | 'courte' | 'longue';
  completed: boolean;
  timestamp: Date;
}

const B2CScreenSilkBreakPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  usePageMetadata('Screen Silk Break', 'Pause écran apaisante avec protection oculaire', '/app/screen-silk', 'calm');

  const [isBreakActive, setIsBreakActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState([5]);
  const [breakType, setBreakType] = useState<'micro' | 'courte' | 'longue'>('courte');
  const [eyeStrainLevel, setEyeStrainLevel] = useState(65);
  const [screenBrightness, setScreenBrightness] = useState([80]);
  const [sessions, setSessions] = useState<BreakSession[]>([]);
  const [blueFilterActive, setBlueFilterActive] = useState(false);
  const [darkModeActive, setDarkModeActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreakActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeBreak();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreakActive, timeRemaining]);

  const startBreak = () => {
    const duration = selectedDuration[0] * 60; // Convert to seconds
    setTimeRemaining(duration);
    setIsBreakActive(true);
    
    const sessionType = duration <= 60 ? 'micro' : duration <= 300 ? 'courte' : 'longue';
    setBreakType(sessionType);

    toast({
      title: "Pause démarrée",
      description: `Session ${sessionType} de ${selectedDuration[0]} minutes`,
    });
  };

  const completeBreak = () => {
    const newSession: BreakSession = {
      id: Date.now().toString(),
      duration: selectedDuration[0],
      type: breakType,
      completed: true,
      timestamp: new Date()
    };
    
    setSessions(prev => [newSession, ...prev.slice(0, 9)]);
    setIsBreakActive(false);
    setEyeStrainLevel(prev => Math.max(10, prev - 15));
    
    toast({
      title: "Pause terminée !",
      description: "Vos yeux vous remercient ✨",
    });
  };

  const pauseBreak = () => {
    setIsBreakActive(false);
  };

  const resetBreak = () => {
    setIsBreakActive(false);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEyeStrainColor = () => {
    if (eyeStrainLevel <= 30) return 'text-green-600';
    if (eyeStrainLevel <= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBreakTypeColor = () => {
    switch (breakType) {
      case 'micro': return 'from-blue-400 to-cyan-400';
      case 'courte': return 'from-purple-400 to-pink-400';
      case 'longue': return 'from-green-400 to-emerald-400';
      default: return 'from-gray-400 to-slate-400';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/app/home')}
            className="hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Screen Silk Break</h1>
            <p className="text-gray-600">Protection oculaire et pauses intelligentes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="relative overflow-hidden">
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-br ${getBreakTypeColor()} opacity-10`}
                animate={isBreakActive ? { scale: 1.02, opacity: 0.15 } : { scale: 1, opacity: 0.1 }}
              />
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-6 h-6 text-blue-500" />
                    Timer de Pause
                  </div>
                  <Badge variant={isBreakActive ? "default" : "secondary"}>
                    {isBreakActive ? 'En cours' : 'Inactif'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="text-center">
                  {/* Affichage du temps */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={timeRemaining}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-6xl font-mono font-bold text-gray-800 mb-4"
                    >
                      {isBreakActive ? formatTime(timeRemaining) : formatTime(selectedDuration[0] * 60)}
                    </motion.div>
                  </AnimatePresence>

                  {/* Progress circulaire */}
                  {isBreakActive && (
                    <div className="mb-6">
                      <Progress 
                        value={(1 - timeRemaining / (selectedDuration[0] * 60)) * 100} 
                        className="w-full h-2"
                      />
                    </div>
                  )}

                  {/* Configuration de durée */}
                  {!isBreakActive && (
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Durée de la pause</label>
                        <Badge variant="outline">{selectedDuration[0]} min</Badge>
                      </div>
                      <Slider
                        value={selectedDuration}
                        onValueChange={setSelectedDuration}
                        max={30}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>1 min</span>
                        <span>Micro (1-2 min)</span>
                        <span>Courte (5-10 min)</span>
                        <span>Longue (15-30 min)</span>
                        <span>30 min</span>
                      </div>
                    </div>
                  )}

                  {/* Contrôles */}
                  <div className="flex gap-4 justify-center">
                    {!isBreakActive ? (
                      <Button 
                        onClick={startBreak}
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-cyan-500"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Commencer la Pause
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={pauseBreak}
                          size="lg"
                          variant="outline"
                        >
                          <Pause className="w-5 h-5 mr-2" />
                          Pause
                        </Button>
                        <Button 
                          onClick={resetBreak}
                          size="lg"
                          variant="outline"
                        >
                          <RotateCcw className="w-5 h-5 mr-2" />
                          Reset
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exercises pour les yeux */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-500" />
                  Exercices Oculaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: 'Règle 20-20-20',
                      description: 'Regardez un objet à 20 pieds pendant 20 secondes, toutes les 20 minutes',
                      icon: '👁️',
                      duration: '20 sec'
                    },
                    {
                      name: 'Clignements rapides',
                      description: 'Clignez rapidement des yeux pendant 20 secondes pour réhumidifier',
                      icon: '💧',
                      duration: '20 sec'
                    },
                    {
                      name: 'Focus Near-Far',
                      description: 'Alternez le focus entre un objet proche et lointain',
                      icon: '🔍',
                      duration: '1 min'
                    },
                    {
                      name: 'Massage des tempes',
                      description: 'Massez doucement les tempes en mouvements circulaires',
                      icon: '💆',
                      duration: '30 sec'
                    }
                  ].map((exercise, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-blue-400">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{exercise.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{exercise.name}</h4>
                            <p className="text-xs text-gray-600 mb-2">{exercise.description}</p>
                            <Badge variant="outline" className="text-xs">
                              {exercise.duration}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau de contrôle */}
          <div className="space-y-6">
            {/* État oculaire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-red-500" />
                  Fatigue Oculaire
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getEyeStrainColor()}`}>
                    {eyeStrainLevel}%
                  </div>
                  <Progress 
                    value={eyeStrainLevel} 
                    className="mb-4"
                  />
                  <p className="text-sm text-gray-600">
                    {eyeStrainLevel <= 30 && "Yeux reposés ✨"}
                    {eyeStrainLevel > 30 && eyeStrainLevel <= 60 && "Fatigue modérée 😐"}
                    {eyeStrainLevel > 60 && "Fatigue élevée 😵"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contrôles d'écran */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-500" />
                  Paramètres Écran
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Luminosité</label>
                    <Badge variant="outline">{screenBrightness[0]}%</Badge>
                  </div>
                  <Slider
                    value={screenBrightness}
                    onValueChange={setScreenBrightness}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => setBlueFilterActive(!blueFilterActive)}
                    variant={blueFilterActive ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                  >
                    <EyeOff className="w-4 h-4 mr-2" />
                    Filtre Anti-Lumière Bleue {blueFilterActive ? 'ON' : 'OFF'}
                  </Button>
                  
                  <Button
                    onClick={() => setDarkModeActive(!darkModeActive)}
                    variant={darkModeActive ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Mode Sombre {darkModeActive ? 'ON' : 'OFF'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Historique */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-green-500" />
                  Sessions Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sessions.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Aucune session enregistrée
                    </p>
                  ) : (
                    sessions.map((session) => (
                      <div key={session.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="text-sm">
                          <div className="font-medium">
                            {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {session.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {session.duration}min
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CScreenSilkBreakPage;