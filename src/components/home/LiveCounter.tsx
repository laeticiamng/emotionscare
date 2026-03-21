/**
 * LiveCounter - Indicateurs factuels de la plateforme
 * Affiche uniquement des données vérifiables ou le compteur d'utilisateurs en ligne réel
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, Layers, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LiveCounterProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'compact';
}

const FACTUAL_STATS = [
  {
    id: 'modules',
    label: 'Modules',
    value: '10+',
    icon: <Layers className="h-4 w-4" />,
    color: 'text-primary',
  },
  {
    id: 'session',
    label: 'Par session',
    value: '3 min',
    icon: <Clock className="h-4 w-4" />,
    color: 'text-blue-500',
  },
  {
    id: 'privacy',
    label: 'Données privées',
    value: '100%',
    icon: <Shield className="h-4 w-4" />,
    color: 'text-green-500',
  },
  {
    id: 'access',
    label: 'Disponibilité',
    value: '7/7',
    icon: <Smartphone className="h-4 w-4" />,
    color: 'text-amber-500',
  },
];

const LiveCounter: React.FC<LiveCounterProps> = ({
  className,
  variant = 'horizontal',
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="gap-1.5">
          Chiffres clés
        </Badge>
      </div>

      <div
        className={cn(
          variant === 'horizontal' && 'grid grid-cols-2 md:grid-cols-4 gap-3',
          variant === 'vertical' && 'space-y-3',
          variant === 'compact' && 'flex flex-wrap gap-2'
        )}
      >
        {FACTUAL_STATS.map((stat) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50',
              variant === 'compact' && 'p-2'
            )}
          >
            <div className={cn('p-2 rounded-full bg-background', stat.color)}>
              {stat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-lg font-bold text-foreground block">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground truncate block">
                {stat.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LiveCounter;
