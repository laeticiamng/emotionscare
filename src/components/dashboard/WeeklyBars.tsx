import React from 'react';
import { useDashboardWeekly, type GlowBucket } from '@/hooks/useDashboardWeekly';
import { WeeklySummarySR } from './WeeklySummarySR';
import { WeeklyBarsSkeleton } from '../skeletons/WeeklyBarsSkeleton';
import { useTranslation } from 'react-i18next';

type DayName = 'Lun'|'Mar'|'Mer'|'Jeu'|'Ven'|'Sam'|'Dim';

const formatDayName = (dateString: string): DayName => {
  const date = new Date(dateString);
  const dayNames: DayName[] = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  return dayNames[date.getDay()];
};

const getBucketHeight = (bucket: GlowBucket): number => {
  switch (bucket) {
    case 'low': return 40;
    case 'medium': return 70;
    case 'high': return 100;
  }
};

const getBucketColor = (bucket: GlowBucket): string => {
  switch (bucket) {
    case 'low': return 'hsl(var(--glow-low))';
    case 'medium': return 'hsl(var(--glow-medium))';
    case 'high': return 'hsl(var(--glow-high))';
  }
};

const getBucketLabel = (bucket: GlowBucket): string => {
  switch (bucket) {
    case 'low': return 'Recharge';
    case 'medium': return 'Stable';
    case 'high': return 'Au top';
  }
};

const normalizeWeek = (days?: any[]): any[] => {
  if (!days || days.length === 0) return [];
  
  // Ensure we have 7 days, padding with empty days if needed
  const normalized = [...days];
  while (normalized.length < 7) {
    const lastDate = normalized[normalized.length - 1]?.date;
    const nextDate = lastDate ? 
      new Date(new Date(lastDate).getTime() + 86400000).toISOString().split('T')[0] :
      new Date().toISOString().split('T')[0];
    normalized.push({ 
      date: nextDate, 
      glow_bucket: 'medium' as GlowBucket, 
      tip: undefined 
    });
  }
  
  return normalized.slice(0, 7);
};

const useReducedMotion = (): boolean => {
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
};

interface WeeklyBarProps {
  day: any;
  index: number;
  reducedMotion: boolean;
  onFocus: (day: string, bucket: GlowBucket) => void;
}

const WeeklyBar: React.FC<WeeklyBarProps> = ({ day, index, reducedMotion, onFocus }) => {
  const height = getBucketHeight(day.glow_bucket);
  const color = getBucketColor(day.glow_bucket);
  const dayName = formatDayName(day.date);
  const label = getBucketLabel(day.glow_bucket);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className={`
          w-6 rounded-lg transition-all duration-300 focus-visible:outline-2 focus-visible:outline-primary
          ${reducedMotion ? '' : 'hover:scale-105'}
        `}
        style={{
          height: '60px',
          backgroundColor: color,
          opacity: height / 100,
          transform: `scaleY(${height / 100})`
        }}
        aria-label={`${dayName} : ${label}`}
        onFocus={() => onFocus(day.date, day.glow_bucket)}
        onMouseEnter={() => onFocus(day.date, day.glow_bucket)}
      />
      <span className="text-xs text-muted-foreground font-medium">
        {dayName}
      </span>
    </div>
  );
};

export const WeeklyBars: React.FC = () => {
  const { data, isLoading } = useDashboardWeekly();
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  
  // Track analytics
  React.useEffect(() => {
    if (data) {
      // dashboard.weekly.view analytics would go here
    }
  }, [data]);

  const handleBarFocus = (day: string, bucket: GlowBucket) => {
    // dashboard.weekly.bar.focus analytics would go here
  };

  if (isLoading) return <WeeklyBarsSkeleton />;

  const days = normalizeWeek(data?.days);

  if (days.length === 0) {
    React.useEffect(() => {
      // dashboard.weekly.empty analytics would go here
    }, []);

    return (
      <section className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg border">
        <h3 className="text-lg font-semibold text-foreground">{t('weekly.title')}</h3>
        <p className="text-muted-foreground">Commence aujourd'hui ✨</p>
      </section>
    );
  }

  return (
    <section 
      aria-labelledby="weeklyTitle" 
      role="img" 
      aria-roledescription="Graphique"
      className="bg-card rounded-lg border p-6"
    >
      <h3 id="weeklyTitle" className="sr-only">{t('weekly.title')}</h3>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{t('weekly.title')}</h3>
      </div>
      
      <WeeklySummarySR days={days} />
      
      <div 
        className="flex items-end justify-between gap-4 h-20"
        style={{ width: '100%', maxWidth: '280px' }}
      >
        {days.map((day, index) => (
          <WeeklyBar
            key={day.date}
            day={day}
            index={index}
            reducedMotion={reducedMotion}
            onFocus={handleBarFocus}
          />
        ))}
      </div>
    </section>
  );
};