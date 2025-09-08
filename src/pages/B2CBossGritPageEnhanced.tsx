import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sword, Shield, Trophy, Zap, Target, Timer, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface BossLevel {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: number;
  rewards: string[];
  challenges: string[];
  unlocked?: boolean;
  completed?: boolean;
  currentHP?: number;
  maxHP?: number;
}

interface UserStats {
  level: number;
  grit: number;
  maxGrit: number;
  experience: number;
  victories: number;
  defeats: number;
  currentStreak: number;
  bestStreak: number;
}

const B2CBossGritPageEnhanced: React.FC = () => {
  const [selectedBoss, setSelectedBoss] = useState<BossLevel | null>(null);
  const [isInBattle, setIsInBattle] = useState(false);
  const [battleTimer, setBattleTimer] = useState(0);
  const [userStats, setUserStats] = useState<UserStats>({
    level: 15,
    grit: 85,
    maxGrit: 100,
    experience: 2340,
    victories: 12,
    defeats: 3,
    currentStreak: 4,
    bestStreak: 7
  });

  const { toast } = useToast();

  const bossLevels: BossLevel[] = [
    {
      id: 'procrastination-dragon',
      name: 'Dragon de la Procrastination',
      title: 'Le Maître de l\'Atermoiement',
      description: 'Un boss redoutable qui vous fait remettre à demain ce que vous pouvez faire aujourd\'hui',
      icon: <Crown className="w-8 h-8" />,
      difficulty: 3,
      rewards: ['Concentration +20', 'Productivité Boost', 'Badge Anti-Procrastination'],
      challenges: ['Résister aux distractions', 'Maintenir le focus 30min', 'Terminer 3 tâches importantes'],
      unlocked: true,
      completed: false,
      currentHP: 100,
      maxHP: 100
    },
    {
      id: 'anxiety-shadow',
      name: 'Ombre de l\'Anxiété',
      title: 'La Peur Incarnée',
      description: 'Un adversaire sournois qui amplifie vos doutes et vos craintes',
      icon: <Shield className="w-8 h-8" />,
      difficulty: 4,
      rewards: ['Confiance +25', 'Résistance au Stress', 'Badge Courage'],
      challenges: ['Affronter une peur', 'Méditation 20min', 'Action courageuse'],
      unlocked: true,
      completed: false,
      currentHP: 120,
      maxHP: 120
    },
    {
      id: 'perfectionism-titan',
      name: 'Titan du Perfectionnisme',
      title: 'L\'Ennemi du Progrès',
      description: 'Ce boss vous empêche d\'avancer en exigeant la perfection absolue',
      icon: <Target className="w-8 h-8" />,
      difficulty: 5,
      rewards: ['Agilité +30', 'Acceptance', 'Badge Progress Over Perfection'],
      challenges: ['Publier du travail "imparfait"', 'Itérer rapidement', 'Accepter les erreurs'],
      unlocked: userStats.victories >= 2,
      completed: false,
      currentHP: 150,
      maxHP: 150
    },
    {
      id: 'burnout-demon',
      name: 'Démon du Burn-out',
      title: 'Le Voleur d\'Énergie',
      description: 'L\'ultime adversaire qui draine votre énergie vitale et votre passion',
      icon: <Zap className="w-8 h-8" />,
      difficulty: 6,
      rewards: ['Résilience +40', 'Équilibre Vie-Travail', 'Badge Phoenix'],
      challenges: ['Établir des limites', 'Prendre des pauses', 'Pratiquer l\'auto-compassion'],
      unlocked: userStats.victories >= 5,
      completed: false,
      currentHP: 200,
      maxHP: 200
    }
  ];

  // Timer de bataille
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isInBattle && battleTimer > 0) {
      interval = setInterval(() => {
        setBattleTimer(prev => {
          if (prev <= 1) {
            handleBattleEnd('timeout');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isInBattle, battleTimer]);

  const startBattle = (boss: BossLevel) => {
    if (!boss.unlocked) {
      toast({
        title: "Boss verrouillé",
        description: "Vous devez d'abord vaincre les boss précédents",
        variant: "destructive"
      });
      return;
    }

    setSelectedBoss(boss);
    setIsInBattle(true);
    setBattleTimer(boss.difficulty * 60); // Durée basée sur la difficulté
    
    toast({
      title: "Bataille engagée !",
      description: `Vous affrontez ${boss.name}. Que le combat commence !`,
    });
  };

  const handleBattleEnd = (result: 'victory' | 'defeat' | 'timeout') => {
    setIsInBattle(false);
    setBattleTimer(0);
    
    if (result === 'victory') {
      setUserStats(prev => ({
        ...prev,
        victories: prev.victories + 1,
        currentStreak: prev.currentStreak + 1,
        bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1),
        experience: prev.experience + 100,
        grit: Math.min(prev.maxGrit, prev.grit + 10)
      }));
      
      if (selectedBoss) {
        const updatedBoss = { ...selectedBoss, completed: true };
        setSelectedBoss(updatedBoss);
      }
      
      toast({
        title: "Victoire épique !",
        description: "Vous avez vaincu le boss et gagné en résilience !",
      });
    } else {
      setUserStats(prev => ({
        ...prev,
        defeats: prev.defeats + 1,
        currentStreak: 0
      }));
      
      toast({
        title: result === 'timeout' ? "Temps écoulé" : "Défaite",
        description: "Ne baissez pas les bras, l'échec forge le caractère !",
        variant: "destructive"
      });
    }
    
    setSelectedBoss(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 6 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < difficulty ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-orange-600 bg-clip-text text-transparent">
            👑 Boss Level Grit
          </h1>
          <p className="text-xl text-gray-300">
            Affrontez vos démons intérieurs et développez une résilience légendaire
          </p>
        </motion.div>

        {/* Stats utilisateur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">Niv. {userStats.level}</div>
              <div className="text-sm text-gray-300">Niveau</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{userStats.victories}</div>
              <div className="text-sm text-gray-300">Victoires</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{userStats.currentStreak}</div>
              <div className="text-sm text-gray-300">Série</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{userStats.grit}</div>
              <div className="text-sm text-gray-300">Grit</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Interface de bataille active */}
        <AnimatePresence>
          {isInBattle && selectedBoss && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <Card className="w-full max-w-2xl bg-gradient-to-br from-red-900 to-orange-900 border-yellow-400">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="text-6xl mb-4">
                    {selectedBoss.icon}
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white">
                    {selectedBoss.name}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-white">
                      <span>HP Boss:</span>
                      <span>{selectedBoss.currentHP}/{selectedBoss.maxHP}</span>
                    </div>
                    <Progress value={(selectedBoss.currentHP! / selectedBoss.maxHP!) * 100} className="bg-red-800" />
                    
                    <div className="text-4xl font-mono text-yellow-400">
                      {formatTime(battleTimer)}
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={() => handleBattleEnd('victory')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Sword className="w-5 h-5 mr-2" />
                      Attaquer
                    </Button>
                    <Button 
                      onClick={() => handleBattleEnd('defeat')}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Fuir
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-300">
                    Relevez les défis pour affaiblir le boss !
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sélection des boss */}
        {!isInBattle && (
          <Tabs defaultValue="bosses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bosses" className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Boss Battles
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Progression
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bosses" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bossLevels.map((boss, index) => (
                  <motion.div
                    key={boss.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`bg-black/30 border-white/10 backdrop-blur-xl hover:bg-black/40 transition-all cursor-pointer ${
                        !boss.unlocked ? 'opacity-50' : ''
                      } ${boss.completed ? 'border-green-400' : ''}`}
                      onClick={() => boss.unlocked && !boss.completed && startBattle(boss)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-full ${boss.completed ? 'bg-green-600' : 'bg-red-600'}`}>
                              {boss.icon}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">{boss.name}</h3>
                              <p className="text-sm text-orange-300">{boss.title}</p>
                            </div>
                          </div>
                          {boss.completed && (
                            <Badge className="bg-green-600">
                              Vaincu ✓
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-4">{boss.description}</p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm">Difficulté:</span>
                            <div className="flex gap-1">
                              {getDifficultyStars(boss.difficulty)}
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-white text-sm font-medium">Récompenses:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {boss.rewards.map((reward, i) => (
                                <Badge key={i} variant="outline" className="text-xs border-yellow-400 text-yellow-400">
                                  {reward}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-white text-sm font-medium">Défis:</span>
                            <ul className="text-xs text-gray-300 mt-1 space-y-1">
                              {boss.challenges.map((challenge, i) => (
                                <li key={i}>• {challenge}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full mt-4"
                          disabled={!boss.unlocked || boss.completed}
                          variant={boss.completed ? "outline" : "default"}
                        >
                          {!boss.unlocked ? '🔒 Verrouillé' : 
                           boss.completed ? '✅ Vaincu' : 
                           '⚔️ Affronter'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Statistiques de Combat</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Victoires</span>
                      <span className="text-green-400 font-bold">{userStats.victories}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Défaites</span>
                      <span className="text-red-400 font-bold">{userStats.defeats}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Ratio V/D</span>
                      <span className="text-blue-400 font-bold">
                        {userStats.defeats > 0 ? (userStats.victories / userStats.defeats).toFixed(1) : '∞'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Meilleure série</span>
                      <span className="text-purple-400 font-bold">{userStats.bestStreak}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Développement du Grit</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-white mb-2">
                        <span>Niveau de Grit</span>
                        <span>{userStats.grit}/{userStats.maxGrit}</span>
                      </div>
                      <Progress value={(userStats.grit / userStats.maxGrit) * 100} className="bg-red-800" />
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-300">
                      <div>• Chaque victoire augmente votre Grit</div>
                      <div>• Les défaites enseignent la persévérance</div>
                      <div>• La série amplifie vos gains</div>
                      <div>• Le Grit débloque de nouveaux boss</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default B2CBossGritPageEnhanced;