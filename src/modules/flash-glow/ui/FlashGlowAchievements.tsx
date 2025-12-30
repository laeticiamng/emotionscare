/**
 * FlashGlowAchievements - Panel des achievements Flash Glow
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, CheckCircle, Star } from 'lucide-react';
import { flashGlowService, FlashGlowAchievement } from '../flash-glowService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const FlashGlowAchievements: React.FC = () => {
  const [achievements, setAchievements] = useState<FlashGlowAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState<FlashGlowAchievement | null>(null);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const stats = await flashGlowService.getStats();
      setAchievements(stats.achievements || []);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercent = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-20" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header avec progression globale */}
      <Card className="bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Achievements
          </CardTitle>
          <CardDescription>
            Débloquez des récompenses en progressant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{unlockedCount}/{totalCount} débloqués</span>
              <span className="text-muted-foreground">{Math.round(completionPercent)}%</span>
            </div>
            <Progress value={completionPercent} className="h-3" />
            <div className="flex gap-2">
              {achievements.slice(0, 5).map((a) => (
                <motion.div
                  key={a.id}
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    a.unlocked 
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {a.unlocked ? a.emoji : <Lock className="h-4 w-4" />}
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des achievements */}
      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${
                achievement.unlocked 
                  ? 'border-yellow-500/30 bg-gradient-to-r from-yellow-500/5 to-transparent' 
                  : 'opacity-70'
              }`}
              onClick={() => setSelectedAchievement(achievement)}
            >
              <CardContent className="flex items-center gap-4 py-4">
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                  ${achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg' 
                    : 'bg-muted'
                  }
                `}>
                  {achievement.unlocked ? achievement.emoji : <Lock className="h-6 w-6 text-muted-foreground" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{achievement.name}</h3>
                    {achievement.unlocked && (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {achievement.description}
                  </p>
                  
                  {!achievement.unlocked && (
                    <div className="mt-2">
                      <Progress 
                        value={(achievement.progress / achievement.target) * 100} 
                        className="h-1.5" 
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.progress}/{achievement.target}
                      </p>
                    </div>
                  )}
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Débloqué le {format(new Date(achievement.unlockedAt), 'PPP', { locale: fr })}
                    </p>
                  )}
                </div>

                {achievement.unlocked && (
                  <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">
                    <Star className="h-3 w-3 mr-1" />
                    Obtenu
                  </Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal détail achievement */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className={`
                  w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-4
                  ${selectedAchievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg' 
                    : 'bg-muted'
                  }
                `}>
                  {selectedAchievement.unlocked 
                    ? selectedAchievement.emoji 
                    : <Lock className="h-10 w-10 text-muted-foreground" />
                  }
                </div>

                <h3 className="text-xl font-bold mb-2">{selectedAchievement.name}</h3>
                <p className="text-muted-foreground mb-4">{selectedAchievement.description}</p>

                {!selectedAchievement.unlocked && (
                  <div className="mb-4">
                    <Progress 
                      value={(selectedAchievement.progress / selectedAchievement.target) * 100} 
                      className="h-2 mb-2" 
                    />
                    <p className="text-sm text-muted-foreground">
                      Progression: {selectedAchievement.progress}/{selectedAchievement.target}
                    </p>
                  </div>
                )}

                {selectedAchievement.unlocked && selectedAchievement.unlockedAt && (
                  <Badge className="bg-green-500/20 text-green-700">
                    Débloqué le {format(new Date(selectedAchievement.unlockedAt), 'PPP', { locale: fr })}
                  </Badge>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FlashGlowAchievements;
