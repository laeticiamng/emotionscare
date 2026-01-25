import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Attraction } from '@/types/park';

interface RecommendationProps {
  attraction: Attraction;
  score: number;
  reason: string;
  delay?: number;
  onSelect?: () => void;
}

export const AttractionRecommendation: React.FC<RecommendationProps> = ({
  attraction,
  score,
  reason,
  delay = 0,
  onSelect
}) => {
  const Icon = attraction.icon;
  const scorePercentage = Math.min(score, 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className={`
        relative overflow-hidden p-4
        bg-gradient-to-br ${attraction.gradient}
        border-2 border-border/50
        hover:border-primary/50 transition-all duration-300
        group cursor-pointer
      `}
      onClick={onSelect}
      >
        <div className="flex items-start gap-3 relative z-10">
          {/* Icon */}
          <div className="p-2 rounded-lg bg-primary/20 backdrop-blur-sm shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
              {attraction.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
              {attraction.subtitle}
            </p>

            {/* Score bar */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Compatibilité</span>
                <span className="text-xs font-semibold">{scorePercentage}%</span>
              </div>
              <motion.div
                className="h-1.5 bg-muted rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: delay + 0.2, duration: 0.5 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: `${scorePercentage}%` }}
                  transition={{ delay: delay + 0.4, duration: 0.6 }}
                />
              </motion.div>
            </div>

            {/* Reason badge */}
            <Badge variant="secondary" className="text-xs gap-1">
              <Heart className="h-3 w-3" />
              {reason}
            </Badge>
          </div>

          {/* Score circle */}
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0"
            whileHover={{ scale: 1.1 }}
            animate={{
              boxShadow: [
                '0 0 0px rgba(0, 0, 0, 0)',
                '0 0 10px rgba(var(--primary), 0.3)',
                '0 0 0px rgba(0, 0, 0, 0)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            +{Math.round(score)}
          </motion.div>
        </div>

        {/* Animated glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.5 }}
        />
      </Card>
    </motion.div>
  );
};

interface RecommendationData {
  attraction: Attraction;
  score: number;
  reason: string;
}

interface RecommendationsProps {
  recommendations: RecommendationData[];
  onSelectAttraction?: (id: string) => void;
  title?: string;
}

export const AttractionRecommendations: React.FC<RecommendationsProps> = ({
  recommendations,
  onSelectAttraction,
  title = '✨ Recommandations Pour Vous'
}) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="mb-4 flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="h-6 w-6 text-primary" />
        </motion.div>
        <h2 className="text-xl font-bold text-foreground">
          {title}
        </h2>
        <div className="flex-1 h-1 bg-gradient-to-r from-primary/50 to-transparent rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => (
          <AttractionRecommendation
            key={rec.attraction.id}
            {...rec}
            delay={index * 0.05}
            onSelect={() => onSelectAttraction?.(rec.attraction.id)}
          />
        ))}
      </div>
    </motion.section>
  );
};
