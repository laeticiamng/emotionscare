/**
 * LeaderboardStats - Statistiques globales du leaderboard
 */
import { memo, useMemo } from 'react';
import { Users, Sparkles, Flame, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AuraEntry } from '../hooks/useAurasLeaderboard';

interface LeaderboardStatsProps {
  auras: AuraEntry[];
}

export const LeaderboardStats = memo(function LeaderboardStats({
  auras,
}: LeaderboardStatsProps) {
  const stats = useMemo(() => {
    if (!auras.length) {
      return {
        participants: 0,
        avgLuminosity: 0,
        streakActive: 0,
        warmAuras: 0,
      };
    }

    const avgLuminosity = Math.round(
      (auras.reduce((sum, a) => sum + a.luminosity, 0) / auras.length) * 100
    );

    const streakActive = auras.filter(
      (a) => a.streakDays && a.streakDays > 0
    ).length;

    const warmAuras = auras.filter((a) => a.colorHue >= 30 && a.colorHue <= 60).length;

    return {
      participants: auras.length,
      avgLuminosity,
      streakActive,
      warmAuras,
    };
  }, [auras]);

  const cards = [
    {
      icon: Users,
      label: 'Participants',
      value: stats.participants,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Sparkles,
      label: 'Luminosité moyenne',
      value: `${stats.avgLuminosity}%`,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: Flame,
      label: 'Streaks actifs',
      value: stats.streakActive,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      icon: Target,
      label: 'Auras vives',
      value: stats.warmAuras,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent/10',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {cards.map(({ icon: Icon, label, value, color, bgColor }) => (
        <Card key={label} className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {label}
            </CardTitle>
            <div className={`p-2 rounded-lg ${bgColor}`}>
              <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});
