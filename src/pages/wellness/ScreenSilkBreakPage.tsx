
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Eye, 
  Timer, 
  Bell, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScreenSilkBreakPage: React.FC = () => {
  const [breakActive, setBreakActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes par défaut
  const [breakType, setBreakType] = useState<'micro' | 'standard' | 'long'>('standard');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [sessionsToday, setSessionsToday] = useState(3);
  const [streak, setStreak] = useState(7);
  
  const breakTypes = {
    micro: { duration: 60, name: 'Micro-pause', description: '1 minute de détente' },
    standard: { duration: 300, name: 'Pause Standard', description: '5 minutes de récupération' },
    long: { duration: 900, name: 'Pause Longue', description: '15 minutes de repos complet' }
  };
  
  const exercises = [
    {
      name: 'Respiration profonde',
      instruction: 'Inspirez lentement pendant 4 secondes, retenez 4 secondes, expirez 6 secondes',
      duration: 60,
      icon: '🫁'
    },
    {
      name: 'Exercices oculaires',
      instruction: 'Regardez au loin, clignez 20 fois, puis fermez les yeux 10 secondes',
      duration: 45,
      icon: '👁️'
    },
    {
      name: 'Étirements du cou',
      instruction: 'Tournez doucement la tête à droite, à gauche, puis en haut et en bas',
      duration: 30,
      icon: '🤸'
    },
    {
      name: 'Relaxation mentale',
      instruction: 'Fermez les yeux et visualisez un endroit paisible qui vous apaise',
      duration: 90,
      icon: '🧘'
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breakActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && breakActive) {
      completeBreak();
    }
    return () => clearInterval(interval);
  }, [breakActive, timeLeft]);

  const startBreak = (type: 'micro' | 'standard' | 'long') => {
    setBreakType(type);
    setTimeLeft(breakTypes[type].duration);
    setBreakActive(true);
    setCurrentExercise(0);
  };

  const pauseBreak = () => {
    setBreakActive(false);
  };

  const resumeBreak = () => {
    setBreakActive(true);
  };

  const resetBreak = () => {
    setBreakActive(false);
    setTimeLeft(breakTypes[breakType].duration);
    setCurrentExercise(0);
  };

  const completeBreak = () => {
    setBreakActive(false);
    setSessionsToday(prev => prev + 1);
    // Animation de félicitations
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((breakTypes[breakType].duration - timeLeft) / breakTypes[breakType].duration) * 100;

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400 mb-4">
            Screen Silk Break
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Pauses intelligentes pour protéger vos yeux et votre bien-être numérique
          </p>
        </motion.div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-400">{sessionsToday}</div>
              <div className="text-sm text-gray-400">Pauses aujourd'hui</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Timer className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-400">{streak}</div>
              <div className="text-sm text-gray-400">Jours consécutifs</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-400">85%</div>
              <div className="text-sm text-gray-400">Santé oculaire</div>
            </CardContent>
          </Card>
        </div>

        {/* Break Interface */}
        {!breakActive ? (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {Object.entries(breakTypes).map(([key, type]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">
                      {key === 'micro' ? '⚡' : key === 'standard' ? '⏸️' : '🛌'}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{type.name}</h3>
                    <p className="text-gray-400 mb-4">{type.description}</p>
                    <Button
                      onClick={() => startBreak(key as 'micro' | 'standard' | 'long')}
                      className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Commencer
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="h-6 w-6 text-green-400" />
                  {breakTypes[breakType].name} en cours
                </div>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {formatTime(timeLeft)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Progress value={progressPercentage} className="h-3 mb-2" />
                <div className="text-center text-gray-400 text-sm">
                  {Math.round(progressPercentage)}% complété
                </div>
              </div>
              
              {/* Exercise Guide */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentExercise}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center mb-6"
                >
                  <div className="text-6xl mb-4">{exercises[currentExercise].icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-green-400">
                    {exercises[currentExercise].name}
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                    {exercises[currentExercise].instruction}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={pauseBreak}
                  variant="outline"
                  size="lg"
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
                
                <Button
                  onClick={resetBreak}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                
                <Button
                  onClick={nextExercise}
                  disabled={currentExercise >= exercises.length - 1}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-teal-600"
                >
                  Suivant
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips Section */}
        <Card className="bg-gradient-to-r from-teal-800/30 to-green-800/30 border-teal-500/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Conseils pour des pauses efficaces
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-semibold text-teal-400 mb-2">Règle 20-20-20</h4>
                <p>Toutes les 20 minutes, regardez quelque chose à 20 pieds (6 mètres) pendant 20 secondes.</p>
              </div>
              <div>
                <h4 className="font-semibold text-teal-400 mb-2">Hydratation</h4>
                <p>Profitez de vos pauses pour boire de l'eau et maintenir une bonne hydratation.</p>
              </div>
              <div>
                <h4 className="font-semibold text-teal-400 mb-2">Posture</h4>
                <p>Levez-vous et étirez-vous pour prévenir les tensions musculaires.</p>
              </div>
              <div>
                <h4 className="font-semibent text-teal-400 mb-2">Lumière naturelle</h4>
                <p>Regardez par la fenêtre ou sortez brièvement pour exposer vos yeux à la lumière naturelle.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScreenSilkBreakPage;
