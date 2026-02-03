/**
 * WellnessScoreCard - Carte de score bien-être pour B2B
 * Affiche le score avec jauge circulaire et tendance
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, Minus, HelpCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WellnessScoreCardProps {
  score: number;
  previousScore?: number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  title?: string;
  subtitle?: string;
  showAnonymizedBadge?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WellnessScoreCard: React.FC<WellnessScoreCardProps> = ({
  score,
  previousScore,
  trend = 'stable',
  trendValue = 0,
  title = 'Score Bien-être',
  subtitle,
  showAnonymizedBadge = true,
  size = 'md',
  className,
}) => {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-success';
    if (value >= 70) return 'text-lime-500';
    if (value >= 60) return 'text-yellow-500';
    if (value >= 50) return 'text-orange-500';
    return 'text-destructive';
  };

  const getScoreBackground = (value: number) => {
    if (value >= 80) return 'from-success/20 to-success/5';
    if (value >= 70) return 'from-lime-500/20 to-lime-500/5';
    if (value >= 60) return 'from-yellow-500/20 to-yellow-500/5';
    if (value >= 50) return 'from-orange-500/20 to-orange-500/5';
    return 'from-destructive/20 to-destructive/5';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success border-success/50';
      case 'down':
        return 'text-destructive border-destructive/50';
      default:
        return 'text-muted-foreground border-muted-foreground/50';
    }
  };

  const getScoreLabel = (value: number) => {
    if (value >= 80) return 'Excellent';
    if (value >= 70) return 'Bon';
    if (value >= 60) return 'Moyen';
    if (value >= 50) return 'À améliorer';
    return 'Critique';
  };

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
  };

  const fontSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  // Calculate stroke-dasharray for circular progress
  const radius = size === 'sm' ? 32 : size === 'md' ? 44 : 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            {title}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Score calculé à partir des indicateurs de bien-être agrégés et anonymisés de votre équipe.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          {showAnonymizedBadge && (
            <Badge variant="outline" className="gap-1 text-xs">
              <Shield className="h-3 w-3" />
              Anonymisé
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className={cn(
        'flex flex-col items-center pt-2 pb-6 bg-gradient-to-b',
        getScoreBackground(score)
      )}>
        {/* Circular Progress */}
        <div className={cn('relative', sizeClasses[size])}>
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${(radius + 8) * 2} ${(radius + 8) * 2}`}>
            {/* Background circle */}
            <circle
              cx={radius + 8}
              cy={radius + 8}
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/30"
            />
            {/* Progress circle */}
            <circle
              cx={radius + 8}
              cy={radius + 8}
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={getScoreColor(score)}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: 'stroke-dashoffset 0.5s ease',
              }}
            />
          </svg>
          
          {/* Score value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('font-bold', fontSizes[size], getScoreColor(score))}>
              {score}
            </span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>

        {/* Score label */}
        <Badge 
          variant="secondary" 
          className={cn('mt-3', getScoreColor(score))}
        >
          {getScoreLabel(score)}
        </Badge>

        {/* Trend */}
        <div className="flex items-center gap-2 mt-3">
          <Badge 
            variant="outline" 
            className={cn('gap-1', getTrendColor())}
          >
            {getTrendIcon()}
            {trendValue > 0 ? '+' : ''}{trendValue}%
          </Badge>
          <span className="text-xs text-muted-foreground">
            vs semaine précédente
          </span>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-muted-foreground text-center mt-2 px-4">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default WellnessScoreCard;
