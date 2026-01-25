/**
 * EmotionCorrelationChart - Visualisation des corrélations temps ↔ émotions
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Heart,
  Zap,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CorrelationResult {
  blockType: string;
  avgValence: number;
  avgArousal: number;
  dataPoints: number;
  trend: 'positive' | 'negative' | 'neutral';
}

interface DayPattern {
  day: number;
  dayName: string;
  avgValence: number;
  avgArousal: number;
  emotionalLoad: number;
  dominantBlockType: string | null;
}

interface EmotionCorrelationChartProps {
  correlations: CorrelationResult[];
  dayPatterns: DayPattern[];
  emotionDataCount: number;
  hasData: boolean;
  isLoading?: boolean;
}

const blockTypeLabels: Record<string, string> = {
  creation: 'Création',
  recovery: 'Récupération',
  constraint: 'Contrainte',
  emotional: 'Charge émotionnelle',
  chosen: 'Temps choisi',
  imposed: 'Temps subi',
};

const TrendIcon = ({ trend }: { trend: 'positive' | 'negative' | 'neutral' }) => {
  if (trend === 'positive') return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (trend === 'negative') return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

export const EmotionCorrelationChart = memo(function EmotionCorrelationChart({
  correlations,
  dayPatterns,
  emotionDataCount,
  hasData,
  isLoading = false,
}: EmotionCorrelationChartProps) {
  if (!hasData) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Corrélation émotions ↔ temps
          </CardTitle>
          <CardDescription>
            Mise en relation de vos données émotionnelles et temporelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Info className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Les corrélations apparaîtront une fois vos blocs et scans émotionnels enregistrés
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {emotionDataCount > 0 
                ? `${emotionDataCount} scans émotionnels disponibles`
                : 'Aucun scan émotionnel sur les 30 derniers jours'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Corrélations par type de bloc */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Émotions par type de temps
          </CardTitle>
          <CardDescription>
            Comment vous sentez-vous selon le type de bloc ?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {correlations.map((corr, index) => (
            <motion.div
              key={corr.blockType}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {blockTypeLabels[corr.blockType] || corr.blockType}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {corr.dataPoints} mesures
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <TrendIcon trend={corr.trend} />
                  <span className={cn(
                    'text-sm font-medium',
                    corr.trend === 'positive' && 'text-green-600',
                    corr.trend === 'negative' && 'text-red-600'
                  )}>
                    {corr.avgValence > 0 ? '+' : ''}{Math.round(corr.avgValence)}
                  </span>
                </div>
              </div>
              
              {/* Valence bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.abs(corr.avgValence) + 50, 100)}%` }}
                  className={cn(
                    'h-full rounded-full absolute',
                    corr.avgValence >= 0 
                      ? 'bg-green-500 left-1/2' 
                      : 'bg-red-500 right-1/2'
                  )}
                  style={{
                    width: `${Math.abs(corr.avgValence) / 2}%`,
                    [corr.avgValence >= 0 ? 'left' : 'right']: '50%',
                  }}
                />
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-muted-foreground/30" />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Patterns par jour */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Patterns quotidiens
          </CardTitle>
          <CardDescription>
            Charge émotionnelle moyenne par jour
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {dayPatterns.map((pattern, index) => (
              <motion.div
                key={pattern.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="text-center"
              >
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  {pattern.dayName}
                </div>
                <div
                  className={cn(
                    'aspect-square rounded-lg flex items-center justify-center transition-colors',
                    pattern.emotionalLoad > 0.6 && 'bg-red-500/20',
                    pattern.emotionalLoad > 0.3 && pattern.emotionalLoad <= 0.6 && 'bg-orange-500/20',
                    pattern.emotionalLoad <= 0.3 && 'bg-green-500/20'
                  )}
                >
                  {pattern.emotionalLoad > 0.6 ? (
                    <Zap className="h-4 w-4 text-red-500" />
                  ) : pattern.emotionalLoad > 0.3 ? (
                    <Heart className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Heart className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <div className="text-xs mt-1 text-muted-foreground">
                  {Math.round(pattern.emotionalLoad * 100)}%
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export default EmotionCorrelationChart;
