/**
 * Composant des badges d'activités
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Lock, Share2, CheckCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { 
  ActivitySessionService, 
  ActivityBadge, 
  UserActivityBadge,
  ActivityStreak 
} from '../services/activitySessionService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ActivityBadges() {
  const { user } = useAuth();
  const [allBadges, setAllBadges] = useState<ActivityBadge[]>([]);
  const [userBadges, setUserBadges] = useState<UserActivityBadge[]>([]);
  const [streak, setStreak] = useState<ActivityStreak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [badges, streak] = await Promise.all([
          ActivitySessionService.getAllBadges(),
          user ? ActivitySessionService.getStreak(user.id) : null
        ]);
        setAllBadges(badges);
        setStreak(streak);

        if (user) {
          const earned = await ActivitySessionService.getUserBadges(user.id);
          setUserBadges(earned);
        }
      } catch (error) {
        console.error('Error loading badges:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const earnedBadgeIds = new Set(userBadges.map(b => b.badge_id));

  const getProgress = (badge: ActivityBadge): number => {
    if (!streak) return 0;
    
    switch (badge.requirement_type) {
      case 'total':
        return Math.min((streak.total_activities / badge.requirement_value) * 100, 100);
      case 'streak':
        return Math.min((streak.current_streak / badge.requirement_value) * 100, 100);
      case 'duration':
        return Math.min((streak.total_minutes / badge.requirement_value) * 100, 100);
      default:
        return 0;
    }
  };

  const getCurrentValue = (badge: ActivityBadge): number => {
    if (!streak) return 0;
    
    switch (badge.requirement_type) {
      case 'total':
        return streak.total_activities;
      case 'streak':
        return streak.current_streak;
      case 'duration':
        return streak.total_minutes;
      default:
        return 0;
    }
  };

  const rarityColors: Record<string, string> = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500'
  };

  const rarityLabels: Record<string, string> = {
    common: 'Commun',
    rare: 'Rare',
    epic: 'Épique',
    legendary: 'Légendaire'
  };

  const shareBadge = (badge: ActivityBadge) => {
    const text = `🏆 J'ai débloqué le badge "${badge.name}" sur EmotionsCare !`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Texte copié dans le presse-papier !');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group badges by category
  const badgesByCategory = allBadges.reduce((acc, badge) => {
    if (!acc[badge.category]) acc[badge.category] = [];
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, ActivityBadge[]>);

  const categoryLabels: Record<string, string> = {
    milestone: '🎯 Jalons',
    streak: '🔥 Séries',
    category: '📚 Catégories',
    duration: '⏱️ Durée'
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Mes badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{userBadges.length}</div>
              <p className="text-xs text-muted-foreground">débloqués</p>
            </div>
            <div className="text-center text-muted-foreground">/</div>
            <div className="text-center">
              <div className="text-3xl font-bold">{allBadges.length}</div>
              <p className="text-xs text-muted-foreground">total</p>
            </div>
            <div className="flex-1">
              <Progress 
                value={(userBadges.length / allBadges.length) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges by category */}
      {Object.entries(badgesByCategory).map(([category, badges]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-base">
              {categoryLabels[category] || category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map(badge => {
                const isEarned = earnedBadgeIds.has(badge.id);
                const progress = getProgress(badge);
                const currentValue = getCurrentValue(badge);
                const IconComponent = badge.icon ? (Icons as any)[badge.icon] : Award;

                return (
                  <div
                    key={badge.id}
                    className={`relative rounded-lg border p-4 transition-all ${
                      isEarned 
                        ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20' 
                        : 'bg-muted/30 border-muted'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center ${
                        isEarned 
                          ? `bg-gradient-to-br ${rarityColors[badge.rarity]}` 
                          : 'bg-muted'
                      }`}>
                        {isEarned ? (
                          <IconComponent className="h-6 w-6 text-white" />
                        ) : (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        )}
                        {isEarned && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-semibold text-sm truncate ${
                            !isEarned && 'text-muted-foreground'
                          }`}>
                            {badge.name}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] ${isEarned ? '' : 'opacity-50'}`}
                          >
                            {rarityLabels[badge.rarity]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {badge.description}
                        </p>
                        
                        {!isEarned && (
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{currentValue}/{badge.requirement_value}</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-1" />
                          </div>
                        )}

                        {isEarned && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-primary">+{badge.xp_reward} XP</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 px-2"
                              onClick={() => shareBadge(badge)}
                            >
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
