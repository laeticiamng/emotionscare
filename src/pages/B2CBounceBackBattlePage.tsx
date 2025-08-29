import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Zap, 
  Shield, 
  Target, 
  Trophy, 
  Heart, 
  Brain,
  Star,
  Clock,
  Flame,
  RotateCcw,
  Play,
  Pause,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  type: 'scenario' | 'reaction' | 'endurance';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  duration: number; // seconds
  scenarioText: string;
  expectedResponse: string;
  stressLevel: number;
}

interface BattleStats {
  resilience: number;
  adaptability: number;
  stressManagement: number;
  recoverySpeed: number;
  mentalStrength: number;
}

const B2CBounceBackBattlePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  usePageMetadata('Bounce Back Battle', 'Entraînement à la résilience émotionnelle', '/app/bounce-back', 'engaged');

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'completed'>('ready');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [battlesCompleted, setBattlesCompleted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState([2]);
  const [battleStats, setBattleStats] = useState<BattleStats>({
    resilience: 65,
    adaptability: 70,
    stressManagement: 60,
    recoverySpeed: 75,
    mentalStrength: 68
  });

  const challenges: Challenge[] = [
    {
      id: 'workplace-pressure',
      type: 'scenario',
      title: 'Pression Professionnelle',
      description: 'Gérez une deadline impossible avec calme',
      difficulty: 'medium',
      duration: 45,
      scenarioText: 'Votre chef vous demande de finir un projet en 2h au lieu de 2 jours. L\'équipe vous regarde. Que faites-vous ?',
      expectedResponse: 'Je communique calmement sur la faisabilité et propose des alternatives',
      stressLevel: 70
    },
    {
      id: 'social-rejection',
      type: 'reaction',
      title: 'Rejet Social',
      description: 'Rebondissez après une critique publique',
      difficulty: 'hard',
      duration: 60,
      scenarioText: 'En réunion, vos idées sont publiquement critiquées et rejetées. Tous vous regardent.',
      expectedResponse: 'Je reste calme, j\'écoute les retours et je propose d\'améliorer ma proposition',
      stressLevel: 85
    },
    {
      id: 'failure-recovery',
      type: 'endurance',
      title: 'Récupération d\'Échec',
      description: 'Transformez un échec en opportunité d\'apprentissage',
      difficulty: 'expert',
      duration: 90,
      scenarioText: 'Votre projet de 6 mois vient d\'échouer. Votre équipe est démotivée. Comment rebondissez-vous ?',
      expectedResponse: 'J\'analyse les leçons apprises, je remotivise l\'équipe et je propose un nouveau plan',
      stressLevel: 95
    },
    {
      id: 'personal-criticism',
      type: 'reaction',
      title: 'Critique Personnelle',
      description: 'Gérez une critique personnelle blessante',
      difficulty: 'medium',
      duration: 30,
      scenarioText: 'Un proche remet en question vos capacités et votre valeur personnelle.',
      expectedResponse: 'Je prends du recul, je ne prends pas les attaques personnellement et je communique mes limites',
      stressLevel: 75
    },
    {
      id: 'financial-stress',
      type: 'endurance',
      title: 'Stress Financier',
      description: 'Restez optimiste face aux difficultés financières',
      difficulty: 'hard',
      duration: 120,
      scenarioText: 'Vos revenus chutent drastiquement. Les factures s\'accumulent. L\'anxiété monte.',
      expectedResponse: 'Je fais un plan d\'action concret, je cherche du soutien et je me concentre sur les solutions',
      stressLevel: 90
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeChallenge();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeRemaining]);

  const startBattle = () => {
    const difficulty = ['easy', 'medium', 'hard', 'expert'][difficultyLevel[0] - 1] as 'easy' | 'medium' | 'hard' | 'expert';
    const availableChallenges = challenges.filter(c => c.difficulty === difficulty);
    const randomChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
    
    setCurrentChallenge(randomChallenge);
    setTimeRemaining(randomChallenge.duration);
    setChallengeProgress(0);
    setGameState('playing');
    
    toast({
      title: "Défi lancé !",
      description: `${randomChallenge.title} - ${randomChallenge.duration}s`,
    });
  };

  const completeChallenge = () => {
    if (currentChallenge) {
      setBattlesCompleted(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);
      
      // Amélioration des stats basée sur le type de défi
      setBattleStats(prev => {
        const improvement = currentChallenge.difficulty === 'expert' ? 3 : 
                           currentChallenge.difficulty === 'hard' ? 2 : 1;
        
        switch (currentChallenge.type) {
          case 'scenario':
            return { ...prev, resilience: Math.min(100, prev.resilience + improvement) };
          case 'reaction':
            return { ...prev, adaptability: Math.min(100, prev.adaptability + improvement) };
          case 'endurance':
            return { ...prev, mentalStrength: Math.min(100, prev.mentalStrength + improvement) };
          default:
            return prev;
        }
      });
    }
    
    setGameState('completed');
    toast({
      title: "Défi réussi !",
      description: `Votre résilience s'améliore. Série: ${currentStreak + 1}`,
    });
  };

  const pauseBattle = () => {
    setGameState('paused');
  };

  const resumeBattle = () => {
    setGameState('playing');
  };

  const resetBattle = () => {
    setGameState('ready');
    setCurrentChallenge(null);
    setTimeRemaining(0);
    setChallengeProgress(0);
  };

  const getDifficultyColor = () => {
    const colors = ['text-green-600', 'text-yellow-600', 'text-orange-600', 'text-red-600'];
    return colors[difficultyLevel[0] - 1];
  };

  const getDifficultyLabel = () => {
    const labels = ['Facile', 'Moyen', 'Difficile', 'Expert'];
    return labels[difficultyLevel[0] - 1];
  };

  const getStatsAverage = () => {
    const values = Object.values(battleStats);
    return Math.round(values.reduce((acc, val) => acc + val, 0) / values.length);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/app/home')}
            className="hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bounce Back Battle</h1>
            <p className="text-gray-600">Entraînement intensif à la résilience émotionnelle</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Zone de jeu principale */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"
                animate={gameState === 'playing' ? { scale: 1.02, opacity: 0.15 } : { scale: 1, opacity: 0.1 }}
              />
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-orange-500" />
                    Zone de Combat
                  </div>
                  <Badge variant={gameState === 'playing' ? "default" : "secondary"}>
                    {gameState === 'playing' ? 'En Combat' : 
                     gameState === 'paused' ? 'En Pause' :
                     gameState === 'completed' ? 'Terminé' : 'Prêt'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {gameState === 'ready' && (
                  <div className="text-center space-y-6">
                    <div className="space-y-4">
                      <Target className="w-16 h-16 mx-auto text-orange-500" />
                      <h3 className="text-2xl font-bold">Prêt pour le Combat ?</h3>
                      <p className="text-gray-600">
                        Affrontez des défis de résilience adaptés à votre niveau. 
                        Chaque victoire renforce votre capacité à rebondir.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Niveau de Difficulté</label>
                        <Badge variant="outline" className={getDifficultyColor()}>
                          {getDifficultyLabel()}
                        </Badge>
                      </div>
                      <Slider
                        value={difficultyLevel}
                        onValueChange={setDifficultyLevel}
                        max={4}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Facile</span>
                        <span>Moyen</span>
                        <span>Difficile</span>
                        <span>Expert</span>
                      </div>
                    </div>

                    <Button 
                      onClick={startBattle}
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-red-500"
                    >
                      <Flame className="w-5 h-5 mr-2" />
                      Lancer le Défi
                    </Button>
                  </div>
                )}

                {(gameState === 'playing' || gameState === 'paused') && currentChallenge && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Badge variant="outline" className="mb-4">
                        {currentChallenge.type.toUpperCase()} - {currentChallenge.difficulty.toUpperCase()}
                      </Badge>
                      <h3 className="text-xl font-bold mb-2">{currentChallenge.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{currentChallenge.description}</p>
                    </div>

                    {/* Timer */}
                    <div className="text-center">
                      <div className="text-4xl font-mono font-bold text-orange-600 mb-2">
                        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                      </div>
                      <Progress 
                        value={(1 - timeRemaining / currentChallenge.duration) * 100} 
                        className="w-full h-2"
                      />
                    </div>

                    {/* Scénario */}
                    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          Scénario de Défi
                        </h4>
                        <p className="text-sm italic mb-4">"{currentChallenge.scenarioText}"</p>
                        
                        <div className="flex items-center gap-2 text-xs">
                          <Zap className="w-3 h-3 text-red-500" />
                          <span>Niveau de stress: </span>
                          <Progress value={currentChallenge.stressLevel} className="w-20 h-1" />
                          <span>{currentChallenge.stressLevel}%</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Contrôles */}
                    <div className="flex gap-4 justify-center">
                      {gameState === 'playing' ? (
                        <Button onClick={pauseBattle} variant="outline">
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button onClick={resumeBattle}>
                          <Play className="w-4 h-4 mr-2" />
                          Reprendre
                        </Button>
                      )}
                      
                      <Button onClick={completeChallenge} size="lg">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Je gère la situation
                      </Button>
                      
                      <Button onClick={resetBattle} variant="destructive">
                        Abandonner
                      </Button>
                    </div>
                  </div>
                )}

                {gameState === 'completed' && (
                  <div className="text-center space-y-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                      <h3 className="text-2xl font-bold text-green-600 mb-2">Défi Réussi !</h3>
                      <p className="text-gray-600 mb-4">
                        Excellente gestion de la situation. Votre résilience se renforce.
                      </p>
                    </motion.div>

                    {currentChallenge && (
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">Réponse optimale :</h4>
                          <p className="text-sm italic">"{currentChallenge.expectedResponse}"</p>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex gap-4 justify-center">
                      <Button onClick={startBattle}>
                        <Flame className="w-4 h-4 mr-2" />
                        Nouveau Défi
                      </Button>
                      <Button onClick={resetBattle} variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Menu Principal
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panneau des statistiques */}
          <div className="space-y-6">
            {/* Stats de combat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Statistiques de Combat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {getStatsAverage()}%
                  </div>
                  <div className="text-sm text-gray-600">Résilience Globale</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-2 bg-orange-50 rounded">
                    <div className="text-lg font-bold text-orange-600">{battlesCompleted}</div>
                    <div className="text-xs text-gray-600">Combats Gagnés</div>
                  </div>
                  <div className="p-2 bg-red-50 rounded">
                    <div className="text-lg font-bold text-red-600">{currentStreak}</div>
                    <div className="text-xs text-gray-600">Série Actuelle</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détail des compétences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Compétences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(battleStats).map(([skill, value]) => (
                  <div key={skill} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">
                        {skill.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <Badge variant="outline">{value}%</Badge>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Badges et achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Badges de Résilience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-lg mb-1">🏆</div>
                    <div className="text-xs text-gray-600">Premier Combat</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded opacity-50">
                    <div className="text-lg mb-1">🔥</div>
                    <div className="text-xs text-gray-600">Série de 5</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded opacity-50">
                    <div className="text-lg mb-1">⚡</div>
                    <div className="text-xs text-gray-600">Expert</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded opacity-50">
                    <div className="text-lg mb-1">🛡️</div>
                    <div className="text-xs text-gray-600">Incassable</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conseils */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Conseil du Jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  "La résilience ne consiste pas à éviter les défis, mais à apprendre à rebondir plus fort après chaque épreuve."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CBounceBackBattlePage;