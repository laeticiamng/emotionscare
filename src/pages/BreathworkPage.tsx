
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wind, Play, Pause, RotateCcw, Heart, Timer } from 'lucide-react';

const BreathworkPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('Inspiration');
  const [seconds, setSeconds] = useState(4);
  const [totalTime, setTotalTime] = useState(300);
  const [breathCount, setBreathCount] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState('4-7-8');

  const techniques = [
    { 
      name: '4-7-8', 
      description: 'Inspiration 4s, Rétention 7s, Expiration 8s',
      color: 'from-blue-500 to-purple-500',
      phases: [4, 7, 8]
    },
    { 
      name: 'Box Breathing', 
      description: 'Inspiration 4s, Rétention 4s, Expiration 4s, Pause 4s',
      color: 'from-green-500 to-teal-500',
      phases: [4, 4, 4, 4]
    },
    { 
      name: 'Cohérence Cardiaque', 
      description: 'Inspiration 5s, Expiration 5s',
      color: 'from-red-500 to-pink-500',
      phases: [5, 5]
    },
    { 
      name: 'Wim Hof', 
      description: 'Respiration intense puis rétention',
      color: 'from-orange-500 to-yellow-500',
      phases: [2, 15]
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && totalTime > 0) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            // Passer à la phase suivante
            setCurrentPhase(prevPhase => {
              const technique = techniques.find(t => t.name === selectedTechnique);
              if (!technique) return prevPhase;
              
              const phases = ['Inspiration', 'Rétention', 'Expiration', 'Pause'];
              const currentIndex = phases.indexOf(prevPhase);
              const nextIndex = (currentIndex + 1) % technique.phases.length;
              
              if (nextIndex === 0) {
                setBreathCount(prev => prev + 1);
              }
              
              return phases[nextIndex];
            });
            
            const technique = techniques.find(t => t.name === selectedTechnique);
            const phaseIndex = ['Inspiration', 'Rétention', 'Expiration', 'Pause'].indexOf(currentPhase);
            return technique?.phases[phaseIndex] || 4;
          }
          return prev - 1;
        });
        setTotalTime(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, totalTime, currentPhase, selectedTechnique]);

  const resetSession = () => {
    setIsActive(false);
    setSeconds(4);
    setTotalTime(300);
    setBreathCount(0);
    setCurrentPhase('Inspiration');
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'Inspiration': return 'from-blue-400 to-cyan-400';
      case 'Rétention': return 'from-purple-400 to-indigo-400';
      case 'Expiration': return 'from-green-400 to-emerald-400';
      case 'Pause': return 'from-gray-400 to-slate-400';
      default: return 'from-blue-400 to-cyan-400';
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Wind className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Breathwork
            </h1>
          </div>
          <p className="text-lg text-slate-300">
            Maîtrisez votre souffle, transformez votre état
          </p>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            Adaptation Immédiate
          </Badge>
        </motion.div>

        {/* Zone de Respiration Principale */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <Card className="bg-black/30 border-blue-500/30 backdrop-blur-md">
            <CardContent className="p-8">
              {/* Cercle de Respiration */}
              <motion.div
                className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center mb-6 shadow-2xl`}
                animate={{
                  scale: currentPhase === 'Inspiration' ? [1, 1.2] : 
                         currentPhase === 'Expiration' ? [1.2, 1] : [1, 1],
                }}
                transition={{
                  duration: seconds,
                  ease: "easeInOut",
                  repeat: 0
                }}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold mb-2">{currentPhase}</p>
                  <p className="text-4xl font-bold">{seconds}</p>
                </div>
              </motion.div>

              {/* Contrôles */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <Button
                  onClick={() => setIsActive(!isActive)}
                  size="lg"
                  className={`w-16 h-16 rounded-full ${
                    isActive 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                  }`}
                >
                  {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <Button
                  onClick={resetSession}
                  variant="outline"
                  size="lg"
                  className="w-16 h-16 rounded-full border-blue-500/50 hover:bg-blue-500/20"
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>
              </div>

              {/* Stats de Session */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Timer className="h-5 w-5 mx-auto mb-1 text-blue-400" />
                  <p className="text-sm text-slate-400">Temps Restant</p>
                  <p className="font-bold">{formatTime(totalTime)}</p>
                </div>
                <div className="text-center">
                  <Wind className="h-5 w-5 mx-auto mb-1 text-green-400" />
                  <p className="text-sm text-slate-400">Respirations</p>
                  <p className="font-bold">{breathCount}</p>
                </div>
                <div className="text-center">
                  <Heart className="h-5 w-5 mx-auto mb-1 text-red-400" />
                  <p className="text-sm text-slate-400">Technique</p>
                  <p className="font-bold text-xs">{selectedTechnique}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sélection de Techniques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-center">Techniques de Respiration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techniques.map((technique) => (
              <motion.button
                key={technique.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTechnique(technique.name)}
                className={`p-4 rounded-xl bg-gradient-to-br ${technique.color} bg-opacity-20 border-2 transition-all text-left ${
                  selectedTechnique === technique.name 
                    ? 'border-white shadow-lg' 
                    : 'border-transparent hover:border-white/30'
                }`}
              >
                <h4 className="font-bold mb-2">{technique.name}</h4>
                <p className="text-sm text-slate-300">{technique.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <Wind className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-400">147</p>
              <p className="text-sm text-slate-400">Sessions Total</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-4 text-center">
              <Timer className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">24h</p>
              <p className="text-sm text-slate-400">Temps Pratiqué</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-400">12</p>
              <p className="text-sm text-slate-400">Série Actuelle</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BreathworkPage;
