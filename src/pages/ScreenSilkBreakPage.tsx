
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Eye, Pause, Play, RefreshCw, Timer } from 'lucide-react';
import { toast } from 'sonner';

const ScreenSilkBreakPage: React.React = () => {
  const [breakTimer, setBreakTimer] = useState(0);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [selectedBreakType, setSelectedBreakType] = useState('micro');
  const [eyeExerciseStep, setEyeExerciseStep] = useState(0);

  const breakTypes = {
    micro: { duration: 20, name: "Micro-pause", description: "20 secondes de détente visuelle" },
    short: { duration: 300, name: "Pause courte", description: "5 minutes de repos écran" },
    long: { duration: 900, name: "Pause longue", description: "15 minutes de déconnexion totale" }
  };

  const eyeExercises = [
    "Regardez un point éloigné pendant 20 secondes",
    "Clignez lentement des yeux 10 fois",
    "Effectuez des mouvements circulaires avec vos yeux",
    "Couvrez vos yeux avec vos paumes pendant 30 secondes",
    "Regardez de gauche à droite lentement",
    "Focalisez alternativement sur votre doigt puis au loin"
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreakActive && breakTimer > 0) {
      interval = setInterval(() => {
        setBreakTimer(prev => {
          if (prev <= 1) {
            setIsBreakActive(false);
            toast.success('Pause terminée ! Vos yeux vous remercient 👀✨');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreakActive, breakTimer]);

  const startBreak = (type: string) => {
    setSelectedBreakType(type);
    setBreakTimer(breakTypes[type as keyof typeof breakTypes].duration);
    setIsBreakActive(true);
    setEyeExerciseStep(0);
    toast.success(`${breakTypes[type as keyof typeof breakTypes].name} démarrée !`);
  };

  const pauseBreak = () => {
    setIsBreakActive(!isBreakActive);
  };

  const resetBreak = () => {
    setIsBreakActive(false);
    setBreakTimer(0);
    setEyeExerciseStep(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextExercise = () => {
    setEyeExerciseStep((prev) => (prev + 1) % eyeExercises.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Monitor className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Screen Silk Break
            </h1>
            <Eye className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Protégez vos yeux et votre bien-être avec des pauses écran intelligentes
          </p>
          <Badge variant="secondary" className="mt-4 bg-green-100 text-green-700">
            Santé Visuelle
          </Badge>
        </motion.div>

        {!isBreakActive ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            {Object.entries(breakTypes).map(([key, breakType]) => (
              <Card key={key} className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-green-300">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <Timer className="w-5 h-5 text-green-600" />
                    {breakType.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{breakType.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline" className="border-green-500 text-green-700">
                      {formatTime(breakType.duration)}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => startBreak(key)}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Démarrer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="mb-6 border-2 border-green-300 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-800">
                  {breakTypes[selectedBreakType as keyof typeof breakTypes].name} en cours
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <motion.div
                  className="text-6xl font-bold text-green-600 mb-6"
                  key={breakTimer}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  data-testid="timer"
                >
                  {formatTime(breakTimer)}
                </motion.div>
                
                <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                  <motion.div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full"
                    style={{
                      width: `${((breakTypes[selectedBreakType as keyof typeof breakTypes].duration - breakTimer) / breakTypes[selectedBreakType as keyof typeof breakTypes].duration) * 100}%`
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <div className="flex gap-4 justify-center mb-6">
                  <Button
                    onClick={pauseBreak}
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    {isBreakActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isBreakActive ? 'Pause' : 'Reprendre'}
                  </Button>
                  <Button
                    onClick={resetBreak}
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Arrêter
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-300">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Exercice pour les yeux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  key={eyeExerciseStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <p className="text-lg text-gray-700 mb-4">
                    {eyeExercises[eyeExerciseStep]}
                  </p>
                  <Button
                    onClick={nextExercise}
                    variant="outline"
                    className="border-purple-500 text-purple-600 hover:bg-purple-50"
                  >
                    Exercice suivant
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 grid md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm">
            <Eye className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800 text-sm">Protection oculaire</h4>
          </div>
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm">
            <Monitor className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800 text-sm">Réduction fatigue</h4>
          </div>
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm">
            <Timer className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800 text-sm">Pauses intelligentes</h4>
          </div>
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm">
            <RefreshCw className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800 text-sm">Récupération active</h4>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScreenSilkBreakPage;
