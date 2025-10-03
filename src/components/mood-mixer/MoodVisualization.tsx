import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Waves,
  Circle,
  Zap,
  Heart,
  Brain
} from 'lucide-react';
import { MoodMix } from '@/types/mood-mixer';

interface MoodVisualizationProps {
  currentMood: string;
  isPlaying: boolean;
  mix: MoodMix;
}

const MoodVisualization: React.FC<MoodVisualizationProps> = ({ 
  currentMood, 
  isPlaying, 
  mix 
}) => {
  const [visualizationType, setVisualizationType] = useState<'waves' | 'particles' | 'pulse'>('waves');
  const [emotionalIntensity, setEmotionalIntensity] = useState(0.5);

  useEffect(() => {
    // Simuler l'évolution de l'intensité émotionnelle
    const interval = setInterval(() => {
      if (isPlaying) {
        setEmotionalIntensity(prev => {
          const newIntensity = prev + (Math.random() - 0.5) * 0.1;
          return Math.max(0.2, Math.min(1, newIntensity));
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const getMoodColor = (moodId: string) => {
    switch (moodId) {
      case 'energetic': return '#ef4444';
      case 'calm': return '#3b82f6';
      case 'focused': return '#8b5cf6';
      case 'creative': return '#f59e0b';
      case 'romantic': return '#ec4899';
      case 'melancholic': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getVisualizationElements = () => {
    const baseColor = getMoodColor(mix.baseMood.id);
    const elements = [];

    for (let i = 0; i < 20; i++) {
      elements.push(
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            backgroundColor: baseColor,
            opacity: 0.3 + emotionalIntensity * 0.4,
          }}
          animate={{
            scale: isPlaying ? [1, 1.5, 1] : 1,
            x: isPlaying ? [0, Math.random() * 100 - 50, 0] : 0,
            y: isPlaying ? [0, Math.random() * 100 - 50, 0] : 0,
            opacity: isPlaying ? [0.3, 0.8, 0.3] : 0.3,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
          initial={{
            width: 8 + Math.random() * 16,
            height: 8 + Math.random() * 16,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      );
    }

    return elements;
  };

  const WaveVisualization = () => (
    <div className="relative w-full h-full overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${getMoodColor(mix.baseMood.id)}${Math.floor((0.1 + i * 0.05) * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          }}
          animate={{
            scale: isPlaying ? [1, 1.2 + i * 0.1, 1] : 1,
            rotate: isPlaying ? [0, 360] : 0,
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-6xl"
          animate={{
            scale: isPlaying ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {mix.baseMood.icon}
        </motion.div>
      </div>
    </div>
  );

  const ParticleVisualization = () => (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
      {getVisualizationElements()}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-4xl backdrop-blur-sm bg-background/30 rounded-full p-4"
          animate={{
            rotate: isPlaying ? [0, 360] : 0,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {mix.baseMood.icon}
        </motion.div>
      </div>
    </div>
  );

  const PulseVisualization = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            borderColor: getMoodColor(mix.baseMood.id),
            width: 100 + i * 50,
            height: 100 + i * 50,
          }}
          animate={{
            scale: isPlaying ? [1, 1.3, 1] : 1,
            opacity: isPlaying ? [0.6, 0.2, 0.6] : 0.3,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
      <motion.div
        className="text-5xl z-10"
        animate={{
          scale: isPlaying ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {mix.baseMood.icon}
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Contrôles de visualisation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Visualisation émotionnelle</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setVisualizationType('waves')}
                className={`p-2 rounded-md transition-colors ${
                  visualizationType === 'waves' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <Waves className="h-4 w-4" />
              </button>
              <button
                onClick={() => setVisualizationType('particles')}
                className={`p-2 rounded-md transition-colors ${
                  visualizationType === 'particles' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <Circle className="h-4 w-4" />
              </button>
              <button
                onClick={() => setVisualizationType('pulse')}
                className={`p-2 rounded-md transition-colors ${
                  visualizationType === 'pulse' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <Zap className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Zone de visualisation */}
          <div className="relative w-full h-64 rounded-lg border bg-gradient-to-br from-muted/20 to-background overflow-hidden">
            <AnimatePresence mode="wait">
              {visualizationType === 'waves' && (
                <motion.div
                  key="waves"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <WaveVisualization />
                </motion.div>
              )}
              {visualizationType === 'particles' && (
                <motion.div
                  key="particles"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <ParticleVisualization />
                </motion.div>
              )}
              {visualizationType === 'pulse' && (
                <motion.div
                  key="pulse"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <PulseVisualization />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Overlay d'informations */}
            <div className="absolute top-4 left-4">
              <Badge 
                variant="secondary" 
                className="bg-background/80 backdrop-blur-sm"
              >
                {mix.baseMood.name}
              </Badge>
            </div>

            <div className="absolute top-4 right-4">
              <Badge 
                variant="outline" 
                className="bg-background/80 backdrop-blur-sm"
              >
                {isPlaying ? 'En cours' : 'En pause'}
              </Badge>
            </div>

            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/80 backdrop-blur-sm rounded-md px-2 py-1">
                <Heart className="h-3 w-3" />
                <span>Intensité: {Math.round(emotionalIntensity * 100)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métriques émotionnelles en temps réel */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <motion.div
              animate={{ 
                scale: isPlaying ? [1, 1.1, 1] : 1 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity 
              }}
              className="text-2xl mb-2"
            >
              <Brain className="h-8 w-8 mx-auto text-primary" />
            </motion.div>
            <div className="text-lg font-bold">{mix.baseMood.energyLevel}/10</div>
            <div className="text-sm text-muted-foreground">Énergie</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <motion.div
              animate={{ 
                rotate: isPlaying ? [0, 360] : 0 
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "linear"
              }}
              className="text-2xl mb-2"
            >
              <Heart className="h-8 w-8 mx-auto text-accent" />
            </motion.div>
            <div className="text-lg font-bold">{mix.baseMood.valence}/10</div>
            <div className="text-sm text-muted-foreground">Positivité</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <motion.div
              animate={{ 
                scale: isPlaying ? [1, 1.2, 1] : 1 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity 
              }}
              className="text-2xl mb-2"
            >
              <Zap className="h-8 w-8 mx-auto text-destructive" />
            </motion.div>
            <div className="text-lg font-bold">{mix.baseMood.tempo}</div>
            <div className="text-sm text-muted-foreground">BPM</div>
          </CardContent>
        </Card>
      </div>

      {/* Humeurs complémentaires */}
      {mix.mixedMoods.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Humeurs complémentaires actives</h4>
            <div className="flex gap-3">
              {mix.mixedMoods.map((mood, index) => (
                <motion.div
                  key={mood.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center gap-2 bg-muted/50 rounded-lg p-2"
                >
                  <motion.span
                    animate={{
                      scale: isPlaying ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 2 + index,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-lg"
                  >
                    {mood.icon}
                  </motion.span>
                  <div>
                    <div className="text-sm font-medium">{mood.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(Math.random() * 30 + 10)}% influence
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoodVisualization;