/**
 * QuotaIndicator - Composant d'affichage du quota utilisateur
 *
 * Affiche:
 * - Quota utilisé / limite
 * - Barre de progression
 * - Date de reset
 * - Upgrade CTA si free tier
 *
 * @module components/music/QuotaIndicator
 */

import React from 'react';
import { LazyMotionWrapper, m } from '@/utils/lazy-motion';
import { useQuotaUI } from '@/hooks/music/useUserQuota';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, TrendingUp, AlertCircle, Clock, Sparkles } from '@/components/music/icons';
import { UserTier } from '@/services/music/quota-service';
import { Link } from 'react-router-dom';

interface QuotaIndicatorProps {
  variant?: 'default' | 'compact' | 'minimal';
  showUpgrade?: boolean;
  className?: string;
}

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
    isLoading
  } = useQuotaUI();

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
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Quota de Génération
            </CardTitle>
            <Badge variant={tier === UserTier.FREE ? 'outline' : 'default'}>
              {tier === UserTier.FREE && 'Free'}
              {tier === UserTier.PREMIUM && 'Premium'}
              {tier === UserTier.ENTERPRISE && 'Enterprise'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
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
        </CardContent>
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
