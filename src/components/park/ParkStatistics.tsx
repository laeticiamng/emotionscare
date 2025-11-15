// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Zap, Clock, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatItem {
  label: string;
  value: number | string;
  icon: React.ElementType;
  gradient: string;
  unit?: string;
  description?: string;
}

interface ParkStatisticsProps {
  stats: StatItem[];
  title?: string;
  showTrends?: boolean;
}

export const StatCard: React.FC<StatItem & { delay?: number }> = ({
  label,
  value,
  icon: Icon,
  gradient,
  unit,
  description,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card className={`
        relative overflow-hidden
        bg-gradient-to-br ${gradient}
        border-2 border-border/50
        hover:border-primary/50 transition-all duration-300
        group h-full
      `}>
        <CardContent className="p-6 relative z-10">
          {/* Icon */}
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm"
              whileHover={{ rotate: 10 }}
            >
              <Icon className="h-6 w-6 text-primary" />
            </motion.div>
            {description && (
              <Badge variant="secondary" className="text-xs">
                +12%
              </Badge>
            )}
          </div>

          {/* Value */}
          <div className="mb-2">
            <motion.div
              className="text-3xl font-bold text-foreground flex items-baseline gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.2 }}
            >
              {value}
              {unit && <span className="text-lg text-muted-foreground font-medium">{unit}</span>}
            </motion.div>
          </div>

          {/* Label */}
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {label}
          </p>

          {/* Description */}
          {description && (
            <p className="text-xs text-muted-foreground/70 line-clamp-2">
              {description}
            </p>
          )}

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
            initial={{ scaleX: 0, originX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.4 }}
          />
        </CardContent>

        {/* Background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.5 }}
        />
      </Card>
    </motion.div>
  );
};

export const ParkStatistics: React.FC<ParkStatisticsProps> = ({
  stats,
  title = '📊 Vos Statistiques'
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <BarChart3 className="h-6 w-6 text-primary" />
        </motion.div>
        <h2 className="text-xl font-bold text-foreground">
          {title}
        </h2>
        <div className="flex-1 h-1 bg-gradient-to-r from-primary/50 to-transparent rounded-full" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            {...stat}
            delay={index * 0.05}
          />
        ))}
      </motion.div>
    </motion.section>
  );
};

interface ProgressStageProps {
  stage: number;
  maxStage: number;
  label: string;
  completed: boolean;
  delay?: number;
}

export const ProgressStage: React.FC<ProgressStageProps> = ({
  stage,
  maxStage,
  label,
  completed,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center gap-3"
    >
      <motion.div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
          ${completed
            ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
          }
        `}
        whileHover={{ scale: 1.1 }}
      >
        {stage}
      </motion.div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">
          {label}
        </p>
        <motion.div
          className="h-1 bg-muted rounded-full overflow-hidden mt-1"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: delay + 0.2, duration: 0.4 }}
        >
          {completed && (
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: delay + 0.4, duration: 0.5 }}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
