// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Clock,
  Award,
  Crown,
  Shield
} from 'lucide-react';

interface GritAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'completion' | 'score' | 'time' | 'category';
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  reward: {
    xp: number;
    features?: string[];
  };
}

interface AchievementsListProps {
  achievements: GritAchievement[];
}

const typeIcons = {
  streak: Zap,
  completion: Target,
  score: Star,
  time: Clock,
  category: Trophy
};

const typeColors = {
  streak: 'text-orange-500',
  completion: 'text-green-500',
  score: 'text-yellow-500',
  time: 'text-blue-500',
  category: 'text-purple-500'
};

const AchievementsList: React.FC<AchievementsListProps> = ({ achievements }) => {
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'crown': return Crown;
      case 'shield': return Shield;
      case 'award': return Award;
      case 'trophy': return Trophy;
      default: return Star;
    }
  };

  const AchievementCard = ({ achievement, index }: { achievement: GritAchievement; index: number }) => {
    const TypeIcon = typeIcons[achievement.type];
    const IconComponent = getAchievementIcon(achievement.icon);
    const typeColor = typeColors[achievement.type];
    const progressPercentage = (achievement.progress / achievement.requirement) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className={`transition-all duration-200 ${
          achievement.unlocked 
            ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/5' 
            : 'opacity-60'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  achievement.unlocked 
                    ? 'bg-yellow-500/20 text-yellow-600' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {achievement.title}
                    {achievement.unlocked && <Trophy className="h-4 w-4 text-yellow-500" />}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className={typeColor}>
                  <TypeIcon className="h-3 w-3 mr-1" />
                  {achievement.type}
                </Badge>
                {achievement.unlocked && achievement.unlockedAt && (
                  <Badge variant="secondary" className="text-xs">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {!achievement.unlocked && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression</span>
                  <span>{achievement.progress} / {achievement.requirement}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                <span>+{achievement.reward.xp} XP</span>
              </div>
              
              {achievement.reward.features && achievement.reward.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {achievement.reward.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {achievement.unlocked && (
              <div className="text-center">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  🎉 Succès débloqué !
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{unlockedAchievements.length}</div>
            <div className="text-sm text-muted-foreground">Succès Débloqués</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{achievements.length}</div>
            <div className="text-sm text-muted-foreground">Total Succès</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Taux de Completion</div>
          </CardContent>
        </Card>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Succès Débloqués ({unlockedAchievements.length})
          </h3>
          <div className="space-y-4">
            {unlockedAchievements.map((achievement, index) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement} 
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-muted-foreground" />
            À Débloquer ({lockedAchievements.length})
          </h3>
          <div className="space-y-4">
            {lockedAchievements.map((achievement, index) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement} 
                index={index + unlockedAchievements.length}
              />
            ))}
          </div>
        </div>
      )}

      {achievements.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun succès disponible pour le moment</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AchievementsList;