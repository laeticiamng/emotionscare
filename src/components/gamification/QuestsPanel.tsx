import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, Target, Zap, Flame } from 'lucide-react';
import { questService, Quest, UserQuestProgress } from '@/services/questService';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const QuestsPanel: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [userProgress, setUserProgress] = useState<UserQuestProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'daily' | 'weekly' | 'special'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    setLoading(true);
    const [questsData, progressData] = await Promise.all([
      questService.getActiveQuests(),
      questService.getUserQuestProgress()
    ]);
    setQuests(questsData);
    setUserProgress(progressData);
    setLoading(false);
  };

  const getProgressForQuest = (questId: string): UserQuestProgress | undefined => {
    return userProgress.find(p => p.quest_id === questId);
  };

  const claimReward = async (questId: string, points: number) => {
    const success = await questService.claimQuestReward(questId);
    if (success) {
      toast({
        title: '🎉 Récompense réclamée !',
        description: `+${points} points ajoutés à votre total.`,
      });
      loadQuests();
    } else {
      toast({
        title: 'Erreur',
        description: 'Impossible de réclamer la récompense.',
        variant: 'destructive'
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getQuestTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Clock className="w-4 h-4" />;
      case 'weekly': return <Target className="w-4 h-4" />;
      case 'special': return <Zap className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const filteredQuests = activeFilter === 'all' 
    ? quests 
    : quests.filter(q => q.quest_type === activeFilter);

  // Stats
  const completedToday = quests.filter(q => {
    const progress = getProgressForQuest(q.id);
    return progress?.completed && q.quest_type === 'daily';
  }).length;
  const totalDaily = quests.filter(q => q.quest_type === 'daily').length;

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderQuest = (quest: Quest, index: number) => {
    const progress = getProgressForQuest(quest.id);
    const maxProgress = quest.max_progress || quest.target_value || 1;
    const pointsReward = quest.points_reward || (quest.energy_reward || 0) + (quest.harmony_points_reward || 0);
    const difficulty = quest.difficulty || 'medium';
    const progressPercentage = progress 
      ? (progress.current_progress / maxProgress) * 100 
      : 0;
    const isCompleted = progress?.completed;

    return (
      <motion.div 
        key={quest.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`p-4 rounded-lg border transition-all ${
          isCompleted 
            ? 'bg-green-500/5 border-green-500/20' 
            : 'bg-secondary/20 border-border hover:border-primary/30'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getQuestTypeIcon(quest.quest_type)}
              <h4 className="font-semibold text-foreground">{quest.title}</h4>
              <Badge className={getDifficultyColor(difficulty)} variant="outline">
                {difficulty}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{quest.description}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-yellow-500">{pointsReward}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{progress?.current_progress || 0} / {maxProgress}</span>
            {isCompleted ? (
              <Button 
                size="sm" 
                onClick={() => claimReward(quest.id, pointsReward)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              >
                <Trophy className="w-3 h-3 mr-1" />
                Réclamer
              </Button>
            ) : (
              <span>{Math.round(progressPercentage)}%</span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Stats Header */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedToday}/{totalDaily}</p>
                <p className="text-sm text-muted-foreground">Quêtes du jour</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {quests.reduce((sum, q) => {
                const p = getProgressForQuest(q.id);
                return sum + (p?.completed ? (q.points_reward || (q.energy_reward || 0) + (q.harmony_points_reward || 0)) : 0);
              }, 0)} pts gagnés
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'daily', 'weekly', 'special'] as const).map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className="capitalize"
          >
            {filter === 'all' ? 'Toutes' : filter === 'daily' ? 'Quotidiennes' : filter === 'weekly' ? 'Hebdo' : 'Spéciales'}
          </Button>
        ))}
      </div>

      {/* Quests List */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="w-5 h-5 text-primary" />
            Quêtes actives
            <Badge variant="outline" className="ml-auto">{filteredQuests.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence>
            {filteredQuests.map((quest, index) => renderQuest(quest, index))}
          </AnimatePresence>
          
          {filteredQuests.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Aucune quête dans cette catégorie</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
