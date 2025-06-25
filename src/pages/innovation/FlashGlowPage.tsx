
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Zap, 
  Lightbulb, 
  Star, 
  Sparkles, 
  Timer, 
  TrendingUp,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FlashGlowPage: React.FC = () => {
  const [sessionActive, setSessionActive] = useState(false);
  const [intensity, setIntensity] = useState([70]);
  const [sessionType, setSessionType] = useState<'focus' | 'energy' | 'calm' | 'creative'>('focus');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [glowLevel, setGlowLevel] = useState(0);
  const [pulseRate, setPulseRate] = useState(60); // BPM
  
  const sessionTypes = {
    focus: {
      name: 'Focus Intense',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-900/20 to-cyan-900/20',
      description: 'Améliore la concentration et la clarté mentale',
      duration: 300,
      pattern: 'steady'
    },
    energy: {
      name: 'Boost Énergie',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-900/20 to-orange-900/20',
      description: 'Stimule la vitalité et la motivation',
      duration: 180,
      pattern: 'dynamic'
    },
    calm: {
      name: 'Sérénité',
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-900/20 to-teal-900/20',
      description: 'Favorise la relaxation et la paix intérieure',
      duration: 600,
      pattern: 'slow'
    },
    creative: {
      name: 'Créativité',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-900/20 to-pink-900/20',
      description: 'Stimule l\'inspiration et l\'innovation',
      duration: 420,
      pattern: 'random'
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        updateGlowEffect();
      }, 1000);
    } else if (timeLeft === 0) {
      completeSession();
    }
    return () => clearInterval(interval);
  }, [sessionActive, timeLeft]);

  const updateGlowEffect = () => {
    const currentSession = sessionTypes[sessionType];
    
    switch (currentSession.pattern) {
      case 'steady':
        setGlowLevel(intensity[0]);
        break;
      case 'dynamic':
        setGlowLevel(intensity[0] + Math.sin(Date.now() / 1000) * 20);
        break;
      case 'slow':
        setGlowLevel(intensity[0] + Math.sin(Date.now() / 3000) * 15);
        break;
      case 'random':
        setGlowLevel(intensity[0] + (Math.random() - 0.5) * 30);
        break;
    }
  };

  const startSession = (type: 'focus' | 'energy' | 'calm' | 'creative') => {
    setSessionType(type);
    setTimeLeft(sessionTypes[type].duration);
    setSessionActive(true);
    setGlowLevel(intensity[0]);
  };

  const pauseSession = () => {
    setSessionActive(false);
  };

  const resumeSession = () => {
    setSessionActive(true);
  };

  const resetSession = () => {
    setSessionActive(false);
    setTimeLeft(sessionTypes[sessionType].duration);
    setGlowLevel(0);
  };

  const completeSession = () => {
    setSessionActive(false);
    setGlowLevel(0);
    // Animation de fin
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
      {/* Glow Effect Background */}
      <AnimatePresence>
        {sessionActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: glowLevel / 100,
              scale: [1, 1.1, 1],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 0.5 },
              scale: { duration: 2, repeat: Infinity }
            }}
            className={`fixed inset-0 bg-gradient-to-r ${sessionTypes[sessionType].bgColor} pointer-events-none`}
            style={{
              filter: `blur(${Math.max(0, glowLevel / 10)}px)`,
            }}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 mb-4">
            Flash Glow
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Thérapie par la lumière intelligente pour optimiser votre état mental
          </p>
        </motion.div>

        {/* Control Panel */}
        {!sessionActive ? (
          <div className="space-y-8">
            {/* Session Types */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(sessionTypes).map(([key, type]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center`}>
                        {key === 'focus' && <Zap className="h-8 w-8 text-white" />}
                        {key === 'energy' && <Lightbulb className="h-8 w-8 text-white" />}
                        {key === 'calm' && <Star className="h-8 w-8 text-white" />}
                        {key === 'creative' && <Sparkles className="h-8 w-8 text-white" />}
                      </div>
                      <h3 className="text-lg font-bold mb-2">{type.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{type.description}</p>
                      <Badge variant="outline" className="mb-4">
                        {Math.floor(type.duration / 60)} min
                      </Badge>
                      <Button
                        onClick={() => startSession(key as any)}
                        className={`w-full bg-gradient-to-r ${type.color} hover:opacity-90`}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Commencer
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Settings */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Paramètres de session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-4">
                    Intensité lumineuse: {intensity[0]}%
                  </label>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={100}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Conseils d'utilisation</h4>
                    <ul className="space-y-1">
                      <li>• Utilisez dans un environnement sombre</li>
                      <li>• Ajustez l'intensité selon votre confort</li>
                      <li>• Fermez les yeux si nécessaire</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Bénéfices attendus</h4>
                    <ul className="space-y-1">
                      <li>• Amélioration de l'humeur</li>
                      <li>• Régulation du rythme circadien</li>
                      <li>• Réduction du stress</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Session Active */
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  {sessionType === 'focus' && <Zap className="h-6 w-6 text-blue-400" />}
                  {sessionType === 'energy' && <Lightbulb className="h-6 w-6 text-yellow-400" />}
                  {sessionType === 'calm' && <Star className="h-6 w-6 text-green-400" />}
                  {sessionType === 'creative' && <Sparkles className="h-6 w-6 text-purple-400" />}
                  Session {sessionTypes[sessionType].name}
                </CardTitle>
                <Badge variant="outline" className="text-2xl px-4 py-2">
                  {formatTime(timeLeft)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-8">
                {/* Visual Feedback */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${sessionTypes[sessionType].color} flex items-center justify-center`}
                  style={{
                    boxShadow: `0 0 ${glowLevel}px rgba(255, 255, 255, 0.3)`
                  }}
                >
                  <div className="text-4xl">
                    {sessionType === 'focus' && '🎯'}
                    {sessionType === 'energy' && '⚡'}
                    {sessionType === 'calm' && '🧘'}
                    {sessionType === 'creative' && '✨'}
                  </div>
                </motion.div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">
                    {sessionType === 'focus' && 'Concentrez-vous sur votre respiration'}
                    {sessionType === 'energy' && 'Ressentez l\'énergie qui vous envahit'}
                    {sessionType === 'calm' && 'Laissez la paix vous envelopper'}
                    {sessionType === 'creative' && 'Ouvrez-vous aux nouvelles idées'}
                  </h3>
                  
                  <p className="text-gray-300 max-w-md mx-auto">
                    Intensité actuelle: {Math.round(glowLevel)}%
                  </p>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={pauseSession}
                    variant="outline"
                    size="lg"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                  
                  <Button
                    onClick={resetSession}
                    variant="outline"
                    size="lg"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FlashGlowPage;
