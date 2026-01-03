/**
 * QuotaWarningBanner - Alerte quand les crédits Suno sont bas
 * Affiche un warning avec option de fallback
 */

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Coins, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuotaWarningBannerProps {
  remaining: number;
  total: number;
  onUseFallback?: () => void;
  className?: string;
}

export const QuotaWarningBanner: React.FC<QuotaWarningBannerProps> = ({
  remaining,
  total,
  onUseFallback,
  className,
}) => {
  // Ne rien afficher si on ne connait pas le quota ou s'il est bon
  if (remaining < 0 || total <= 0) return null;
  
  const percentage = (remaining / total) * 100;
  const isLow = percentage <= 20;
  const isCritical = percentage <= 5;
  const isExhausted = remaining === 0;

  if (percentage > 20) return null;

  return (
    <Alert 
      variant={isExhausted ? 'destructive' : 'default'}
      className={cn(
        'border-2',
        isCritical && !isExhausted && 'border-warning bg-warning/10',
        isLow && !isCritical && 'border-yellow-500/50 bg-yellow-500/5',
        className
      )}
    >
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        <Coins className="h-4 w-4" />
        {isExhausted 
          ? 'Crédits épuisés' 
          : isCritical 
            ? 'Crédits presque épuisés' 
            : 'Crédits limités'}
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Crédits restants</span>
            <span className="font-medium">{remaining} / {total}</span>
          </div>
          <Progress 
            value={percentage} 
            className={cn(
              "h-2",
              isExhausted && "[&>div]:bg-destructive",
              isCritical && !isExhausted && "[&>div]:bg-warning",
              isLow && !isCritical && "[&>div]:bg-yellow-500"
            )} 
          />
        </div>
        
        {isExhausted ? (
          <p className="text-sm">
            La génération IA n'est plus disponible. Vous pouvez écouter les pistes de démonstration.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {isCritical 
              ? 'Il ne reste que quelques générations possibles.' 
              : 'Pensez à économiser vos crédits.'}
          </p>
        )}

        <div className="flex gap-2">
          {isExhausted && onUseFallback && (
            <Button size="sm" variant="outline" onClick={onUseFallback}>
              Pistes démo
            </Button>
          )}
          <Button size="sm" variant="ghost" className="gap-1" asChild>
            <a 
              href="https://sunoapi.org/pricing" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3 w-3" />
              Obtenir plus
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default QuotaWarningBanner;
