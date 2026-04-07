// @ts-nocheck
/**
 * GamificationHubPage — Hub unifié de gamification
 * Regroupe XP, Badges, Défis quotidiens, Classement et Résilience
 */
import React, { Suspense, lazy, useState } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Flame, Target, Medal, Swords, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useGamification } from '@/hooks/useGamification';
import { motion } from 'framer-motion';

const AchievementsPage = lazy(() => import('@/pages/gamification/AchievementsPage'));
const DailyChallengesPage = lazy(() => import('@/pages/gamification/DailyChallengesPage'));
const LeaderboardPage = lazy(() => import('@/pages/gamification/LeaderboardPage'));
const ChallengesPage = lazy(() => import('@/pages/gamification/ChallengesPage'));

const TABS = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: Trophy },
  { id: 'daily', label: 'Défis du jour', icon: Flame },
  { id: 'achievements', label: 'Badges', icon: Medal },
  { id: 'challenges', label: 'Résilience', icon: Target },
  { id: 'leaderboard', label: 'Classement', icon: Star },
] as const;

const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

const GamificationHubPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { stats } = useGamification();

  usePageSEO({
    title: 'Gamification — Progression & Défis | EmotionsCare',
    description: 'Suivez votre progression, relevez des défis quotidiens et débloquez des badges pour votre bien-être émotionnel.',
  });

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab }, { replace: true });
  };

  const xp = stats?.totalXP ?? 0;
  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;
  const streak = stats?.currentStreak ?? 0;
  const badges = stats?.totalBadges ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header with XP summary */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold">Progression</h1>
          </div>
          <p className="text-muted-foreground">Votre parcours de bien-être gamifié</p>
        </div>

        {/* XP Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">Niveau</span>
              </div>
              <p className="text-2xl font-bold">{level}</p>
              <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                  style={{ width: `${(xpInLevel / 500) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{xpInLevel}/500 XP</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">XP Total</span>
              </div>
              <p className="text-2xl font-bold">{xp.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-xs text-muted-foreground">Streak</span>
              </div>
              <p className="text-2xl font-bold">{streak}j</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Medal className="h-4 w-4 text-violet-500" />
                <span className="text-xs text-muted-foreground">Badges</span>
              </div>
              <p className="text-2xl font-bold">{badges}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-6">
            {TABS.map(({ id, label, icon: Icon }) => (
              <TabsTrigger key={id} value={id} className="gap-1.5 shrink-0">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">🎯 Objectifs du jour</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Faire un scan émotionnel', xp: 50, done: false },
                      { label: 'Compléter une session de respiration', xp: 30, done: false },
                      { label: 'Écrire dans votre journal', xp: 40, done: false },
                    ].map((goal, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 ${goal.done ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`} />
                          <span className={goal.done ? 'line-through text-muted-foreground' : ''}>{goal.label}</span>
                        </div>
                        <Badge variant="secondary">+{goal.xp} XP</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">🏆 Derniers badges débloqués</h2>
                  <div className="flex gap-4 flex-wrap">
                    {[
                      { emoji: '🌅', name: 'Premier Scan', desc: 'Votre premier scan émotionnel' },
                      { emoji: '🫁', name: 'Souffle d\'or', desc: '10 sessions de respiration' },
                      { emoji: '📝', name: 'Plume fidèle', desc: '7 jours consécutifs de journal' },
                    ].map((badge, i) => (
                      <div key={i} className="flex flex-col items-center text-center w-20">
                        <div className="text-3xl mb-1">{badge.emoji}</div>
                        <p className="text-xs font-medium">{badge.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="daily">
            <Suspense fallback={<LoadingFallback />}>
              <DailyChallengesPage />
            </Suspense>
          </TabsContent>

          <TabsContent value="achievements">
            <Suspense fallback={<LoadingFallback />}>
              <AchievementsPage />
            </Suspense>
          </TabsContent>

          <TabsContent value="challenges">
            <Suspense fallback={<LoadingFallback />}>
              <ChallengesPage />
            </Suspense>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Suspense fallback={<LoadingFallback />}>
              <LeaderboardPage />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GamificationHubPage;
