// @ts-nocheck
import { useState } from 'react';
import { Sparkles, Battery, BatteryLow, BatteryCharging, Coffee, Moon, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmotionalEnergy } from '@/hooks/useEmotionalEnergy';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface EmotionalEnergyDisplayProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface EnergyBoost {
  id: string;
  name: string;
  icon: React.ReactNode;
  energyGain: number;
  description: string;
  available: boolean;
}

const RECOVERY_TIPS = [
  { icon: <Coffee className="w-4 h-4" />, tip: 'Prends une pause de 5 minutes', action: 'respiration' },
  { icon: <Moon className="w-4 h-4" />, tip: 'Une méditation rapide recharge l\'énergie', action: 'meditation' },
  { icon: <Heart className="w-4 h-4" />, tip: 'Note 3 choses positives dans ton journal', action: 'journal' },
];

/**
 * Affiche l'énergie émotionnelle de l'utilisateur avec boosts et tips
 */
export const EmotionalEnergyDisplay = ({ 
  className, 
  showLabel = true,
  size = 'md'
}: EmotionalEnergyDisplayProps) => {
  const { energy, isLow, isFull, timeUntilRefill, isLoading } = useEmotionalEnergy();
  const { toast } = useToast();
  const [showBoostAnimation, setShowBoostAnimation] = useState(false);

  // Mock available boosts
  const [availableBoosts] = useState<EnergyBoost[]>([
    { id: '1', name: 'Méditation', icon: <Moon className="w-4 h-4" />, energyGain: 2, description: 'Complète une méditation', available: true },
    { id: '2', name: 'Journal', icon: <Heart className="w-4 h-4" />, energyGain: 1, description: 'Écris dans ton journal', available: true },
    { id: '3', name: 'Respiration', icon: <Coffee className="w-4 h-4" />, energyGain: 1, description: 'Exercice de respiration', available: true },
  ]);

  if (isLoading || !energy) return null;

  const percentage = (energy.currentEnergy / energy.maxEnergy) * 100;

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m`;
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const getEnergyIcon = () => {
    if (isFull) return <Sparkles className="text-purple-500" />;
    if (isLow) return <BatteryLow className="text-amber-500" />;
    if (percentage > 50) return <Battery className="text-green-500" />;
    return <BatteryCharging className="text-blue-500" />;
  };

  const getEnergyColor = () => {
    if (isFull) return 'text-purple-500';
    if (isLow) return 'text-amber-500';
    if (percentage > 50) return 'text-green-500';
    return 'text-blue-500';
  };

  const handleBoost = (boost: EnergyBoost) => {
    setShowBoostAnimation(true);
    setTimeout(() => setShowBoostAnimation(false), 1500);
    
    toast({
      title: `⚡ +${boost.energyGain} Énergie`,
      description: `${boost.name} complété ! Continue comme ça.`,
    });
  };

  return (
    <TooltipProvider>
      <Popover>
        <PopoverTrigger asChild>
          <div className={cn('flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity', className)}>
            {/* Icon */}
            <motion.div 
              className={cn(
                'relative',
                size === 'sm' && 'w-8 h-8',
                size === 'md' && 'w-10 h-10',
                size === 'lg' && 'w-12 h-12'
              )}
              animate={showBoostAnimation ? { scale: [1, 1.2, 1] } : {}}
            >
              <div className={cn(
                'absolute inset-0 rounded-full transition-all flex items-center justify-center',
                isFull && 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse',
                isLow && 'bg-gradient-to-br from-amber-500/20 to-red-500/20'
              )}>
                <div className={cn(
                  size === 'sm' && 'w-4 h-4',
                  size === 'md' && 'w-5 h-5',
                  size === 'lg' && 'w-6 h-6'
                )}>
                  {getEnergyIcon()}
                </div>
              </div>
              
              {/* Boost animation overlay */}
              <AnimatePresence>
                {showBoostAnimation && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-full bg-yellow-400"
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {showLabel && (
                <div className="flex items-center gap-2">
                  <p className={cn('font-medium', sizeClasses[size])}>
                    Énergie
                  </p>
                  {isLow && (
                    <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/30">
                      Basse
                    </Badge>
                  )}
                  {isFull && (
                    <Badge variant="outline" className="text-xs text-purple-500 border-purple-500/30">
                      Max
                    </Badge>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Progress 
                  value={percentage} 
                  className={cn(
                    'flex-1',
                    size === 'sm' && 'h-1.5',
                    size === 'md' && 'h-2',
                    size === 'lg' && 'h-3'
                  )}
                />
                <span className={cn(
                  'font-bold tabular-nums',
                  sizeClasses[size],
                  getEnergyColor()
                )}>
                  {energy.currentEnergy}/{energy.maxEnergy}
                </span>
              </div>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Énergie Émotionnelle</h4>
              <span className={cn('text-2xl font-bold', getEnergyColor())}>
                {energy.currentEnergy}/{energy.maxEnergy}
              </span>
            </div>

            {/* Status Message */}
            <div className={cn(
              'p-3 rounded-lg text-sm',
              isFull && 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
              isLow && 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
              !isFull && !isLow && 'bg-muted text-muted-foreground'
            )}>
              {isFull ? (
                <p>✨ Énergie au maximum ! Tu es prêt(e) pour toutes les activités.</p>
              ) : isLow ? (
                <p>⚡ Énergie basse. Essaie un boost ci-dessous ou prends une pause.</p>
              ) : (
                <p>Prochaine recharge automatique dans {formatTime(timeUntilRefill)}</p>
              )}
            </div>

            {/* Quick Boosts */}
            {!isFull && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Boosts rapides</h5>
                <div className="grid gap-2">
                  {availableBoosts.map((boost) => (
                    <Tooltip key={boost.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-between"
                          onClick={() => handleBoost(boost)}
                          disabled={!boost.available}
                        >
                          <span className="flex items-center gap-2">
                            {boost.icon}
                            {boost.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            +{boost.energyGain}
                          </Badge>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{boost.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}

            {/* Recovery Tips (when low) */}
            {isLow && (
              <div className="space-y-2 border-t pt-3">
                <h5 className="text-sm font-medium text-amber-600">💡 Conseils de récupération</h5>
                <div className="space-y-1">
                  {RECOVERY_TIPS.map((tip, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded bg-muted/50"
                    >
                      {tip.icon}
                      <span>{tip.tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info */}
            <div className="text-xs text-muted-foreground pt-2 border-t space-y-1">
              <p className="flex items-center gap-2">
                <BatteryCharging className="w-3 h-3" />
                Recharge auto : 1 point toutes les 4h
              </p>
              <p className="flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                Gagne de l'énergie avec les activités
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};
