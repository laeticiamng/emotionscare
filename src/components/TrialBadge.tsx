import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Clock, Sparkles, Crown, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface TrialBadgeProps {
  user?: {
    trialEndingSoon?: boolean;
    trialEndsAt?: string;
    trialStartedAt?: string;
  } | null;
  onDismiss?: () => void;
  showUpgradeAction?: boolean;
  variant?: 'badge' | 'banner' | 'compact';
  className?: string;
}

const TrialBadge: React.FC<TrialBadgeProps> = ({
  user,
  onDismiss,
  showUpgradeAction = true,
  variant = 'badge',
  className,
}) => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
  } | null>(null);

  // N'afficher le badge QUE si le flag trialEndingSoon existe et est true
  if (!user?.trialEndingSoon || dismissed) {
    return null;
  }

  // Calculate time remaining
  useEffect(() => {
    if (!user?.trialEndsAt) return;

    const updateCountdown = () => {
      const endDate = new Date(user.trialEndsAt!);
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setCountdown({ days, hours, minutes });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [user?.trialEndsAt]);

  // Calculate progress percentage
  const getTrialProgress = () => {
    if (!user?.trialStartedAt || !user?.trialEndsAt) return 100;
    
    const start = new Date(user.trialStartedAt).getTime();
    const end = new Date(user.trialEndsAt).getTime();
    const now = Date.now();
    
    const total = end - start;
    const elapsed = now - start;
    
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const progress = getTrialProgress();

  // Urgency level based on days remaining
  const getUrgency = () => {
    if (!countdown) return 'medium';
    if (countdown.days === 0 && countdown.hours < 24) return 'critical';
    if (countdown.days <= 1) return 'high';
    if (countdown.days <= 3) return 'medium';
    return 'low';
  };

  const urgency = getUrgency();

  const urgencyStyles = {
    critical: 'bg-red-500 hover:bg-red-600 animate-pulse',
    high: 'bg-orange-500 hover:bg-orange-600',
    medium: 'bg-amber-500 hover:bg-amber-600',
    low: 'bg-blue-500 hover:bg-blue-600',
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  // Compact badge variant
  if (variant === 'compact') {
    return (
      <Badge 
        variant="destructive" 
        className={cn(
          'flex items-center gap-1',
          urgency === 'critical' && 'animate-pulse',
          className
        )}
      >
        <Clock className="h-3 w-3" />
        {countdown?.days === 0 
          ? `${countdown.hours}h restantes`
          : `${countdown?.days ?? '?'}j`
        }
      </Badge>
    );
  }

  // Banner variant
  if (variant === 'banner') {
    return (
      <div className={cn(
        'relative flex items-center justify-between p-3 rounded-lg border',
        urgency === 'critical' && 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800',
        urgency === 'high' && 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800',
        urgency === 'medium' && 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
        urgency === 'low' && 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
        className
      )}>
        <div className="flex items-center gap-3 flex-1">
          {urgency === 'critical' ? (
            <AlertTriangle className="h-5 w-5 text-red-500 animate-bounce" />
          ) : (
            <Clock className="h-5 w-5 text-amber-500" />
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">
                {urgency === 'critical' 
                  ? 'Dernières heures d\'essai !'
                  : 'Votre essai se termine bientôt'
                }
              </span>
              {countdown && (
                <span className="text-xs text-muted-foreground">
                  {countdown.days > 0 && `${countdown.days}j `}
                  {countdown.hours}h {countdown.minutes}m
                </span>
              )}
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-3">
          {showUpgradeAction && (
            <Button 
              size="sm" 
              onClick={handleUpgrade}
              className={cn(urgencyStyles[urgency])}
            >
              <Crown className="h-4 w-4 mr-1" />
              Passer Premium
            </Button>
          )}
          {onDismiss && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleDismiss}
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Default badge with popover
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge 
          variant="destructive" 
          className={cn(
            'flex items-center gap-1 cursor-pointer transition-transform hover:scale-105',
            urgency === 'critical' && 'animate-pulse',
            className
          )}
        >
          <Clock className="h-3 w-3" />
          {countdown?.days === 0 
            ? 'Expire aujourd\'hui !'
            : countdown?.days === 1 
              ? 'Expire demain'
              : 'Essai expire bientôt'
          }
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              'p-2 rounded-full',
              urgency === 'critical' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
            )}>
              {urgency === 'critical' ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : (
                <Clock className="h-5 w-5 text-amber-500" />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-sm">
                {urgency === 'critical' 
                  ? 'Dernières heures !'
                  : 'Essai gratuit'
                }
              </h4>
              <p className="text-xs text-muted-foreground">
                {urgency === 'critical'
                  ? 'Passez Premium pour ne rien perdre'
                  : 'Profitez de toutes les fonctionnalités'
                }
              </p>
            </div>
          </div>

          {countdown && (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{countdown.days}</div>
                <div className="text-xs text-muted-foreground">jours</div>
              </div>
              <div className="p-2 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{countdown.hours}</div>
                <div className="text-xs text-muted-foreground">heures</div>
              </div>
              <div className="p-2 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{countdown.minutes}</div>
                <div className="text-xs text-muted-foreground">min</div>
              </div>
            </div>
          )}

          <Progress value={progress} className="h-2" />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Accès illimité à toutes les fonctionnalités
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Analyses IA avancées
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Support prioritaire
            </div>
          </div>

          {showUpgradeAction && (
            <Button 
              className={cn('w-full', urgencyStyles[urgency])}
              onClick={handleUpgrade}
            >
              <Crown className="h-4 w-4 mr-2" />
              Passer Premium maintenant
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TrialBadge;
