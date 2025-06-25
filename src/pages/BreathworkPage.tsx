
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMood } from '@/hooks/useMood';
import { Wind, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

const BreathworkPage: React.FC = () => {
  const { mood, isLoading } = useMood();
  const [currentTechnique, setCurrentTechnique] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [timer, setTimer] = useState(0);
  const [cycle, setCycle] = useState(0);

  // Techniques adaptées selon l'humeur
  const getTechniquesByMood = () => {
    if (!mood) return defaultTechniques;
    
    const { valence, arousal } = mood;
    
    if (arousal > 70) {
      // Énergie haute -> techniques calmantes
      return techniques.filter(t => t.category === 'calming');
    } else if (valence < 30) {
      // Humeur basse -> techniques énergisantes
      return techniques.filter(t => t.category === 'energizing');
    } else {
      return techniques.filter(t => t.category === 'balanced');
    }
  };

  const techniques = [
    {
      id: 'box-breathing',
      name: 'Respiration Carrée',
      category: 'balanced',
      description: 'Technique 4-4-4-4 pour l\'équilibre et la concentration',
      pattern: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
      cycles: 8,
      color: 'from-blue-400 to-cyan-500',
      benefits: 'Réduit le stress, améliore la concentration'
    },
    {
      id: 'calm-breathing',
      name: 'Respiration Apaisante',
      category: 'calming',
      description: 'Expiration prolongée pour la relaxation profonde',
      pattern: { inhale: 4, hold: 2, exhale: 8, pause: 2 },
      cycles: 6,
      color: 'from-green-400 to-teal-500',
      benefits: 'Calme le système nerveux, favorise la détente'
    },
    {
      id: 'energy-breathing',
      name: 'Respiration Dynamisante',
      category: 'energizing',
      description: 'Technique énergisante pour booster la vitalité',
      pattern: { inhale: 6, hold: 2, exhale: 4, pause: 1 },
      cycles: 10,
      color: 'from-orange-400 to-yellow-500',
      benefits: 'Augmente l\'énergie, améliore l\'humeur'
    }
  ];

  const defaultTechniques = techniques;
  const availableTechniques = getTechniquesByMood();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && currentTechnique) {
      interval = setInterval(() => {
        setTimer(prev => {
          const pattern = currentTechnique.pattern;
          const phaseTimers = {
            inhale: pattern.inhale,
            hold: pattern.hold,
            exhale: pattern.exhale,
            pause: pattern.pause
          };
          
          if (prev >= phaseTimers[phase] - 1) {
            // Passer à la phase suivante
            const phases: Array<'inhale' | 'hold' | 'exhale' | 'pause'> = ['inhale', 'hold', 'exhale', 'pause'];
            const currentIndex = phases.indexOf(phase);
            const nextPhase = phases[(currentIndex + 1) % 4];
            
            setPhase(nextPhase);
            
            if (nextPhase === 'inhale') {
              setCycle(prev => prev + 1);
              if (cycle >= currentTechnique.cycles) {
                setIsActive(false);
                setCycle(0);
                return 0;
              }
            }
            
            return 0;
          }
          
          return prev + 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, phase, currentTechnique, cycle]);

  const startTechnique = (technique: any) => {
    setCurrentTechnique(technique);
    setIsActive(true);
    setPhase('inhale');
    setTimer(0);
    setCycle(0);
  };

  const toggleSession = () => {
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimer(0);
    setCycle(0);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Inspirez lentement...';
      case 'hold': return 'Retenez votre respiration...';
      case 'exhale': return 'Expirez doucement...';
      case 'pause': return 'Pause...';
      default: return '';
    }
  };

  const getCircleSize = () => {
    if (!currentTechnique) return 'w-32 h-32';
    
    const pattern = currentTechnique.pattern;
    const maxTime = Math.max(pattern.inhale, pattern.hold, pattern.exhale, pattern.pause);
    const progress = timer / (pattern[phase] - 1);
    
    if (phase === 'inhale') {
      const scale = 1 + (progress * 0.5);
      return { transform: `scale(${scale})` };
    } else if (phase === 'exhale') {
      const scale = 1.5 - (progress * 0.5);
      return { transform: `scale(${scale})` };
    }
    
    return { transform: 'scale(1.5)' };
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wind className="h-8 w-8 text-cyan-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Breathwork
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Techniques de respiration adaptées pour harmoniser votre état intérieur
          </p>
        </div>

        {/* Session active */}
        {currentTechnique && (
          <Card className="mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${currentTechnique.color} text-white`}>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                {currentTechnique.name}
                <Badge variant="secondary" className="bg-white/20 text-white ml-auto">
                  Cycle {cycle + 1}/{currentTechnique.cycles}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Cercle de respiration */}
                <div className="relative flex items-center justify-center">
                  <div 
                    className={`w-32 h-32 rounded-full bg-gradient-to-r ${currentTechnique.color} opacity-30 transition-transform duration-1000 ease-in-out`}
                    style={getCircleSize()}
                  ></div>
                  <div className="absolute text-white font-bold text-xl">
                    {currentTechnique.pattern[phase] - timer}
                  </div>
                </div>
                
                {/* Instructions */}
                <div className="space-y-2">
                  <div className="text-2xl font-medium text-gray-700">
                    {getPhaseInstruction()}
                  </div>
                  <div className="text-lg text-gray-500 capitalize">
                    {phase}
                  </div>
                </div>

                {/* Contrôles */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={toggleSession}
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                    {isActive ? 'Pause' : 'Reprendre'}
                  </Button>
                  <Button onClick={resetSession} variant="outline" size="lg">
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grille des techniques */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTechniques.map((technique) => (
            <Card 
              key={technique.id}
              className="group hover:scale-105 transition-all duration-300 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl overflow-hidden"
            >
              <CardHeader className={`bg-gradient-to-r ${technique.color} text-white`}>
                <CardTitle className="text-lg">{technique.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">{technique.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Pattern:</span>
                    <span className="font-mono">
                      {technique.pattern.inhale}-{technique.pattern.hold}-{technique.pattern.exhale}-{technique.pattern.pause}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cycles:</span>
                    <span>{technique.cycles}</span>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg">
                  <div className="text-sm text-gray-600">
                    <Sparkles className="h-4 w-4 inline mr-1" />
                    {technique.benefits}
                  </div>
                </div>

                <Button
                  onClick={() => startTechnique(technique)}
                  disabled={currentTechnique?.id === technique.id}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  {currentTechnique?.id === technique.id ? 'En cours...' : 'Commencer'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {mood && (
          <div className="mt-8 text-center">
            <Badge variant="outline" className="bg-white/50">
              Techniques adaptées à votre état émotionnel
            </Badge>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Adaptation des techniques...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreathworkPage;
