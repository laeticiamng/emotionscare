// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Trophy, Award, Share2, History, Target,
  Flame, Star, Users, ChevronUp, ChevronDown,
  Crown, Zap, Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MyGamification } from '@/store/gamification.store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RankCardProps {
  data: MyGamification | null;
}

interface RankHistory {
  rank: string;
  tier: number;
  timestamp: Date;
  xpGained: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  deadline?: Date;
  completed: boolean;
}

const STORAGE_KEY = 'rank-card-data';

const rankTiers = [
  { name: 'Débutant', icon: '🌱', color: 'from-green-500/20 to-emerald-500/20', minXp: 0 },
  { name: 'Apprenti', icon: '📚', color: 'from-blue-500/20 to-cyan-500/20', minXp: 100 },
  { name: 'Pratiquant', icon: '🎯', color: 'from-purple-500/20 to-violet-500/20', minXp: 500 },
  { name: 'Expert', icon: '⭐', color: 'from-yellow-500/20 to-amber-500/20', minXp: 1500 },
  { name: 'Maître', icon: '👑', color: 'from-orange-500/20 to-red-500/20', minXp: 5000 },
  { name: 'Légende', icon: '🏆', color: 'from-pink-500/20 to-rose-500/20', minXp: 15000 },
];

const defaultChallenges: Challenge[] = [
  { id: '1', title: '7 jours consécutifs', description: 'Connectez-vous 7 jours de suite', progress: 3, target: 7, reward: 50, completed: false },
  { id: '2', title: 'Explorateur', description: 'Essayez 5 fonctionnalités différentes', progress: 2, target: 5, reward: 30, completed: false },
  { id: '3', title: 'Zen Master', description: 'Complétez 10 sessions de respiration', progress: 4, target: 10, reward: 75, completed: false },
];

export const RankCard: React.FC<RankCardProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('rank');
  const [rankHistory, setRankHistory] = useState<RankHistory[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>(defaultChallenges);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [weeklyXp, setWeeklyXp] = useState(0);
  const [streak, setStreak] = useState(0);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setRankHistory(parsed.history || []);
      setChallenges(parsed.challenges || defaultChallenges);
      setWeeklyXp(parsed.weeklyXp || 0);
      setStreak(parsed.streak || 0);
    }
  }, []);

  // Save data and track rank changes
  useEffect(() => {
    if (data) {
      const newEntry: RankHistory = {
        rank: data.rank_label,
        tier: data.tier || 1,
        timestamp: new Date(),
        xpGained: 10, // Placeholder
      };

      // Check for level up
      if (rankHistory.length > 0 && rankHistory[0].tier < (data.tier || 1)) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }

      setRankHistory(prev => {
        const updated = [newEntry, ...prev.slice(0, 49)];
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          history: updated,
          challenges,
          weeklyXp,
          streak
        }));
        return updated;
      });
    }
  }, [data?.tier]);

  const handleShare = async () => {
    if (!data) return;
    
    const text = `🏆 Mon rang sur EmotionsCare: ${data.rank_label}\n${data.next_goal_hint}\n\n#EmotionsCare #Gamification`;
    
    if (navigator.share) {
      await navigator.share({ title: 'Mon rang', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Copié dans le presse-papier');
    }
  };

  const claimChallenge = (challengeId: string) => {
    setChallenges(prev => {
      const updated = prev.map(c => 
        c.id === challengeId ? { ...c, completed: true } : c
      );
      const challenge = prev.find(c => c.id === challengeId);
      if (challenge) {
        setWeeklyXp(w => w + challenge.reward);
        toast.success(`+${challenge.reward} XP gagnés !`);
      }
      return updated;
    });
  };

  // Calculate stats
  const currentTierIndex = rankTiers.findIndex(t => t.name === data?.rank_label) || 0;
  const currentTier = rankTiers[currentTierIndex];
  const nextTier = rankTiers[currentTierIndex + 1];
  const progressToNext = nextTier ? 65 : 100; // Placeholder progress

  if (!data) {
    return (
      <Card className="bg-gradient-to-r from-muted/50 to-muted/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-20">
            <div className="text-center text-muted-foreground">
              <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Classement en cours de chargement...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Level up animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-gradient-to-br from-yellow-500 to-orange-500 p-8 rounded-2xl text-white text-center"
            >
              <Crown className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Niveau supérieur !</h2>
              <p className="text-lg opacity-90">{data.rank_label}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className={cn('border-2 overflow-hidden', `bg-gradient-to-br ${currentTier?.color || 'from-primary/5 to-secondary/5'}`)}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Ton rang
              </CardTitle>
              <div className="flex items-center gap-2">
                <TabsList className="h-8">
                  <TabsTrigger value="rank" className="text-xs px-2">Rang</TabsTrigger>
                  <TabsTrigger value="challenges" className="text-xs px-2">Défis</TabsTrigger>
                  <TabsTrigger value="history" className="text-xs px-2">Historique</TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <TabsContent value="rank" className="mt-0 space-y-4">
              {/* Main rank display */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl">{currentTier?.icon || '🌟'}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {data.rank_label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Niveau {data.tier || 1}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  {data.featured_badge && (
                    <motion.div 
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Award className="w-8 h-8 text-yellow-600" />
                    </motion.div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Dernier badge
                  </p>
                </div>
              </div>

              {/* XP Progress */}
              {nextTier && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Progression vers {nextTier.name}
                    </span>
                    <span className="font-medium">{progressToNext}%</span>
                  </div>
                  <Progress value={progressToNext} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{currentTier?.name}</span>
                    <span>{nextTier.icon} {nextTier.name}</span>
                  </div>
                </div>
              )}

              {/* Weekly stats */}
              <div className="grid grid-cols-3 gap-2">
                <Card className="p-3 bg-background/50 text-center">
                  <Flame className="h-5 w-5 mx-auto text-orange-500 mb-1" />
                  <div className="text-lg font-bold">{streak}</div>
                  <p className="text-xs text-muted-foreground">Streak</p>
                </Card>
                <Card className="p-3 bg-background/50 text-center">
                  <Star className="h-5 w-5 mx-auto text-yellow-500 mb-1" />
                  <div className="text-lg font-bold">{weeklyXp}</div>
                  <p className="text-xs text-muted-foreground">XP/semaine</p>
                </Card>
                <Card className="p-3 bg-background/50 text-center">
                  <Users className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                  <div className="text-lg font-bold">#{Math.floor(Math.random() * 100) + 1}</div>
                  <p className="text-xs text-muted-foreground">Classement</p>
                </Card>
              </div>

              {/* Next goal */}
              {data.next_goal_hint && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="w-4 h-4" />
                    <span>Prochain objectif</span>
                  </div>
                  
                  <div className="p-3 bg-background/50 rounded-lg border">
                    <p className="text-sm">{data.next_goal_hint}</p>
                  </div>
                </div>
              )}

              {/* Badges */}
              <div className="flex gap-2 pt-2 flex-wrap">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Actif
                </Badge>
                {data.tier && (
                  <Badge variant="outline">
                    Niveau {data.tier}
                  </Badge>
                )}
                {streak >= 7 && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 gap-1">
                    🔥 {streak} jours
                  </Badge>
                )}
              </div>
            </TabsContent>

            <TabsContent value="challenges" className="mt-0 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Défis en cours</h4>
                <Badge variant="outline" className="gap-1">
                  <Gift className="h-3 w-3" />
                  {challenges.filter(c => !c.completed).length} actifs
                </Badge>
              </div>
              
              {challenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    'p-3 rounded-lg border',
                    challenge.completed 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-background/50'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-sm">{challenge.title}</h5>
                      <p className="text-xs text-muted-foreground">{challenge.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs gap-1">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      +{challenge.reward} XP
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={(challenge.progress / challenge.target) * 100} 
                      className="flex-1 h-2" 
                    />
                    <span className="text-xs text-muted-foreground">
                      {challenge.progress}/{challenge.target}
                    </span>
                    {challenge.progress >= challenge.target && !challenge.completed && (
                      <Button 
                        size="sm" 
                        className="h-6 text-xs"
                        onClick={() => claimChallenge(challenge.id)}
                      >
                        Réclamer
                      </Button>
                    )}
                    {challenge.completed && (
                      <Badge className="bg-green-500 text-xs">✓</Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <ScrollArea className="h-48">
                {rankHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun historique</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {rankHistory.slice(0, 10).map((entry, i) => {
                      const tierData = rankTiers.find(t => t.name === entry.rank);
                      const prevEntry = rankHistory[i + 1];
                      const change = prevEntry 
                        ? entry.tier - prevEntry.tier 
                        : 0;
                      
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors"
                        >
                          <span className="text-xl">{tierData?.icon || '🌟'}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{entry.rank}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs gap-1">
                              +{entry.xpGained} XP
                            </Badge>
                            {change !== 0 && (
                              <div className={cn(
                                'flex items-center',
                                change > 0 ? 'text-green-500' : 'text-red-500'
                              )}>
                                {change > 0 ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              {/* Tier progression */}
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Tous les rangs</h4>
                <div className="flex gap-1">
                  {rankTiers.map((tier, i) => (
                    <div
                      key={tier.name}
                      className={cn(
                        'flex-1 p-2 rounded text-center text-xs',
                        i <= currentTierIndex 
                          ? `bg-gradient-to-br ${tier.color}` 
                          : 'bg-muted/30 opacity-50'
                      )}
                      title={tier.name}
                    >
                      <span className="text-lg">{tier.icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};
