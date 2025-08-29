import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Target, Trophy, Flame, Star, Crown, Zap, 
         Clock, TrendingUp, Award, Users, Brain, Heart, 
         CheckCircle, AlertCircle, Play, Pause } from 'lucide-react';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'mindset' | 'habits' | 'focus' | 'resilience' | 'goals';
  difficulty: 'rookie' | 'pro' | 'boss' | 'legend';
  duration: string;
  points: number;
  status: 'available' | 'active' | 'completed' | 'locked';
  progress: number;
  requirements?: string[];
  rewards: string[];
  icon: string;
}

interface GritLevel {
  level: number;
  title: string;
  minPoints: number;
  perks: string[];
  badge: string;
}

const BossGritPage: React.FC = () => {
  usePageMetadata('Boss Grit', 'Développez votre résilience et dépassez vos limites', '/app/boss-grit', 'engaged');
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('challenges');
  const [userLevel, setUserLevel] = useState(3);
  const [userPoints, setUserPoints] = useState(1250);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completedToday, setCompletedToday] = useState(2);
  const [streak, setStreak] = useState(12);

  const gritLevels: GritLevel[] = [
    {
      level: 1,
      title: 'Rookie',
      minPoints: 0,
      perks: ['Défis basiques', 'Suivi simple'],
      badge: '🥉'
    },
    {
      level: 2,
      title: 'Fighter',
      minPoints: 500,
      perks: ['Défis intermédiaires', 'Bonus XP +10%'],
      badge: '🥈'
    },
    {
      level: 3,
      title: 'Warrior',
      minPoints: 1000,
      perks: ['Défis avancés', 'Coach IA personnel', 'Défis personnalisés'],
      badge: '🥇'
    },
    {
      level: 4,
      title: 'Boss',
      minPoints: 2000,
      perks: ['Défis extrêmes', 'Mentor communauté', 'Récompenses exclusives'],
      badge: '👑'
    },
    {
      level: 5,
      title: 'Legend',
      minPoints: 5000,
      perks: ['Créateur de défis', 'Impact communauté', 'Reconnaissance globale'],
      badge: '🌟'
    }
  ];

  useEffect(() => {
    loadChallenges();
    loadActiveChallenge();
  }, []);

  const loadChallenges = () => {
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Réveil du Guerrier',
        description: 'Levez-vous tous les jours à 6h pendant 7 jours consécutifs',
        category: 'habits',
        difficulty: 'rookie',
        duration: '7 jours',
        points: 100,
        status: 'active',
        progress: 43,
        rewards: ['Badge Lève-tôt', '+100 points', 'Habitude matinale'],
        icon: '🌅'
      },
      {
        id: '2',
        title: 'Maître de la Focus Zone',
        description: 'Travaillez 2h en focus profond sans interruption',
        category: 'focus',
        difficulty: 'pro',
        duration: '1 session',
        points: 200,
        status: 'available',
        progress: 0,
        rewards: ['Badge Focus Master', '+200 points', 'Technique Pomodoro Pro'],
        icon: '🎯'
      },
      {
        id: '3',
        title: 'Phoenix Mental',
        description: 'Transformez 3 échecs en opportunités d\'apprentissage',
        category: 'resilience',
        difficulty: 'boss',
        duration: '21 jours',
        points: 500,
        status: 'locked',
        progress: 0,
        requirements: ['Niveau Warrior', 'Compléter 5 défis de résilience'],
        rewards: ['Badge Phoenix', '+500 points', 'Mental de Boss'],
        icon: '🔥'
      },
      {
        id: '4',
        title: 'Tsunami de Productivité',
        description: 'Atteignez 200% de vos objectifs quotidiens pendant 5 jours',
        category: 'goals',
        difficulty: 'legend',
        duration: '5 jours',
        points: 1000,
        status: 'locked',
        progress: 0,
        requirements: ['Niveau Boss', 'Maîtriser la gestion du temps'],
        rewards: ['Badge Tsunami', '+1000 points', 'Système de productivité ultime'],
        icon: '🌊'
      },
      {
        id: '5',
        title: 'Mindset Bulletproof',
        description: 'Pratiquez la gratitude et la visualisation positive 30 jours',
        category: 'mindset',
        difficulty: 'pro',
        duration: '30 jours',
        points: 300,
        status: 'completed',
        progress: 100,
        rewards: ['Badge Mindset Master', '+300 points', 'Mental blindé'],
        icon: '🧠'
      },
      {
        id: '6',
        title: 'Cardio Warrior',
        description: 'Faites 30 min de cardio intense 5 fois cette semaine',
        category: 'habits',
        difficulty: 'rookie',
        duration: '1 semaine',
        points: 150,
        status: 'available',
        progress: 0,
        rewards: ['Badge Cardio Beast', '+150 points', 'Endurance warrior'],
        icon: '💪'
      }
    ];
    setChallenges(mockChallenges);
  };

  const loadActiveChallenge = () => {
    const active = challenges.find(c => c.status === 'active');
    setActiveChallenge(active || null);
  };

  const getCurrentLevel = () => {
    return gritLevels.find(level => 
      userPoints >= level.minPoints && 
      (gritLevels[level.level] ? userPoints < gritLevels[level.level].minPoints : true)
    ) || gritLevels[0];
  };

  const getNextLevel = () => {
    const currentLevel = getCurrentLevel();
    return gritLevels[currentLevel.level] || null;
  };

  const getProgressToNextLevel = () => {
    const currentLevel = getCurrentLevel();
    const nextLevel = getNextLevel();
    
    if (!nextLevel) return 100;
    
    const progress = ((userPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100;
    return Math.min(progress, 100);
  };

  const startChallenge = (challenge: Challenge) => {
    const updatedChallenges = challenges.map(c => 
      c.id === challenge.id ? { ...c, status: 'active' as const } : c
    );
    setChallenges(updatedChallenges);
    setActiveChallenge(challenge);
  };

  const completeChallenge = (challenge: Challenge) => {
    const updatedChallenges = challenges.map(c => 
      c.id === challenge.id ? { ...c, status: 'completed' as const, progress: 100 } : c
    );
    setChallenges(updatedChallenges);
    setUserPoints(prev => prev + challenge.points);
    setActiveChallenge(null);
    setCompletedToday(prev => prev + 1);
  };

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'rookie': return 'bg-green-500';
      case 'pro': return 'bg-blue-500';
      case 'boss': return 'bg-purple-500';
      case 'legend': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: Challenge['category']) => {
    switch (category) {
      case 'mindset': return Brain;
      case 'habits': return Clock;
      case 'focus': return Target;
      case 'resilience': return Heart;
      case 'goals': return Trophy;
      default: return Star;
    }
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressToNext = getProgressToNextLevel();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-6">
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
              <h1 className="text-3xl font-bold text-gray-900">Boss Grit</h1>
              <p className="text-gray-600">Développez votre mental de champion</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{userPoints}</div>
              <div className="text-sm text-gray-600">Points Grit</div>
            </div>
            <div className="flex items-center gap-2 bg-orange-100 px-3 py-2 rounded-lg">
              <Flame className="w-4 h-4 text-orange-600" />
              <span className="font-semibold text-orange-600">{streak} jours</span>
            </div>
          </div>
        </div>

        {/* Niveau actuel et progression */}
        <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{currentLevel.badge}</div>
                <div>
                  <h2 className="text-2xl font-bold">{currentLevel.title}</h2>
                  <p className="text-red-100">Niveau {currentLevel.level}</p>
                  {nextLevel && (
                    <p className="text-sm text-red-200">
                      {nextLevel.minPoints - userPoints} points pour {nextLevel.title}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{completedToday}</div>
                <div className="text-sm text-red-200">Défis terminés aujourd'hui</div>
              </div>
            </div>
            
            {nextLevel && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Progression vers {nextLevel.title}</span>
                  <span className="text-sm">{Math.round(progressToNext)}%</span>
                </div>
                <Progress value={progressToNext} className="bg-red-400" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Défi actif */}
        {activeChallenge && (
          <Card className="border-2 border-orange-300 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-orange-600" />
                Défi en cours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="text-4xl">{activeChallenge.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{activeChallenge.title}</h3>
                  <p className="text-gray-600 mb-3">{activeChallenge.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className={getDifficultyColor(activeChallenge.difficulty)}>
                      {activeChallenge.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      {activeChallenge.duration}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="w-3 h-3" />
                      {activeChallenge.points} points
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progression</span>
                      <span className="text-sm text-gray-600">{activeChallenge.progress}%</span>
                    </div>
                    <Progress value={activeChallenge.progress} className="h-3" />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => completeChallenge(activeChallenge)}
                      disabled={activeChallenge.progress < 100}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {activeChallenge.progress >= 100 ? 'Terminer le défi' : 'En cours...'}
                    </Button>
                    <Button variant="outline">
                      <Pause className="w-4 h-4 mr-2" />
                      Mettre en pause
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interface avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="challenges">Défis</TabsTrigger>
            <TabsTrigger value="progress">Progression</TabsTrigger>
            <TabsTrigger value="community">Communauté</TabsTrigger>
            <TabsTrigger value="rewards">Récompenses</TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-6">
            {/* Filtres par catégorie */}
            <div className="flex gap-2 flex-wrap">
              {['Tous', 'mindset', 'habits', 'focus', 'resilience', 'goals'].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className="capitalize"
                >
                  {category === 'Tous' ? 'Tous' : category}
                </Button>
              ))}
            </div>

            {/* Liste des défis */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => {
                const CategoryIcon = getCategoryIcon(challenge.category);
                
                return (
                  <Card 
                    key={challenge.id} 
                    className={`cursor-pointer hover:shadow-lg transition-all ${
                      challenge.status === 'locked' ? 'opacity-60' : ''
                    } ${challenge.status === 'completed' ? 'bg-green-50 border-green-200' : ''}`}
                  >
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">{challenge.icon}</div>
                        <h3 className="font-bold text-lg mb-2">{challenge.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <Badge className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm">
                            <CategoryIcon className="w-3 h-3" />
                            <span className="capitalize">{challenge.category}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {challenge.duration}
                          </div>
                          <div className="flex items-center gap-1 font-semibold text-orange-600">
                            <Star className="w-3 h-3" />
                            {challenge.points} points
                          </div>
                        </div>

                        {challenge.progress > 0 && (
                          <div>
                            <Progress value={challenge.progress} className="h-2 mb-1" />
                            <div className="text-xs text-gray-500">{challenge.progress}% complété</div>
                          </div>
                        )}
                      </div>

                      {challenge.requirements && (
                        <div className="mb-4">
                          <div className="text-xs font-medium text-gray-700 mb-1">Prérequis:</div>
                          {challenge.requirements.map((req, index) => (
                            <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {req}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mb-4">
                        <div className="text-xs font-medium text-gray-700 mb-2">Récompenses:</div>
                        <div className="flex flex-wrap gap-1">
                          {challenge.rewards.map((reward, index) => (
                            <span key={index} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                              {reward}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button 
                        className="w-full"
                        disabled={challenge.status === 'locked' || challenge.status === 'active'}
                        variant={challenge.status === 'completed' ? 'outline' : 'default'}
                        onClick={() => challenge.status === 'available' && startChallenge(challenge)}
                      >
                        {challenge.status === 'available' && 'Commencer le défi'}
                        {challenge.status === 'active' && 'En cours...'}
                        {challenge.status === 'completed' && '✓ Terminé'}
                        {challenge.status === 'locked' && '🔒 Verrouillé'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {/* Statistiques détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Défis complétés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {challenges.filter(c => c.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Sur {challenges.length} disponibles
                  </div>
                  <Progress 
                    value={(challenges.filter(c => c.status === 'completed').length / challenges.length) * 100} 
                    className="mt-2" 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    Série actuelle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 mb-2">{streak}</div>
                  <div className="text-sm text-gray-600">Jours consécutifs</div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                    <Flame className="w-3 h-3" />
                    <span>Record personnel</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Niveau Grit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {currentLevel.level}
                  </div>
                  <div className="text-sm text-gray-600">{currentLevel.title}</div>
                  {nextLevel && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500">
                        {nextLevel.minPoints - userPoints} points pour niveau {nextLevel.level}
                      </div>
                      <Progress value={progressToNext} className="mt-1 h-1" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Graphique de progression */}
            <Card>
              <CardHeader>
                <CardTitle>Progression hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-sm font-medium mb-2">{day}</div>
                      <div className={`h-20 rounded ${
                        index <= 4 ? 'bg-green-200' : 'bg-gray-100'
                      } flex items-end justify-center p-1`}>
                        {index <= 4 && (
                          <div className="w-full bg-green-500 rounded" style={{height: `${60 + index * 10}%`}}></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-600">
                  Activité des 7 derniers jours
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            {/* Classement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Classement de la semaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'Vous', points: userPoints, level: currentLevel.title, badge: currentLevel.badge },
                    { rank: 2, name: 'Alex_Warrior', points: 1180, level: 'Warrior', badge: '🥇' },
                    { rank: 3, name: 'Sarah_Boss', points: 1050, level: 'Warrior', badge: '🥇' },
                    { rank: 4, name: 'Mike_Grit', points: 980, level: 'Fighter', badge: '🥈' },
                    { rank: 5, name: 'Lisa_Strong', points: 890, level: 'Fighter', badge: '🥈' }
                  ].map((user) => (
                    <div key={user.rank} className={`flex items-center justify-between p-3 rounded-lg ${
                      user.name === 'Vous' ? 'bg-orange-100 border border-orange-300' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1 ? 'bg-yellow-500 text-white' :
                          user.rank === 2 ? 'bg-gray-300 text-gray-700' :
                          user.rank === 3 ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {user.rank}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-orange-600">{user.points}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feed communauté */}
            <Card>
              <CardHeader>
                <CardTitle>Activité de la communauté</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { user: 'Alex_Warrior', action: 'a terminé', challenge: 'Phoenix Mental', time: 'Il y a 2h', points: 500 },
                    { user: 'Sarah_Boss', action: 'a commencé', challenge: 'Maître de la Focus Zone', time: 'Il y a 4h', points: 0 },
                    { user: 'Mike_Grit', action: 'a atteint', challenge: 'Niveau Fighter', time: 'Il y a 6h', points: 0 }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {activity.user[0]}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">
                          <span className="font-medium">{activity.user}</span>
                          <span className="text-gray-600"> {activity.action} </span>
                          <span className="font-medium">{activity.challenge}</span>
                          {activity.points > 0 && (
                            <span className="text-orange-600"> (+{activity.points} points)</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            {/* Badges obtenus */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Mes badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[
                    { name: 'Lève-tôt', icon: '🌅', earned: true },
                    { name: 'Focus Master', icon: '🎯', earned: true },
                    { name: 'Mindset Master', icon: '🧠', earned: true },
                    { name: 'Phoenix', icon: '🔥', earned: false },
                    { name: 'Tsunami', icon: '🌊', earned: false },
                    { name: 'Cardio Beast', icon: '💪', earned: false }
                  ].map((badge, index) => (
                    <div key={index} className={`text-center p-4 rounded-lg border-2 ${
                      badge.earned ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-gray-50 opacity-50'
                    }`}>
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <div className="text-sm font-medium">{badge.name}</div>
                      {badge.earned && (
                        <div className="text-xs text-orange-600 mt-1">✓ Obtenu</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Avantages du niveau */}
            <Card>
              <CardHeader>
                <CardTitle>Avantages {currentLevel.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentLevel.perks.map((perk, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
                
                {nextLevel && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-3">Prochains avantages ({nextLevel.title}):</h4>
                    <div className="space-y-2">
                      {nextLevel.perks.map((perk, index) => (
                        <div key={index} className="flex items-center gap-3 text-gray-600">
                          <Crown className="w-4 h-4" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BossGritPage;