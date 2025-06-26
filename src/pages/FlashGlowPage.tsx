
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  Sun, 
  Moon,
  Palette,
  Timer
} from 'lucide-react';

const FlashGlowPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [intensity, setIntensity] = useState([70]);
  const [frequency, setFrequency] = useState([8]);
  const [duration, setDuration] = useState(300); // 5 minutes par défaut
  const [timeLeft, setTimeLeft] = useState(duration);
  const [selectedColor, setSelectedColor] = useState('blue');
  const [currentPhase, setCurrentPhase] = useState<'flash' | 'glow'>('flash');

  const colors = {
    blue: { primary: '#3B82F6', secondary: '#93C5FD', name: 'Bleu Apaisant' },
    green: { primary: '#10B981', secondary: '#6EE7B7', name: 'Vert Naturel' },
    purple: { primary: '#8B5CF6', secondary: '#C4B5FD', name: 'Violet Créatif' },
    orange: { primary: '#F59E0B', secondary: '#FCD34D', name: 'Orange Énergisant' },
    pink: { primary: '#EC4899', secondary: '#F9A8D4', name: 'Rose Douceur' }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            return duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, duration]);

  useEffect(() => {
    if (isActive) {
      const phaseInterval = setInterval(() => {
        setCurrentPhase(prev => prev === 'flash' ? 'glow' : 'flash');
      }, 1000 / frequency[0]);
      
      return () => clearInterval(phaseInterval);
    }
  }, [isActive, frequency]);

  const toggleSession = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setTimeLeft(duration);
    }
  };

  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(duration);
    setCurrentPhase('flash');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentColor = colors[selectedColor as keyof typeof colors];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4" data-testid="page-root">
      {isActive && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: currentPhase === 'flash' 
              ? `radial-gradient(circle, ${currentColor.primary}40 0%, transparent 70%)`
              : `radial-gradient(circle, ${currentColor.secondary}20 0%, transparent 50%)`,
          }}
          animate={{
            opacity: currentPhase === 'flash' ? intensity[0] / 100 : 0.3,
          }}
          transition={{
            duration: 0.1,
            ease: "easeInOut"
          }}
        />
      )}

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Flash Glow Therapy
          </h1>
          <p className="text-gray-300 text-lg">
            Thérapie par lumière pulsée pour stimuler le bien-être
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contrôles */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-400" />
                Contrôles de session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sélection de couleur */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Couleur thérapeutique
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(colors).map(([key, color]) => (
                    <Button
                      key={key}
                      variant={selectedColor === key ? "default" : "outline"}
                      onClick={() => setSelectedColor(key)}
                      className="flex items-center gap-2 text-left"
                      style={{
                        borderColor: selectedColor === key ? color.primary : undefined,
                        backgroundColor: selectedColor === key ? `${color.primary}20` : undefined
                      }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color.primary }}
                      />
                      <span className="text-sm">{color.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Intensité */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Intensité: {intensity[0]}%
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

              {/* Fréquence */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Fréquence: {frequency[0]} Hz
                </label>
                <Slider
                  value={frequency}
                  onValueChange={setFrequency}
                  max={40}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Durée */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Durée: {Math.floor(duration / 60)} minutes
                </label>
                <div className="flex gap-2">
                  {[180, 300, 600, 900].map((d) => (
                    <Button
                      key={d}
                      variant={duration === d ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setDuration(d);
                        setTimeLeft(d);
                      }}
                    >
                      {Math.floor(d / 60)}min
                    </Button>
                  ))}
                </div>
              </div>

              {/* Contrôles de lecture */}
              <div className="flex justify-center gap-4 pt-4">
                <Button
                  onClick={toggleSession}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                  {isActive ? 'Pause' : 'Démarrer'}
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

          {/* Visualisation et informations */}
          <div className="space-y-6">
            {/* Timer */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Timer className="h-4 w-4" />
                  Temps restant
                </div>
                {isActive && (
                  <Badge className="mt-3 bg-green-500/20 text-green-400">
                    Session active
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Visualisation */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Visualisation</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="w-full h-32 rounded-lg border-2 border-gray-600 flex items-center justify-center"
                  style={{
                    background: isActive 
                      ? `linear-gradient(45deg, ${currentColor.primary}40, ${currentColor.secondary}40)`
                      : 'transparent'
                  }}
                  animate={{
                    borderColor: isActive ? currentColor.primary : '#4B5563',
                    boxShadow: isActive && currentPhase === 'flash' 
                      ? `0 0 30px ${currentColor.primary}60` 
                      : 'none'
                  }}
                >
                  <div className="text-center text-gray-400">
                    {isActive ? (
                      <div>
                        <div className="text-lg font-semibold text-white">
                          {currentPhase === 'flash' ? 'Flash' : 'Glow'}
                        </div>
                        <div className="text-sm">
                          {frequency[0]} Hz
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Sun className="h-8 w-8 mx-auto mb-2" />
                        <div>Prêt à commencer</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            {/* Bienfaits */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Bienfaits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Stimulation du système nerveux</li>
                  <li>• Amélioration de l'humeur</li>
                  <li>• Réduction du stress</li>
                  <li>• Synchronisation des ondes cérébrales</li>
                  <li>• Augmentation de la concentration</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashGlowPage;
