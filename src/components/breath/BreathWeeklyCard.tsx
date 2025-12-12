import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wind, Activity, Brain, TrendingUp, TrendingDown, Share2, Download, ChevronDown, ChevronUp, Target } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface BreathWeeklyCardProps {
  weekStart: string;
  coherenceAvg?: number;
  hrvStressIdx?: number;
  mindfulnessAvg?: number;
  relaxIdx?: number;
  mvpaWeek?: number;
  moodScore?: number;
  previousWeek?: {
    coherenceAvg?: number;
    hrvStressIdx?: number;
    mindfulnessAvg?: number;
    relaxIdx?: number;
    moodScore?: number;
  };
  weeklyGoal?: number;
  className?: string;
}

interface MetricTrend {
  value: number;
  previous?: number;
  trend: 'up' | 'down' | 'stable';
  percentChange: number;
}

const calculateTrend = (current?: number, previous?: number): MetricTrend => {
  if (!current) return { value: 0, trend: 'stable', percentChange: 0 };
  if (!previous) return { value: current, trend: 'stable', percentChange: 0 };
  
  const diff = current - previous;
  const percentChange = (diff / previous) * 100;
  
  return {
    value: current,
    previous,
    trend: diff > 2 ? 'up' : diff < -2 ? 'down' : 'stable',
    percentChange: Math.round(percentChange)
  };
};

const TrendIndicator: React.FC<{ trend: 'up' | 'down' | 'stable'; value: number; inverted?: boolean }> = ({ trend, value, inverted }) => {
  const isPositive = inverted ? trend === 'down' : trend === 'up';
  const isNegative = inverted ? trend === 'up' : trend === 'down';
  
  if (trend === 'stable') return null;
  
  return (
    <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-muted-foreground'}`}>
      {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      <span>{value > 0 ? '+' : ''}{value}%</span>
    </div>
  );
};

/**
 * Affiche les métriques hebdomadaires de respiration et cohérence cardiaque
 */
export const BreathWeeklyCard: React.FC<BreathWeeklyCardProps> = ({
  weekStart,
  coherenceAvg,
  hrvStressIdx,
  mindfulnessAvg,
  relaxIdx,
  mvpaWeek,
  moodScore,
  previousWeek,
  weeklyGoal = 60,
  className = '',
}) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const weekDate = new Date(weekStart);
  const formattedWeek = format(weekDate, "'Semaine du' d MMMM yyyy", { locale: fr });
  
  // Calculate trends
  const coherenceTrend = calculateTrend(coherenceAvg, previousWeek?.coherenceAvg);
  const hrvTrend = calculateTrend(hrvStressIdx, previousWeek?.hrvStressIdx);
  const mindfulnessTrend = calculateTrend(mindfulnessAvg, previousWeek?.mindfulnessAvg);
  const relaxTrend = calculateTrend(relaxIdx, previousWeek?.relaxIdx);
  const moodTrend = calculateTrend(moodScore, previousWeek?.moodScore);
  
  const getCoherenceLevel = (score?: number) => {
    if (!score) return { label: 'N/A', color: 'bg-muted text-muted-foreground' };
    if (score >= 80) return { label: 'Excellente', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    if (score >= 60) return { label: 'Bonne', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    if (score >= 40) return { label: 'Modérée', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    return { label: 'Faible', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' };
  };

  const coherenceLevel = getCoherenceLevel(coherenceAvg);
  const goalProgress = mvpaWeek ? Math.min((mvpaWeek / weeklyGoal) * 100, 100) : 0;

  const handleShare = async () => {
    const text = `🧘 Ma semaine Breath (${format(weekDate, 'd MMM', { locale: fr })}):\n` +
      `• Cohérence: ${coherenceAvg?.toFixed(1) || 'N/A'}%\n` +
      `• HRV: ${hrvStressIdx?.toFixed(1) || 'N/A'}\n` +
      `• Pleine conscience: ${mindfulnessAvg?.toFixed(1) || 'N/A'}\n` +
      `• Activité: ${mvpaWeek || 0} min`;
    
    if (navigator.share) {
      await navigator.share({ title: 'Ma semaine Breath', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !', duration: 2000 });
    }
  };

  const handleExport = () => {
    const data = {
      weekStart,
      metrics: { coherenceAvg, hrvStressIdx, mindfulnessAvg, relaxIdx, mvpaWeek, moodScore },
      trends: { coherenceTrend, hrvTrend, mindfulnessTrend, relaxTrend, moodTrend },
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breath-weekly-${weekStart}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Export réussi' });
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wind className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Métriques Breath</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
            <Badge variant="secondary" className={coherenceLevel.color}>
              {coherenceLevel.label}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{formattedWeek}</p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Weekly goal progress */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Objectif hebdomadaire</span>
            </div>
            <span className="text-sm font-bold">{mvpaWeek || 0}/{weeklyGoal} min</span>
          </div>
          <Progress value={goalProgress} className="h-2" />
          {goalProgress >= 100 && (
            <p className="text-xs text-green-600 mt-1">🎉 Objectif atteint !</p>
          )}
        </div>

        {/* Coherence & HRV */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-3 rounded-lg bg-muted/50"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                <p className="text-xs font-medium text-muted-foreground">Cohérence</p>
              </div>
              <TrendIndicator trend={coherenceTrend.trend} value={coherenceTrend.percentChange} />
            </div>
            <p className="text-lg font-semibold text-foreground">
              {coherenceAvg ? `${coherenceAvg.toFixed(1)}%` : 'N/A'}
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-3 rounded-lg bg-muted/50"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                <p className="text-xs font-medium text-muted-foreground">HRV Stress</p>
              </div>
              <TrendIndicator trend={hrvTrend.trend} value={hrvTrend.percentChange} inverted />
            </div>
            <p className="text-lg font-semibold text-foreground">
              {hrvStressIdx ? `${hrvStressIdx.toFixed(1)}` : 'N/A'}
            </p>
          </motion.div>
        </div>

        {/* Mindfulness & Relaxation */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-3 rounded-lg bg-muted/50"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Brain className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                <p className="text-xs font-medium text-muted-foreground">Pleine conscience</p>
              </div>
              <TrendIndicator trend={mindfulnessTrend.trend} value={mindfulnessTrend.percentChange} />
            </div>
            <p className="text-lg font-semibold text-foreground">
              {mindfulnessAvg ? `${mindfulnessAvg.toFixed(1)}` : 'N/A'}
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-3 rounded-lg bg-muted/50"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Wind className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                <p className="text-xs font-medium text-muted-foreground">Relaxation</p>
              </div>
              <TrendIndicator trend={relaxTrend.trend} value={relaxTrend.percentChange} />
            </div>
            <p className="text-lg font-semibold text-foreground">
              {relaxIdx ? `${relaxIdx.toFixed(1)}` : 'N/A'}
            </p>
          </motion.div>
        </div>

        {/* MVPA & Mood */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">Activité physique</p>
              <p className="text-sm font-semibold text-foreground">
                {mvpaWeek ? `${mvpaWeek} min` : 'N/A'}
              </p>
            </div>
          </div>
          
          {moodScore !== undefined && moodScore !== null && (
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                <p className="text-xs font-medium text-muted-foreground">Humeur</p>
                <TrendIndicator trend={moodTrend.trend} value={moodTrend.percentChange} />
              </div>
              <p className="text-sm font-semibold text-foreground">
                {moodScore.toFixed(1)}/10
              </p>
            </div>
          )}
        </div>

        {/* Expandable details */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Moins de détails' : 'Plus de détails'}
          {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
        </Button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              {/* Comparison with previous week */}
              {previousWeek && (
                <div className="p-3 rounded-lg bg-muted/30 border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Comparaison semaine précédente</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span>Cohérence</span>
                      <span className={coherenceTrend.trend === 'up' ? 'text-green-500' : coherenceTrend.trend === 'down' ? 'text-red-500' : ''}>
                        {previousWeek.coherenceAvg?.toFixed(1) || 'N/A'} → {coherenceAvg?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>HRV</span>
                      <span className={hrvTrend.trend === 'down' ? 'text-green-500' : hrvTrend.trend === 'up' ? 'text-red-500' : ''}>
                        {previousWeek.hrvStressIdx?.toFixed(1) || 'N/A'} → {hrvStressIdx?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Humeur</span>
                      <span className={moodTrend.trend === 'up' ? 'text-green-500' : moodTrend.trend === 'down' ? 'text-red-500' : ''}>
                        {previousWeek.moodScore?.toFixed(1) || 'N/A'} → {moodScore?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tips based on data */}
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">💡 Conseil</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {coherenceAvg && coherenceAvg < 50 
                    ? 'Essayez des séances de cohérence cardiaque plus fréquentes pour améliorer votre score.'
                    : hrvStressIdx && hrvStressIdx > 50
                    ? 'Votre niveau de stress est élevé. Prenez des pauses respiratoires régulières.'
                    : 'Continuez ainsi ! Vos métriques sont bonnes.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default BreathWeeklyCard;
