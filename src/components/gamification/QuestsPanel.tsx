// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, Target, Zap } from 'lucide-react';
import { questService, Quest, UserQuestProgress } from '@/services/questService';
import { useToast } from '@/hooks/use-toast';

export const QuestsPanel: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [userProgress, setUserProgress] = useState<UserQuestProgress[]>([]);
  const [loading, setLoading] = useState(true);
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

  const claimReward = async (questId: string) => {
    const success = await questService.claimQuestReward(questId);
    if (success) {
      toast({
        title: '🎉 Récompense réclamée !',
        description: 'Vos points ont été ajoutés à votre total.',
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
      case 'easy': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
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

  const getQuestTypeLabel = (type: string) => {
    switch (type) {
      case 'daily': return 'Quotidienne';
      case 'weekly': return 'Hebdomadaire';
      case 'special': return 'Spéciale';
      default: return type;
    }
  };

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

  const dailyQuests = quests.filter(q => q.quest_type === 'daily');
  const weeklyQuests = quests.filter(q => q.quest_type === 'weekly');

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Clock className="w-5 h-5 text-primary" />
            Quêtes Quotidiennes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dailyQuests.map(quest => {
            const progress = getProgressForQuest(quest.id);
            const progressPercentage = progress 
              ? (progress.current_progress / quest.max_progress) * 100 
              : 0;

            return (
              <div key={quest.id} className="p-4 bg-secondary/20 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getQuestTypeIcon(quest.quest_type)}
                      <h4 className="font-semibold text-foreground">{quest.title}</h4>
                      <Badge className={getDifficultyColor(quest.difficulty)}>
                        {quest.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{quest.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-yellow-500">{quest.points_reward}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {progress?.current_progress || 0} / {quest.max_progress}
                    </span>
                    {progress?.completed && (
                      <Button 
                        size="sm" 
                        onClick={() => claimReward(quest.id)}
                        className="bg-primary text-primary-foreground"
                      >
                        Réclamer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="w-5 h-5 text-primary" />
            Quêtes Hebdomadaires
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weeklyQuests.map(quest => {
            const progress = getProgressForQuest(quest.id);
            const progressPercentage = progress 
              ? (progress.current_progress / quest.max_progress) * 100 
              : 0;

            return (
              <div key={quest.id} className="p-4 bg-secondary/20 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getQuestTypeIcon(quest.quest_type)}
                      <h4 className="font-semibold text-foreground">{quest.title}</h4>
                      <Badge className={getDifficultyColor(quest.difficulty)}>
                        {quest.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{quest.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-yellow-500">{quest.points_reward}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {progress?.current_progress || 0} / {quest.max_progress}
                    </span>
                    {progress?.completed && (
                      <Button 
                        size="sm" 
                        onClick={() => claimReward(quest.id)}
                        className="bg-primary text-primary-foreground"
                      >
                        Réclamer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
