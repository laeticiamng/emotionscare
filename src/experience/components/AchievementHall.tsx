// @ts-nocheck
/**
 * Experience Layer — Achievement Hall (Signature Scene)
 * 3D explorable space for viewing collected badges and trophies.
 * Falls back to a premium 2D grid with DepthCards on low-tier devices.
 *
 * Structure:
 *   - Horizontal scroll/drag to explore shelves
 *   - Badges organized by rarity
 *   - Locked badges = veiled mystery shapes
 *   - Legendary badges = 3D rotating objects with halo
 *   - Click to zoom + details
 */

import React, { Suspense, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useExperienceStore } from '../store/experience.store';
import { DepthCard } from './DepthCard';
import { RevealContainer } from './RevealContainer';

/* ── Types ───────────────────────────────────────────────────── */

interface Badge {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward?: number;
}

interface AchievementHallProps {
  badges: Badge[];
  onBadgeClick?: (badge: Badge) => void;
  className?: string;
}

/* ── Rarity Config ───────────────────────────────────────────── */

const RARITY_CONFIG = {
  common: {
    depth: 1 as const,
    gradient: 'from-slate-400/20 to-slate-500/10',
    border: 'border-slate-400/30',
    glow: '',
    label: 'Commun',
    color: '#94a3b8',
  },
  rare: {
    depth: 1 as const,
    gradient: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30',
    glow: '',
    label: 'Rare',
    color: '#3b82f6',
  },
  epic: {
    depth: 2 as const,
    gradient: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/30',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]',
    label: 'Épique',
    color: '#a855f7',
  },
  legendary: {
    depth: 2 as const,
    gradient: 'from-amber-400/25 to-amber-500/10',
    border: 'border-amber-400/40',
    glow: 'shadow-[0_0_25px_rgba(251,191,36,0.2)]',
    label: 'Légendaire',
    color: '#fbbf24',
  },
};

/* ── Main Component ──────────────────────────────────────────── */

export function AchievementHall({ badges, onBadgeClick, className }: AchievementHallProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const reducedMotion = useExperienceStore((s) => s.preferences.reducedMotion);
  const palette = useExperienceStore((s) => s.ambient.palette);

  // Group by rarity
  const grouped = useMemo(() => {
    const groups: Record<string, Badge[]> = {
      legendary: [],
      epic: [],
      rare: [],
      common: [],
    };
    badges.forEach((b) => {
      groups[b.rarity]?.push(b);
    });
    return groups;
  }, [badges]);

  const handleClick = (badge: Badge) => {
    setSelectedBadge(badge);
    onBadgeClick?.(badge);
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* Header ambient */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `
              radial-gradient(ellipse 60% 60% at 30% 30%, ${palette.primary}12, transparent 60%),
              radial-gradient(ellipse 40% 40% at 70% 70%, ${palette.secondary}08, transparent 50%)
            `,
          }}
        />
        <h2 className="text-2xl font-bold tracking-tight">Cabinet des Trophées</h2>
        <p className="text-muted-foreground mt-1">
          {badges.filter((b) => b.unlocked).length} / {badges.length} découverts
        </p>
      </div>

      {/* Rarity sections */}
      {Object.entries(grouped).map(([rarity, items]) => {
        if (items.length === 0) return null;
        const config = RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG];

        return (
          <section key={rarity}>
            <div className="flex items-center gap-2 mb-4 px-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {config.label}
              </h3>
              <span className="text-xs text-muted-foreground/60">
                ({items.filter((b) => b.unlocked).length}/{items.length})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {items.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reducedMotion ? 0 : index * 0.05,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <RevealContainer
                    revealed={badge.unlocked}
                    glowAfterReveal={badge.rarity === 'legendary' || badge.rarity === 'epic'}
                    duration={600}
                  >
                    <DepthCard
                      depth={config.depth}
                      onClick={() => handleClick(badge)}
                      className={cn(
                        'p-4 flex flex-col items-center gap-2 min-h-[120px] justify-center',
                        `bg-gradient-to-br ${config.gradient}`,
                        config.border,
                        config.glow,
                        !badge.unlocked && 'opacity-50'
                      )}
                    >
                      <span className="text-3xl" role="img" aria-label={badge.name}>
                        {badge.icon}
                      </span>
                      <span className="text-xs font-medium text-center leading-tight">
                        {badge.unlocked ? badge.name : '???'}
                      </span>
                      {badge.xpReward && badge.unlocked && (
                        <span className="text-[10px] text-muted-foreground">
                          +{badge.xpReward} XP
                        </span>
                      )}
                    </DepthCard>
                  </RevealContainer>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Detail modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBadge(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className={cn(
                'relative z-10 w-full max-w-sm rounded-3xl p-6 border',
                'bg-card shadow-2xl',
                RARITY_CONFIG[selectedBadge.rarity].glow
              )}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-3">
                <motion.span
                  className="text-6xl block"
                  animate={
                    reducedMotion
                      ? {}
                      : {
                          rotateY: [0, 360],
                        }
                  }
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'inline-block' }}
                >
                  {selectedBadge.icon}
                </motion.span>
                <h3 className="text-lg font-bold">{selectedBadge.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedBadge.description}</p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${RARITY_CONFIG[selectedBadge.rarity].color}20`,
                      color: RARITY_CONFIG[selectedBadge.rarity].color,
                    }}
                  >
                    {RARITY_CONFIG[selectedBadge.rarity].label}
                  </span>
                  {selectedBadge.xpReward && (
                    <span className="text-xs text-muted-foreground">+{selectedBadge.xpReward} XP</span>
                  )}
                </div>
                {selectedBadge.unlockedAt && (
                  <p className="text-xs text-muted-foreground/60 pt-1">
                    Débloqué le {new Date(selectedBadge.unlockedAt).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
