/**
 * MUSIC GAMIFICATION PANEL - EmotionsCare
 * Panel gamification spécifique musique
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star, 
  Flame, 
  Music2,
  Zap,
  Gift,
  Award,
  Share2
} from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { BadgeShareDialog } from './BadgeShareDialog';

export const MusicGamificationPanel: React.FC = () => {
  const { userStats, achievements, loading } = useGamification();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);

  const handleShareClick = (achievement: any) => {
    setSelectedAchievement({
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      rarity: achievement.rarity
    });
    setShareDialogOpen(true);
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

  if (!userStats) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Chargement de votre progression...</p>
        </CardContent>
      </Card>
    );
  }

  const progressToNextLevel = ((userStats.totalPoints % 500) / 500) * 100;

  return (
    <div className="space-y-6">
      {/* Niveau et progression */}
      <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/60">
                <Star className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Niveau {userStats.level}</CardTitle>
                <CardDescription>
                  {userStats.rank}
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="text-lg px-4 py-1">
                <Flame className="h-4 w-4 mr-1 inline" />
                {userStats.streak} jours
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progression vers niveau {userStats.level + 1}</span>
              <span className="font-medium">{Math.round(progressToNextLevel)}%</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {userStats.totalPoints} points
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                <Music2 className="h-6 w-6 mx-auto mb-1" />
              </div>
              <div className="text-xs text-muted-foreground">Musiques</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                <Trophy className="h-6 w-6 mx-auto mb-1" />
              </div>
              <div className="text-xs text-muted-foreground">{userStats.achievements} badges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                <Award className="h-6 w-6 mx-auto mb-1" />
              </div>
              <div className="text-xs text-muted-foreground">{userStats.completedChallenges} défis</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements récents */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Derniers succès
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.slice(0, 3).map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {achievement.description}
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        +{achievement.points} pts
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleShareClick(achievement)}
                        className="h-8 w-8 p-0"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <BadgeShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        achievement={selectedAchievement}
      />

      {/* Message encouragement */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="py-4 text-center">
          <Gift className="h-8 w-8 mx-auto mb-2 text-purple-500" />
          <p className="text-sm font-medium">
            Continue ton parcours musical !
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Débloque de nouveaux styles au niveau {userStats.level + 1}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicGamificationPanel;
