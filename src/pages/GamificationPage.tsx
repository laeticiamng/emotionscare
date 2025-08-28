
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Zap, 
  Crown, 
  Award, 
  Target, 
  TrendingUp, 
  Calendar,
  Gift,
  Users,
  Flame,
  Medal,
  ChevronRight,
  Lock,
  Unlock,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import PageLayout from '@/components/common/PageLayout';
import FeatureCard from '@/components/common/FeatureCard';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  progress: number;
  maxProgress: number;
  points: number;
  unlocked: boolean;
  category: 'daily' | 'weekly' | 'milestone' | 'social';
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'epic';
  progress: number;
  maxProgress: number;
  reward: number;
  deadline?: Date;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  completed: boolean;
}

const GamificationPage: React.FC = () => {
  const [userLevel] = useState(12);
  const [userXP] = useState(3420);
  const [nextLevelXP] = useState(4000);
  const [totalPoints] = useState(12750);
  const [streak] = useState(7);

  const [achievements] = useState<Achievement[]>([
    {
      id: 'first-scan',
      title: 'Premier Scan',
      description: 'Effectuez votre premier scan émotionnel',
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-500',
      progress: 1,
      maxProgress: 1,
      points: 100,
      unlocked: true,
      category: 'milestone'
    },
    {
      id: 'meditation-master',
      title: 'Maître de Méditation',
      description: 'Complétez 30 sessions de méditation',
      icon: Crown,
      gradient: 'from-purple-500 to-pink-500',
      progress: 24,
      maxProgress: 30,
      points: 500,
      unlocked: false,
      category: 'milestone'
    },
    {
      id: 'social-butterfly',
      title: 'Papillon Social',
      description: 'Partagez votre humeur 7 jours consécutifs',
      icon: Users,
      gradient: 'from-green-500 to-emerald-500',
      progress: 7,
      maxProgress: 7,
      points: 250,
      unlocked: true,
      category: 'social'
    },
    {
      id: 'streak-champion',
      title: 'Champion des Séries',
      description: 'Maintenez une série de 30 jours',
      icon: Flame,
      gradient: 'from-orange-500 to-red-500',
      progress: 7,
      maxProgress: 30,
      points: 1000,
      unlocked: false,
      category: 'daily'
    }
  ]);

  const [quests] = useState<Quest[]>([
    {
      id: 'daily-scan',
      title: 'Scan Quotidien',
      description: 'Effectuez un scan émotionnel aujourd\'hui',
      type: 'daily',
      progress: 1,
      maxProgress: 1,
      reward: 50,
      difficulty: 'Facile',
      completed: true
    },
    {
      id: 'breathing-session',
      title: 'Session de Respiration',
      description: 'Pratiquez 10 minutes de respiration consciente',
      type: 'daily',
      progress: 0,
      maxProgress: 10,
      reward: 75,
      difficulty: 'Moyen',
      completed: false
    },
    {
      id: 'journal-entry',
      title: 'Entrée de Journal',
      description: 'Écrivez dans votre journal émotionnel',
      type: 'daily',
      progress: 0,
      maxProgress: 1,
      reward: 40,
      difficulty: 'Facile',
      completed: false
    },
    {
      id: 'weekly-goals',
      title: 'Objectifs Hebdomadaires',
      description: 'Complétez toutes vos quêtes quotidiennes cette semaine',
      type: 'weekly',
      progress: 5,
      maxProgress: 7,
      reward: 300,
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      difficulty: 'Difficile',
      completed: false
    }
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: 'Sarah M.', points: 15420, avatar: '👩' },
    { rank: 2, name: 'Mike T.', points: 14850, avatar: '👨' },
    { rank: 3, name: 'Emma L.', points: 14200, avatar: '👩‍💼' },
    { rank: 4, name: 'Vous', points: totalPoints, avatar: '👤' },
    { rank: 5, name: 'Alex R.', points: 12100, avatar: '👨‍💻' }
  ]);

  const completeQuest = (questId: string) => {
    console.log(`Completing quest: ${questId}`);
    // Ici on mettrait à jour l'état de la quête
  };

  const claimReward = (achievementId: string) => {
    console.log(`Claiming reward for: ${achievementId}`);
    // Ici on débloquerait la récompense
  };

  return (
    <PageLayout
      header={{
        title: 'Gamification',
        subtitle: 'Transformez votre parcours bien-être en aventure',
        description: 'Accomplissez des quêtes, débloquez des achievements et progressez dans votre développement personnel.',
        icon: Trophy,
        gradient: 'from-yellow-500/20 to-orange-500/5',
        badge: 'Système de Récompenses',
        stats: [
          {
            label: 'Niveau',
            value: userLevel.toString(),
            icon: Crown,
            color: 'text-yellow-500'
          },
          {
            label: 'Points',
            value: totalPoints.toLocaleString(),
            icon: Star,
            color: 'text-purple-500'
          },
          {
            label: 'Série',
            value: `${streak}j`,
            icon: Flame,
            color: 'text-orange-500'
          },
          {
            label: 'Achievements',
            value: achievements.filter(a => a.unlocked).length.toString(),
            icon: Award,
            color: 'text-green-500'
          }
        ],
        actions: [
          {
            label: 'Récompenses',
            onClick: () => console.log('Rewards'),
            variant: 'default',
            icon: Gift
          },
          {
            label: 'Classement',
            onClick: () => console.log('Leaderboard'),
            variant: 'outline',
            icon: BarChart3
          }
        ]
      }}
      tips={{
        title: 'Maximisez vos récompenses',
        items: [
          {
            title: 'Régularité',
            content: 'Maintenez votre série quotidienne pour des bonus exponentiels',
            icon: Calendar
          },
          {
            title: 'Diversité',
            content: 'Explorez tous les modules pour débloquer plus d\'achievements',
            icon: Target
          },
          {
            title: 'Social',
            content: 'Partagez vos progrès pour obtenir des bonus sociaux',
            icon: Users
          }
        ],
        cta: {
          label: 'Guide du système de récompenses',
          onClick: () => console.log('Point system guide')
        }
      }}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progression utilisateur et quêtes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progression globale */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Niveau {userLevel}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">{userXP.toLocaleString()} XP</p>
                  <p className="text-sm text-muted-foreground">
                    {nextLevelXP - userXP} XP pour le niveau suivant
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{Math.round((userXP / nextLevelXP) * 100)}%</p>
                  <p className="text-xs text-muted-foreground">Progression</p>
                </div>
              </div>
              <Progress value={(userXP / nextLevelXP) * 100} className="h-3" />
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-yellow-500">{totalPoints.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Points totaux</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-orange-500">{streak}</p>
                  <p className="text-xs text-muted-foreground">Jours consécutifs</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-500">{achievements.filter(a => a.unlocked).length}</p>
                  <p className="text-xs text-muted-foreground">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quêtes actives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Quêtes Actives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quests.map((quest) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 border rounded-lg ${quest.completed ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-card border-border'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{quest.title}</h3>
                        <Badge variant={
                          quest.type === 'daily' ? 'default' :
                          quest.type === 'weekly' ? 'secondary' : 'destructive'
                        }>
                          {quest.type}
                        </Badge>
                        <Badge variant="outline">{quest.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{quest.description}</p>
                      {quest.deadline && (
                        <p className="text-xs text-orange-500 mt-1">
                          Expire dans {Math.ceil((quest.deadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000))} jours
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">+{quest.reward}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{quest.progress} / {quest.maxProgress}</span>
                    </div>
                    <Progress value={(quest.progress / quest.maxProgress) * 100} className="h-2" />
                  </div>

                  {quest.completed ? (
                    <Button className="w-full mt-3" disabled>
                      <Award className="h-4 w-4 mr-2" />
                      Terminé
                    </Button>
                  ) : (
                    <Button 
                      className="w-full mt-3" 
                      variant="outline"
                      onClick={() => completeQuest(quest.id)}
                    >
                      Continuer
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-purple-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-lg border ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800' 
                        : 'bg-muted/50 border-muted'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${achievement.gradient} flex items-center justify-center`}>
                        {achievement.unlocked ? (
                          <achievement.icon className="h-6 w-6 text-white" />
                        ) : (
                          <Lock className="h-6 w-6 text-white/70" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        
                        {!achievement.unlocked && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progression</span>
                              <span>{achievement.progress} / {achievement.maxProgress}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className="h-1"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                            +{achievement.points} pts
                          </Badge>
                          {achievement.unlocked && (
                            <Button size="sm" onClick={() => claimReward(achievement.id)}>
                              <Gift className="h-3 w-3 mr-1" />
                              Récompense
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Classement et statistiques */}
        <div className="space-y-4">
          {/* Mini profil */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Votre Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">👤</span>
                </div>
                <p className="font-semibold">Niveau {userLevel}</p>
                <p className="text-sm text-muted-foreground">
                  {totalPoints.toLocaleString()} points
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-orange-500">{streak}</p>
                  <p className="text-xs text-muted-foreground">Jours de série</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-500">
                    {achievements.filter(a => a.unlocked).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Classement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Classement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((player) => (
                <div
                  key={player.rank}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    player.name === 'Vous' ? 'bg-primary/10 ring-1 ring-primary/20' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    player.rank === 1 ? 'bg-yellow-500 text-white' :
                    player.rank === 2 ? 'bg-gray-400 text-white' :
                    player.rank === 3 ? 'bg-amber-600 text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {player.rank <= 3 ? (
                      <Crown className="h-4 w-4" />
                    ) : (
                      player.rank
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {player.points.toLocaleString()} pts
                    </p>
                  </div>
                  <span className="text-2xl">{player.avatar}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Récompenses à débloquer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-pink-500" />
                Prochaines Récompenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Crown className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Badge Premium</p>
                    <p className="text-xs text-muted-foreground">Niveau 15</p>
                  </div>
                </div>
                <Progress value={80} className="h-1" />
              </div>
              
              <div className="p-3 border border-border rounded-lg opacity-60">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Avatar Personnalisé</p>
                    <p className="text-xs text-muted-foreground">20 000 points</p>
                  </div>
                </div>
                <Progress value={64} className="h-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default GamificationPage;
