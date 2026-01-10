/**
 * TrustBadges - Badges de confiance et certifications
 * Social proof pour la crédibilité
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Lock, Heart, CheckCircle2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBadge {
  id: string;
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  color: string;
}

const badges: TrustBadge[] = [
  {
    id: 'rgpd',
    icon: <Shield className="h-5 w-5" />,
    label: 'RGPD Conforme',
    sublabel: 'Protection des données',
    color: 'text-green-500',
  },
  {
    id: 'secure',
    icon: <Lock className="h-5 w-5" />,
    label: 'Chiffrement SSL',
    sublabel: 'Niveau bancaire',
    color: 'text-blue-500',
  },
  {
    id: 'certified',
    icon: <Award className="h-5 w-5" />,
    label: 'Certifié',
    sublabel: 'Professionnels de santé',
    color: 'text-amber-500',
  },
  {
    id: 'satisfaction',
    icon: <Heart className="h-5 w-5" />,
    label: '95% Satisfaction',
    sublabel: '2847 avis',
    color: 'text-pink-500',
  },
  {
    id: 'verified',
    icon: <CheckCircle2 className="h-5 w-5" />,
    label: 'Efficacité prouvée',
    sublabel: 'Études cliniques',
    color: 'text-emerald-500',
  },
  {
    id: 'rating',
    icon: <Star className="h-5 w-5" />,
    label: '4.8/5',
    sublabel: 'Note moyenne',
    color: 'text-yellow-500',
  },
];

interface TrustBadgesProps {
  variant?: 'inline' | 'grid' | 'compact';
  className?: string;
  showAll?: boolean;
}

const TrustBadges: React.FC<TrustBadgesProps> = ({
  variant = 'inline',
  className,
  showAll = false,
}) => {
  const displayBadges = showAll ? badges : badges.slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  if (variant === 'compact') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={cn('flex flex-wrap justify-center gap-3', className)}
      >
        {displayBadges.map((badge) => (
          <motion.div
            key={badge.id}
            variants={itemVariants}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50"
          >
            <span className={badge.color} aria-hidden="true">{badge.icon}</span>
            <span className="text-xs font-medium text-foreground">{badge.label}</span>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (variant === 'grid') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4', className)}
      >
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center p-4 rounded-xl bg-card/50 border border-border/50 text-center hover:shadow-lg transition-all"
          >
            <div className={cn('p-2 rounded-full bg-muted mb-2', badge.color)} aria-hidden="true">
              {badge.icon}
            </div>
            <span className="text-sm font-semibold text-foreground">{badge.label}</span>
            {badge.sublabel && (
              <span className="text-xs text-muted-foreground mt-0.5">{badge.sublabel}</span>
            )}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // Variant inline (default)
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn(
        'flex flex-wrap justify-center gap-4 sm:gap-6 py-4 sm:py-6 border-y border-border/30 px-2 sm:px-0',
        className
      )}
    >
      {displayBadges.map((badge, index) => (
        <motion.div
          key={badge.id}
          variants={itemVariants}
          className="flex items-center gap-2"
        >
          <span className={badge.color} aria-hidden="true">{badge.icon}</span>
          <div className="text-left">
            <span className="text-sm font-medium text-foreground block">{badge.label}</span>
            {badge.sublabel && (
              <span className="text-xs text-muted-foreground">{badge.sublabel}</span>
            )}
          </div>
          {index < displayBadges.length - 1 && (
            <div className="hidden md:block w-px h-8 bg-border/50 ml-4" />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TrustBadges;
