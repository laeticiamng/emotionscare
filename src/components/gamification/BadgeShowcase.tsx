// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGamification } from '@/hooks/useGamification';
import { Award, Star, Trophy, Target, Heart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const BadgeShowcase: React.FC = () => {
  const { userBadges, loading } = useGamification();

  const getBadgeIcon = (category: string) => {
    switch (category) {
      case 'emotion_mastery': return <Heart className="h-4 w-4" />;
      case 'consistency': return <Target className="h-4 w-4" />;
      case 'social': return <Star className="h-4 w-4" />;
      case 'exploration': return <Zap className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Collection de Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Collection de Badges ({userBadges.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userBadges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userBadges.map((userBadge, index) => (
              <motion.div
                key={userBadge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="text-center p-4 rounded-lg border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full ${getRarityColor(userBadge.badge.rarity)} flex items-center justify-center text-white`}>
                    {getBadgeIcon(userBadge.badge.category)}
                  </div>
                  <h3 className="font-medium text-sm mb-1">{userBadge.badge.name}</h3>
                  <p className="text-xs text-muted-foreground">{userBadge.badge.description}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {userBadge.badge.rarity}
                  </Badge>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border rounded-md p-2 text-xs w-48 z-10">
                  <p className="font-medium">{userBadge.badge.name}</p>
                  <p className="text-muted-foreground">{userBadge.badge.description}</p>
                  <p className="text-primary mt-1">Obtenu le {new Date(userBadge.earned_at).toLocaleDateString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-medium mb-2">Aucun badge pour le moment</h3>
            <p className="text-muted-foreground">
              Utilisez l'application pour débloquer des badges et récompenses !
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgeShowcase;
