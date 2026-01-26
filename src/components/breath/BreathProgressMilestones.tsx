import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Flame, Target, Star, Share2, Download, Award, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
  earnedAt?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

interface BreathProgressMilestonesProps {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  weeklyMinutes: number;
}

const rarityConfig = {
  common: { label: 'Commun', color: 'bg-slate-500', textColor: 'text-slate-300' },
  rare: { label: 'Rare', color: 'bg-blue-500', textColor: 'text-blue-300' },
  epic: { label: 'Épique', color: 'bg-purple-500', textColor: 'text-purple-300' },
  legendary: { label: 'Légendaire', color: 'bg-amber-500', textColor: 'text-amber-300' }
};

const getMilestoneAchievements = (
  totalSessions: number,
  totalMinutes: number,
  currentStreak: number,
  weeklyMinutes: number
): Achievement[] => {
  return [
    {
      id: 'first_breath',
      name: 'Premier Souffle',
      description: 'Complète ta première séance',
      icon: <Trophy className="h-5 w-5" />,
      earned: totalSessions >= 1,
      progress: totalSessions,
      maxProgress: 1,
      rarity: 'common'
    },
    {
      id: 'breathing_streak_3',
      name: 'Souffle Régulier',
      description: '3 jours d\'affilée',
      icon: <Flame className="h-4 w-4" />,
      earned: currentStreak >= 3,
      progress: currentStreak,
      maxProgress: 3,
      rarity: 'common'
    },
    {
      id: 'breathing_streak_7',
      name: 'Une Semaine de Sérénité',
      description: '7 jours d\'affilée',
      icon: <Flame className="h-5 w-5" />,
      earned: currentStreak >= 7,
      progress: currentStreak,
      maxProgress: 7,
      rarity: 'rare'
    },
    {
      id: 'breathing_streak_30',
      name: 'Maître de la Constance',
      description: '30 jours d\'affilée',
      icon: <Flame className="h-5 w-5" />,
      earned: currentStreak >= 30,
      progress: currentStreak,
      maxProgress: 30,
      rarity: 'legendary'
    },
    {
      id: 'breathing_sessions_10',
      name: 'Dix Respirations',
      description: '10 séances complétées',
      icon: <Trophy className="h-5 w-5" />,
      earned: totalSessions >= 10,
      progress: totalSessions,
      maxProgress: 10,
      rarity: 'common'
    },
    {
      id: 'breathing_sessions_25',
      name: 'Maître Respiratoire',
      description: '25 séances complétées',
      icon: <Trophy className="h-5 w-5" />,
      earned: totalSessions >= 25,
      progress: totalSessions,
      maxProgress: 25,
      rarity: 'rare'
    },
    {
      id: 'breathing_sessions_100',
      name: 'Centurion du Souffle',
      description: '100 séances complétées',
      icon: <Trophy className="h-5 w-5" />,
      earned: totalSessions >= 100,
      progress: totalSessions,
      maxProgress: 100,
      rarity: 'epic'
    },
    {
      id: 'breathing_time_30',
      name: 'Demi-Heure de Paix',
      description: '30 minutes de respiration totales',
      icon: <Target className="h-5 w-5" />,
      earned: totalMinutes >= 30,
      progress: totalMinutes,
      maxProgress: 30,
      rarity: 'common'
    },
    {
      id: 'breathing_time_100',
      name: 'Centime de Sérénité',
      description: '100 minutes de respiration',
      icon: <Star className="h-5 w-5" />,
      earned: totalMinutes >= 100,
      progress: totalMinutes,
      maxProgress: 100,
      rarity: 'rare'
    },
    {
      id: 'breathing_time_500',
      name: 'Demi-Millénaire de Calme',
      description: '500 minutes de respiration',
      icon: <Star className="h-5 w-5" />,
      earned: totalMinutes >= 500,
      progress: totalMinutes,
      maxProgress: 500,
      rarity: 'epic'
    },
    {
      id: 'weekly_warrior',
      name: 'Guerrier de la Semaine',
      description: '15 minutes cette semaine',
      icon: <Target className="h-5 w-5" />,
      earned: weeklyMinutes >= 15,
      progress: weeklyMinutes,
      maxProgress: 15,
      rarity: 'common'
    },
    {
      id: 'weekly_champion',
      name: 'Champion Hebdomadaire',
      description: '60 minutes cette semaine',
      icon: <Award className="h-5 w-5" />,
      earned: weeklyMinutes >= 60,
      progress: weeklyMinutes,
      maxProgress: 60,
      rarity: 'epic'
    },
  ];
};

const AchievementCard: React.FC<{ achievement: Achievement; onShare: (a: Achievement) => void }> = ({ achievement, onShare }) => {
  const progressPercent = achievement.maxProgress
    ? Math.min(100, (achievement.progress || 0) / achievement.maxProgress * 100)
    : 0;

  const rarity = achievement.rarity || 'common';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'rounded-lg border-2 p-4 transition-all relative group',
        achievement.earned
          ? 'border-primary/50 bg-primary/10'
          : 'border-border/50 bg-muted/30 opacity-60'
      )}
    >
      {/* Rarity badge */}
      <div className="absolute top-2 right-2">
        <Badge className={cn('text-xs', rarityConfig[rarity].color, rarityConfig[rarity].textColor)}>
          {rarityConfig[rarity].label}
        </Badge>
      </div>

      <div className="flex items-start gap-3">
        <div className={cn(
          'rounded-lg p-2.5 transition-colors',
          achievement.earned
            ? 'bg-primary/30 text-primary'
            : 'bg-muted/50 text-muted-foreground'
        )}>
          {achievement.earned ? achievement.icon : <Lock className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0 pr-16">
          <h4 className="font-semibold text-foreground text-sm">{achievement.name}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{achievement.description}</p>

          {achievement.maxProgress && achievement.progress !== undefined && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">
                  {Math.min(achievement.progress, achievement.maxProgress)}/{achievement.maxProgress}
                </span>
                <span className="text-xs text-muted-foreground/70">{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={cn(
                    'h-full transition-all rounded-full',
                    achievement.earned ? 'bg-primary' : 'bg-muted-foreground/50'
                  )}
                />
              </div>
            </div>
          )}
        </div>
        
        {achievement.earned && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            onClick={() => onShare(achievement)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export const BreathProgressMilestones: React.FC<BreathProgressMilestonesProps> = ({
  totalSessions,
  totalMinutes,
  currentStreak,
  weeklyMinutes,
}) => {
  const { toast } = useToast();
  const [_activeTab, _setActiveTab] = useState('all');
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  const achievements = useMemo(
    () => getMilestoneAchievements(totalSessions, totalMinutes, currentStreak, weeklyMinutes),
    [totalSessions, totalMinutes, currentStreak, weeklyMinutes]
  );

  const earnedCount = achievements.filter(a => a.earned).length;
  const nextMilestone = achievements.find(a => !a.earned);

  const filteredAchievements = useMemo(() => {
    switch (filter) {
      case 'earned':
        return achievements.filter(a => a.earned);
      case 'locked':
        return achievements.filter(a => !a.earned);
      default:
        return achievements;
    }
  }, [achievements, filter]);

  const stats = useMemo(() => ({
    common: achievements.filter(a => a.rarity === 'common' && a.earned).length,
    rare: achievements.filter(a => a.rarity === 'rare' && a.earned).length,
    epic: achievements.filter(a => a.rarity === 'epic' && a.earned).length,
    legendary: achievements.filter(a => a.rarity === 'legendary' && a.earned).length,
  }), [achievements]);

  const handleShare = async (achievement: Achievement) => {
    const text = `🏆 J'ai débloqué "${achievement.name}" sur EmotionsCare Breath !\n${achievement.description}`;
    
    if (navigator.share) {
      await navigator.share({ title: 'Mon exploit Breath', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !', description: 'Partagez votre exploit.' });
    }
  };

  const handleExport = () => {
    const data = {
      exportDate: new Date().toISOString(),
      stats: { totalSessions, totalMinutes, currentStreak, weeklyMinutes },
      achievements: achievements.map(a => ({
        id: a.id,
        name: a.name,
        earned: a.earned,
        progress: a.progress,
        maxProgress: a.maxProgress
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breath-milestones-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Export réussi', description: 'Vos exploits ont été exportés.' });
  };

  return (
    <Card className="border-slate-800/50 bg-slate-950/40" data-zero-number-check="true">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-100">Tes Exploits</CardTitle>
            <p className="text-sm text-slate-400 mt-1">
              {earnedCount}/{achievements.length} accomplissements débloqués
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleExport} className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-400">{earnedCount}</div>
              <div className="text-xs text-slate-400">Trophées</div>
            </div>
          </div>
        </div>

        {/* Stats by rarity */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <Badge variant="outline" className="text-slate-300">
            Commun: {stats.common}
          </Badge>
          <Badge variant="outline" className="text-blue-300">
            Rare: {stats.rare}
          </Badge>
          <Badge variant="outline" className="text-purple-300">
            Épique: {stats.epic}
          </Badge>
          <Badge variant="outline" className="text-amber-300">
            Légendaire: {stats.legendary}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filter tabs */}
        <div className="flex gap-2">
          {(['all', 'earned', 'locked'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Tous' : f === 'earned' ? 'Débloqués' : 'Verrouillés'}
            </Button>
          ))}
        </div>

        {/* Next Milestone */}
        {nextMilestone && filter !== 'earned' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4"
          >
            <p className="text-xs font-medium text-cyan-400 mb-2">PROCHAIN OBJECTIF</p>
            <div className="flex items-start gap-3">
              <div className="rounded-lg p-2 bg-cyan-500/20 text-cyan-400 flex-shrink-0">
                {nextMilestone.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-100 text-sm">{nextMilestone.name}</p>
                <p className="text-xs text-slate-400">{nextMilestone.description}</p>
                {nextMilestone.maxProgress && nextMilestone.progress !== undefined && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-cyan-500/20 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (nextMilestone.progress / nextMilestone.maxProgress) * 100)}%` }}
                        className="h-full bg-cyan-400 rounded-full transition-all"
                      />
                    </div>
                    <span className="text-xs text-cyan-400 font-medium whitespace-nowrap">
                      {nextMilestone.progress}/{nextMilestone.maxProgress}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* All Achievements Grid */}
        <div className="grid gap-3">
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} onShare={handleShare} />
            ))}
          </AnimatePresence>
        </div>

        {earnedCount === achievements.length && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-center"
          >
            <p className="text-sm font-semibold text-amber-200">
              🎉 Félicitations ! Tu as débloqué tous les exploits !
            </p>
            <p className="text-xs text-amber-300/70 mt-1">
              Continue à respirer pour maintenir ta série
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default BreathProgressMilestones;
