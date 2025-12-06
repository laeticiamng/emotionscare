import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBadges, Badge as UserBadge } from '@/hooks/useBadges';
import { Trophy, Lock, Share2, Twitter, Linkedin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Achievements = () => {
  const { badges, loading, shareBadgeOnSocial } = useBadges();
  const [shareLoading, setShareLoading] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const unlockedBadges = badges.filter((b: UserBadge) => b.unlocked);
  const lockedBadges = badges.filter((b: UserBadge) => !b.unlocked);
  const inProgressBadges = lockedBadges.filter(
    (b: UserBadge) => b.progress && b.progress.current > 0
  );

  const handleShare = async (badgeId: string, platform: 'twitter' | 'linkedin') => {
    setShareLoading(badgeId);
    await shareBadgeOnSocial(badgeId, platform);
    setShareLoading(null);
  };

  const renderBadgeCard = (badge: UserBadge, isLocked: boolean) => {
    const progressPercent = badge.progress
      ? (badge.progress.current / badge.progress.target) * 100
      : 0;

    return (
      <motion.div
        key={badge.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`relative overflow-hidden ${isLocked ? 'opacity-60' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`text-5xl ${
                    isLocked ? 'grayscale opacity-50' : ''
                  }`}
                >
                  {badge.badge_icon || '🏆'}
                </div>
                <div>
                  <CardTitle className="text-lg">{badge.badge_name}</CardTitle>
                  {badge.badge_description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {badge.badge_description}
                    </p>
                  )}
                </div>
              </div>
              {isLocked && <Lock className="h-5 w-5 text-muted-foreground" />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Catégorie</span>
                <BadgeUI variant="secondary">{badge.badge_category}</BadgeUI>
              </div>

              {badge.progress && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-medium">
                      {badge.progress.current} / {badge.progress.target}
                    </span>
                  </div>
                  <Progress value={progressPercent} />
                </div>
              )}

              {!isLocked && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleShare(badge.badge_id, 'twitter')}
                    disabled={shareLoading === badge.badge_id}
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleShare(badge.badge_id, 'linkedin')}
                    disabled={shareLoading === badge.badge_id}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              )}

              {badge.shared_on_social && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Share2 className="h-3 w-3" />
                  Partagé sur les réseaux sociaux
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Mes Achievements
          </h1>
          <p className="text-muted-foreground mt-1">
            {unlockedBadges.length} débloqués sur {badges.length} badges
          </p>
        </div>

        <div className="flex gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {unlockedBadges.length}
              </div>
              <div className="text-xs text-muted-foreground">Débloqués</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">
                {inProgressBadges.length}
              </div>
              <div className="text-xs text-muted-foreground">En cours</div>
            </div>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="unlocked" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="unlocked">
            Débloqués ({unlockedBadges.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            En cours ({inProgressBadges.length})
          </TabsTrigger>
          <TabsTrigger value="locked">
            Verrouillés ({lockedBadges.length - inProgressBadges.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unlocked">
          {unlockedBadges.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun badge débloqué pour le moment</p>
                <p className="text-sm mt-2">
                  Complétez des défis pour gagner vos premiers badges !
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unlockedBadges.map((badge: UserBadge) => renderBadgeCard(badge, false))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress">
          {inProgressBadges.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                <Progress value={0} className="w-32 mx-auto mb-4" />
                <p>Aucun badge en cours</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressBadges.map((badge: UserBadge) => renderBadgeCard(badge, true))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="locked">
          {lockedBadges.length - inProgressBadges.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tous les badges sont débloqués ou en cours !</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedBadges
                .filter((b: UserBadge) => !b.progress || b.progress.current === 0)
                .map((badge: UserBadge) => renderBadgeCard(badge, true))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Achievements;
