import React from 'react';
import { useDashboardWeekly, type GlowBucket } from '@/hooks/useDashboardWeekly';
import { GlowTip } from './GlowTip';
import { GlowGaugeSkeleton } from '../skeletons/GlowGaugeSkeleton';
import { useTranslation } from 'react-i18next';

interface GaugeSVGProps {
  bucket: GlowBucket;
  reducedMotion: boolean;
}

const GaugeSVG: React.FC<GaugeSVGProps> = ({ bucket, reducedMotion }) => {
  const getStrokeColor = (bucket: GlowBucket) => {
    switch (bucket) {
      case 'low': return 'hsl(var(--glow-low))';
      case 'medium': return 'hsl(var(--glow-medium))';
      case 'high': return 'hsl(var(--glow-high))';
    }
  };

  const getStrokePercent = (bucket: GlowBucket) => {
    switch (bucket) {
      case 'low': return 40;
      case 'medium': return 70;
      case 'high': return 100;
    }
  };

  const radius = 90;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  const strokePercent = getStrokePercent(bucket);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - strokePercent / 100);

  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      className="transform -rotate-90"
      role="img"
      aria-hidden="true"
    >
      {/* Background circle */}
      <circle
        cx="110"
        cy="110"
        r={radius}
        stroke="hsl(var(--muted))"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle */}
      <circle
        cx="110"
        cy="110"
        r={radius}
        stroke={getStrokeColor(bucket)}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        className={
          reducedMotion 
            ? 'transition-all duration-300' 
            : 'animate-fade-in transition-all duration-500'
        }
        style={
          reducedMotion 
            ? {} 
            : { 
                animation: 'fade-in 0.25s ease-out', 
                animationDelay: '0.1s',
                animationFillMode: 'both'
              }
        }
      />
    </svg>
  );
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

export const GlowGauge: React.FC = () => {
  const { data, error, isLoading } = useDashboardWeekly();
  const reducedMotion = useReducedMotion();
  const { t } = useTranslation();

  if (isLoading) return <GlowGaugeSkeleton />;

  // Fallback state for errors or missing data
  if (error || !data?.today) {
    return (
      <section 
        role="status" 
        aria-live="polite" 
        aria-label="État du jour : Prêt quand tu l'es"
        className="flex flex-col items-center gap-4 p-6"
      >
        <GaugeSVG bucket="medium" reducedMotion={reducedMotion} />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">Prêt quand tu l'es</h3>
          <p className="text-sm text-muted-foreground">État neutre</p>
        </div>
      </section>
    );
  }

  const today = data.today;
  const bucket = today.glow_bucket;
  const label = t(`glow.widget.state.${bucket}`);

  // Track analytics
  React.useEffect(() => {
    // dashboard.glow.view analytics would go here
  }, []);

  return (
    <section 
      role="status" 
      aria-live="polite" 
      aria-label={`État du jour : ${label}`}
      className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg border"
    >
      <div className="relative">
        <GaugeSVG bucket={bucket} reducedMotion={reducedMotion} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">{label}</h3>
          </div>
        </div>
      </div>
      
      {today.tip && (
        <GlowTip text={today.tip} />
      )}
    </section>
  );
};