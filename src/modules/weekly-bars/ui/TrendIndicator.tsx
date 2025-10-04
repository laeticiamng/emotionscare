/**
 * Indicateur de tendance
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'stable';
  className?: string;
}

export const TrendIndicator = ({ trend, className = '' }: TrendIndicatorProps) => {
  const config = {
    up: {
      icon: TrendingUp,
      label: 'En hausse',
      variant: 'default' as const
    },
    down: {
      icon: TrendingDown,
      label: 'En baisse',
      variant: 'destructive' as const
    },
    stable: {
      icon: Minus,
      label: 'Stable',
      variant: 'secondary' as const
    }
  };

  const { icon: Icon, label, variant } = config[trend];

  return (
    <Badge variant={variant} className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
};
