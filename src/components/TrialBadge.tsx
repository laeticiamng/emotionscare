import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, Sparkles, Crown, AlertTriangle, X, 
  Star, CheckCircle, Users, TrendingUp, Gift,
  Zap, Shield, HeartHandshake
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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

interface TrialStats {
  featuresUsed: number;
  totalFeatures: number;
  sessionsCompleted: number;
  emotionsTracked: number;
}

const TESTIMONIALS = [
  {
    name: 'Marie L.',
    role: 'Utilisatrice Premium',
    quote: 'EmotionsCare a transformé ma gestion du stress quotidien.',
    rating: 5,
  },
  {
    name: 'Thomas B.',
    role: 'Coach bien-être',
    quote: 'Un outil indispensable pour mes clients et moi-même.',
    rating: 5,
  },
  {
    name: 'Sophie M.',
    role: 'Professionnelle',
    quote: 'Les analyses IA m\'ont vraiment aidée à me comprendre.',
    rating: 5,
  },
];

const PREMIUM_FEATURES = [
  { icon: <Zap className="h-4 w-4" />, label: 'Analyses IA illimitées', free: '5/jour', premium: 'Illimité' },
  { icon: <Shield className="h-4 w-4" />, label: 'Export des données', free: 'Non', premium: 'Oui' },
  { icon: <HeartHandshake className="h-4 w-4" />, label: 'Coach personnel', free: 'Basique', premium: 'Avancé' },
  { icon: <Star className="h-4 w-4" />, label: 'Contenu exclusif', free: 'Limité', premium: 'Complet' },
];

const TrialBadge: React.FC<TrialBadgeProps> = ({
  user,
  onDismiss,
  showUpgradeAction = true,
  variant = 'badge',
  className,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dismissed, setDismissed] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [trialStats, setTrialStats] = useState<TrialStats>({
    featuresUsed: 0,
    totalFeatures: 12,
    sessionsCompleted: 0,
    emotionsTracked: 0,
  });
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  // N'afficher le badge QUE si le flag trialEndingSoon existe et est true
  if (!user?.trialEndingSoon || dismissed) {
    return null;
  }

  // Load trial stats from localStorage
  useEffect(() => {
    const stats = localStorage.getItem('trial-usage-stats');
    if (stats) {
      setTrialStats(JSON.parse(stats));
    } else {
      // Generate sample stats for demo
      const sampleStats = {
        featuresUsed: Math.floor(Math.random() * 8) + 3,
        totalFeatures: 12,
        sessionsCompleted: Math.floor(Math.random() * 15) + 5,
        emotionsTracked: Math.floor(Math.random() * 30) + 10,
      };
      setTrialStats(sampleStats);
      localStorage.setItem('trial-usage-stats', JSON.stringify(sampleStats));
    }
  }, []);

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate time remaining with seconds
  useEffect(() => {
    if (!user?.trialEndsAt) return;

    const updateCountdown = () => {
      const endDate = new Date(user.trialEndsAt!);
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

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

  const handleClaimOffer = () => {
    toast({
      title: 'Offre spéciale activée !',
      description: '-20% sur votre premier mois Premium',
    });
    navigate('/pricing?offer=trial-special');
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
          ? `${countdown.hours}h ${countdown.minutes}m`
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
                <span className="text-xs text-muted-foreground font-mono">
                  {countdown.days > 0 && `${countdown.days}j `}
                  {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
                </span>
              )}
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-3">
          {/* Special offer badge */}
          <Badge variant="secondary" className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 animate-pulse">
            <Gift className="h-3 w-3 mr-1" />
            -20%
          </Badge>
          
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
      <PopoverContent className="w-80 p-0" align="end">
        <div className="space-y-4">
          {/* Header with countdown */}
          <div className={cn(
            'p-4 rounded-t-lg',
            urgency === 'critical' ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
          )}>
            <div className="flex items-center gap-2 text-white mb-3">
              {urgency === 'critical' ? (
                <AlertTriangle className="h-5 w-5 animate-bounce" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
              <span className="font-semibold">
                {urgency === 'critical' ? 'Dernières heures !' : 'Essai gratuit'}
              </span>
            </div>
            
            {/* Live countdown */}
            {countdown && (
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white/20 rounded-lg p-2">
                  <div className="text-2xl font-bold text-white">{countdown.days}</div>
                  <div className="text-xs text-white/80">jours</div>
                </div>
                <div className="bg-white/20 rounded-lg p-2">
                  <div className="text-2xl font-bold text-white">{String(countdown.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-white/80">heures</div>
                </div>
                <div className="bg-white/20 rounded-lg p-2">
                  <div className="text-2xl font-bold text-white">{String(countdown.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-white/80">min</div>
                </div>
                <div className="bg-white/20 rounded-lg p-2">
                  <div className="text-2xl font-bold text-white">{String(countdown.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-white/80">sec</div>
                </div>
              </div>
            )}
          </div>

          <div className="px-4 space-y-4">
            {/* Trial usage stats */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4 text-primary" />
                Votre activité d'essai
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-primary">{trialStats.featuresUsed}/{trialStats.totalFeatures}</div>
                  <div className="text-xs text-muted-foreground">Fonctions</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">{trialStats.sessionsCompleted}</div>
                  <div className="text-xs text-muted-foreground">Sessions</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">{trialStats.emotionsTracked}</div>
                  <div className="text-xs text-muted-foreground">Émotions</div>
                </div>
              </div>
            </div>

            {/* Feature comparison */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Comparaison des plans</div>
              <div className="space-y-1">
                {PREMIUM_FEATURES.map((feature, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{feature.icon}</span>
                      <span>{feature.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{feature.free}</span>
                      <span className="text-primary font-medium">{feature.premium}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social proof */}
            <div className="bg-primary/5 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">+12,000 utilisateurs satisfaits</span>
              </div>
              
              {/* Testimonial carousel */}
              <div className="relative overflow-hidden">
                <div className="flex items-start gap-2 transition-all duration-500">
                  <div className="flex-shrink-0">
                    <div className="flex">
                      {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs italic">"{TESTIMONIALS[currentTestimonial].quote}"</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      — {TESTIMONIALS[currentTestimonial].name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special offer */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  Offre spéciale fin d'essai
                </span>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">
                -20% sur votre premier mois Premium si vous passez maintenant !
              </p>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                onClick={handleClaimOffer}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Activer l'offre
              </Button>
            </div>

            {/* Main CTA */}
            {showUpgradeAction && (
              <Button 
                className={cn('w-full', urgencyStyles[urgency])}
                onClick={handleUpgrade}
              >
                <Crown className="h-4 w-4 mr-2" />
                Passer Premium maintenant
              </Button>
            )}

            <Progress value={progress} className="h-2" />
          </div>

          <div className="px-4 pb-4">
            <p className="text-xs text-center text-muted-foreground">
              Annulez à tout moment • Satisfait ou remboursé 30j
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TrialBadge;
