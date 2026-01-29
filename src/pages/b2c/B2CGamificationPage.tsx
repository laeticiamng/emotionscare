/**
 * GAMIFICATION PAGE - EMOTIONSCARE
 * Page de gamification accessible WCAG 2.1 AA
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Flame, Gift, Zap, Crown, Sparkles, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AurasGalaxy } from '@/features/leaderboard';
import { RewardsTab } from '@/components/gamification/RewardsTab';
import { DailyChallengesCard } from '@/components/gamification/DailyChallengesCard';
import { useGamification } from '@/modules/gamification';
import { Progress } from '@/components/ui/progress';

const B2CGamificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'rewards' | 'leaderboard'>('achievements');
  const { progress, achievements, isLoading } = useGamification();

  const level = progress?.level ?? 1;
  const experience = progress?.currentXp ?? 0;
  const nextLevelXp = progress?.nextLevelXp ?? 100;
  const streak = progress?.streak ?? 0;
  const totalPoints = progress?.totalPoints ?? 0;
  const achievementsUnlocked = achievements.filter(a => a.unlocked).length;

  useEffect(() => {
    document.title = "Ma Progression | EmotionsCare";
  }, []);

  const progressPercentage = (experience / nextLevelXp) * 100;

  const handleTabChange = (tab: 'achievements' | 'rewards' | 'leaderboard') => {
    setSelectedTab(tab);
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-muted to-muted-foreground';
      case 'rare': return 'from-info to-info';
      case 'epic': return 'from-accent to-accent';
      case 'legendary': return 'from-warning to-warning/80';
      default: return 'from-muted to-muted-foreground';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-muted';
      case 'rare': return 'border-info';
      case 'epic': return 'border-accent';
      case 'legendary': return 'border-warning';
      default: return 'border-muted';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background" data-testid="page-root">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        tabIndex={0}
      >
        Aller au contenu principal
      </a>

      <header className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm border-b border-border/50">
        <button 
          onClick={() => navigate(-1)}
          onKeyDown={(e) => handleKeyDown(e, () => navigate(-1))}
          className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Retourner à la page précédente"
          tabIndex={0}
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <h1 className="text-lg font-medium">Ma Progression</h1>
        <div className="w-9" aria-hidden="true" />
      </header>

      <main id="main-content" role="main">
        <section className="p-6" aria-labelledby="stats-title">
          <h2 id="stats-title" className="sr-only">Statistiques de progression</h2>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg"
                role="img"
                aria-label={`Niveau ${level}`}
              >
                <Crown className="w-10 h-10 text-primary-foreground" aria-hidden="true" />
              </motion.div>
              <h3 className="text-2xl font-bold">Niveau {level}</h3>
              <div 
                className="w-full bg-muted rounded-full h-3 mt-3 mb-2"
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progression vers le niveau suivant: ${progressPercentage.toFixed(1)}%`}
              >
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-primary to-accent h-3 rounded-full"
                />
              </div>
              <p className="text-sm text-muted-foreground">{experience} / {nextLevelXp} XP</p>
            </div>

            <div className="grid grid-cols-3 gap-4" role="group" aria-label="Statistiques rapides">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Flame className="w-6 h-6 text-warning" aria-hidden="true" />
                </div>
                <div className="text-xl font-bold">{streak}</div>
                <div className="text-xs text-muted-foreground">jours de série</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-6 h-6 text-warning" aria-hidden="true" />
                </div>
                <div className="text-xl font-bold">{achievementsUnlocked}</div>
                <div className="text-xs text-muted-foreground">succès obtenus</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-info" aria-hidden="true" />
                </div>
                <div className="text-xl font-bold">{totalPoints}</div>
                <div className="text-xs text-muted-foreground">points</div>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Challenges */}
        <section className="px-6 mb-4">
          <DailyChallengesCard />
        </section>

        {/* Tab Navigation */}
        <nav className="px-4 mb-4" aria-label="Navigation des sections">
          <div className="flex bg-muted/50 rounded-2xl p-1" role="tablist">
            {[
              { key: 'achievements', label: 'Succès', icon: Star },
              { key: 'rewards', label: 'Récompenses', icon: Gift },
              { key: 'leaderboard', label: 'Classement', icon: Trophy }
            ].map(({ key, label, icon: Icon }) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTabChange(key as any)}
                onKeyDown={(e) => handleKeyDown(e, () => handleTabChange(key as any))}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  selectedTab === key 
                    ? 'bg-card shadow-sm text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                role="tab"
                aria-selected={selectedTab === key}
                aria-controls={`${key}-panel`}
                tabIndex={selectedTab === key ? 0 : -1}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium">{label}</span>
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <section className="px-4 pb-6">
          <AnimatePresence mode="wait">
            {selectedTab === 'achievements' && (
              <motion.div
                key="achievements"
                id="achievements-panel"
                role="tabpanel"
                aria-labelledby="achievements-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <h3 className="sr-only">Liste des succès</h3>
                {achievements.map((achievement, index) => (
                  <motion.article
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-card/80 backdrop-blur-sm rounded-2xl p-4 border-2 ${getRarityBorder(achievement.rarity)} ${
                      achievement.unlocked ? 'shadow-lg' : 'opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center text-2xl shadow-lg ${
                          !achievement.unlocked ? 'grayscale' : ''
                        }`}
                        role="img"
                        aria-label={`Icône du succès ${achievement.name}`}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{achievement.name}</h4>
                          {achievement.unlocked && (
                            <Star 
                              className="w-4 h-4 text-warning fill-current" 
                              aria-label="Succès débloqué"
                            />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        {!achievement.unlocked && (
                          <div>
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progression</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100}
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}

            {selectedTab === 'rewards' && (
              <RewardsTab userPoints={totalPoints} />
            )}

            {selectedTab === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                id="leaderboard-panel"
                role="tabpanel"
                aria-labelledby="leaderboard-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <AurasGalaxy minHeight="300px" showHeader={true} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default B2CGamificationPage;