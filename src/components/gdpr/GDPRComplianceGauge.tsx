import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Shield, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GDPRComplianceGaugeProps {
  score: number;
  breakdown: {
    consentRate: number;
    exportSpeed: number;
    deletionSpeed: number;
    alerts: number;
    overdueCompliance: number;
  };
  isLoading: boolean;
}

const GDPRComplianceGauge: React.FC<GDPRComplianceGaugeProps> = ({ score, breakdown, isLoading }) => {
  const getScoreColor = (value: number): string => {
    if (value >= 90) return 'text-green-600 dark:text-green-400';
    if (value >= 75) return 'text-blue-600 dark:text-blue-400';
    if (value >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (value: number): string => {
    if (value >= 90) return 'Excellent';
    if (value >= 75) return 'Bon';
    if (value >= 60) return 'Satisfaisant';
    return 'À améliorer';
  };

  const getProgressColor = (value: number): string => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 75) return 'bg-blue-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48" />
        </CardContent>
      </Card>
    );
  }

  const breakdownItems = [
    { label: 'Consentements', value: breakdown.consentRate, key: 'consentRate' },
    { label: 'Rapidité exports', value: breakdown.exportSpeed, key: 'exportSpeed' },
    { label: 'Rapidité suppressions', value: breakdown.deletionSpeed, key: 'deletionSpeed' },
    { label: 'Gestion alertes', value: breakdown.alerts, key: 'alerts' },
    { label: 'Respect délais', value: breakdown.overdueCompliance, key: 'overdueCompliance' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Score de conformité RGPD</CardTitle>
              <CardDescription>Indicateur global de conformité</CardDescription>
            </div>
          </div>
          {score >= 75 ? (
            <TrendingUp className="h-6 w-6 text-green-600" />
          ) : (
            <TrendingDown className="h-6 w-6 text-red-600" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score Display */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative">
            <svg className="w-48 h-48 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              {/* Progress circle */}
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(score / 100) * 552} 552`}
                className={cn(
                  'transition-all duration-1000 ease-out',
                  score >= 90 ? 'text-green-500' :
                  score >= 75 ? 'text-blue-500' :
                  score >= 60 ? 'text-yellow-500' :
                  'text-red-500'
                )}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={cn('text-5xl font-bold', getScoreColor(score))}>
                {score}
              </div>
              <div className="text-sm text-muted-foreground mt-1">/ 100</div>
              <div className={cn('text-sm font-medium mt-2', getScoreColor(score))}>
                {getScoreLabel(score)}
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Détail par catégorie</h4>
          {breakdownItems.map((item) => (
            <div key={item.key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className={cn('font-medium', getScoreColor(item.value))}>
                  {Math.round(item.value)}%
                </span>
              </div>
              <div className="relative">
                <Progress value={item.value} className="h-2" />
                <div
                  className={cn(
                    'absolute top-0 left-0 h-2 rounded-full transition-all duration-500',
                    getProgressColor(item.value)
                  )}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GDPRComplianceGauge;
