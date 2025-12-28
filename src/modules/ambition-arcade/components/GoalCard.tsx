/**
 * Carte d'objectif Ambition Arcade
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  ChevronDown, ChevronUp, CheckCircle, Clock, 
  Plus, Star, Target, Trash2, Play, Loader2, Heart, Timer
} from 'lucide-react';
import { 
  useAmbitionQuests, 
  useCreateQuest, 
  useCompleteQuest, 
  useStartQuest,
  useConfetti,
  type AmbitionGoal 
} from '../hooks';
import { useCompleteGoal, useAbandonGoal } from '../hooks/useAmbitionGoals';
import { useDeleteGoal } from '../hooks/useDeleteGoal';
import { useAmbitionFavorites, useAmbitionRatings } from '../hooks/useAmbitionExtras';
import { RatingStars } from './RatingStars';
import { ArtifactGallery } from './ArtifactGallery';
import { ShareAchievement } from './ShareAchievement';
import { QuestTimer } from './QuestTimer';

interface GoalCardProps {
  goal: AmbitionGoal;
  onTagClick?: (tag: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onTagClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  
  const { data: quests, isLoading: questsLoading } = useAmbitionQuests(isExpanded ? goal.id : undefined);
  const createQuest = useCreateQuest();
  const completeQuest = useCompleteQuest();
  const startQuest = useStartQuest();
  const completeGoal = useCompleteGoal();
  const abandonGoal = useAbandonGoal();
  const deleteGoal = useDeleteGoal();
  const { isFavorite, toggleFavorite } = useAmbitionFavorites();
  const { getRating, rateRun } = useAmbitionRatings();
  const { fireGoalCompleteConfetti } = useConfetti();

  const goalIsFavorite = isFavorite(goal.id);
  const goalRating = getRating(goal.id);

  const handleCompleteGoal = async () => {
    await completeGoal.mutateAsync(goal.id);
    fireGoalCompleteConfetti();
  };

  const progressPercent = goal.questsTotal > 0 
    ? (goal.questsCompleted / goal.questsTotal) * 100 
    : 0;

  const isCompleted = goal.status === 'completed';
  const isAbandoned = goal.status === 'abandoned';

  const handleAddQuest = async () => {
    if (!newQuestTitle.trim()) return;
    await createQuest.mutateAsync({
      runId: goal.id,
      title: newQuestTitle.trim()
    });
    setNewQuestTitle('');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`transition-all ${
        isCompleted 
          ? 'border-success/50 bg-success/5' 
          : isAbandoned 
            ? 'opacity-60' 
            : 'hover:shadow-md'
      }`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className={`text-lg ${isCompleted ? 'text-success' : ''}`}>
                {goal.objective}
              </CardTitle>
              <div className="flex flex-wrap gap-1 mt-2">
                {goal.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className={`text-xs ${onTagClick ? 'cursor-pointer hover:bg-primary/20 transition-colors' : ''}`}
                    onClick={(e) => {
                      if (onTagClick) {
                        e.stopPropagation();
                        onTagClick(tag);
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => { e.stopPropagation(); toggleFavorite(goal.id); }}
              >
                <Heart className={`w-4 h-4 ${goalIsFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
              </Button>

              {/* Share Button (for completed) */}
              {isCompleted && (
                <ShareAchievement
                  type="goal"
                  title={goal.objective}
                  description={`Objectif complété avec ${goal.questsCompleted} quêtes !`}
                  stats={[
                    { label: 'XP', value: goal.xpEarned },
                    { label: 'Quêtes', value: goal.questsCompleted }
                  ]}
                />
              )}

              {isCompleted && (
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">{goal.questsCompleted}/{goal.questsTotal} quêtes</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning" />
                <span>{goal.xpEarned} XP</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{new Date(goal.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {isExpanded ? 'Réduire' : 'Quêtes'}
            </Button>
          </div>

          {/* Expanded Quests */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3 border-t pt-4"
              >
                {/* Quest List */}
                {questsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {quests?.map(quest => (
                      <div 
                        key={quest.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          quest.status === 'completed' 
                            ? 'bg-success/5 border-success/30' 
                            : 'bg-muted/30'
                        }`}
                      >
                        <div className="flex-1">
                          <p className={`font-medium ${
                            quest.status === 'completed' ? 'line-through text-muted-foreground' : ''
                          }`}>
                            {quest.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{quest.xpReward} XP</span>
                            <span>·</span>
                            <span>~{quest.estMinutes} min</span>
                          </div>
                        </div>
                        
                        {quest.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : quest.status === 'in_progress' ? (
                          <div className="flex items-center gap-2">
                            <QuestTimer
                              questId={quest.id}
                              questTitle={quest.title}
                              estimatedMinutes={quest.estMinutes}
                              compact
                            />
                            <Button 
                              size="sm" 
                              onClick={() => completeQuest.mutate({ questId: quest.id })}
                              disabled={completeQuest.isPending}
                            >
                              Terminer
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => startQuest.mutate(quest.id)}
                            disabled={startQuest.isPending}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Start
                          </Button>
                        )}
                      </div>
                    ))}

                    {quests?.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        Aucune quête créée
                      </p>
                    )}
                  </div>
                )}

                {/* Artifacts */}
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Artefacts</p>
                  <ArtifactGallery runId={goal.id} compact />
                </div>
                {/* Add Quest */}
                {!isCompleted && !isAbandoned && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nouvelle quête..."
                      value={newQuestTitle}
                      onChange={(e) => setNewQuestTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddQuest()}
                    />
                    <Button 
                      size="icon" 
                      onClick={handleAddQuest}
                      disabled={!newQuestTitle.trim() || createQuest.isPending}
                    >
                      {createQuest.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}

                {/* Rating (for completed) */}
                {isCompleted && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Votre note :</span>
                    <RatingStars 
                      value={goalRating} 
                      onChange={(rating) => rateRun(goal.id, rating)} 
                      size="sm"
                    />
                  </div>
                )}

                {/* Actions */}
                {!isCompleted && !isAbandoned && (
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1" 
                      onClick={handleCompleteGoal}
                      disabled={completeGoal.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Compléter
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-destructive"
                      onClick={() => abandonGoal.mutate(goal.id)}
                      disabled={abandonGoal.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Delete abandoned */}
                {isAbandoned && (
                  <div className="pt-2">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="w-full"
                      onClick={() => deleteGoal.mutate(goal.id)}
                      disabled={deleteGoal.isPending}
                    >
                      {deleteGoal.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      Supprimer définitivement
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GoalCard;
