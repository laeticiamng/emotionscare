import { useMemo } from 'react';
import {
  Trophy,
  RefreshCw,
  Sparkles,
  Flame,
  Medal,
  Award,
  Target,
  Shield,
  Users,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAdvancedLeaderboard } from '@/hooks/useAdvancedLeaderboard';
import type { LeaderboardPeriod } from '@/hooks/useAdvancedLeaderboard';

const PERIOD_LABELS: Record<'week' | 'month' | 'all', string> = {
  week: '7 derniers jours',
  month: '30 derniers jours',
  all: 'All-time',
};

const podiumGradients = [
  'from-yellow-400/30 via-amber-400/10 to-orange-500/10 border-yellow-400/40',
  'from-slate-200/30 via-slate-300/10 to-slate-500/10 border-slate-300/40',
  'from-orange-400/20 via-rose-500/10 to-amber-500/10 border-orange-400/40',
];

const getAvatarFallback = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const formatNumber = (value: number) => value.toLocaleString('fr-FR');

const LeaderboardPage = () => {
  const {
    entries,
    loading,
    error,
    refresh,
    period,
    setPeriod,
    emotionalProfile,
    setEmotionalProfile,
    profileOptions,
    lastUpdated,
  } = useAdvancedLeaderboard();

  const topThree = useMemo(() => entries.slice(0, 3), [entries]);
  const remainingEntries = useMemo(() => entries.slice(3), [entries]);

  const summaryStats = useMemo(() => {
    if (!entries.length) {
      return {
        participants: 0,
        averageXp: 0,
        averageBadges: 0,
        averageChallenges: 0,
      };
    }

    const participants = entries.length;
    const totalXp = entries.reduce((acc, entry) => acc + entry.xp[period], 0);
    const totalBadges = entries.reduce(
      (acc, entry) => acc + entry.badgesUnlocked,
      0
    );
    const totalChallenges = entries.reduce(
      (acc, entry) => acc + entry.challengesCompleted,
      0
    );

    return {
      participants,
      averageXp: Math.round(totalXp / participants),
      averageBadges: Number((totalBadges / participants).toFixed(1)),
      averageChallenges: Number((totalChallenges / participants).toFixed(1)),
    };
  }, [entries, period]);

  const formattedLastUpdated = useMemo(() => {
    if (!lastUpdated) return null;
    const parsed = new Date(lastUpdated);
    if (Number.isNaN(parsed.getTime())) return null;

    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(parsed);
  }, [lastUpdated]);

  const periodLabel = PERIOD_LABELS[period];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="container mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Trophy className="h-4 w-4" />
              Classement EmotionScare
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Classement communautaire des explorateurs
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Suivez le classement des utilisateurs selon leur XP gagné,
              les badges débloqués et les défis complétés. Utilisez les filtres
              pour analyser les performances par période et par profil émotionnel.
            </p>
            {formattedLastUpdated && (
              <p className="text-xs text-muted-foreground">
                Dernière mise à jour : {formattedLastUpdated}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <Tabs
              value={period}
              onValueChange={(value) =>
                setPeriod(value as LeaderboardPeriod)
              }
              className="md:self-end"
            >
              <TabsList aria-label="Filtrer le leaderboard par période">
                <TabsTrigger value="week">Semaine</TabsTrigger>
                <TabsTrigger value="month">Mois</TabsTrigger>
                <TabsTrigger value="all">All-time</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select
                value={emotionalProfile}
                onValueChange={setEmotionalProfile}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Profil émotionnel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les profils</SelectItem>
                  {profileOptions.map((profile) => (
                    <SelectItem key={profile} value={profile}>
                      {profile}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
                onClick={refresh}
                disabled={loading}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                />
                Actualiser
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-primary/40 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryStats.participants || '—'}
              </div>
              <p className="text-xs text-muted-foreground">
                Explorateurs inclus dans la vue courante
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">XP moyen</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryStats.participants
                  ? `${formatNumber(summaryStats.averageXp)} XP`
                  : '—'}
              </div>
              <p className="text-xs text-muted-foreground">
                Moyenne sur la période {periodLabel.toLowerCase()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Badges moyens
              </CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryStats.participants
                  ? summaryStats.averageBadges.toLocaleString('fr-FR')
                  : '—'}
              </div>
              <p className="text-xs text-muted-foreground">
                Badges débloqués par explorateur
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Défis moyens
              </CardTitle>
              <Sparkles className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryStats.participants
                  ? summaryStats.averageChallenges.toLocaleString('fr-FR')
                  : '—'}
              </div>
              <p className="text-xs text-muted-foreground">
                Défis complétés par explorateur
              </p>
            </CardContent>
          </Card>
        </div>

        {loading && !entries.length ? (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center gap-3 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Chargement du classement avancé…
              </p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="py-6 text-center text-sm text-destructive">
              Une erreur est survenue : {error}
            </CardContent>
          </Card>
        ) : !entries.length ? (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center gap-3 text-center text-muted-foreground">
              <Trophy className="h-10 w-10" />
              <p>Aucun participant n’est disponible pour le moment.</p>
              <p className="text-xs">
                Revenez plus tard ou ajustez vos filtres pour voir le
                classement.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {topThree.map((entry, index) => (
                <Card
                  key={entry.id}
                  className={`relative overflow-hidden border ${podiumGradients[index] ?? 'border-border'}`}
                >
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10" />
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {index === 0 ? (
                            <Trophy className="h-5 w-5 text-yellow-500" />
                          ) : index === 1 ? (
                            <Medal className="h-5 w-5 text-slate-500" />
                          ) : (
                            <Award className="h-5 w-5 text-orange-500" />
                          )}
                          #{entry.rank} • {entry.displayName}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {entry.emotionalProfile}
                        </p>
                      </div>
                      <Avatar className="h-12 w-12 border-2 border-primary/40">
                        {entry.avatarUrl ? (
                          <AvatarImage src={entry.avatarUrl} alt={entry.displayName} />
                        ) : (
                          <AvatarFallback>
                            {getAvatarFallback(entry.displayName)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">XP</p>
                        <p className="text-lg font-semibold text-primary">
                          {formatNumber(entry.xp[period])}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Badges</p>
                        <p className="text-lg font-semibold">
                          {entry.badgesUnlocked}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Défis</p>
                        <p className="text-lg font-semibold">
                          {entry.challengesCompleted}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {entry.topBadges.length ? (
                        entry.topBadges.map((badgeName, badgeIndex) => (
                          <Badge
                            key={`${entry.id}-badge-${badgeIndex}`}
                            variant="secondary"
                            className="text-xs"
                          >
                            {badgeName}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Aucun badge à afficher
                        </span>
                      )}
                    </div>

                    {entry.streakDays ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        <Flame className="h-3 w-3" />
                        {entry.streakDays} jours de série
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>

            {remainingEntries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Classement détaillé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {remainingEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-xl border border-border/60 bg-background/60 p-4 backdrop-blur"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-1 items-center gap-4">
                          <div className="text-xl font-semibold text-muted-foreground">
                            #{entry.rank}
                          </div>
                          <Avatar className="h-10 w-10">
                            {entry.avatarUrl ? (
                              <AvatarImage
                                src={entry.avatarUrl}
                                alt={entry.displayName}
                              />
                            ) : (
                              <AvatarFallback>
                                {getAvatarFallback(entry.displayName)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-semibold">
                              {entry.displayName}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="rounded-full px-2 py-0.5">
                                {entry.emotionalProfile}
                              </Badge>
                              {entry.streakDays ? (
                                <span className="inline-flex items-center gap-1 text-orange-500">
                                  <Flame className="h-3 w-3" />
                                  {entry.streakDays} jours de série
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="grid flex-none grid-cols-3 gap-6 text-center text-sm md:gap-8">
                          <div>
                            <p className="text-xs text-muted-foreground">XP</p>
                            <p className="text-base font-semibold text-primary">
                              {formatNumber(entry.xp[period])}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Badges</p>
                            <p className="text-base font-semibold">
                              {entry.badgesUnlocked}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Défis</p>
                            <p className="text-base font-semibold">
                              {entry.challengesCompleted}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        {entry.topBadges.length ? (
                          entry.topBadges.map((badgeName, badgeIndex) => (
                            <Badge
                              key={`${entry.id}-list-badge-${badgeIndex}`}
                              variant="secondary"
                              className="text-xs"
                            >
                              {badgeName}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            Aucun badge mis en avant
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
