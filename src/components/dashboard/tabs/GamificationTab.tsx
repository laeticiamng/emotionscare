// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Trophy, Star, Download, Share2, 
  Target, Flame, Award, Crown 
} from 'lucide-react';
import { useGamificationRealData } from '@/hooks/useGamificationRealData';
import { useToast } from '@/hooks/use-toast';

export interface GamificationTabProps {
  className?: string;
}

const GamificationTab: React.FC<GamificationTabProps> = ({ className }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const { stats, badges, challenges, leaderboard, isLoading } = useGamificationRealData();

  const handleExport = () => {
    const data = { stats, challenges, badges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gamification-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast({ title: 'Exporté !', description: 'Données de gamification téléchargées' });
  };

  if (isLoading) {
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleShare = async () => {
    const text = `🎮 Mon profil EmotionsCare: Niveau ${stats.level} | ${stats.totalPoints} pts | ${stats.badgesEarned} badges !`;
    if (navigator.share) await navigator.share({ text }).catch(() => {});
    else { await navigator.clipboard.writeText(text); toast({ title: 'Copié !' }); }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Gamification
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}><Share2 className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExport}><Download className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats overview */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-primary/5 rounded-lg text-center">
              <Crown className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
              <div className="text-xl font-bold">{stats.level}</div>
              <div className="text-xs text-muted-foreground">Niveau</div>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg text-center">
              <Star className="h-5 w-5 mx-auto mb-1 text-amber-500" />
              <div className="text-xl font-bold">{stats.totalPoints}</div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg text-center">
              <Award className="h-5 w-5 mx-auto mb-1 text-purple-500" />
              <div className="text-xl font-bold">{stats.badgesEarned}</div>
              <div className="text-xs text-muted-foreground">Badges</div>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg text-center">
              <Target className="h-5 w-5 mx-auto mb-1 text-green-500" />
              <div className="text-xl font-bold">{stats.challengesCompleted}</div>
              <div className="text-xs text-muted-foreground">Défis</div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Défis</TabsTrigger>
              <TabsTrigger value="badges" className="flex-1">Badges</TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex-1">Classement</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {challenges.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Aucun défi actif pour le moment</p>
              ) : (
                challenges.slice(0, 3).map(challenge => (
                  <div key={challenge.id} className="border p-3 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        {challenge.title}
                      </h4>
                      <Badge variant={challenge.status === 'completed' ? "default" : "secondary"}>
                        {challenge.progress}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="badges" className="mt-4">
              {badges.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Aucun badge disponible</p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {badges.map(badge => (
                    <div key={badge.id} className={`border p-3 rounded-md text-center ${badge.earned ? 'border-primary' : 'opacity-50'}`}>
                      <div className="text-2xl mb-2">{badge.earned ? badge.icon || '🏅' : '🔒'}</div>
                      <p className="text-sm font-medium">{badge.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="leaderboard" className="mt-4 space-y-2">
              {leaderboard.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Classement non disponible</p>
              ) : (
                leaderboard.slice(0, 5).map(entry => (
                  <div key={entry.id} className={`flex justify-between items-center border p-3 rounded-md ${entry.rank <= 3 ? 'bg-primary/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-bold w-6 text-center">
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                      </span>
                      <span>{entry.username}</span>
                    </div>
                    <span className="font-medium text-primary">{entry.score} pts</span>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationTab;
