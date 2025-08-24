import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, Zap, Calendar, Target, Star } from 'lucide-react';
import { GritAchievement } from '@/types/boss-level-grit';

interface AchievementsListProps {
  achievements: GritAchievement[];
}

const AchievementsList: React.FC<AchievementsListProps> = ({ achievements }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'streak': return <Calendar className="h-4 w-4" />;
      case 'completion': return <Target className="h-4 w-4" />;
      case 'score': return <Star className="h-4 w-4" />;
      case 'time': return <Calendar className="h-4 w-4" />;
      case 'category': return <Trophy className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'streak': return 'Série';
      case 'completion': return 'Complétion';
      case 'score': return 'Performance';
      case 'time': return 'Temps';
      case 'category': return 'Catégorie';
      default: return type;
    }
  };

  const getProgressColor = (achievement: GritAchievement) => {
    if (achievement.unlocked) return 'hsl(var(--primary))';
    const progressPercent = (achievement.progress / achievement.requirement) * 100;
    if (progressPercent >= 75) return 'hsl(var(--accent))';
    if (progressPercent >= 50) return 'hsl(var(--secondary))';
    return 'hsl(var(--muted))';
  };

  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    if (!a.unlocked && !b.unlocked) {
      const aProgress = (a.progress / a.requirement) * 100;
      const bProgress = (b.progress / b.requirement) * 100;
      return bProgress - aProgress;
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* Statistiques des succès */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {achievements.filter(a => a.unlocked).length}
            </div>
            <div className="text-sm text-muted-foreground">Débloqués</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">
              {achievements.filter(a => !a.unlocked && (a.progress / a.requirement) >= 0.75).length}
            </div>
            <div className="text-sm text-muted-foreground">Presque acquis</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-muted-foreground">
              {achievements.length}
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des succès */}
      <div className="grid gap-4 md:grid-cols-2">
        {sortedAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className={`relative overflow-hidden ${
              achievement.unlocked 
                ? 'bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20' 
                : 'opacity-80'
            }`}>
              {achievement.unlocked && (
                <div className="absolute top-0 right-0 p-2">
                  <Trophy className="h-5 w-5 text-accent" />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <span className="text-lg">{achievement.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: getProgressColor(achievement) }}
                    >
                      <div className="flex items-center gap-1">
                        {getTypeIcon(achievement.type)}
                        {getTypeLabel(achievement.type)}
                      </div>
                    </Badge>
                    {achievement.unlocked && (
                      <Badge variant="default" className="text-xs">
                        Débloqué
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>
                      {achievement.progress} / {achievement.requirement}
                    </span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.requirement) * 100} 
                    className="h-2"
                  />
                  {!achievement.unlocked && (
                    <div className="text-xs text-muted-foreground">
                      {achievement.requirement - achievement.progress} restant(s)
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Zap className="h-3 w-3" />
                    Récompense: {achievement.reward.xp} XP
                  </div>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="text-xs text-muted-foreground">
                      Débloqué le {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                {achievement.reward.features && achievement.reward.features.length > 0 && (
                  <div className="pt-2">
                    <div className="text-xs text-muted-foreground mb-1">
                      Fonctionnalités bonus:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {achievement.reward.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {!achievement.unlocked && (
                  <div className="flex items-center justify-center p-2 rounded bg-muted/50">
                    <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      À débloquer
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {achievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun succès disponible</h3>
          <p className="text-muted-foreground">
            Commencez des défis pour débloquer vos premiers succès !
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementsList;