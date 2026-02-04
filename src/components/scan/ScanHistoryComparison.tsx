/**
 * Comparaison historique multi-périodes
 * Compare les émotions entre différentes périodes
 */

import { memo, useMemo, useState } from 'react';
import { 
  GitCompare, 
  Calendar,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface PeriodData {
  label: string;
  avgValence: number;
  avgArousal: number;
  totalScans: number;
  topEmotions: { name: string; percentage: number }[];
  bestDay: { date: string; valence: number };
  worstDay: { date: string; valence: number };
}

interface ScanHistoryComparisonProps {
  periodA?: PeriodData;
  periodB?: PeriodData;
  onSelectPeriod?: (slot: 'A' | 'B', period: string) => void;
  className?: string;
}

const PERIOD_OPTIONS = [
  { value: 'this-week', label: 'Cette semaine' },
  { value: 'last-week', label: 'Semaine dernière' },
  { value: 'this-month', label: 'Ce mois' },
  { value: 'last-month', label: 'Mois dernier' },
  { value: '3-months', label: '3 derniers mois' },
  { value: '6-months', label: '6 derniers mois' },
];

// Demo data
const DEMO_PERIOD_A: PeriodData = {
  label: 'Cette semaine',
  avgValence: 0.42,
  avgArousal: 0.55,
  totalScans: 12,
  topEmotions: [
    { name: 'joie', percentage: 45 },
    { name: 'sérénité', percentage: 30 },
    { name: 'anxiété', percentage: 15 },
  ],
  bestDay: { date: '2026-02-03', valence: 0.8 },
  worstDay: { date: '2026-02-01', valence: 0.1 },
};

const DEMO_PERIOD_B: PeriodData = {
  label: 'Semaine dernière',
  avgValence: 0.35,
  avgArousal: 0.48,
  totalScans: 10,
  topEmotions: [
    { name: 'sérénité', percentage: 40 },
    { name: 'joie', percentage: 25 },
    { name: 'tristesse', percentage: 20 },
  ],
  bestDay: { date: '2026-01-28', valence: 0.7 },
  worstDay: { date: '2026-01-25', valence: -0.1 },
};

export const ScanHistoryComparison = memo(function ScanHistoryComparison({
  periodA = DEMO_PERIOD_A,
  periodB = DEMO_PERIOD_B,
  onSelectPeriod,
  className
}: ScanHistoryComparisonProps) {
  const [selectedPeriodA, setSelectedPeriodA] = useState('this-week');
  const [selectedPeriodB, setSelectedPeriodB] = useState('last-week');

  const comparison = useMemo(() => {
    const valenceDiff = periodA.avgValence - periodB.avgValence;
    const arousalDiff = periodA.avgArousal - periodB.avgArousal;
    const scansDiff = periodA.totalScans - periodB.totalScans;

    return {
      valenceDiff,
      arousalDiff,
      scansDiff,
      valenceChange: valenceDiff > 0.05 ? 'better' : valenceDiff < -0.05 ? 'worse' : 'same',
      arousalChange: arousalDiff > 0.05 ? 'higher' : arousalDiff < -0.05 ? 'lower' : 'same',
    };
  }, [periodA, periodB]);

  const PeriodSelector = ({ slot, value }: { slot: 'A' | 'B'; value: string }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Calendar className="h-3 w-3" />
          {PERIOD_OPTIONS.find(o => o.value === value)?.label}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {PERIOD_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => {
              if (slot === 'A') setSelectedPeriodA(option.value);
              else setSelectedPeriodB(option.value);
              onSelectPeriod?.(slot, option.value);
            }}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const ChangeIndicator = ({ change, value }: { change: string; value: number }) => {
    const Icon = change === 'better' || change === 'higher' ? TrendingUp : 
                 change === 'worse' || change === 'lower' ? TrendingDown : Minus;
    const color = change === 'better' ? 'text-green-500' : 
                  change === 'worse' ? 'text-red-500' : 
                  change === 'higher' ? 'text-blue-500' :
                  change === 'lower' ? 'text-orange-500' : 'text-gray-500';
    
    return (
      <span className={cn("flex items-center gap-1", color)}>
        <Icon className="h-4 w-4" />
        {value > 0 ? '+' : ''}{(value * 100).toFixed(0)}%
      </span>
    );
  };

  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-primary" />
          <CardTitle>Comparaison de périodes</CardTitle>
        </div>
        <CardDescription>
          Analysez l'évolution de vos émotions entre deux périodes
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Period Selectors */}
        <div className="flex items-center justify-center gap-4">
          <PeriodSelector slot="A" value={selectedPeriodA} />
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <PeriodSelector slot="B" value={selectedPeriodB} />
        </div>

        {/* Main Comparison */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Period A */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-3">
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">{periodA.label}</Badge>
              <div className="text-3xl font-bold text-blue-600">
                {((periodA.avgValence + 1) * 50).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Bien-être moyen</div>
            </div>
            <div className="space-y-1">
              {periodA.topEmotions.slice(0, 3).map((emotion) => (
                <div key={emotion.name} className="flex items-center justify-between text-xs">
                  <span className="capitalize">{emotion.name}</span>
                  <span className="text-muted-foreground">{emotion.percentage}%</span>
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-muted-foreground">
              {periodA.totalScans} scans
            </div>
          </div>

          {/* Comparison Center */}
          <div className="flex flex-col items-center justify-center space-y-4 p-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Bien-être</div>
              <ChangeIndicator change={comparison.valenceChange} value={comparison.valenceDiff} />
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Énergie</div>
              <ChangeIndicator change={comparison.arousalChange} value={comparison.arousalDiff} />
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Activité</div>
              <span className={cn(
                "font-medium",
                comparison.scansDiff > 0 ? "text-green-500" : comparison.scansDiff < 0 ? "text-red-500" : "text-gray-500"
              )}>
                {comparison.scansDiff > 0 ? '+' : ''}{comparison.scansDiff} scans
              </span>
            </div>
          </div>

          {/* Period B */}
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-3">
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">{periodB.label}</Badge>
              <div className="text-3xl font-bold text-purple-600">
                {((periodB.avgValence + 1) * 50).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Bien-être moyen</div>
            </div>
            <div className="space-y-1">
              {periodB.topEmotions.slice(0, 3).map((emotion) => (
                <div key={emotion.name} className="flex items-center justify-between text-xs">
                  <span className="capitalize">{emotion.name}</span>
                  <span className="text-muted-foreground">{emotion.percentage}%</span>
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-muted-foreground">
              {periodB.totalScans} scans
            </div>
          </div>
        </div>

        {/* Emotion Evolution */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Évolution par émotion</h4>
          <div className="grid grid-cols-2 gap-3">
            {periodA.topEmotions.map((emotionA) => {
              const emotionB = periodB.topEmotions.find(e => e.name === emotionA.name);
              const diff = emotionA.percentage - (emotionB?.percentage || 0);
              
              return (
                <div key={emotionA.name} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium capitalize">{emotionA.name}</span>
                    <span className={cn(
                      "text-xs",
                      diff > 5 ? "text-green-500" : diff < -5 ? "text-red-500" : "text-muted-foreground"
                    )}>
                      {diff > 0 ? '+' : ''}{diff}%
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="text-[10px] text-muted-foreground mb-1">Maintenant</div>
                      <Progress value={emotionA.percentage} className="h-2" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-muted-foreground mb-1">Avant</div>
                      <Progress value={emotionB?.percentage || 0} className="h-2" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best/Worst Days Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="text-xs text-muted-foreground mb-1">🌟 Meilleurs jours</div>
            <div className="flex justify-between text-sm">
              <span>{new Date(periodA.bestDay.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
              <span className="text-green-600 font-medium">
                vs {new Date(periodB.bestDay.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="text-xs text-muted-foreground mb-1">⚡ Jours difficiles</div>
            <div className="flex justify-between text-sm">
              <span>{new Date(periodA.worstDay.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
              <span className="text-red-600 font-medium">
                vs {new Date(periodB.worstDay.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
