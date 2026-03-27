// @ts-nocheck
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Award,
  Trophy,
  Medal,
  Zap,
  Download,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import QueryStateWrapper from '@/components/ui/QueryStateWrapper';

const GamificationTab: React.FC = () => {
  const { data: stats, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-gamification-stats'],
    queryFn: async () => {
      const [usersRes, achievementsRes, challengesRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('user_achievements').select('id, achievement_id', { count: 'exact' }),
        supabase.from('user_challenge_progress').select('id, completed_at', { count: 'exact' }),
      ]);

      const totalUsers = usersRes.count || 0;
      const totalAchievements = achievementsRes.count || 0;
      const totalChallenges = challengesRes.count || 0;
      const completedChallenges = challengesRes.data?.filter(c => c.completed_at).length || 0;

      return {
        totalUsers,
        totalAchievements,
        totalChallenges,
        completedChallenges,
        challengeCompletionRate: totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0,
      };
    },
    staleTime: 60_000,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gamification</h2>
          <p className="text-muted-foreground">
            Analysez l'engagement des utilisateurs à travers les mécanismes de gamification.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <Zap className="mr-2 h-4 w-4" />
            Nouvelle campagne
          </Button>
        </div>
      </div>

      <QueryStateWrapper
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        loadingText="Chargement des statistiques de gamification..."
        errorText="Impossible de charger les statistiques"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers ?? 0}</div>
              <p className="text-xs text-muted-foreground">inscrits sur la plateforme</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Badges débloqués</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAchievements ?? 0}</div>
              <p className="text-xs text-muted-foreground">achievements au total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Défis actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalChallenges ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.completedChallenges ?? 0} complétés
              </p>
              <Progress value={stats?.challengeCompletionRate ?? 0} className="h-1 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taux de complétion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.challengeCompletionRate ?? 0}%</div>
              <p className="text-xs text-muted-foreground">des défis complétés</p>
              <Progress value={stats?.challengeCompletionRate ?? 0} className="h-1 mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="challenges">Défis</TabsTrigger>
            <TabsTrigger value="rewards">Récompenses</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Statistiques de gamification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Les données sont chargées en temps réel depuis la base de données.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Medal className="h-5 w-5 text-sky-500" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {stats?.totalAchievements ?? 0} badges débloqués par {stats?.totalUsers ?? 0} utilisateurs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="badges">
            <p className="text-muted-foreground">Gestion des badges en cours de développement.</p>
          </TabsContent>
          <TabsContent value="challenges">
            <p className="text-muted-foreground">Gestion des défis en cours de développement.</p>
          </TabsContent>
          <TabsContent value="rewards">
            <p className="text-muted-foreground">Gestion des récompenses en cours de développement.</p>
          </TabsContent>
        </Tabs>
      </QueryStateWrapper>
    </div>
  );
};

export default GamificationTab;
