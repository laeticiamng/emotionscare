/**
 * AppleStatsSection - Section statistiques avec compteurs animés
 * Style Apple avec grandes typographies et animations fluides
 */

import React, { memo, useRef, useEffect, useState } from 'react';
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const stats: StatItem[] = [
  { value: 10000, suffix: '+', label: 'Utilisateurs actifs', description: 'Soignants et étudiants' },
  { value: 94, suffix: '%', label: 'Taux de satisfaction', description: 'Efficacité ressentie' },
  { value: 3, suffix: 'min', label: 'Durée moyenne', description: "D'une intervention" },
  { value: 50, suffix: '+', label: 'Protocoles', description: 'Validés scientifiquement' },
];

const AnimatedCounter: React.FC<{ value: number; suffix: string; isInView: boolean }> = ({ 
  value, 
  suffix, 
  isInView 
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setDisplayValue(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isInView]);

  return (
    <span className="tabular-nums">
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
};

const AppleStatsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

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
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Les chiffres parlent{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              d'eux-mêmes.
            </span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                <AnimatedCounter 
                  value={stat.value} 
                  suffix={stat.suffix} 
                  isInView={isInView} 
                />
              </div>
              <div className="text-lg md:text-xl font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
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
