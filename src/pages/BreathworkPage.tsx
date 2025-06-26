
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';

const BreathworkPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [progress, setProgress] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [totalCycles] = useState(5);

  const breathingPattern = {
    inhale: 4000,
    hold: 4000,
    exhale: 6000,
    pause: 2000
  };

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        const increment = 100 / (breathingPattern[phase] / 100);
        if (prev >= 100) {
          // Passer à la phase suivante
          switch (phase) {
            case 'inhale':
              setPhase('hold');
              break;
            case 'hold':
              setPhase('exhale');
              break;
            case 'exhale':
              setPhase('pause');
              break;
            case 'pause':
              setPhase('inhale');
              setCycle(prev => prev + 1);
              break;
          }
          return 0;
        }
        return prev + increment;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  useEffect(() => {
    if (cycle >= totalCycles) {
      setIsActive(false);
      setCycle(0);
    }
  }, [cycle, totalCycles]);

  const toggleBreathing = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setProgress(0);
      setPhase('inhale');
    }
  };

  const resetSession = () => {
    setIsActive(false);
    setProgress(0);
    setPhase('inhale');
    setCycle(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
      case 'pause': return 'Pause';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-cyan-400';
      case 'hold': return 'from-purple-400 to-pink-400';
      case 'exhale': return 'from-green-400 to-emerald-400';
      case 'pause': return 'from-gray-300 to-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4" data-testid="page-root">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Respiration Guidée
          </h1>
          <p className="text-gray-600 text-lg">
            Techniques de respiration pour réduire le stress et améliorer votre bien-être
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visualisation de la respiration */}
          <Card className="p-8">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Wind className="h-6 w-6 text-blue-500" />
                Session de Respiration
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <motion.div
                className={`w-64 h-64 mx-auto rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-xl flex items-center justify-center`}
                animate={{
                  scale: isActive ? (phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.8 : 1) : 1,
                }}
                transition={{ 
                  duration: isActive ? breathingPattern[phase] / 1000 : 0.5,
                  ease: "easeInOut"
                }}
              >
                <div className="text-white text-center">
                  <div className="text-3xl font-bold mb-2">{getPhaseText()}</div>
                  <div className="text-lg opacity-90">
                    Cycle {cycle + 1}/{totalCycles}
                  </div>
                </div>
              </motion.div>

              <Progress value={progress} className="w-full h-3" />

              <div className="flex justify-center gap-4">
                <Button
                  onClick={toggleBreathing}
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                  {isActive ? 'Pause' : 'Commencer'}
                </Button>
                <Button
                  onClick={resetSession}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informations et techniques */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technique 4-4-6-2</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Inspirez</strong> pendant 4 secondes</li>
                  <li>• <strong>Retenez</strong> pendant 4 secondes</li>
                  <li>• <strong>Expirez</strong> pendant 6 secondes</li>
                  <li>• <strong>Pause</strong> pendant 2 secondes</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bienfaits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Réduction du stress et de l'anxiété</li>
                  <li>• Amélioration de la concentration</li>
                  <li>• Régulation du système nerveux</li>
                  <li>• Meilleure qualité de sommeil</li>
                  <li>• Renforcement du système immunitaire</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conseils</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Trouvez un endroit calme et confortable</li>
                  <li>• Adoptez une posture droite mais détendue</li>
                  <li>• Concentrez-vous sur votre respiration</li>
                  <li>• Pratiquez régulièrement pour de meilleurs résultats</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathworkPage;
