/**
 * XPBar - Barre de progression XP visible dans le header
 * Affiche le niveau, les points d'expérience et les badges
 * Niveaux : Débutant -> Initié -> Praticien -> Expert -> Maître
 */

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Zap, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressionAura } from '@/experience/components/ProgressionAura';
import { useImmersionLevel } from '@/experience/hooks/useAmbient';

interface Level {
  name: string;
  minXP: number;
  icon: string;
  color: string;
}

interface BadgeItem {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
}

const LEVELS: Level[] = [
  { name: 'Débutant', minXP: 0, icon: '🌱', color: 'from-green-400 to-green-600' },
  { name: 'Initié', minXP: 100, icon: '🌿', color: 'from-emerald-400 to-emerald-600' },
  { name: 'Praticien', minXP: 300, icon: '⭐', color: 'from-blue-400 to-blue-600' },
  { name: 'Expert', minXP: 600, icon: '💎', color: 'from-purple-400 to-purple-600' },
  { name: 'Maître', minXP: 1000, icon: '👑', color: 'from-amber-400 to-amber-600' },
];

function getCurrentLevel(xp: number): { current: Level; next: Level | null; progress: number } {
  let currentLevel = LEVELS[0];
  let nextLevel: Level | null = LEVELS[1];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || null;
      break;
    }
  }

  const currentMin = currentLevel.minXP;
  const nextMin = nextLevel ? nextLevel.minXP : currentLevel.minXP;
  const progress = nextLevel
    ? ((xp - currentMin) / (nextMin - currentMin)) * 100
    : 100;

  return { current: currentLevel, next: nextLevel, progress };
}

const XPBar: React.FC<{ className?: string }> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const immersionLevel = useImmersionLevel();

  // Fetch XP from Supabase
  const { data: xpData, isLoading: xpLoading } = useQuery({
    queryKey: ['user_xp', user?.id],
    queryFn: async () => {
      if (!user?.id) return { xp: 0 };
      const { data, error } = await supabase
        .from('user_points')
        .select('total_points, points')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return { xp: data?.total_points ?? data?.points ?? 0 };
    },
    enabled: !!user?.id,
  });

  // Fetch badges from Supabase
  const { data: badges = [] } = useQuery<BadgeItem[]>({
    queryKey: ['user_badges_xpbar', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Fetch all available badges
      const { data: allBadges } = await supabase
        .from('badges')
        .select('id, name, icon')
        .limit(10);

      // Fetch user's earned badges
      const { data: earnedBadges } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', user.id);

      const earnedIds = new Set((earnedBadges ?? []).map((b: any) => b.badge_id));

      return (allBadges ?? []).map((b: any) => ({
        id: b.id,
        name: b.name ?? '',
        icon: b.icon ?? '🏅',
        earned: earnedIds.has(b.id),
      }));
    },
    enabled: !!user?.id,
  });

  const xp = xpData?.xp ?? 0;
  const { current, next, progress } = useMemo(() => getCurrentLevel(xp), [xp]);
  const earnedBadges = badges.filter((b) => b.earned);

  if (xpLoading) {
    return (
      <div className={cn('relative', className)}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60">
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Compact bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 hover:bg-muted transition-colors"
        aria-label={`Niveau ${current.name}, ${xp} XP. Cliquer pour voir les détails.`}
        aria-expanded={isExpanded}
      >
        <span className="text-sm" role="img" aria-label={current.name}>
          {current.icon}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium hidden sm:inline">{current.name}</span>
          {/* Mini progress bar or ProgressionAura */}
          {immersionLevel >= 1 ? (
            <ProgressionAura progress={progress} compact />
          ) : (
            <div className="w-16 h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full bg-gradient-to-r', current.color)}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          )}
          <span className="text-[10px] text-muted-foreground font-medium">{xp} XP</span>
        </div>
        <ChevronDown
          className={cn(
            'h-3 w-3 text-muted-foreground transition-transform',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expanded dropdown */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-72 bg-popover/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-primary/5 p-5 z-50"
            role="dialog"
            aria-label="Détails de progression"
          >
            {/* Level info */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br',
                  current.color,
                  'text-white'
                )}
              >
                {current.icon}
              </div>
              <div>
                <p className="font-semibold">{current.name}</p>
                <p className="text-xs text-muted-foreground">
                  {xp} XP{next ? ` / ${next.minXP} XP` : ' — Niveau maximum !'}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full bg-gradient-to-r', current.color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              {next && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  {next.minXP - xp} XP avant le niveau{' '}
                  <span className="font-medium">{next.name}</span>
                </p>
              )}
            </div>

            {/* XP Sources */}
            <div className="mb-4 space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Gagner des XP
              </p>
              <div className="space-y-1">
                {[
                  { action: 'Compléter un protocole', xp: '+20 XP', icon: Zap },
                  { action: 'Scanner émotionnel', xp: '+15 XP', icon: Star },
                  { action: 'Série 7 jours', xp: '+50 XP', icon: Trophy },
                ].map((source) => (
                  <div key={source.action} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <source.icon className="h-3 w-3" />
                      {source.action}
                    </div>
                    <span className="font-medium text-primary">{source.xp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            {badges.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Badges ({earnedBadges.length}/{badges.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border',
                        badge.earned
                          ? 'bg-primary/10 border-primary/20 text-foreground'
                          : 'bg-muted/50 border-border text-muted-foreground/40'
                      )}
                      title={badge.name}
                    >
                      <span className={cn(!badge.earned && 'grayscale opacity-40')}>
                        {badge.icon}
                      </span>
                      <span className="hidden sm:inline">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Level roadmap */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Parcours
              </p>
              <div className="flex items-center justify-between">
                {LEVELS.map((level, i) => {
                  const isReached = xp >= level.minXP;
                  return (
                    <div key={level.name} className="flex flex-col items-center gap-1">
                      <span
                        className={cn(
                          'text-lg',
                          !isReached && 'grayscale opacity-30'
                        )}
                      >
                        {level.icon}
                      </span>
                      <span
                        className={cn(
                          'text-[9px]',
                          isReached ? 'text-foreground font-medium' : 'text-muted-foreground/40'
                        )}
                      >
                        {level.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default XPBar;
