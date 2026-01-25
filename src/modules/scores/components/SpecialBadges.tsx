/**
 * SpecialBadges - Badges spéciaux et gamification avancée
 */
import { motion } from 'framer-motion';
import { Share2, Lock, Sparkles, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface SpecialBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition_type: string;
  condition_value: number;
  xp_reward: number;
}

interface UserBadge {
  id: string;
  badge_id: string;
  earned_at: string;
  shared: boolean;
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-400 to-orange-500'
};

const RARITY_LABELS = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire'
};

export default function SpecialBadges() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: allBadges = [] } = useQuery({
    queryKey: ['special-badges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('special_badges')
        .select('*')
        .order('rarity', { ascending: true });
      if (error) throw error;
      return data as SpecialBadge[];
    }
  });

  const { data: userBadges = [] } = useQuery({
    queryKey: ['user-special-badges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('user_special_badges')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      return data as UserBadge[];
    },
    enabled: !!user?.id
  });

  const earnedBadgeIds = new Set(userBadges.map(b => b.badge_id));
  const earnedCount = userBadges.length;
  const totalCount = allBadges.length;

  const handleShare = async (badge: SpecialBadge) => {
    try {
      await navigator.share?.({
        title: `J'ai obtenu le badge ${badge.name} !`,
        text: badge.description,
        url: window.location.href
      });
      toast({ title: 'Partagé !', description: 'Badge partagé avec succès.' });
    } catch {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(
        `🏆 J'ai obtenu le badge "${badge.name}" sur EmotionsCare ! ${badge.description}`
      );
      toast({ title: 'Copié !', description: 'Lien copié dans le presse-papier.' });
    }
  };

  const groupedBadges = allBadges.reduce((acc, badge) => {
    if (!acc[badge.category]) acc[badge.category] = [];
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, SpecialBadge[]>);

  const categoryLabels: Record<string, string> = {
    score: '📊 Scores',
    streak: '🔥 Streaks',
    module: '🎯 Modules',
    community: '👥 Communauté',
    special: '⭐ Spéciaux'
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Badges Spéciaux
            </CardTitle>
            <CardDescription>
              {earnedCount} / {totalCount} badges obtenus
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {Math.round((earnedCount / totalCount) * 100) || 0}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedBadges).map(([category, badges]) => (
          <div key={category} className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground">
              {categoryLabels[category] || category}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {badges.map((badge, idx) => {
                const isEarned = earnedBadgeIds.has(badge.id);
                
                return (
                  <TooltipProvider key={badge.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className={cn(
                            "relative p-4 rounded-xl text-center cursor-pointer transition-all",
                            "border-2",
                            isEarned 
                              ? "bg-gradient-to-br border-transparent shadow-lg hover:scale-105"
                              : "bg-muted/30 border-muted-foreground/20 opacity-60 hover:opacity-80",
                            isEarned && RARITY_COLORS[badge.rarity]
                          )}
                        >
                          {/* Lock overlay for unearned */}
                          {!isEarned && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-xl">
                              <Lock className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          
                          {/* Badge content */}
                          <motion.div
                            className="text-3xl mb-2"
                            animate={isEarned ? { 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            } : {}}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              repeatDelay: 3 
                            }}
                          >
                            {badge.icon}
                          </motion.div>
                          <p className={cn(
                            "text-xs font-medium truncate",
                            isEarned ? "text-white" : "text-muted-foreground"
                          )}>
                            {badge.name}
                          </p>
                          
                          {/* Rarity indicator */}
                          <div className={cn(
                            "absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                            badge.rarity === 'legendary' && "bg-amber-500 text-white",
                            badge.rarity === 'epic' && "bg-purple-500 text-white",
                            badge.rarity === 'rare' && "bg-blue-500 text-white",
                            badge.rarity === 'common' && "bg-gray-400 text-white"
                          )}>
                            {badge.rarity === 'legendary' && '★'}
                            {badge.rarity === 'epic' && '◆'}
                            {badge.rarity === 'rare' && '●'}
                          </div>
                          
                          {/* XP reward */}
                          {isEarned && badge.xp_reward > 0 && (
                            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] bg-primary">
                              +{badge.xp_reward} XP
                            </Badge>
                          )}
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{badge.icon}</span>
                            <div>
                              <p className="font-semibold">{badge.name}</p>
                              <Badge variant="outline" className="text-[10px]">
                                {RARITY_LABELS[badge.rarity]}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{badge.description}</p>
                          {isEarned ? (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full gap-2"
                              onClick={() => handleShare(badge)}
                            >
                              <Share2 className="h-3 w-3" /> Partager
                            </Button>
                          ) : (
                            <p className="text-xs text-amber-500 flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              Objectif: {badge.condition_value}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
