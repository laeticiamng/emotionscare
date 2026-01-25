import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { 
  Trophy, Star, Zap, Target, CheckCircle, Clock, 
  TrendingUp, Award, Sparkles, Flame, Loader2,
  Filter, RefreshCw, Share2, Medal, Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration_minutes: number;
  xp_reward: number;
  status: string;
  challenge_config: any;
  created_at: string;
  completed_at?: string;
}

interface Stats {
  totalChallenges: number;
  completedChallenges: number;
  totalAchievements: number;
  totalXP: number;
  currentLevel: number;
  currentStreak: number;
  weeklyXP?: number;
  rank?: number;
}

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  xp: number;
  level: number;
  rank: number;
}

const LEVEL_TITLES: Record<number, string> = {
  1: 'Débutant',
  2: 'Apprenti',
  3: 'Pratiquant',
  4: 'Confirmé',
  5: 'Expert',
  6: 'Maître',
  7: 'Grand Maître',
  8: 'Légende',
  9: 'Mythique',
  10: 'Transcendant'
};

const GamificationDashboard: React.FC = () => {
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('challenges');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Charger données avec realtime subscription
  useEffect(() => {
    loadData();

    // Subscription realtime pour les mises à jour
    const channel = supabase
      .channel('gamification-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_challenges' 
      }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadData = async () => {
    try {
      const { data: challengeData } = await supabase.functions.invoke('gamification-engine', {
        body: { action: 'list' }
      });

      if (challengeData?.challenges) {
        setChallenges(challengeData.challenges);
      }

      const { data: statsData } = await supabase.functions.invoke('gamification-engine', {
        body: { action: 'stats' }
      });

      if (statsData?.stats) {
        setStats(statsData.stats);
      }
    } catch (error) {
      logger.error('Error loading data', error as Error, 'UI');
    }
  };

  const generateChallenges = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('gamification-engine', {
        body: { action: 'generate' }
      });

      if (error) throw error;

      toast({
        title: 'Défis générés',
        description: `${data.challenges.length} nouveaux défis personnalisés`,
      });

      await loadData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const completeChallenge = async (challengeId: string) => {
    setCompletingId(challengeId);
    try {
      const { data, error } = await supabase.functions.invoke('gamification-engine', {
        body: {
          action: 'complete',
          challengeId
        }
      });

      if (error) throw error;

      let description = `+${data.challenge.xp_reward} XP`;
      if (data.newLevel > (stats?.currentLevel || 1)) {
        description += ` | Niveau ${data.newLevel} atteint !`;
      }
      if (data.achievements.length > 0) {
        description += ` | ${data.achievements.length} nouveau(x) badge(s)`;
      }

      toast({
        title: 'Défi complété !',
        description,
      });

      await loadData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setCompletingId(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      breathing: '🫁',
      meditation: '🧘',
      journal: '📔',
      social: '👥',
      physical: '💪',
    };
    return icons[category] || '⭐';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'bg-green-500',
      medium: 'bg-yellow-500',
      hard: 'bg-red-500',
    };
    return colors[difficulty] || 'bg-gray-500';
  };

  const xpToNextLevel = stats ? (stats.currentLevel * 1000) - stats.totalXP : 1000;
  const progressToNextLevel = stats ? ((stats.totalXP % 1000) / 1000) * 100 : 0;

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Niveau</p>
                <p className="text-3xl font-bold">{stats?.currentLevel || 1}</p>
              </div>
              <Trophy className="h-10 w-10 opacity-80" />
            </div>
            <div className="mt-4 space-y-2">
              <Progress value={progressToNextLevel} className="h-2 bg-white/20" />
              <p className="text-xs opacity-90">{xpToNextLevel} XP pour le niveau suivant</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">XP Total</p>
                <p className="text-2xl font-bold">{stats?.totalXP || 0}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Série actuelle</p>
                <p className="text-2xl font-bold">{stats?.currentStreak || 0}</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Badges</p>
                <p className="text-2xl font-bold">{stats?.totalAchievements || 0}</p>
              </div>
              <Award className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progression
            </CardTitle>
            <Badge variant="secondary">
              {stats?.completedChallenges || 0}/{stats?.totalChallenges || 0} défis
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress 
            value={stats ? (stats.completedChallenges / Math.max(stats.totalChallenges, 1)) * 100 : 0} 
            className="h-3"
          />
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={generateChallenges}
          disabled={isGenerating}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Générer de nouveaux défis
            </>
          )}
        </Button>
      </div>

      {challenges.filter(c => c.status === 'active').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Défis actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.filter(c => c.status === 'active').map((challenge) => (
                <Card key={challenge.id} className="hover:border-primary transition-colors">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCategoryIcon(challenge.category)}</span>
                        <div>
                          <h3 className="font-semibold">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {challenge.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {challenge.duration_minutes}min
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        +{challenge.xp_reward} XP
                      </Badge>
                    </div>

                    {challenge.challenge_config?.instructions && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Instructions:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {challenge.challenge_config.instructions.slice(0, 3).map((inst: string, i: number) => (
                            <li key={i}>• {inst}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button
                      onClick={() => completeChallenge(challenge.id)}
                      disabled={completingId === challenge.id}
                      className="w-full"
                      size="sm"
                    >
                      {completingId === challenge.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Validation...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marquer comme complété
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {challenges.filter(c => c.status === 'completed').slice(0, 3).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Défis récemment complétés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {challenges.filter(c => c.status === 'completed').slice(0, 3).map((challenge) => (
                <div key={challenge.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getCategoryIcon(challenge.category)}</span>
                    <div>
                      <p className="font-medium">{challenge.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(challenge.completed_at!).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    +{challenge.xp_reward} XP
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GamificationDashboard;
