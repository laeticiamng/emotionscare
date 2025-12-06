import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Trophy, Crown, Award, TrendingUp, Calendar, Gift } from 'lucide-react';
import {
  seasonService,
  CompetitiveSeason,
  SeasonRanking,
  SeasonReward,
  HonoraryTitle,
} from '@/services/season-service';

export default function CompetitiveSeasonsPage() {
  const [currentSeason, setCurrentSeason] = useState<CompetitiveSeason | null>(null);
  const [seasonHistory, setSeasonHistory] = useState<CompetitiveSeason[]>([]);
  const [userRanking, setUserRanking] = useState<SeasonRanking | null>(null);
  const [leaderboard, setLeaderboard] = useState<SeasonRanking[]>([]);
  const [rewards, setRewards] = useState<SeasonReward[]>([]);
  const [titles, setTitles] = useState<HonoraryTitle[]>([]);

  useEffect(() => {
    loadSeasonData();
  }, []);

  const loadSeasonData = async () => {
    const [season, history, titlesData] = await Promise.all([
      seasonService.getCurrentSeason(),
      seasonService.getSeasonHistory(),
      seasonService.getUserHonoraryTitles(),
    ]);

    setCurrentSeason(season);
    setSeasonHistory(history);
    setTitles(titlesData);

    if (season) {
      const [ranking, board, rewardsData] = await Promise.all([
        seasonService.getUserSeasonRanking(season.id),
        seasonService.getSeasonLeaderboard(season.id),
        seasonService.getSeasonRewards(season.id),
      ]);

      setUserRanking(ranking);
      setLeaderboard(board);
      setRewards(rewardsData);
    }
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      bronze: 'bg-orange-900',
      silver: 'bg-gray-400',
      gold: 'bg-yellow-500',
      platinum: 'bg-cyan-400',
      diamond: 'bg-blue-500',
      master: 'bg-purple-500',
      grandmaster: 'bg-pink-500',
    };
    return colors[tier] || 'bg-gray-500';
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'secondary',
      rare: 'default',
      epic: 'default',
      legendary: 'default',
    };
    return colors[rarity] || 'secondary';
  };

  const calculateProgress = (points: number) => {
    const thresholds = [0, 500, 1000, 2000, 3000, 4000, 5000];
    const currentTierIndex = thresholds.findIndex((t, i) => 
      i === thresholds.length - 1 || (points >= t && points < thresholds[i + 1])
    );
    
    if (currentTierIndex === thresholds.length - 1) return 100;
    
    const currentThreshold = thresholds[currentTierIndex];
    const nextThreshold = thresholds[currentTierIndex + 1];
    return ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Current Season Header */}
      {currentSeason && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Trophy className="h-6 w-6 text-primary" />
                  {currentSeason.name}
                </CardTitle>
                <CardDescription>
                  Saison {currentSeason.season_number} • Se termine le{' '}
                  {new Date(currentSeason.end_date).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge variant="default" className="text-lg px-4 py-2">
                Saison Active
              </Badge>
            </div>
          </CardHeader>
          {userRanking && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className={`inline-block px-4 py-2 rounded-lg ${getTierColor(userRanking.tier)} text-white font-bold mb-2`}>
                      {userRanking.tier.toUpperCase()}
                    </div>
                    <p className="text-sm text-muted-foreground">Rang actuel</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-primary">{userRanking.total_points}</div>
                    <p className="text-sm text-muted-foreground">Points</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold">{userRanking.wins}</div>
                    <p className="text-sm text-muted-foreground">Victoires</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold">
                      #{userRanking.final_rank || leaderboard.findIndex(r => r.user_id === userRanking.user_id) + 1}
                    </div>
                    <p className="text-sm text-muted-foreground">Classement</p>
                  </CardContent>
                </Card>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression vers le prochain rang</span>
                  <span className="text-muted-foreground">{calculateProgress(userRanking.total_points).toFixed(0)}%</span>
                </div>
                <Progress value={calculateProgress(userRanking.total_points)} />
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <Tabs defaultValue="leaderboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leaderboard">
            <TrendingUp className="h-4 w-4 mr-2" />
            Classement
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <Gift className="h-4 w-4 mr-2" />
            Récompenses
          </TabsTrigger>
          <TabsTrigger value="titles">
            <Crown className="h-4 w-4 mr-2" />
            Titres
          </TabsTrigger>
          <TabsTrigger value="history">
            <Calendar className="h-4 w-4 mr-2" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Top 100 Joueurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-muted-foreground w-8">
                        {index + 1}
                      </div>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={player.user?.avatar_url} />
                        <AvatarFallback>{player.user?.display_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{player.user?.display_name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getTierColor(player.tier)} variant="secondary">
                            {player.tier}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {player.wins}V - {player.losses}D
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{player.total_points}</div>
                      <p className="text-sm text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <CardTitle>Récompenses de Fin de Saison</CardTitle>
              <CardDescription>
                Récompenses basées sur votre classement final
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map((reward) => (
                  <Card key={reward.id} className="border-primary/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold mb-1">
                            Rang #{reward.rank_min} - #{reward.rank_max}
                          </h4>
                          <Badge variant="outline">
                            {reward.reward_type === 'xp' && `${reward.reward_value} XP`}
                            {reward.reward_type === 'cosmetic' && 'Cosmétique Exclusif'}
                            {reward.reward_type === 'title' && 'Titre Honorifique'}
                            {reward.reward_type === 'badge' && 'Badge Spécial'}
                          </Badge>
                        </div>
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      {reward.reward_data && (
                        <p className="text-sm text-muted-foreground">
                          {JSON.stringify(reward.reward_data)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="titles">
          <Card>
            <CardHeader>
              <CardTitle>Vos Titres Honorifiques</CardTitle>
              <CardDescription>
                Titres permanents gagnés dans les saisons précédentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {titles.length === 0 ? (
                  <p className="text-muted-foreground col-span-2 text-center py-8">
                    Aucun titre débloqué. Terminez une saison dans le top pour gagner des titres !
                  </p>
                ) : (
                  titles.map((title) => (
                    <Card key={title.id} className="border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Crown className={`h-8 w-8 ${
                            title.rarity === 'legendary' ? 'text-yellow-500' :
                            title.rarity === 'epic' ? 'text-purple-500' :
                            title.rarity === 'rare' ? 'text-blue-500' :
                            'text-gray-500'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{title.title_name}</h4>
                              <Badge variant={getRarityColor(title.rarity) as any}>
                                {title.rarity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {title.title_description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Obtenu le {new Date(title.granted_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Saisons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seasonHistory.map((season) => (
                  <Card key={season.id} className={season.status === 'active' ? 'border-primary/20' : ''}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{season.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Saison {season.season_number} •{' '}
                            {new Date(season.start_date).toLocaleDateString()} -{' '}
                            {new Date(season.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={
                          season.status === 'active' ? 'default' :
                          season.status === 'ended' ? 'secondary' :
                          'outline'
                        }>
                          {season.status === 'active' && 'Active'}
                          {season.status === 'ended' && 'Terminée'}
                          {season.status === 'upcoming' && 'À venir'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
