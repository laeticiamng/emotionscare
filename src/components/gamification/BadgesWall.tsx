import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import { Award, Lock, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/store/gamification.store';
import { BadgeHalo } from './BadgeHalo';

interface BadgesWallProps {
  badges: {
    unlocked: Badge[];
    locked: Badge[];
  } | null;
}

export const BadgesWall: React.FC<BadgesWallProps> = ({ badges }) => {
  if (!badges) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Mes badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const allBadges = [...badges.unlocked, ...badges.locked];
  const unlockedCount = badges.unlocked.length;
  const totalCount = allBadges.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Mes badges
          </div>
          <BadgeComponent variant="secondary">
            {unlockedCount}/{totalCount}
          </BadgeComponent>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Unlocked Badges */}
        {badges.unlocked.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Débloqués ({badges.unlocked.length})
            </h4>
            <div 
              className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              role="grid"
              aria-label="Badges débloqués"
            >
              {badges.unlocked.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BadgeHalo
                    badge={badge}
                    unlocked={true}
                    onClick={() => {
                      // Analytics on view
                      if (typeof window !== 'undefined' && window.gtag) {
                        window.gtag('event', 'gami_badge_view', {
                          custom_badge_id: badge.id
                        });
                      }
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        {badges.locked.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              À débloquer ({badges.locked.length})
            </h4>
            <div 
              className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              role="grid"
              aria-label="Badges à débloquer"
            >
              {badges.locked.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (badges.unlocked.length + index) * 0.1 }}
                >
                  <BadgeHalo
                    badge={badge}
                    unlocked={false}
                    onClick={() => {
                      // Analytics on view
                      if (typeof window !== 'undefined' && window.gtag) {
                        window.gtag('event', 'gami_badge_view', {
                          custom_badge_id: badge.id
                        });
                      }
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Comment débloquer plus de badges ?</h4>
              <p className="text-sm text-muted-foreground">
                Participe régulièrement aux activités, complète tes objectifs quotidiens 
                et explore tous les modules disponibles. Chaque badge a ses propres critères !
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {unlockedCount === 0 && (
          <div className="text-center py-8">
            <Lock className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-1">Aucun badge débloqué</h3>
            <p className="text-sm text-muted-foreground">
              Commence ton aventure pour débloquer tes premiers badges !
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};