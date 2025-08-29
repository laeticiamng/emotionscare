import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Trophy, Target, Gamepad2, Zap, Star, 
         Crown, Flame, Award, TrendingUp, Clock, Play, 
         Pause, RotateCcw, Users, Gift, Sparkles, CheckCircle } from 'lucide-react';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface ArcadeGame {
  id: string;
  title: string;
  description: string;
  category: 'productivity' | 'habits' | 'learning' | 'fitness' | 'mindfulness';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timeLimit: number; // minutes
  points: number;
  status: 'available' | 'playing' | 'completed' | 'locked';
  progress: number;
  icon: string;
  mechanics: string[];
  achievements: string[];
  leaderboard?: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

interface PlayerStats {
  level: number;
  xp: number;
  xpToNext: number;
  gamesPlayed: number;
  gamesWon: number;
  totalPlayTime: number;
  streakDays: number;
  rank: string;
}

const AmbitionArcadePage: React.FC = () => {
  usePageMetadata('Ambition Arcade', 'Transformez vos objectifs en jeux motivants', '/app/ambition-arcade', 'energized');
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('games');
  const [games, setGames] = useState<ArcadeGame[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [currentGame, setCurrentGame] = useState<ArcadeGame | null>(null);
  const [gameTimer, setGameTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadGames();
    loadAchievements();
    loadPlayerStats();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentGame) {
      interval = setInterval(() => {
        setGameTimer(prev => {
          if (prev >= currentGame.timeLimit * 60) {
            endGame();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentGame]);

  const loadGames = () => {
    const arcadeGames: ArcadeGame[] = [
      {
        id: '1',
        title: 'Focus Sprint',
        description: 'Travaillez sans distraction pendant 25 minutes',
        category: 'productivity',
        difficulty: 'easy',
        timeLimit: 25,
        points: 100,
        status: 'available',
        progress: 0,
        icon: '🎯',
        mechanics: ['Pomodoro Timer', 'Focus Tracking', 'Distraction Blocker'],
        achievements: ['Focus Master', 'Zero Distraction', 'Speed Demon'],
        leaderboard: true
      },
      {
        id: '2',
        title: 'Habit Builder',
        description: 'Construisez une nouvelle habitude sur 21 jours',
        category: 'habits',
        difficulty: 'medium',
        timeLimit: 10,
        points: 300,
        status: 'available',
        progress: 0,
        icon: '🏗️',
        mechanics: ['Daily Check-ins', 'Streak Counter', 'Habit Stack'],
        achievements: ['Habit Hero', '21 Day Warrior', 'Consistency King'],
        leaderboard: true
      },
      {
        id: '3',
        title: 'Knowledge Quest',
        description: 'Apprenez quelque chose de nouveau chaque jour',
        category: 'learning',
        difficulty: 'medium',
        timeLimit: 15,
        points: 200,
        status: 'available',
        progress: 0,
        icon: '📚',
        mechanics: ['Daily Facts', 'Quiz Challenges', 'Progress Tracking'],
        achievements: ['Curious Mind', 'Fact Collector', 'Knowledge Master'],
        leaderboard: false
      },
      {
        id: '4',
        title: 'Fitness Fighter',
        description: 'Complétez des défis sportifs quotidiens',
        category: 'fitness',
        difficulty: 'hard',
        timeLimit: 30,
        points: 250,
        status: 'locked',
        progress: 0,
        icon: '💪',
        mechanics: ['Exercise Challenges', 'Rep Counter', 'Progress Photos'],
        achievements: ['Fitness Warrior', 'Strong Body', 'Endurance Beast'],
        leaderboard: true
      },
      {
        id: '5',
        title: 'Zen Master',
        description: 'Pratiquez la méditation et la pleine conscience',
        category: 'mindfulness',
        difficulty: 'easy',
        timeLimit: 20,
        points: 150,
        status: 'available',
        progress: 0,
        icon: '🧘',
        mechanics: ['Breathing Timer', 'Mindfulness Exercises', 'Calm Tracker'],
        achievements: ['Inner Peace', 'Meditation Monk', 'Zen Champion'],
        leaderboard: false
      },
      {
        id: '6',
        title: 'Goal Crusher',
        description: 'Décomposez et atteignez vos objectifs ambitieux',
        category: 'productivity',
        difficulty: 'expert',
        timeLimit: 45,
        points: 500,
        status: 'locked',
        progress: 0,
        icon: '🎖️',
        mechanics: ['Goal Breakdown', 'Milestone Tracking', 'Success Metrics'],
        achievements: ['Goal Getter', 'Dream Achiever', 'Success Legend'],
        leaderboard: true
      }
    ];
    setGames(arcadeGames);
  };

  const loadAchievements = () => {
    const playerAchievements: Achievement[] = [
      {
        id: '1',
        name: 'First Steps',
        description: 'Jouer à votre premier jeu',
        icon: '👶',
        points: 10,
        rarity: 'common',
        unlockedAt: new Date().toISOString(),
        progress: 1,
        maxProgress: 1
      },
      {
        id: '2',
        name: 'Focus Master',
        description: 'Compléter 10 sessions Focus Sprint',
        icon: '🎯',
        points: 100,
        rarity: 'rare',
        progress: 7,
        maxProgress: 10
      },
      {
        id: '3',
        name: 'Habit Hero',
        description: 'Maintenir une habitude pendant 30 jours',
        icon: '🦸',
        points: 300,
        rarity: 'epic',
        progress: 12,
        maxProgress: 30
      },
      {
        id: '4',
        name: 'Zen Champion',
        description: 'Méditer 100 heures au total',
        icon: '🏆',
        points: 500,
        rarity: 'legendary',
        progress: 45,
        maxProgress: 100
      },
      {
        id: '5',
        name: 'Speed Demon',
        description: 'Terminer un Focus Sprint en temps record',
        icon: '⚡',
        points: 50,
        rarity: 'rare',
        progress: 0,
        maxProgress: 1
      }
    ];
    setAchievements(playerAchievements);
  };

  const loadPlayerStats = () => {
    const stats: PlayerStats = {
      level: 8,
      xp: 2350,
      xpToNext: 650,
      gamesPlayed: 47,
      gamesWon: 32,
      totalPlayTime: 1380, // minutes
      streakDays: 12,
      rank: 'Ambitious Player'
    };
    setPlayerStats(stats);
  };

  const startGame = (game: ArcadeGame) => {
    setCurrentGame(game);
    setGameTimer(0);
    setIsPlaying(true);
    
    const updatedGames = games.map(g => 
      g.id === game.id ? { ...g, status: 'playing' as const } : g
    );
    setGames(updatedGames);
  };

  const pauseGame = () => {
    setIsPlaying(false);
  };

  const resumeGame = () => {
    setIsPlaying(true);
  };

  const endGame = () => {
    if (!currentGame) return;
    
    setIsPlaying(false);
    const updatedGames = games.map(g => 
      g.id === currentGame.id ? { 
        ...g, 
        status: 'completed' as const, 
        progress: 100 
      } : g
    );
    setGames(updatedGames);
    
    // Award XP and update stats
    if (playerStats) {
      setPlayerStats(prev => prev ? {
        ...prev,
        xp: prev.xp + currentGame.points,
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: prev.gamesWon + 1,
        totalPlayTime: prev.totalPlayTime + Math.floor(gameTimer / 60)
      } : null);
    }
    
    setCurrentGame(null);
    setGameTimer(0);
  };

  const resetGame = () => {
    setGameTimer(0);
    setIsPlaying(false);
  };

  const getCategoryIcon = (category: ArcadeGame['category']) => {
    switch (category) {
      case 'productivity': return Target;
      case 'habits': return TrendingUp;
      case 'learning': return Star;
      case 'fitness': return Zap;
      case 'mindfulness': return Sparkles;
      default: return Gamepad2;
    }
  };

  const getDifficultyColor = (difficulty: ArcadeGame['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const winRate = playerStats ? Math.round((playerStats.gamesWon / playerStats.gamesPlayed) * 100) : 0;

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/app/home')}
              className="hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ambition Arcade</h1>
              <p className="text-gray-600">Gamifiez vos objectifs et boostez votre motivation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {playerStats?.level || 0}
              </div>
              <div className="text-sm text-gray-600">Niveau</div>
            </div>
            <div className="flex items-center gap-2 bg-purple-100 px-3 py-2 rounded-lg">
              <Flame className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-purple-600">
                {playerStats?.streakDays || 0} jours
              </span>
            </div>
          </div>
        </div>

        {/* Profil joueur */}
        {playerStats && (
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Crown className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{playerStats.rank}</h2>
                    <p className="text-purple-100">Niveau {playerStats.level}</p>
                    <p className="text-sm text-purple-200">
                      {playerStats.xpToNext} XP pour le niveau suivant
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold">{playerStats.gamesPlayed}</div>
                      <div className="text-xs text-purple-200">Jeux joués</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{winRate}%</div>
                      <div className="text-xs text-purple-200">Taux de réussite</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{formatDuration(playerStats.totalPlayTime)}</div>
                      <div className="text-xs text-purple-200">Temps de jeu</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Progression XP</span>
                  <span className="text-sm">{playerStats.xp} XP</span>
                </div>
                <Progress value={(playerStats.xp / (playerStats.xp + playerStats.xpToNext)) * 100} className="bg-purple-400" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jeu en cours */}
        {currentGame && (
          <Card className="border-2 border-purple-300 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-purple-600" />
                Jeu en cours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{currentGame.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold">{currentGame.title}</h3>
                    <p className="text-gray-600">{currentGame.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-mono font-bold text-purple-600">
                    {formatTime(gameTimer)}
                  </div>
                  <div className="text-sm text-gray-600">
                    / {currentGame.timeLimit} min
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Progress 
                  value={(gameTimer / (currentGame.timeLimit * 60)) * 100} 
                  className="h-3 mb-4" 
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={isPlaying ? pauseGame : resumeGame}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isPlaying ? 'Pause' : 'Reprendre'}
                  </Button>
                  <Button onClick={resetGame} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button onClick={endGame} variant="outline">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Terminer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interface avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="games">Jeux</TabsTrigger>
            <TabsTrigger value="achievements">Succès</TabsTrigger>
            <TabsTrigger value="leaderboard">Classement</TabsTrigger>
            <TabsTrigger value="rewards">Récompenses</TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="space-y-6">
            {/* Filtres */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'productivity', 'habits', 'learning', 'fitness', 'mindfulness'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === 'all' ? 'Tous' : category}
                </Button>
              ))}
            </div>

            {/* Liste des jeux */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => {
                const CategoryIcon = getCategoryIcon(game.category);
                
                return (
                  <Card 
                    key={game.id} 
                    className={`cursor-pointer hover:shadow-lg transition-all ${
                      game.status === 'locked' ? 'opacity-60' : ''
                    } ${game.status === 'completed' ? 'bg-green-50 border-green-200' : ''}`}
                  >
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">{game.icon}</div>
                        <h3 className="font-bold text-lg mb-2">{game.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{game.description}</p>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <Badge className={getDifficultyColor(game.difficulty)}>
                            {game.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm">
                            <CategoryIcon className="w-3 h-3" />
                            <span className="capitalize">{game.category}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {game.timeLimit} min
                          </div>
                          <div className="flex items-center gap-1 font-semibold text-purple-600">
                            <Trophy className="w-3 h-3" />
                            {game.points} XP
                          </div>
                        </div>

                        {game.progress > 0 && (
                          <div>
                            <Progress value={game.progress} className="h-2 mb-1" />
                            <div className="text-xs text-gray-500">{game.progress}% complété</div>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="text-xs font-medium text-gray-700 mb-1">Mécaniques:</div>
                        <div className="flex flex-wrap gap-1">
                          {game.mechanics.slice(0, 2).map((mechanic, index) => (
                            <span key={index} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {mechanic}
                            </span>
                          ))}
                          {game.mechanics.length > 2 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              +{game.mechanics.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-xs font-medium text-gray-700 mb-1">Succès disponibles:</div>
                        <div className="text-xs text-gray-600">{game.achievements.length} succès à débloquer</div>
                        {game.leaderboard && (
                          <div className="flex items-center gap-1 mt-1">
                            <Users className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-orange-600">Classement global</span>
                          </div>
                        )}
                      </div>

                      <Button 
                        className="w-full"
                        disabled={game.status === 'locked' || game.status === 'playing'}
                        variant={game.status === 'completed' ? 'outline' : 'default'}
                        onClick={() => game.status === 'available' && startGame(game)}
                      >
                        {game.status === 'available' && 'Jouer'}
                        {game.status === 'playing' && 'En cours...'}
                        {game.status === 'completed' && '✓ Terminé'}
                        {game.status === 'locked' && '🔒 Verrouillé'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            {/* Progression des succès */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Progression des succès
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{unlockedAchievements.length}</div>
                    <div className="text-sm text-gray-600">Succès débloqués</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{achievements.length}</div>
                    <div className="text-sm text-gray-600">Total disponibles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {unlockedAchievements.reduce((sum, a) => sum + a.points, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Points gagnés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Completion</div>
                  </div>
                </div>
                
                <Progress 
                  value={(unlockedAchievements.length / achievements.length) * 100} 
                  className="h-3" 
                />
              </CardContent>
            </Card>

            {/* Liste des succès */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`${
                    achievement.unlockedAt ? 'bg-green-50 border-green-200' : 'opacity-70'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{achievement.name}</h3>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span>Progression:</span>
                            <span className="font-medium">
                              {achievement.progress} / {achievement.maxProgress}
                            </span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100} 
                            className="h-2" 
                          />
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-1 text-sm text-purple-600">
                            <Star className="w-3 h-3" />
                            <span>{achievement.points} points</span>
                          </div>
                          {achievement.unlockedAt && (
                            <Badge variant="secondary" className="text-xs">
                              ✓ Débloqué
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            {/* Classement global */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Classement hebdomadaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'Vous', points: playerStats?.xp || 0, level: playerStats?.level || 0, games: playerStats?.gamesWon || 0 },
                    { rank: 2, name: 'AmbitionMaster', points: 2180, level: 9, games: 45 },
                    { rank: 3, name: 'GoalCrusher', points: 2050, level: 8, games: 38 },
                    { rank: 4, name: 'FocusNinja', points: 1980, level: 8, games: 42 },
                    { rank: 5, name: 'HabitBuilder', points: 1890, level: 7, games: 35 }
                  ].map((player) => (
                    <div key={player.rank} className={`flex items-center justify-between p-4 rounded-lg ${
                      player.name === 'Vous' ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          player.rank === 1 ? 'bg-yellow-500 text-white' :
                          player.rank === 2 ? 'bg-gray-300 text-gray-700' :
                          player.rank === 3 ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {player.rank}
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-gray-600">Niveau {player.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">{player.points} XP</div>
                        <div className="text-xs text-gray-500">{player.games} victoires</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Classements par jeu */}
            <Card>
              <CardHeader>
                <CardTitle>Classements par jeu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {games.filter(g => g.leaderboard).map((game) => (
                    <div key={game.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl">{game.icon}</div>
                        <div>
                          <h4 className="font-semibold">{game.title}</h4>
                          <p className="text-sm text-gray-600">Votre meilleur: #{Math.floor(Math.random() * 10) + 1}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Top 3: GamerPro (1:23), SpeedMaster (1:27), Vous (1:35)
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            {/* Récompenses disponibles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Boutique de récompenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: 'Avatar Épique',
                      description: 'Débloquez un avatar unique',
                      cost: 500,
                      type: 'cosmetic',
                      icon: '👑',
                      available: true
                    },
                    {
                      name: 'Boost XP x2',
                      description: 'Double XP pendant 24h',
                      cost: 200,
                      type: 'boost',
                      icon: '⚡',
                      available: true
                    },
                    {
                      name: 'Jeu Exclusif',
                      description: 'Accès au mode "Ultimate Challenge"',
                      cost: 1000,
                      type: 'content',
                      icon: '🎮',
                      available: false
                    },
                    {
                      name: 'Badge Légendaire',
                      description: 'Montrez votre statut d\'élite',
                      cost: 750,
                      type: 'cosmetic',
                      icon: '🏆',
                      available: true
                    },
                    {
                      name: 'Titre Personnalisé',
                      description: 'Créez votre propre titre',
                      cost: 300,
                      type: 'cosmetic',
                      icon: '📝',
                      available: true
                    },
                    {
                      name: 'Thème Spécial',
                      description: 'Interface avec effets visuels',
                      cost: 400,
                      type: 'cosmetic',
                      icon: '🎨',
                      available: true
                    }
                  ].map((reward, index) => (
                    <Card key={index} className={`cursor-pointer hover:shadow-lg transition-all ${
                      !reward.available ? 'opacity-50' : ''
                    }`}>
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-2">{reward.icon}</div>
                        <h3 className="font-semibold mb-2">{reward.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                        
                        <div className="flex justify-between items-center mb-3">
                          <Badge variant="outline" className="capitalize">
                            {reward.type}
                          </Badge>
                          <div className="flex items-center gap-1 font-bold text-purple-600">
                            <Star className="w-4 h-4" />
                            {reward.cost}
                          </div>
                        </div>

                        <Button 
                          className="w-full"
                          disabled={!reward.available || (playerStats?.xp || 0) < reward.cost}
                        >
                          {reward.available ? 'Acheter' : 'Bientôt disponible'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Historique des récompenses */}
            <Card>
              <CardHeader>
                <CardTitle>Mes récompenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Badge Débutant', date: 'Il y a 5 jours', type: 'Gratuit' },
                    { name: 'Avatar Starter', date: 'Il y a 3 jours', type: 'Acheté (100 XP)' },
                    { name: 'Titre "Motivé"', date: 'Hier', type: 'Succès débloqué' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.date}</div>
                      </div>
                      <Badge variant="secondary">{item.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AmbitionArcadePage;