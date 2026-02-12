/**
 * AppleStatsSection - Section statistiques avec compteurs animés
 * Style Apple avec grandes typographies et animations fluides
 */

import React, { memo, useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const stats: StatItem[] = [
  { value: 6, suffix: '', label: 'Protocoles validés', description: 'Approche scientifique' },
  { value: 3, suffix: ' min', label: 'Par session', description: 'Micro-interventions efficaces' },
  { value: 100, suffix: '%', label: 'Données protégées', description: 'Chiffrement & RGPD' },
  { value: 7, suffix: '/7', label: 'Disponibilité', description: 'Accès permanent, jour et nuit' },
];

const AnimatedCounter: React.FC<{ value: number; suffix: string; isInView: boolean }> = ({
  value,
  suffix,
  isInView
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const startTime = performance.now();
    let rafId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      // Use Math.round and ensure final value is exact
      const current = progress >= 1 ? value : Math.round(easeOutQuart * value);
      setDisplayValue(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [value, isInView]);

  return (
    <span className="tabular-nums">
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
};

const AppleStatsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  // Use lower threshold (0.1) for more reliable detection with lazy-loaded components
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 md:py-48 bg-muted/30 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 md:mb-32"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Les chiffres parlent{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              d'eux-mêmes.
            </span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-12 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center px-1 sm:px-2"
            >
              <div className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2 sm:mb-4 leading-tight whitespace-nowrap">
                <AnimatedCounter 
                  value={stat.value} 
                  suffix={stat.suffix} 
                  isInView={isInView} 
                />
              </div>
              <div className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(AppleStatsSection);
