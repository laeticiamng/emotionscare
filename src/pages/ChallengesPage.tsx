/**
 * ChallengesPage - Défis communautaires avec données Supabase
 */
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame, Users, Clock, Plus, Trophy, Target, Calendar } from 'lucide-react';
import { useWeeklyChallenges } from '@/hooks/useWeeklyChallenges';
import { useChallengesHistory } from '@/hooks/useChallengesHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ChallengesPage() {
  const navigate = useNavigate();
  const { challenges, userProgress, isLoading, claimReward } = useWeeklyChallenges();
  const { stats, loading: statsLoading } = useChallengesHistory();

  const activeChallenges = challenges.filter(c => c.is_active);
  const totalParticipants = challenges.length * 50; // Estimation basée sur les défis actifs

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="h-8 w-8 text-primary" />
              Défis Collaboratifs
            </h1>
            <p className="text-muted-foreground">Progressez ensemble, soutenez-vous mutuellement</p>
          </div>
          <Button onClick={() => navigate('/app/challenges/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Proposer un Défi
          </Button>
        </header>

        {/* Défis métier soignants */}
        <div className="grid gap-3 md:grid-cols-3 mb-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">Nouveau</Badge>
                <span className="text-sm font-medium">Pause Inter-Garde</span>
              </div>
              <p className="text-xs text-muted-foreground">3 min de respiration entre deux patients</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs bg-success/10">Populaire</Badge>
                <span className="text-sm font-medium">Décompression Post-Urgence</span>
              </div>
              <p className="text-xs text-muted-foreground">Session de 5 min après une situation intense</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-info/5 to-info/10 border-info/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs bg-info/10">Équipe</Badge>
                <span className="text-sm font-medium">Rituel d'Équipe</span>
              </div>
              <p className="text-xs text-muted-foreground">5 min de cohésion avant la relève</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Défis Actifs</CardTitle>
              <Flame className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{activeChallenges.length}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{totalParticipants}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Défis Complétés</CardTitle>
              <Target className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.totalCompleted || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">XP Total</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.totalCompleted ? stats.totalCompleted * 50 : 0}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Challenges Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              <Flame className="h-4 w-4" />
              Actifs
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Défis en cours</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : activeChallenges.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucun défi actif pour le moment</p>
                    <Button className="mt-4" onClick={() => navigate('/app/challenges/create')}>
                      Créer le premier défi
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeChallenges.map((challenge) => {
                      const progress = userProgress.get(challenge.id);
                      const progressPercent = progress 
                        ? Math.round((progress.current_value / challenge.target_value) * 100)
                        : 0;
                      const isCompleted = progressPercent >= 100;

                      return (
                        <div
                          key={challenge.id}
                          className="space-y-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                          onClick={() => navigate(`/app/challenges/${challenge.id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold flex items-center gap-2">
                                {challenge.title}
                                {isCompleted && (
                                  <Badge variant="default" className="bg-success">
                                    Complété
                                  </Badge>
                                )}
                                {!isCompleted && challenge.is_active && (
                                  <Badge variant="secondary">En cours</Badge>
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {challenge.description}
                              </p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {activeChallenges.length * 10} participants
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Fin: {challenge.ends_at ? format(new Date(challenge.ends_at), 'dd MMM', { locale: fr }) : 'N/A'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Trophy className="h-3 w-3" />
                                  +{challenge.xp_reward} XP
                                </span>
                              </div>
                            </div>
                            {isCompleted && !progress?.completed_at && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  claimReward(challenge.id);
                                }}
                              >
                                Récupérer
                              </Button>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Votre progression</span>
                              <span className="font-medium">{progressPercent}%</span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historique des défis</CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : stats && stats.totalCompleted > 0 ? (
                  <div className="space-y-6">
                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{stats.totalCompleted}</div>
                        <div className="text-xs text-muted-foreground">Défis complétés</div>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-success">{stats.currentStreak}</div>
                        <div className="text-xs text-muted-foreground">Série actuelle</div>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-warning">{stats.bestStreak}</div>
                        <div className="text-xs text-muted-foreground">Meilleure série</div>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-info">{Math.round(stats.completionRate)}%</div>
                        <div className="text-xs text-muted-foreground">Taux réussite</div>
                      </div>
                    </div>
                    
                    {/* Weekly average */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Moyenne hebdomadaire</p>
                        <p className="text-sm text-muted-foreground">Sur les 4 dernières semaines</p>
                      </div>
                      <div className="text-2xl font-bold">{stats.weeklyAverage.toFixed(1)} défis/semaine</div>
                    </div>
                    
                    {/* Breakdown by type */}
                    {Object.keys(stats.completionByType).length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Par type de défi</h4>
                        <div className="space-y-2">
                          {Object.entries(stats.completionByType).map(([type, data]) => (
                            <div key={type} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                              <span className="capitalize">{type}</span>
                              <div className="flex items-center gap-3">
                                <Progress value={(data.completed / data.total) * 100} className="w-24 h-2" />
                                <span className="text-sm text-muted-foreground">
                                  {data.completed}/{data.total}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun défi complété pour l'instant</p>
                    <p className="text-sm mt-2">Participez à votre premier défi pour voir votre historique ici !</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
