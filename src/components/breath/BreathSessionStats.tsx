import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBreathSessions } from '@/hooks/useBreathSessions';
import { Activity, Flame, Target, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({ icon: Icon, label, value, unit = '' }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
}) => (
  <div className="flex flex-col gap-2 rounded-xl border border-slate-800/50 bg-slate-900/40 px-4 py-3">
    <div className="flex items-center gap-2">
      <div className="text-amber-400/80">{Icon}</div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
    </div>
    <p className="text-xl font-semibold text-slate-100">
      {value}<span className="text-sm text-slate-400 ml-1">{unit}</span>
    </p>
  </div>
);

export const BreathSessionStats: React.FC = () => {
  const { stats, loading } = useBreathSessions();

  if (loading) {
    return (
      <Card className="border-slate-800/50 bg-slate-950/40" data-zero-number-check="true">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-100">Tes statistiques respiratoires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 bg-slate-800/30" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-800/50 bg-slate-950/40" data-zero-number-check="true">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-100">
          Tes statistiques respiratoires
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={<Activity className="h-4 w-4" />}
            label="Séances"
            value={stats.totalSessions}
          />
          <StatCard
            icon={<Clock className="h-4 w-4" />}
            label="Total"
            value={stats.totalMinutes}
            unit="min"
          />
          <StatCard
            icon={<Target className="h-4 w-4" />}
            label="Cette semaine"
            value={stats.weeklyMinutes}
            unit="min"
          />
          <StatCard
            icon={<Flame className="h-4 w-4" />}
            label="Série"
            value={stats.currentStreak}
            unit="jours"
          />
        </div>
        {stats.averageSessionDuration > 0 && (
          <p className="mt-4 text-sm text-slate-400">
            Durée moyenne: <span className="text-slate-200">{Math.round(stats.averageSessionDuration / 60)}min {stats.averageSessionDuration % 60}s</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
