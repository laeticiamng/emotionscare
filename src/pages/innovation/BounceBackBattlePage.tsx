
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, Sword, Heart, Zap, Timer, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const BounceBackBattlePage: React.FC = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const [resilience, setResilience] = useState(85);
  const [energy, setEnergy] = useState(70);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [battleActive, setBattleActive] = useState(false);
  
  const challenges = [
    {
      type: 'stress',
      title: 'Tempête de Stress',
      description: 'Une situation professionnelle difficile vous submarge',
      icon: <Zap className="h-6 w-6" />,
      difficulty: 3,
      strategies: ['Respiration 4-7-8', 'Recentrage mental', 'Perspective positive']
    },
    {
      type: 'conflict',
      title: 'Conflit Interpersonnel',
      description: 'Une dispute avec un proche vous affecte',
      icon: <Users className="h-6 w-6" />,
      difficulty: 2,
      strategies: ['Écoute active', 'Communication assertive', 'Empathie']
    },
    {
      type: 'failure',
      title: 'Échec Personnel',
      description: 'Un projet important n\'a pas abouti comme prévu',
      icon: <Shield className="h-6 w-6" />,
      difficulty: 4,
      strategies: ['Analyse constructive', 'Plan d\'action', 'Auto-compassion']
    }
  ];
  
  const [currentChallenge, setCurrentChallenge] = useState(challenges[0]);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (battleActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setBattleActive(false);
    }
    return () => clearInterval(interval);
  }, [battleActive, timeLeft]);

  const startBattle = () => {
    setBattleActive(true);
    setTimeLeft(300);
    setScore(0);
    setCurrentRound(1);
    setResilience(85);
    setEnergy(70);
  };

  const handleStrategy = (strategy: string) => {
    setSelectedStrategy(strategy);
    
    // Calcul du score basé sur la stratégie et la difficulté
    const baseScore = Math.floor(Math.random() * 20) + 10;
    const difficultyBonus = currentChallenge.difficulty * 5;
    const newScore = baseScore + difficultyBonus;
    
    setScore(prev => prev + newScore);
    setResilience(prev => Math.min(100, prev + 5));
    setEnergy(prev => Math.max(0, prev - 10));
    
    // Passer au défi suivant après 2 secondes
    setTimeout(() => {
      if (currentRound < 3) {
        setCurrentRound(prev => prev + 1);
        setCurrentChallenge(challenges[currentRound]);
        setSelectedStrategy(null);
      } else {
        setBattleActive(false);
      }
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 mb-4">
            Bounce Back Battle
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Entraînez votre résilience face aux défis de la vie
          </p>
        </motion.div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-400">{resilience}%</div>
              <div className="text-sm text-gray-400">Résilience</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-red-400">{energy}%</div>
              <div className="text-sm text-gray-400">Énergie</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Timer className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-yellow-400">{formatTime(timeLeft)}</div>
              <div className="text-sm text-gray-400">Temps</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Sword className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-400">{score}</div>
              <div className="text-sm text-gray-400">Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Battle Arena */}
        {!battleActive ? (
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="p-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={startBattle}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xl px-8 py-4"
                >
                  <Sword className="mr-2 h-6 w-6" />
                  Commencer la Bataille
                </Button>
              </motion.div>
              <p className="text-gray-300 mt-4">
                Affrontez des défis émotionnels et développez votre résilience
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  {currentChallenge.icon}
                  Round {currentRound}/3: {currentChallenge.title}
                </CardTitle>
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  Difficulté: {currentChallenge.difficulty}/5
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-gray-300 text-lg mb-4">{currentChallenge.description}</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentRound / 3) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Choisissez votre stratégie de résilience :</h3>
                <div className="grid gap-3">
                  {currentChallenge.strategies.map((strategy, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => handleStrategy(strategy)}
                        disabled={selectedStrategy !== null}
                        variant={selectedStrategy === strategy ? "default" : "outline"}
                        className="w-full justify-start h-auto p-4 text-left"
                      >
                        {strategy}
                      </Button>
                    </motion.div>
                  ))}
                </div>
                
                {selectedStrategy && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg"
                  >
                    <p className="text-green-300">
                      Excellente stratégie ! Vous avez gagné {Math.floor(Math.random() * 20) + 10} points de résilience.
                    </p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Summary */}
        {!battleActive && score > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-green-800/50 to-blue-800/50 border-green-500/50">
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold text-green-400 mb-4">Bataille Terminée !</h3>
                <p className="text-gray-300 mb-4">
                  Vous avez développé votre résilience face aux défis. Score final: <span className="text-yellow-400 font-bold">{score}</span>
                </p>
                <Button
                  onClick={startBattle}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Nouvelle Bataille
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BounceBackBattlePage;
