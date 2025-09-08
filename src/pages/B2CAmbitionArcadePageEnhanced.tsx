import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Trophy, Target, Rocket, Star, Zap, Timer, Medal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ArcadeGame {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'motivation' | 'focus' | 'creativity' | 'persistence';
  difficulty: number;
  playTime: number;
  points: number;
  unlocked: boolean;
  highScore: number;
  theme: string;
}

interface GameSession {
  gameId: string;
  score: number;
  duration: number;
  completed: boolean;
  achievements: string[];
}

const B2CAmbitionArcadePageEnhanced: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<ArcadeGame | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [playerStats, setPlayerStats] = useState({
    totalPoints: 4520,
    gamesPlayed: 23,
    achievements: 8,
    level: 7,
    streak: 3
  });

  const { toast } = useToast();

  const arcadeGames: ArcadeGame[] = [
    {
      id: 'goal-rush',
      name: 'Goal Rush',
      description: 'Course effrénée vers vos objectifs ! Collectez des motivations et évitez les obstacles.',
      icon: <Target className="w-6 h-6" />,
      category: 'motivation',
      difficulty: 2,
      playTime: 300,
      points: 150,
      unlocked: true,
      highScore: 2340,
      theme: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'focus-defender',
      name: 'Focus Defender',
      description: 'Défendez votre concentration contre les distractions qui attaquent !',
      icon: <Zap className="w-6 h-6" />,
      category: 'focus',
      difficulty: 3,
      playTime: 240,
      points: 200,
      unlocked: true,
      highScore: 1890,
      theme: 'from-purple-500 to-pink-500'
    },
    {
      id: 'dream-builder',
      name: 'Dream Builder',
      description: 'Construisez vos rêves pièce par pièce dans ce puzzle créatif.',
      icon: <Star className="w-6 h-6" />,
      category: 'creativity',
      difficulty: 2,
      playTime: 420,
      points: 180,
      unlocked: true,
      highScore: 3120,
      theme: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'persistence-platformer',
      name: 'Persistence Platformer',
      description: 'Plateforme difficile qui vous apprend à ne jamais abandonner.',
      icon: <Rocket className="w-6 h-6" />,
      category: 'persistence',
      difficulty: 4,
      playTime: 360,
      points: 250,
      unlocked: playerStats.level >= 5,
      highScore: 4560,
      theme: 'from-red-500 to-pink-500'
    },
    {
      id: 'ambition-arena',
      name: 'Ambition Arena',
      description: 'Combat épique contre vos limitations intérieures.',
      icon: <Trophy className="w-6 h-6" />,
      category: 'motivation',
      difficulty: 5,
      playTime: 480,
      points: 300,
      unlocked: playerStats.achievements >= 5,
      highScore: 5670,
      theme: 'from-green-500 to-teal-500'
    },
    {
      id: 'flow-state-runner',
      name: 'Flow State Runner',
      description: 'Course infinie dans l\'état de flow parfait.',
      icon: <Medal className="w-6 h-6" />,
      category: 'focus',
      difficulty: 3,
      playTime: 600,
      points: 220,
      unlocked: playerStats.gamesPlayed >= 10,
      highScore: 7890,
      theme: 'from-indigo-500 to-blue-500'
    }
  ];

  // Timer de jeu
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && gameTime > 0) {
      interval = setInterval(() => {
        setGameTime(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
        
        // Simulation de score qui augmente
        setCurrentScore(prev => prev + Math.floor(Math.random() * 10) + 5);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, gameTime]);

  const startGame = (game: ArcadeGame) => {
    if (!game.unlocked) {
      toast({
        title: "Jeu verrouillé",
        description: "Vous devez remplir les conditions pour débloquer ce jeu",
        variant: "destructive"
      });
      return;
    }

    setSelectedGame(game);
    setIsPlaying(true);
    setGameTime(game.playTime);
    setCurrentScore(0);
    
    toast({
      title: `${game.name} démarré !`,
      description: `Vous avez ${Math.floor(game.playTime / 60)} minutes pour faire le meilleur score !`,
    });
  };

  const endGame = () => {
    if (!selectedGame) return;
    
    setIsPlaying(false);
    
    const isNewHighScore = currentScore > selectedGame.highScore;
    const pointsEarned = Math.floor(currentScore / 10);
    
    if (isNewHighScore) {
      selectedGame.highScore = currentScore;
      toast({
        title: "Nouveau record !",
        description: `Félicitations ! Vous avez battu votre précédent record !`,
      });
    }
    
    setPlayerStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + pointsEarned,
      gamesPlayed: prev.gamesPlayed + 1,
      achievements: isNewHighScore ? prev.achievements + 1 : prev.achievements
    }));
    
    toast({
      title: "Partie terminée",
      description: `Score: ${currentScore.toLocaleString()} | Points gagnés: ${pointsEarned}`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (category: ArcadeGame['category']) => {
    switch (category) {
      case 'motivation': return 'bg-blue-100 text-blue-800';
      case 'focus': return 'bg-purple-100 text-purple-800';
      case 'creativity': return 'bg-yellow-100 text-yellow-800';
      case 'persistence': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < difficulty ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🎮 Ambition Arcade
          </h1>
          <p className="text-xl text-gray-300">
            Développez votre ambition et votre motivation à travers des jeux immersifs
          </p>
        </motion.div>

        {/* Stats du joueur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{playerStats.level}</div>
              <div className="text-sm text-gray-300">Niveau</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{playerStats.totalPoints.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Points</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-400">{playerStats.gamesPlayed}</div>
              <div className="text-sm text-gray-300">Parties</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{playerStats.achievements}</div>
              <div className="text-sm text-gray-300">Succès</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{playerStats.streak}</div>
              <div className="text-sm text-gray-300">Série</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Interface de jeu active */}
        <AnimatePresence>
          {isPlaying && selectedGame && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <Card className={`w-full max-w-4xl bg-gradient-to-br ${selectedGame.theme} border-white/20`}>
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="text-6xl mb-4">
                      {selectedGame.icon}
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white">
                      {selectedGame.name}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{currentScore.toLocaleString()}</div>
                        <div className="text-sm opacity-80">Score</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold">{formatTime(gameTime)}</div>
                        <div className="text-sm opacity-80">Temps restant</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold">{selectedGame.highScore.toLocaleString()}</div>
                        <div className="text-sm opacity-80">Record</div>
                      </div>
                    </div>
                    
                    {/* Zone de jeu simulée */}
                    <div className="bg-black/30 rounded-lg p-8 min-h-64 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="text-8xl"
                        >
                          🎯
                        </motion.div>
                        <div className="text-white text-lg">
                          Jeu en cours... Score en augmentation !
                        </div>
                        <Progress value={(currentScore % 100)} className="w-64 mx-auto" />
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <Button 
                        onClick={() => setCurrentScore(prev => prev + 100)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        Power-Up !
                      </Button>
                      <Button 
                        onClick={endGame}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Terminer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sélection des jeux */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {arcadeGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
              >
                <Card 
                  className={`bg-black/30 border-white/10 backdrop-blur-xl hover:bg-black/40 transition-all h-full ${
                    !game.unlocked ? 'opacity-50' : ''
                  }`}
                  onClick={() => game.unlocked && startGame(game)}
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-full bg-gradient-to-br ${game.theme}`}>
                        {game.icon}
                      </div>
                      <div className="text-right">
                        <Badge className={getCategoryColor(game.category)}>
                          {game.category}
                        </Badge>
                        <div className="flex gap-1 mt-1">
                          {getDifficultyStars(game.difficulty)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                      <p className="text-gray-300 text-sm mb-4">{game.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Durée:</span>
                        <span className="text-white">{Math.floor(game.playTime / 60)} min</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Points max:</span>
                        <span className="text-yellow-400">{game.points}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Record:</span>
                        <span className="text-green-400">{game.highScore.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4"
                      disabled={!game.unlocked}
                    >
                      {!game.unlocked ? (
                        <>🔒 Verrouillé</>
                      ) : (
                        <>
                          <Gamepad2 className="w-4 h-4 mr-2" />
                          Jouer
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Leaderboard et succès */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Top Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {arcadeGames
                  .filter(game => game.unlocked)
                  .sort((a, b) => b.highScore - a.highScore)
                  .slice(0, 5)
                  .map((game, index) => (
                    <div key={game.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                      <div className="text-lg">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{game.name}</div>
                        <div className="text-gray-400 text-xs">{game.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold">{game.highScore.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Medal className="w-5 h-5" />
                Succès Récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Premier pas', desc: 'Jouez à votre premier jeu', icon: '🎮', unlocked: true },
                  { name: 'Concentration', desc: 'Atteignez 1000 points en Focus Defender', icon: '🎯', unlocked: true },
                  { name: 'Créatif', desc: 'Complétez Dream Builder', icon: '🌟', unlocked: true },
                  { name: 'Persistant', desc: 'Jouez 5 jours consécutifs', icon: '🔥', unlocked: playerStats.streak >= 3 },
                  { name: 'Maître arcade', desc: 'Débloquez tous les jeux', icon: '👑', unlocked: false }
                ].map((achievement, index) => (
                  <div 
                    key={achievement.name} 
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-green-900/30' : 'bg-gray-900/30'
                    }`}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className={`font-medium ${achievement.unlocked ? 'text-green-400' : 'text-gray-400'}`}>
                        {achievement.name}
                      </div>
                      <div className="text-xs text-gray-500">{achievement.desc}</div>
                    </div>
                    {achievement.unlocked && (
                      <div className="text-green-400">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2CAmbitionArcadePageEnhanced;