/**
 * SummaryChip - Composant d'affichage de résumé IA
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Heart, 
  Meh, 
  Frown,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryChipProps {
  summary: string;
  tone: 'positive' | 'neutral' | 'negative';
  showTone?: boolean;
  animated?: boolean;
  className?: string;
}

export const SummaryChip: React.FC<SummaryChipProps> = ({
  summary,
  tone,
  showTone = true,
  animated = true,
  className
}) => {
  const getToneConfig = () => {
    switch (tone) {
      case 'positive':
        return {
          icon: Heart,
          color: 'text-green-600',
          bg: 'bg-green-50 border-green-200',
          badge: 'bg-green-500',
          label: 'Positif'
        };
      case 'negative':
        return {
          icon: Frown,
          color: 'text-red-600',
          bg: 'bg-red-50 border-red-200',
          badge: 'bg-red-500',
          label: 'Difficile'
        };
      default:
        return {
          icon: Meh,
          color: 'text-blue-600',
          bg: 'bg-blue-50 border-blue-200',
          badge: 'bg-blue-500',
          label: 'Neutre'
        };
    }
  };

  const toneConfig = getToneConfig();
  const ToneIcon = toneConfig.icon;

  const cardContent = (
    <Card className={cn(
      "border-2 shadow-sm transition-all duration-200 hover:shadow-md",
      toneConfig.bg,
      className
    )}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header avec IA badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Résumé IA
              </span>
            </div>
            {showTone && (
              <Badge 
                variant="secondary"
                className={cn("text-white text-xs", toneConfig.badge)}
              >
                <ToneIcon className="h-3 w-3 mr-1" />
                {toneConfig.label}
              </Badge>
            )}
          </div>

          {/* Contenu du résumé */}
          <div className="flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Indicateur de confiance (optionnel) */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    i < 2 ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
            <span>Confiance IA</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!animated) {
    return cardContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      {cardContent}
    </motion.div>
  );
};

export default SummaryChip;