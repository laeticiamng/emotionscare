
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Monitor, Eye, Clock, Pause, Play } from 'lucide-react';

const ScreenSilkBreakPage: React.FC = () => {
  const [breakTime, setBreakTime] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(breakTime * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setTimeLeft(breakTime * 60);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, breakTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = ((breakTime * 60 - timeLeft) / (breakTime * 60)) * 100;

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Monitor className="h-12 w-12 text-emerald-600 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Screen Silk Break
            </h1>
            <Eye className="h-12 w-12 text-emerald-600 ml-4" />
          </div>
          <p className="text-xl text-emerald-700 max-w-3xl mx-auto">
            Prenez soin de vos yeux avec des pauses écran apaisantes et réparatrices
          </p>
        </motion.div>

        {/* Timer principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto mb-8"
        >
          <Card className="bg-white/80 border-emerald-200 shadow-xl backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-emerald-700 flex items-center justify-center">
                <Clock className="h-6 w-6 mr-2" />
                Timer de Pause
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold text-emerald-600 mb-4">
                {formatTime(timeLeft)}
              </div>
              <Progress value={progress} className="mb-6 h-3" />
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setIsActive(!isActive)}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                  {isActive ? 'Pause' : 'Démarrer'}
                </Button>
                <Button
                  onClick={() => {
                    setIsActive(false);
                    setTimeLeft(breakTime * 60);
                  }}
                  variant="outline"
                  size="lg"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Options de durée */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <Card className="bg-white/80 border-emerald-200 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-xl text-emerald-700">
                Durée de la Pause
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[5, 10, 20].map((minutes) => (
                  <Button
                    key={minutes}
                    onClick={() => {
                      setBreakTime(minutes);
                      setTimeLeft(minutes * 60);
                      setIsActive(false);
                    }}
                    variant={breakTime === minutes ? "default" : "outline"}
                    className={breakTime === minutes 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                      : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    }
                  >
                    {minutes} min
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Exercices pour les yeux */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="bg-white/80 border-emerald-200 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-700">Règle 20-20-20</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-600 mb-4">
                Toutes les 20 minutes, regardez quelque chose à 20 pieds (6 mètres) pendant 20 secondes.
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Commencer l'exercice
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-emerald-200 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-700">Clignements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-600 mb-4">
                Clignez lentement et délibérément 10 fois pour hydrater vos yeux.
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Exercice de clignement
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ScreenSilkBreakPage;
