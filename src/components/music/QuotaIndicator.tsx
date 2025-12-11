/**
 * QuotaIndicator - Composant d'affichage du quota utilisateur enrichi
 *
 * Affiche:
 * - Quota utilisé / limite
 * - Barre de progression
 * - Date de reset
 * - Upgrade CTA si free tier
 * - Historique d'usage
 * - Prédictions de consommation
 * - Notifications de quota
 *
 * @module components/music/QuotaIndicator
 */

// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { LazyMotionWrapper, m } from '@/utils/lazy-motion';
import { useQuotaUI } from '@/hooks/music/useUserQuota';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Zap, TrendingUp, AlertCircle, Clock, Sparkles, 
  History, Bell, BellOff, BarChart3, Calendar,
  ChevronUp, ChevronDown, Target, Gift
} from '@/components/music/icons';
import { UserTier } from '@/services/music/quota-service';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface QuotaIndicatorProps {
  variant?: 'default' | 'compact' | 'minimal';
  showUpgrade?: boolean;
  className?: string;
}

interface UsageEntry {
  date: string;
  count: number;
  type: 'generation' | 'save' | 'share';
}

interface QuotaNotification {
  enabled: boolean;
  threshold: number; // Percentage
}

const STORAGE_KEY = 'quota-indicator-data';

export function QuotaIndicator({
  variant = 'default',
  showUpgrade = true,
  className = ''
}: QuotaIndicatorProps) {
  const {
    quota,
    remaining,
    limit,
    percentage,
    formattedResetDate,
    quotaColor,
    tier,
    isLoading,
    canGenerate
  } = useQuotaUI();

  const [activeTab, setActiveTab] = useState('overview');
  const [usageHistory, setUsageHistory] = useState<UsageEntry[]>([]);
  const [notifications, setNotifications] = useState<QuotaNotification>({
    enabled: true,
    threshold: 20
  });
  const [predictions, setPredictions] = useState({
    daysRemaining: 0,
    dailyAverage: 0,
    willExceed: false
  });

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setUsageHistory(data.history || []);
      setNotifications(data.notifications || notifications);
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      history: usageHistory,
      notifications
    }));
  }, [usageHistory, notifications]);

  // Calculate predictions
  useEffect(() => {
    if (usageHistory.length > 0) {
      const last7Days = usageHistory.slice(0, 7);
      const totalUsage = last7Days.reduce((sum, e) => sum + e.count, 0);
      const dailyAverage = totalUsage / Math.min(7, last7Days.length);
      const daysRemaining = dailyAverage > 0 ? Math.floor(remaining / dailyAverage) : 30;
      const willExceed = dailyAverage * 30 > limit;

      setPredictions({ daysRemaining, dailyAverage, willExceed });
    }
  }, [usageHistory, remaining, limit]);

  // Check for notification trigger
  useEffect(() => {
    if (notifications.enabled && percentage <= notifications.threshold && percentage > 0) {
      toast.warning(`Attention: Il ne vous reste que ${remaining} générations (${percentage}%)`);
    }
  }, [percentage, remaining, notifications]);

  // Track usage (would be called on actual generation)
  const trackUsage = (type: 'generation' | 'save' | 'share' = 'generation') => {
    const today = new Date().toISOString().split('T')[0];
    setUsageHistory(prev => {
      const todayEntry = prev.find(e => e.date === today && e.type === type);
      if (todayEntry) {
        return prev.map(e => 
          e.date === today && e.type === type 
            ? { ...e, count: e.count + 1 } 
            : e
        );
      }
      return [{ date: today, count: 1, type }, ...prev.slice(0, 89)];
    });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Chargement du quota...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quota) {
    return null;
  }

  // Variante minimale
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <Zap className="h-4 w-4" />
        <span>
          {remaining}/{limit}
        </span>
        {percentage <= 20 && (
          <AlertCircle className="h-4 w-4 text-orange-500" />
        )}
      </div>
    );
  }

  // Variante compacte
  if (variant === 'compact') {
    return (
      <Card className={className}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {remaining}/{limit} générations
                </span>
                {predictions.willExceed && (
                  <Badge variant="destructive" className="text-xs">
                    ⚠️
                  </Badge>
                )}
              </div>
              <Progress
                value={percentage}
                className="h-1.5"
                indicatorClassName={
                  quotaColor === 'red'
                    ? 'bg-red-500'
                    : quotaColor === 'orange'
                    ? 'bg-orange-500'
                    : quotaColor === 'yellow'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }
              />
            </div>
            {tier === UserTier.FREE && showUpgrade && (
              <Button size="sm" variant="outline" asChild>
                <Link to="/premium">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Upgrade
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Variante par défaut (complète)
  return (
    <LazyMotionWrapper>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={className}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Quota de Génération
                </CardTitle>
                <div className="flex items-center gap-2">
                  <TabsList className="h-7">
                    <TabsTrigger value="overview" className="text-xs px-2">Vue</TabsTrigger>
                    <TabsTrigger value="history" className="text-xs px-2">Historique</TabsTrigger>
                    <TabsTrigger value="settings" className="text-xs px-2">Options</TabsTrigger>
                  </TabsList>
                  <Badge variant={tier === UserTier.FREE ? 'outline' : 'default'}>
                    {tier === UserTier.FREE && 'Free'}
                    {tier === UserTier.PREMIUM && 'Premium'}
                    {tier === UserTier.ENTERPRISE && 'Enterprise'}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <TabsContent value="overview" className="mt-0 space-y-4">
                {/* Progression */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">
                      {remaining}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        / {limit}
                      </span>
                    </span>
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  </div>
                  <Progress
                    value={percentage}
                    className="h-2"
                    indicatorClassName={
                      quotaColor === 'red'
                        ? 'bg-red-500'
                        : quotaColor === 'orange'
                        ? 'bg-orange-500'
                        : quotaColor === 'yellow'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {remaining === 0
                      ? 'Quota épuisé'
                      : remaining === 1
                      ? '1 génération restante'
                      : `${remaining} générations restantes`}
                  </p>
                </div>

                {/* Predictions */}
                <div className="grid grid-cols-3 gap-2">
                  <Card className="p-2 bg-muted/30">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Target className="h-3 w-3" />
                      Moyenne/jour
                    </div>
                    <div className="text-lg font-bold">
                      {predictions.dailyAverage.toFixed(1)}
                    </div>
                  </Card>
                  <Card className="p-2 bg-muted/30">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3 w-3" />
                      Jours restants
                    </div>
                    <div className={cn(
                      'text-lg font-bold',
                      predictions.daysRemaining < 7 && 'text-orange-500'
                    )}>
                      ~{predictions.daysRemaining}
                    </div>
                  </Card>
                  <Card className="p-2 bg-muted/30">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <TrendingUp className="h-3 w-3" />
                      Tendance
                    </div>
                    <div className={cn(
                      'text-lg font-bold flex items-center',
                      predictions.willExceed ? 'text-red-500' : 'text-green-500'
                    )}>
                      {predictions.willExceed ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      {predictions.willExceed ? 'Élevée' : 'OK'}
                    </div>
                  </Card>
                </div>

                {/* Date de reset */}
                {formattedResetDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Renouvellement: {formattedResetDate}</span>
                  </div>
                )}

                {/* Avertissement si quota bas */}
                {remaining <= 3 && remaining > 0 && (
                  <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                    <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-orange-900 dark:text-orange-100 font-medium">
                        Quota presque épuisé
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                        Plus que {remaining} génération{remaining > 1 ? 's' : ''} disponible{remaining > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}

                {/* Message quota épuisé */}
                {remaining === 0 && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-red-900 dark:text-red-100 font-medium">
                        Quota épuisé
                      </p>
                      <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                        Renouvellement: {formattedResetDate}
                      </p>
                    </div>
                  </div>
                )}

                {/* CTA Upgrade pour Free tier */}
                {tier === UserTier.FREE && showUpgrade && (
                  <Button className="w-full" variant="default" size="sm" asChild>
                    <Link to="/premium">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Passer à Premium
                      <span className="ml-2 text-xs opacity-80">(100 générations/mois)</span>
                    </Link>
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <ScrollArea className="h-48">
                  {usageHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucun historique</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Group by date */}
                      {Object.entries(
                        usageHistory.reduce((acc, entry) => {
                          acc[entry.date] = acc[entry.date] || [];
                          acc[entry.date].push(entry);
                          return acc;
                        }, {} as Record<string, UsageEntry[]>)
                      )
                        .slice(0, 7)
                        .map(([date, entries]) => {
                          const total = entries.reduce((sum, e) => sum + e.count, 0);
                          return (
                            <div
                              key={date}
                              className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {new Date(date).toLocaleDateString('fr-FR', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short'
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={(total / limit) * 100 * 30} 
                                  className="w-16 h-1.5" 
                                />
                                <Badge variant="outline" className="text-xs">
                                  {total} gen.
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </ScrollArea>

                {/* Weekly summary */}
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cette semaine</span>
                    <span className="font-medium">
                      {usageHistory
                        .filter(e => {
                          const entryDate = new Date(e.date);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return entryDate >= weekAgo;
                        })
                        .reduce((sum, e) => sum + e.count, 0)
                      } générations
                    </span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-0 space-y-4">
                {/* Notifications */}
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    {notifications.enabled ? (
                      <Bell className="h-4 w-4 text-primary" />
                    ) : (
                      <BellOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Alertes quota</p>
                      <p className="text-xs text-muted-foreground">
                        Notification à {notifications.threshold}%
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.enabled}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, enabled: checked }))
                    }
                  />
                </div>

                {/* Threshold selector */}
                {notifications.enabled && (
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">
                      Seuil d'alerte
                    </label>
                    <div className="flex gap-2">
                      {[10, 20, 30, 50].map((threshold) => (
                        <Button
                          key={threshold}
                          variant={notifications.threshold === threshold ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => 
                            setNotifications(prev => ({ ...prev, threshold }))
                          }
                        >
                          {threshold}%
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bonus info */}
                <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Bonus quotidien</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Connectez-vous chaque jour pour gagner des générations bonus !
                  </p>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </m.div>
    </LazyMotionWrapper>
  );
}

/**
 * Composant simplifié pour affichage inline
 */
export function QuotaBadge({ className = '' }: { className?: string }) {
  const { remaining, limit, quotaColor, isLoading } = useQuotaUI();

  if (isLoading) {
    return null;
  }

  return (
    <Badge
      variant="outline"
      className={`${className} ${
        quotaColor === 'red'
          ? 'border-red-500 text-red-700 dark:text-red-400'
          : quotaColor === 'orange'
          ? 'border-orange-500 text-orange-700 dark:text-orange-400'
          : quotaColor === 'yellow'
          ? 'border-yellow-500 text-yellow-700 dark:text-yellow-400'
          : 'border-green-500 text-green-700 dark:text-green-400'
      }`}
    >
      <Zap className="h-3 w-3 mr-1" />
      {remaining}/{limit}
    </Badge>
  );
}

/**
 * Composant d'avertissement quand quota insuffisant
 */
export function QuotaWarning({ className = '' }: { className?: string }) {
  const { remaining, canGenerate, formattedResetDate, tier } = useQuotaUI();

  if (canGenerate) {
    return null;
  }

  return (
    <Card className={`border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-900 dark:text-red-100">
              Quota de générations épuisé
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              Vous avez utilisé toutes vos {tier === UserTier.FREE ? '10' : '100'} générations mensuelles.
            </p>
            {formattedResetDate && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                Renouvellement: {formattedResetDate}
              </p>
            )}
            {tier === UserTier.FREE && (
              <Button size="sm" variant="default" className="mt-3" asChild>
                <Link to="/premium">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Passer à Premium
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default QuotaIndicator;
