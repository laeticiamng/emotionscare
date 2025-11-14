/**
 * Affichage des badges musicaux
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Award, Lock, TrendingUp } from 'lucide-react';
import { checkAndUnlockBadges, getUserMusicBadges, MusicBadge } from '@/services/music/badges-service';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface MusicBadgesDisplayProps {
  userId: string;
  listeningHistory: any[];
}

export const MusicBadgesDisplay: React.FC<MusicBadgesDisplayProps> = ({
  userId,
  listeningHistory
}) => {
  const [badges, setBadges] = useState<MusicBadge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadBadges();
  }, [userId, listeningHistory]);

  const loadBadges = async () => {
    const userBadges = await getUserMusicBadges(userId);
    const newlyUnlocked = await checkAndUnlockBadges(userId, listeningHistory);
    
    // Afficher les notifications pour les nouveaux badges
    newlyUnlocked.forEach((badge, index) => {
      setTimeout(() => {
        showBadgeUnlockNotification(badge);
      }, index * 1000);
    });
    
    // Mettre à jour les badges avec ceux débloqués
    const updatedBadges = userBadges.map(badge => {
      const unlocked = newlyUnlocked.find(b => b.id === badge.id);
      return unlocked || badge;
    });
    
    setBadges(updatedBadges);
  };

  const showBadgeUnlockNotification = (badge: MusicBadge) => {
    // Confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    toast({
      title: '🎉 Nouveau badge débloqué !',
      description: `${badge.icon} ${badge.name}: ${badge.description}`
    });
  };

  const categories = [
    { value: 'all', label: 'Tous', icon: Award },
    { value: 'discovery', label: 'Découverte', icon: TrendingUp },
    { value: 'consistency', label: 'Consistance', icon: Award },
    { value: 'diversity', label: 'Diversité', icon: Award },
    { value: 'expertise', label: 'Expertise', icon: Award },
    { value: 'milestone', label: 'Étapes', icon: Award }
  ];

  const filteredBadges = selectedCategory === 'all'
    ? badges
    : badges.filter(b => b.category === selectedCategory);

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const progressPercentage = (unlockedCount / badges.length) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center">
          <Award className="h-6 w-6 mr-2 text-primary" />
          Vos badges musicaux
        </h2>
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">
            {unlockedCount} / {badges.length} badges débloqués
          </p>
          <div className="flex-1 max-w-xs">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
          {categories.map(cat => (
            <TabsTrigger key={cat.value} value={cat.value} className="text-xs">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`p-4 text-center transition-all ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20'
                    : 'bg-muted/30 opacity-60'
                }`}
              >
                <div className="relative mb-3">
                  <div
                    className={`text-6xl ${
                      badge.unlocked ? 'grayscale-0' : 'grayscale'
                    }`}
                  >
                    {badge.icon}
                  </div>
                  {!badge.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-sm text-foreground mb-1">
                  {badge.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {badge.description}
                </p>

                {!badge.unlocked && badge.threshold && badge.progress !== undefined && (
                  <div className="space-y-1">
                    <Progress
                      value={(badge.progress / badge.threshold) * 100}
                      className="h-1"
                    />
                    <p className="text-xs text-muted-foreground">
                      {badge.progress} / {badge.threshold}
                    </p>
                  </div>
                )}

                {badge.unlocked && (
                  <Badge variant="secondary" className="text-xs mt-2">
                    Débloqué
                  </Badge>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
