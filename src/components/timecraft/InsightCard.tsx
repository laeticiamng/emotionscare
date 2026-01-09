/**
 * InsightCard - Carte d'insight non-prescriptif
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Info, 
  Eye, 
  TrendingUp, 
  Link2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TimeInsight } from '@/hooks/timecraft';

interface InsightCardProps {
  insight: TimeInsight;
  index?: number;
}

const severityConfig = {
  info: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    badgeVariant: 'secondary' as const,
  },
  attention: {
    icon: Eye,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    badgeVariant: 'outline' as const,
  },
  neutral: {
    icon: TrendingUp,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/50 border-muted-foreground/20',
    badgeVariant: 'outline' as const,
  },
};

const typeLabels = {
  observation: 'Observation',
  pattern: 'Pattern',
  correlation: 'Corrélation',
};

export const InsightCard = memo(function InsightCard({
  insight,
  index = 0,
}: InsightCardProps) {
  const config = severityConfig[insight.severity];
  const Icon = config.icon;
  const TypeIcon = insight.type === 'correlation' ? Link2 : insight.type === 'pattern' ? TrendingUp : Eye;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={cn('overflow-hidden transition-all hover:shadow-md', config.bgColor)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn('p-2 rounded-lg bg-background/50', config.color)}>
              <Icon className="h-4 w-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm">{insight.title}</h4>
                <Badge variant={config.badgeVariant} className="text-[10px] px-1.5 py-0">
                  <TypeIcon className="h-2.5 w-2.5 mr-1" />
                  {typeLabels[insight.type]}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.description}
              </p>

              {insight.emotionalContext && (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Contexte émotionnel:</span>
                  <Badge variant="outline" className="text-[10px]">
                    Valence: {Math.round(insight.emotionalContext.avgValence)}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    Arousal: {Math.round(insight.emotionalContext.avgArousal)}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

interface InsightsListProps {
  insights: TimeInsight[];
  emptyMessage?: string;
}

export function InsightsList({ insights, emptyMessage }: InsightsListProps) {
  if (insights.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            {emptyMessage || 'Aucun insight disponible pour le moment'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Les observations apparaîtront une fois vos blocs créés
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, index) => (
        <InsightCard key={insight.id} insight={insight} index={index} />
      ))}
    </div>
  );
}

export default InsightCard;
