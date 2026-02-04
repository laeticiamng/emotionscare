/**
 * ScoreBreakdown - Décomposition détaillée d'un score
 */

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { TrendIndicator, TrendDirection } from './TrendIndicator';

export interface ScoreComponent {
  id: string;
  label: string;
  value: number;
  maxValue: number;
  weight: number;
  trend?: TrendDirection;
  previousValue?: number;
  description?: string;
  color?: string;
}

interface ScoreBreakdownProps {
  title: string;
  description?: string;
  totalScore: number;
  maxScore?: number;
  components: ScoreComponent[];
  showWeights?: boolean;
  className?: string;
}

const defaultColors = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500'
];

export const ScoreBreakdown = memo(function ScoreBreakdown({
  title,
  description,
  totalScore,
  maxScore = 100,
  components,
  showWeights = false,
  className
}: ScoreBreakdownProps) {
  const scorePercent = (totalScore / maxScore) * 100;
  const scoreLevel = getScoreLevel(scorePercent);

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {title}
              <Badge 
                variant="outline"
                className={cn(
                  scoreLevel.color,
                  'ml-2'
                )}
              >
                {scoreLevel.label}
              </Badge>
            </CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {totalScore}
              <span className="text-lg text-muted-foreground font-normal">
                /{maxScore}
              </span>
            </div>
            <Progress 
              value={scorePercent} 
              className="w-24 h-2 mt-1"
              aria-label={`Score global: ${totalScore} sur ${maxScore}`}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <TooltipProvider>
          {components.map((component, index) => {
            const percent = (component.value / component.maxValue) * 100;
            const color = component.color || defaultColors[index % defaultColors.length];

            return (
              <div key={component.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className={cn('w-3 h-3 rounded-full', color)}
                      aria-hidden="true"
                    />
                    <span className="font-medium">{component.label}</span>
                    
                    {component.description && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info 
                            className="w-4 h-4 text-muted-foreground cursor-help" 
                            aria-label={`Info: ${component.description}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{component.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {showWeights && (
                      <Badge variant="secondary" className="text-[10px] px-1.5">
                        ×{component.weight}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {component.trend && (
                      <TrendIndicator 
                        value={component.value}
                        previousValue={component.previousValue}
                        direction={component.trend}
                        size="sm"
                      />
                    )}
                    <span className="text-sm font-medium tabular-nums">
                      {component.value}
                      <span className="text-muted-foreground">
                        /{component.maxValue}
                      </span>
                    </span>
                  </div>
                </div>

                <Progress 
                  value={percent} 
                  className="h-1.5"
                  aria-label={`${component.label}: ${component.value} sur ${component.maxValue}`}
                />
              </div>
            );
          })}
        </TooltipProvider>

        {/* Légende des pondérations */}
        {showWeights && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Le score total est calculé selon les pondérations indiquées (×).
              Les composantes avec une pondération plus élevée ont plus d'impact.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

function getScoreLevel(percent: number): { label: string; color: string } {
  if (percent >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' };
  if (percent >= 75) return { label: 'Très bien', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' };
  if (percent >= 60) return { label: 'Bien', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400' };
  if (percent >= 40) return { label: 'À améliorer', color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400' };
  return { label: 'Critique', color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' };
}

export default ScoreBreakdown;
