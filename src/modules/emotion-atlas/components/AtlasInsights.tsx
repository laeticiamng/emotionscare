import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Lightbulb, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { AtlasInsight } from '../types';
import { cn } from '@/lib/utils';

interface AtlasInsightsProps {
  insights: AtlasInsight[];
  className?: string;
}

const INSIGHT_ICONS = {
  pattern: TrendingUp,
  trend: Sparkles,
  recommendation: Lightbulb,
};

const INSIGHT_COLORS = {
  info: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  success: 'bg-green-500/10 text-green-600 border-green-500/20',
  warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
};

export const AtlasInsights: React.FC<AtlasInsightsProps> = ({ insights, className }) => {
  if (insights.length === 0) {
    return (
      <Card className={cn('border-dashed', className)}>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Pas assez de données pour générer des insights</p>
          <p className="text-sm">Continuez à utiliser l'application pour obtenir des recommandations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        Insights personnalisés
      </h3>

      <div className="space-y-2">
        {insights.map((insight, index) => {
          const Icon = INSIGHT_ICONS[insight.type];
          const colorClass = INSIGHT_COLORS[insight.severity];

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn('border', colorClass)}>
                <CardContent className="py-3 px-4">
                  <div className="flex items-start gap-3">
                    <div className={cn('p-2 rounded-lg', colorClass)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm text-foreground">{insight.title}</h4>
                        {insight.emotion && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                            {insight.emotion}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {insight.description}
                      </p>
                      {insight.actionable && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 mt-2 -ml-2 gap-1">
                          Voir les détails
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
