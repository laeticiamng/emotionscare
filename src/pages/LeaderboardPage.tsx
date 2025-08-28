import React from 'react';
import { useGamificationStore } from '@/store/gamification.store';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useBadges } from '@/hooks/useBadges';
import { RankCard } from '@/components/gamification/RankCard';
import { FiltersBar } from '@/components/gamification/FiltersBar';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import { BadgesWall } from '@/components/gamification/BadgesWall';
import { SeasonBanner } from '@/components/gamification/SeasonBanner';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Award, Users } from 'lucide-react';

export default function LeaderboardPage() {
  const { scope, period, setScope, setPeriod } = useGamificationStore();
  const { me, leaderboard, next, loading, error, fetchNext } = useLeaderboard({ scope, period });
  const { badges } = useBadges();

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Gamification
          </h1>
          <p className="text-muted-foreground">
            Classements et badges de progression
          </p>
        </header>

        <SeasonBanner />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RankCard data={me} />
            
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="leaderboard" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Classement
                    </TabsTrigger>
                    <TabsTrigger value="badges" className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Badges
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="leaderboard" className="space-y-4 mt-6">
                    <FiltersBar 
                      scope={scope} 
                      period={period} 
                      onScope={setScope} 
                      onPeriod={setPeriod} 
                    />
                    
                    <Leaderboard 
                      entries={leaderboard} 
                      loading={loading} 
                      error={error} 
                      onLoadMore={fetchNext}
                      hasMore={!!next}
                    />
                  </TabsContent>
                  
                  <TabsContent value="badges" className="mt-6">
                    <BadgesWall badges={badges} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {/* Quick stats or additional info */}
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Communauté</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Participants actifs</span>
                      <span className="font-medium">{leaderboard?.length || 0}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Badges débloqués</span>
                      <span className="font-medium">
                        {badges?.unlocked?.length || 0}/{(badges?.unlocked?.length || 0) + (badges?.locked?.length || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}