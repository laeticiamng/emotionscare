import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  Calendar,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  Gift,
  TrendingUp,
  Users,
  Brain,
  Heart,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface UserStats {
  level: number;
  total_points: number;
  streak_days: number;
  completed_challenges: number;
  total_badges: number;
  rank: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'emotional' | 'physical' | 'mental' | 'social';
  difficulty: 'facile' | 'moyen' | 'difficile';
  points: number;
  progress: number;
  target_value: number;
  completed: boolean;
  expires_at: string;
  type: 'count' | 'duration' | 'completion';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlocked_at?: string;
  progress?: number;
  target?: number;
}

const categoryIcons = {
  emotional: Heart,
  physical: Activity,
  mental: Brain,
  social: Users
};

const difficultyColors = {
  facile: 'bg-green-500',
  moyen: 'bg-yellow-500',
  difficile: 'bg-red-500'
};

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-600'
};

export const EnhancedGamificationDashboard: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingChallenges, setGeneratingChallenges] = useState(false);

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Charger les statistiques utilisateur
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsData) {
        setUserStats(statsData);
      }

      // Charger les défis actuels
      const { data: challengesData } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (challengesData) {
        setChallenges(challengesData);
      }

      // Charger les achievements
      const { data: achievementsData } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id);

      if (achievementsData) {
        setAchievements(achievementsData.map(ua => ({
          ...ua.achievement,
          unlocked: true,
          unlocked_at: ua.unlocked_at
        })));
      }

    } catch (error) {
      // Gamification data loading error
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de gamification",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDailyChallenges = async () => {
    setGeneratingChallenges(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.functions.invoke('generate-daily-challenges', {
        body: {
          user_id: user.id,
          user_level: userStats?.level || 1,
          preferred_categories: ['emotional', 'mental', 'physical', 'social']
        }
      });

      if (error) throw error;

      if (data.success) {
        setChallenges(prev => [...data.challenges, ...prev.filter(c => c.completed)]);
        toast({
          title: "Nouveaux défis générés!",
          description: `${data.challenges.length} défis quotidiens vous attendent`,
        });
      }
    } catch (error) {
      // Challenge generation error
      toast({
        title: "Erreur",
        description: "Impossible de générer de nouveaux défis",
        variant: "destructive"
      });
    } finally {
      setGeneratingChallenges(false);
    }
  };

  const updateChallengeProgress = async (challengeId: string, progress: number) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      const isCompleted = progress >= challenge.target_value;
      
      const { error } = await supabase
        .from('challenges')
        .update({ 
          progress, 
          completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null
        })
        .eq('id', challengeId);

      if (error) throw error;

      setChallenges(prev => 
        prev.map(c => 
          c.id === challengeId 
            ? { ...c, progress, completed: isCompleted }
            : c
        )
      );

      if (isCompleted) {
        // Animation de félicitations
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        toast({
          title: "Défi complété!",
          description: `Vous avez gagné ${challenge.points} points`,
        });

        // Mettre à jour les statistiques
        if (userStats) {
          setUserStats(prev => prev ? {
            ...prev,
            total_points: prev.total_points + challenge.points,
            completed_challenges: prev.completed_challenges + 1
          } : null);
        }
      }
    } catch (error) {
      // Challenge progress update error
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le défi",
        variant: "destructive"
      });
    }
  };

  const calculateLevelProgress = () => {
    if (!userStats) return { current: 0, needed: 100, percentage: 0 };
    
    const baseXP = 100;
    const currentLevelXP = baseXP * Math.pow(1.5, userStats.level - 1);
    const nextLevelXP = baseXP * Math.pow(1.5, userStats.level);
    const progressXP = userStats.total_points - currentLevelXP;
    const neededXP = nextLevelXP - currentLevelXP;
    
    return {
      current: Math.max(0, progressXP),
      needed: neededXP,
      percentage: Math.min(100, (progressXP / neededXP) * 100)
    };
  };

  const levelProgress = calculateLevelProgress();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gamification</h2>
        <Button 
          onClick={generateDailyChallenges}
          disabled={generatingChallenges}
          className="bg-gradient-to-r from-primary to-primary/80"
        >
          {generatingChallenges ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Nouveaux Défis
            </>
          )}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Niveau</p>
                <p className="text-3xl font-bold text-yellow-600">{userStats?.level || 1}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-4">
              <Progress value={levelProgress.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {levelProgress.current}/{levelProgress.needed} XP
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Points</p>
                <p className="text-3xl font-bold text-blue-600">{userStats?.total_points || 0}</p>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Série</p>
                <p className="text-3xl font-bold text-green-600">{userStats?.streak_days || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Badges</p>
                <p className="text-3xl font-bold text-purple-600">{userStats?.total_badges || 0}</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="challenges">Défis Actifs</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.filter(c => !c.completed).map((challenge) => {
              const CategoryIcon = categoryIcons[challenge.category];
              const progressPercentage = (challenge.progress / challenge.target_value) * 100;
              
              return (
                <Card key={challenge.id} className="relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-2 h-full ${difficultyColors[challenge.difficulty]}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-5 w-5 text-primary" />
                        <Badge variant="outline" className="text-xs">
                          {challenge.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{challenge.points}pts</p>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{challenge.progress}/{challenge.target_value}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateChallengeProgress(challenge.id, challenge.progress + 1)}
                        disabled={challenge.completed}
                        className="flex-1"
                      >
                        {challenge.completed ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Complété
                          </>
                        ) : (
                          <>
                            <Target className="mr-2 h-4 w-4" />
                            Progresser
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Expire le {new Date(challenge.expires_at).toLocaleDateString()}</span>
                      <Badge variant="outline" className="text-xs">
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {challenges.filter(c => !c.completed).length === 0 && (
            <Card className="p-8 text-center">
              <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun défi actif</h3>
              <p className="text-muted-foreground mb-4">
                Générez de nouveaux défis quotidiens pour continuer votre progression
              </p>
              <Button onClick={generateDailyChallenges}>
                <Zap className="mr-2 h-4 w-4" />
                Générer des défis
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`relative overflow-hidden ${
                achievement.unlocked ? 'ring-2 ring-primary' : 'opacity-60'
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[achievement.rarity]} opacity-10`} />
                <CardContent className="p-6 relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${rarityColors[achievement.rarity]} 
                      flex items-center justify-center text-white text-xl font-bold`}>
                      {achievement.icon || '🏆'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {achievement.rarity}
                      </Badge>
                    </div>
                    {achievement.unlocked && (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {achievement.description}
                  </p>

                  {achievement.progress && achievement.target && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{achievement.progress}/{achievement.target}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.target) * 100} 
                        className="h-2" 
                      />
                    </div>
                  )}

                  {achievement.unlocked && achievement.unlocked_at && (
                    <p className="text-xs text-muted-foreground mt-4">
                      Débloqué le {new Date(achievement.unlocked_at).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {achievements.length === 0 && (
            <Card className="p-8 text-center">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun achievement débloqué</h3>
              <p className="text-muted-foreground">
                Complétez des défis pour débloquer vos premiers achievements
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedGamificationDashboard;