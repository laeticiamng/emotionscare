/**
 * LiveCounter - Compteurs animés en temps réel
 * Affiche les statistiques live de la plateforme
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Activity, Heart, Zap, TrendingUp, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CounterItem {
  id: string;
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'stable';
}

interface LiveCounterProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'compact';
  showRefresh?: boolean;
  onRefresh?: () => void;
}

const LiveCounter: React.FC<LiveCounterProps> = ({
  className,
  variant = 'horizontal',
  showRefresh = true,
  onRefresh,
}) => {
  const [counters, setCounters] = useState<CounterItem[]>([
    {
      id: 'online',
      label: 'En ligne',
      value: 127,
      icon: <Users className="h-4 w-4" />,
      color: 'text-green-500',
      trend: 'up',
    },
    {
      id: 'sessions',
      label: 'Sessions aujourd\'hui',
      value: 1842,
      icon: <Activity className="h-4 w-4" />,
      color: 'text-blue-500',
      suffix: '+',
      trend: 'up',
    },
    {
      id: 'happy',
      label: 'Moments positifs',
      value: 456,
      icon: <Heart className="h-4 w-4" />,
      color: 'text-pink-500',
      trend: 'stable',
    },
    {
      id: 'active',
      label: 'Protocoles actifs',
      value: 89,
      icon: <Zap className="h-4 w-4" />,
      color: 'text-amber-500',
      trend: 'up',
    },
  ]);

  const [isLive, setIsLive] = useState(true);

  // Simuler des mises à jour en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev =>
        prev.map(counter => {
          const change = Math.floor(Math.random() * 5) - 2;
          const newValue = Math.max(1, counter.value + change);
          return {
            ...counter,
            value: newValue,
            trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Composant pour un seul compteur
  const Counter = ({ counter }: { counter: CounterItem }) => (
    <motion.div
      key={counter.value}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50',
        variant === 'compact' && 'p-2'
      )}
    >
      <div className={cn('p-2 rounded-full bg-background', counter.color)}>
        {counter.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={counter.value}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-lg font-bold text-foreground"
            >
              {counter.value.toLocaleString()}
            </motion.span>
          </AnimatePresence>
          {counter.suffix && (
            <span className="text-sm text-muted-foreground">{counter.suffix}</span>
          )}
          {counter.trend === 'up' && (
            <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
          )}
        </div>
        <span className="text-xs text-muted-foreground truncate block">
          {counter.label}
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header avec indicateur live */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <span className={cn(
              'h-2 w-2 rounded-full',
              isLive ? 'bg-green-500 animate-pulse' : 'bg-muted'
            )} />
            En temps réel
          </Badge>
        </div>
        {showRefresh && (
          <button
            onClick={() => {
              onRefresh?.();
              setIsLive(true);
            }}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label="Actualiser les statistiques"
          >
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Compteurs */}
      <div
        className={cn(
          variant === 'horizontal' && 'grid grid-cols-2 md:grid-cols-4 gap-3',
          variant === 'vertical' && 'space-y-3',
          variant === 'compact' && 'flex flex-wrap gap-2'
        )}
      >
        {counters.map((counter) => (
          <Counter key={counter.id} counter={counter} />
        ))}
      </div>
    </div>
  );
};

export default LiveCounter;
