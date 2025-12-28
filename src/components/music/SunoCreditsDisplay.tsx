/**
 * SunoCreditsDisplay - Affichage des crédits Suno avec détails
 * Inclut notification proactive quand les crédits sont bas
 */

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Coins, RefreshCw, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import { useSunoVinyl } from '@/hooks/useSunoVinyl';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SunoCreditsDisplayProps {
  compact?: boolean;
  className?: string;
}

const SunoCreditsDisplay: React.FC<SunoCreditsDisplayProps> = ({ 
  compact = false,
  className 
}) => {
  const { credits, refreshCredits } = useSunoVinyl();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const hasShownWarning = useRef(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshCredits();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const usagePercent = credits.total > 0 
    ? ((credits.total - credits.remaining) / credits.total) * 100 
    : 0;

  const isLow = credits.remaining >= 0 && credits.remaining < 10;
  const isCritical = credits.remaining >= 0 && credits.remaining < 3;

  // Toast proactif au chargement si crédits faibles
  useEffect(() => {
    if (credits.loading || hasShownWarning.current) return;
    if (credits.remaining < 0) return; // Non configuré
    
    if (isCritical) {
      hasShownWarning.current = true;
      toast.warning('Crédits Suno critiques !', {
        description: `Il vous reste ${credits.remaining} crédit(s). Pensez à recharger.`,
        duration: 8000,
      });
    } else if (isLow) {
      hasShownWarning.current = true;
      toast.info('Crédits Suno limités', {
        description: `${credits.remaining} crédit(s) restants sur ${credits.total}.`,
        duration: 5000,
      });
    }
  }, [credits.loading, credits.remaining, credits.total, isLow, isCritical]);

  if (credits.loading) {
    return (
      <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Chargement crédits...</span>
      </div>
    );
  }

  // Credits not available (API key not configured or error)
  if (credits.remaining < 0) {
    return compact ? null : (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="py-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Coins className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Crédits Suno non configurés</p>
              <p className="text-xs">Mode démo avec pistes locales</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compact mode - just badge
  if (compact) {
    return (
      <Badge 
        variant={isCritical ? "destructive" : isLow ? "secondary" : "outline"} 
        className={cn("gap-1 cursor-pointer hover:opacity-80", className)}
        onClick={handleRefresh}
      >
        {isCritical && <AlertTriangle className="h-3 w-3" />}
        <Coins className="h-3 w-3" />
        {credits.remaining} / {credits.total}
      </Badge>
    );
  }

  // Full display
  return (
    <Card className={cn(
      "transition-all",
      isCritical && "border-destructive/50 bg-destructive/5",
      isLow && !isCritical && "border-yellow-500/50 bg-yellow-500/5",
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Crédits Suno AI
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <span className={cn(
              "text-3xl font-bold",
              isCritical && "text-destructive",
              isLow && !isCritical && "text-yellow-600"
            )}>
              {credits.remaining}
            </span>
            <span className="text-muted-foreground text-lg ml-1">/ {credits.total}</span>
          </div>
          {credits.plan && (
            <Badge variant="outline" className="capitalize">
              {credits.plan}
            </Badge>
          )}
        </div>

        <Progress 
          value={usagePercent} 
          className={cn(
            "h-2",
            isCritical && "[&>div]:bg-destructive",
            isLow && !isCritical && "[&>div]:bg-yellow-500"
          )}
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{Math.round(usagePercent)}% utilisé</span>
          <span>~{credits.remaining} générations restantes</span>
        </div>

        {isCritical && (
          <div className="flex items-center gap-2 text-destructive text-xs mt-2 p-2 bg-destructive/10 rounded-md">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>Crédits faibles ! Recharge recommandée.</span>
          </div>
        )}

        {isLow && !isCritical && (
          <div className="flex items-center gap-2 text-yellow-600 text-xs mt-2 p-2 bg-yellow-500/10 rounded-md">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>Crédits limités. Pensez à recharger.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SunoCreditsDisplay;
