// @ts-nocheck
/**
 * Organisation Dashboard - Vue macro pour institutions B2B
 * Affiche uniquement des données agrégées et anonymisées
 */
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Shield,
  Calendar,
  Clock,
  Heart,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useOrgAggregates } from '@/hooks/b2b/useOrgAggregates';
import { cn } from '@/lib/utils';

interface OrgDashboardProps {
  orgId: string;
  orgName: string;
}

export const OrgDashboard: React.FC<OrgDashboardProps> = ({ orgId, orgName }) => {
  const { data, loading, refetch } = useOrgAggregates(orgId);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Header avec indicateur anonymisation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{orgName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              Données anonymisées
            </Badge>
            <span className="text-xs text-muted-foreground">
              Minimum 5 participants par indicateur
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Actualiser
        </Button>
      </div>

      {/* Avertissement éthique */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            <Shield className="h-4 w-4 inline mr-2" />
            Ce tableau de bord affiche des tendances collectives uniquement.
            Aucune donnée individuelle n'est accessible.
          </p>
        </CardContent>
      </Card>

      {/* KPIs macro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Taux d'adoption */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Taux d'adoption
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{data?.adoptionRate ?? 0}%</span>
                {getTrendIcon(data?.adoptionTrend ?? 'stable')}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Utilisateurs actifs cette semaine
            </p>
          </CardContent>
        </Card>

        {/* Fréquence d'usage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Fréquence moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{data?.avgSessionsPerUser ?? 0}</span>
                <span className="text-muted-foreground">sessions/sem</span>
              </div>
            )}
            <Progress value={(data?.avgSessionsPerUser ?? 0) * 20} className="h-2 mt-3" />
          </CardContent>
        </Card>

        {/* Durée moyenne */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Durée moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{data?.avgSessionDuration ?? 0}</span>
                <span className="text-muted-foreground">min</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">Par session</p>
          </CardContent>
        </Card>

        {/* Évolution temporelle */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Évolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="flex items-end gap-2">
                <span className={cn(
                  "text-3xl font-bold",
                  (data?.weeklyGrowth ?? 0) > 0 && "text-success",
                  (data?.weeklyGrowth ?? 0) < 0 && "text-destructive"
                )}>
                  {(data?.weeklyGrowth ?? 0) > 0 ? '+' : ''}{data?.weeklyGrowth ?? 0}%
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">vs semaine précédente</p>
          </CardContent>
        </Card>
      </div>

      {/* Parcours les plus utilisés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Parcours les plus utilisés
          </CardTitle>
          <CardDescription>
            Types d'activités privilégiées par vos collaborateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {(data?.topPathways ?? []).map((pathway, index) => (
                <div key={pathway.name} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{pathway.name}</span>
                      <span className="text-muted-foreground">{pathway.percentage}%</span>
                    </div>
                    <Progress value={pathway.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Créneaux d'utilisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Créneaux d'utilisation
          </CardTitle>
          <CardDescription>
            Moments privilégiés pour les sessions bien-être
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(data?.usageByTimeSlot ?? []).map((slot) => (
                <div
                  key={slot.label}
                  className={cn(
                    "text-center p-4 rounded-lg border",
                    slot.isTop && "bg-primary/5 border-primary/30"
                  )}
                >
                  <div className="text-2xl mb-1">{slot.emoji}</div>
                  <div className="font-medium">{slot.label}</div>
                  <div className="text-2xl font-bold">{slot.percentage}%</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer éthique */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-4">
        <Shield className="h-3 w-3" />
        <span>
          Données agrégées et anonymisées • Aucun score individuel • Conforme RGPD
        </span>
      </div>
    </div>
  );
};

export default OrgDashboard;
