/**
 * InsightCard - Affiche un insight Context Lens
 */

import React, { memo } from 'react';
import { AlertCircle, TrendingUp, Lightbulb, Link2, Bell, CheckCircle, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ContextLensInsight } from '../types';

interface InsightCardProps {
  insight: ContextLensInsight;
  onMarkRead?: () => void;
  className?: string;
}

const INSIGHT_ICONS: Record<ContextLensInsight['type'], LucideIcon> = {
  pattern: TrendingUp,
  trigger: AlertCircle,
  recommendation: Lightbulb,
  correlation: Link2,
  alert: Bell,
};

const INSIGHT_COLORS: Record<ContextLensInsight['type'], string> = {
  pattern: 'text-purple-500 bg-purple-500/10',
  trigger: 'text-orange-500 bg-orange-500/10',
  recommendation: 'text-emerald-500 bg-emerald-500/10',
  correlation: 'text-blue-500 bg-blue-500/10',
  alert: 'text-red-500 bg-red-500/10',
};

const INSIGHT_LABELS: Record<ContextLensInsight['type'], string> = {
  pattern: 'Pattern',
  trigger: 'Déclencheur',
  recommendation: 'Conseil',
  correlation: 'Corrélation',
  alert: 'Alerte',
};

const InsightCard: React.FC<InsightCardProps> = memo(({ insight, onMarkRead, className }) => {
  const Icon = INSIGHT_ICONS[insight.type];
  const colorClass = INSIGHT_COLORS[insight.type];
  const label = INSIGHT_LABELS[insight.type];

  const confidencePercent = Math.round(insight.confidence * 100);

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
        !insight.is_read && 'border-l-4 border-l-primary',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={cn('p-2 rounded-lg', colorClass)}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <Badge variant="secondary" className="text-xs">
                {label}
              </Badge>
            </div>
          </div>

          {!insight.is_read && onMarkRead && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onMarkRead}
              title="Marquer comme lu"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <h4 className="font-semibold text-sm">{insight.title}</h4>
        <p className="text-sm text-muted-foreground">{insight.description}</p>

        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>Confiance : {confidencePercent}%</span>
          <span>
            {new Date(insight.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
});

InsightCard.displayName = 'InsightCard';

export default InsightCard;
