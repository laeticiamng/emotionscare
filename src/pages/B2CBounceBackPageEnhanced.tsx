import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Shield, Heart, Zap, TrendingUp, Target, Timer, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface ResilienceChallenge {
  id: string;
  title: string;
  description: string;
  type: 'mental' | 'emotional' | 'physical' | 'social';
  difficulty: number;
  duration: number;
  resilience_boost: number;
  techniques: string[];
  completed?: boolean;
}

interface ResilienceMetrics {
  mental_strength: number;
  emotional_stability: number;
  adaptability: number;
  optimism: number;
  social_support: number;
  overall_resilience: number;
}

const B2CBounceBackPageEnhanced: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<ResilienceChallenge | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingTime, setTrainingTime] = useState(0);
  const [currentIntensity, setCurrentIntensity] = useState(5);
  const [stressLevel, setStressLevel] = useState(3);
  const [resilienceMetrics, setResilienceMetrics] = useState<ResilienceMetrics>({
    mental_strength: 72,
    emotional_stability: 68,
    adaptability: 75,
    optimism: 70,
    social_support: 65,
    overall_resilience: 70
  });

  const { toast } = useToast();

  const resilienceChallenges: ResilienceChallenge[] = [
    {
      id: 'stress-inoculation',
      title: 'Inoculation au Stress',
      description: 'Exposition graduelle au stress pour développer votre résistance',
      type: 'mental',
      difficulty: 3,
      duration: 900, // 15 minutes
      resilience_boost: 15,
      techniques: ['Respiration contrôlée', 'Visualisation positive', 'Auto-talk constructif'],
      completed: false
    },
    {
      id: 'emotional-regulation',
      title: 'Régulation Émotionnelle',
      description: 'Apprenez à gérer vos émotions intenses et retrouver votre équilibre',
      type: 'emotional',
      difficulty: 4,
      duration: 1200, // 20 minutes
      resilience_boost: 20,
      techniques: ['Mindfulness', 'Recadrage cognitif', 'Technique STOP'],
      completed: false
    },
    {
      id: 'adversity-simulation',
      title: 'Simulation d\'Adversité',
      description: 'Affrontez des défis simulés pour renforcer votre capacité d\'adaptation',
      type: 'mental',
      difficulty: 5,
      duration: 1800, // 30 minutes
      resilience_boost: 25,
      techniques: ['Résolution de problèmes', 'Flexibilité cognitive', 'Orientation solution'],
      completed: false
    },
    {
      id: 'social-resilience',
      title: 'Résilience Sociale',
      description: 'Développez votre capacité à rebondir dans les relations interpersonnelles',
      type: 'social',
      difficulty: 3,
      duration: 600, // 10 minutes
      resilience_boost: 18,
      techniques: ['Communication assertive', 'Empathie', 'Gestion de conflit'],
      completed: false
    },
    {
      id: 'optimism-training',
      title: 'Entraînement à l\'Optimisme',
      description: 'Cultivez un état d\'esprit positif et résilient face aux défis',
      type: 'emotional',
      difficulty: 2,
      duration: 480, // 8 minutes
      resilience_boost: 12,
      techniques: ['Gratitude', 'Reframing positif', 'Vision future positive'],
      completed: false
    },
    {
      id: 'recovery-mastery',
      title: 'Maîtrise de la Récupération',
      description: 'Apprenez à récupérer rapidement après un échec ou un revers',
      type: 'physical',
      difficulty: 4,
      duration: 1500, // 25 minutes
      resilience_boost: 22,
      techniques: ['Relaxation progressive', 'Méditation', 'Autosoins'],
      completed: false
    }
  ];

  // Timer d'entraînement
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTraining && trainingTime > 0) {
      interval = setInterval(() => {
        setTrainingTime(prev => {
          if (prev <= 1) {
            completeTraining();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTraining, trainingTime]);

  const startTraining = (challenge: ResilienceChallenge) => {
    setSelectedChallenge(challenge);
    setIsTraining(true);
    setTrainingTime(challenge.duration);
    
    toast({
      title: "Entraînement démarré !",
      description: `${challenge.title} - Durée: ${Math.floor(challenge.duration / 60)} minutes`,
    });
  };

  const completeTraining = () => {
    if (!selectedChallenge) return;
    
    setIsTraining(false);
    
    // Calculer l'amélioration basée sur l'intensité et le niveau de stress
    const effectivenessMultiplier = (currentIntensity / 10) * (1 + (stressLevel / 10));
    const actualBoost = Math.floor(selectedChallenge.resilience_boost * effectivenessMultiplier);
    
    // Mettre à jour les métriques de résilience
    setResilienceMetrics(prev => {
      const newMetrics = { ...prev };
      
      switch (selectedChallenge.type) {
        case 'mental':
          newMetrics.mental_strength = Math.min(100, prev.mental_strength + actualBoost * 0.4);
          newMetrics.adaptability = Math.min(100, prev.adaptability + actualBoost * 0.3);
          break;
        case 'emotional':
          newMetrics.emotional_stability = Math.min(100, prev.emotional_stability + actualBoost * 0.4);
          newMetrics.optimism = Math.min(100, prev.optimism + actualBoost * 0.3);
          break;
        case 'physical':
          newMetrics.mental_strength = Math.min(100, prev.mental_strength + actualBoost * 0.2);
          newMetrics.emotional_stability = Math.min(100, prev.emotional_stability + actualBoost * 0.2);
          break;
        case 'social':
          newMetrics.social_support = Math.min(100, prev.social_support + actualBoost * 0.4);
          newMetrics.optimism = Math.min(100, prev.optimism + actualBoost * 0.2);
          break;
      }
      
      // Recalculer la résilience globale
      newMetrics.overall_resilience = Math.floor(
        (newMetrics.mental_strength + 
         newMetrics.emotional_stability + 
         newMetrics.adaptability + 
         newMetrics.optimism + 
         newMetrics.social_support) / 5
      );
      
      return newMetrics;
    });
    
    // Marquer le défi comme complété
    selectedChallenge.completed = true;
    
    toast({
      title: "Entraînement terminé !",
      description: `Résilience +${actualBoost} points ! Excellent travail !`,
    });
    
    setSelectedChallenge(null);
  };

  const stopTraining = () => {
    setIsTraining(false);
    setTrainingTime(0);
    setSelectedChallenge(null);
    
    toast({
      title: "Entraînement interrompu",
      description: "Vous pouvez reprendre quand vous le souhaitez",
      variant: "destructive"
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeColor = (type: ResilienceChallenge['type']) => {
    switch (type) {
      case 'mental': return 'bg-blue-100 text-blue-800';
      case 'emotional': return 'bg-purple-100 text-purple-800';
      case 'physical': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    if (value >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
            ⚡ Bounce Back Battle
          </h1>
          <p className="text-xl text-gray-300">
            Développez votre résilience et votre capacité à rebondir face aux défis
          </p>
        </motion.div>

        {/* Métriques de résilience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Profil de Résilience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm">Force Mentale</span>
                      <span className={`text-sm font-bold ${getMetricColor(resilienceMetrics.mental_strength)}`}>
                        {resilienceMetrics.mental_strength}%
                      </span>
                    </div>
                    <Progress value={resilienceMetrics.mental_strength} className="bg-slate-700" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm">Stabilité Émotionnelle</span>
                      <span className={`text-sm font-bold ${getMetricColor(resilienceMetrics.emotional_stability)}`}>
                        {resilienceMetrics.emotional_stability}%
                      </span>
                    </div>
                    <Progress value={resilienceMetrics.emotional_stability} className="bg-slate-700" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm">Adaptabilité</span>
                      <span className={`text-sm font-bold ${getMetricColor(resilienceMetrics.adaptability)}`}>
                        {resilienceMetrics.adaptability}%
                      </span>
                    </div>
                    <Progress value={resilienceMetrics.adaptability} className="bg-slate-700" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm">Optimisme</span>
                      <span className={`text-sm font-bold ${getMetricColor(resilienceMetrics.optimism)}`}>
                        {resilienceMetrics.optimism}%
                      </span>
                    </div>
                    <Progress value={resilienceMetrics.optimism} className="bg-slate-700" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm">Support Social</span>
                      <span className={`text-sm font-bold ${getMetricColor(resilienceMetrics.social_support)}`}>
                        {resilienceMetrics.social_support}%
                      </span>
                    </div>
                    <Progress value={resilienceMetrics.social_support} className="bg-slate-700" />
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {resilienceMetrics.overall_resilience}%
                      </div>
                      <div className="text-sm text-blue-100">Résilience Globale</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Interface d'entraînement active */}
        <AnimatePresence>
          {isTraining && selectedChallenge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <Card className="w-full max-w-3xl bg-gradient-to-br from-blue-900 to-indigo-900 border-cyan-400">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="text-6xl mb-4">
                    {selectedChallenge.type === 'mental' && '🧠'}
                    {selectedChallenge.type === 'emotional' && '💙'}
                    {selectedChallenge.type === 'physical' && '💪'}
                    {selectedChallenge.type === 'social' && '🤝'}
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white">
                    {selectedChallenge.title}
                  </h2>
                  
                  <div className="text-5xl font-mono text-cyan-400">
                    {formatTime(trainingTime)}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-black/30 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Techniques Actives:</h3>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {selectedChallenge.techniques.map((technique, i) => (
                          <Badge key={i} className="bg-cyan-600">
                            {technique}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-white text-sm block mb-2">Intensité: {currentIntensity}/10</label>
                        <Slider
                          value={[currentIntensity]}
                          onValueChange={(value) => setCurrentIntensity(value[0])}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="text-white text-sm block mb-2">Niveau de Stress: {stressLevel}/10</label>
                        <Slider
                          value={[stressLevel]}
                          onValueChange={(value) => setStressLevel(value[0])}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={completeTraining}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Award className="w-5 h-5 mr-2" />
                      Terminer
                    </Button>
                    <Button 
                      onClick={stopTraining}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Arrêter
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-300">
                    Restez concentré sur les techniques. Votre résilience se renforce !
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Défis de résilience */}
        {!isTraining && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {resilienceChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
              >
                <Card 
                  className={`bg-black/30 border-white/10 backdrop-blur-xl hover:bg-black/40 transition-all h-full ${
                    challenge.completed ? 'border-green-400' : ''
                  }`}
                  onClick={() => !challenge.completed && startTraining(challenge)}
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">
                        {challenge.type === 'mental' && '🧠'}
                        {challenge.type === 'emotional' && '💙'}
                        {challenge.type === 'physical' && '💪'}
                        {challenge.type === 'social' && '🤝'}
                      </div>
                      <div className="text-right">
                        <Badge className={getTypeColor(challenge.type)}>
                          {challenge.type}
                        </Badge>
                        {challenge.completed && (
                          <Badge className="bg-green-600 mt-1">
                            Complété ✓
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
                      <p className="text-gray-300 text-sm mb-4">{challenge.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Durée:</span>
                        <span className="text-white">{Math.floor(challenge.duration / 60)} min</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Difficulté:</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < challenge.difficulty ? 'bg-red-400' : 'bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Boost:</span>
                        <span className="text-cyan-400">+{challenge.resilience_boost}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-xs text-gray-400 mb-2">Techniques:</div>
                      <div className="flex flex-wrap gap-1">
                        {challenge.techniques.slice(0, 2).map((technique, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-cyan-400 text-cyan-400">
                            {technique}
                          </Badge>
                        ))}
                        {challenge.techniques.length > 2 && (
                          <Badge variant="outline" className="text-xs border-gray-400 text-gray-400">
                            +{challenge.techniques.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4"
                      disabled={challenge.completed}
                    >
                      {challenge.completed ? (
                        <>✅ Complété</>
                      ) : (
                        <>
                          <ArrowUp className="w-4 h-4 mr-2" />
                          S'entraîner
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default B2CBounceBackPageEnhanced;