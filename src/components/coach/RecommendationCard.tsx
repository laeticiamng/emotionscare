// @ts-nocheck

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, Star, ArrowRight, Heart, Share2, 
  CheckCircle, ThumbsUp, ThumbsDown, Play,
  History, TrendingUp, Bell, BellOff, MessageSquare,
  BarChart3, Download, Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'music' | 'breathing' | 'meditation' | 'exercise' | 'social';
  duration?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  rating?: number;
  category: string;
  action?: () => void;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  className?: string;
  variant?: 'default' | 'compact';
}

interface SavedRecommendation {
  recommendation: Recommendation;
  savedAt: Date;
  completed: boolean;
  completedAt?: Date;
  feedback?: 'helpful' | 'not_helpful';
  notes?: string;
  rating?: number;
  scheduledFor?: Date;
  reminder?: boolean;
  completionCount: number;
  streak: number;
}

interface GlobalStats {
  totalCompleted: number;
  totalSaved: number;
  helpfulCount: number;
  notHelpfulCount: number;
  avgRating: number;
  totalRatings: number;
  longestStreak: number;
  byType: Record<string, { completed: number; saved: number }>;
  weeklyProgress: number[];
}

const STORAGE_KEY = 'recommendation-card-data';

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  className,
  variant = 'default'
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [feedback, setFeedback] = useState<'helpful' | 'not_helpful' | null>(null);
  const [notes, setNotes] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hasReminder, setHasReminder] = useState(false);
  const [savedRecommendations, setSavedRecommendations] = useState<SavedRecommendation[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [stats, setStats] = useState<GlobalStats>({
    totalCompleted: 0,
    totalSaved: 0,
    helpfulCount: 0,
    notHelpfulCount: 0,
    avgRating: 0,
    totalRatings: 0,
    longestStreak: 0,
    byType: {},
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0]
  });

  // Load saved data
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      setSavedRecommendations(parsed.saved || []);
      setStats(parsed.stats || stats);
      
      const savedEntry = parsed.saved?.find((s: SavedRecommendation) => 
        s.recommendation.id === recommendation.id
      );
      if (savedEntry) {
        setIsSaved(true);
        setIsCompleted(savedEntry.completed);
        setFeedback(savedEntry.feedback || null);
        setUserRating(savedEntry.rating || 0);
        setHasReminder(savedEntry.reminder || false);
        setNotes(savedEntry.notes || '');
        setCurrentStreak(savedEntry.streak || 0);
      }
    }
  }, [recommendation.id]);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      saved: savedRecommendations,
      stats
    }));
  }, [savedRecommendations, stats]);

  // Calculate weekly progress
  const weeklyStats = useMemo(() => {
    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    const completedThisWeek = savedRecommendations.filter(s => {
      if (!s.completedAt) return false;
      const completedDate = new Date(s.completedAt);
      const diffDays = Math.floor((today.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays < 7;
    });

    return {
      total: completedThisWeek.length,
      goal: 7,
      progress: Math.min(100, (completedThisWeek.length / 7) * 100)
    };
  }, [savedRecommendations]);

  const getTypeColor = () => {
    switch (recommendation.type) {
      case 'music': return 'bg-accent/10 text-accent';
      case 'breathing': return 'bg-primary/10 text-primary';
      case 'meditation': return 'bg-green-500/10 text-green-600';
      case 'exercise': return 'bg-amber-500/10 text-amber-600';
      case 'social': return 'bg-pink-500/10 text-pink-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyColor = () => {
    switch (recommendation.difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-600';
      case 'medium': return 'bg-amber-500/10 text-amber-600';
      case 'hard': return 'bg-red-500/10 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyLabel = () => {
    switch (recommendation.difficulty) {
      case 'easy': return 'Facile';
      case 'medium': return 'Moyen';
      case 'hard': return 'Difficile';
      default: return 'Autre';
    }
  };

  const getTypeLabel = () => {
    switch (recommendation.type) {
      case 'music': return 'Musique';
      case 'breathing': return 'Respiration';
      case 'meditation': return 'Méditation';
      case 'exercise': return 'Exercice';
      case 'social': return 'Social';
      default: return 'Autre';
    }
  };

  const getTypeIcon = () => {
    switch (recommendation.type) {
      case 'music': return '🎵';
      case 'breathing': return '🌬️';
      case 'meditation': return '🧘';
      case 'exercise': return '💪';
      case 'social': return '👥';
      default: return '✨';
    }
  };

  const handleSave = () => {
    if (isSaved) {
      setSavedRecommendations(prev => 
        prev.filter(s => s.recommendation.id !== recommendation.id)
      );
      setIsSaved(false);
      toast.info('Retiré des favoris');
    } else {
      const newEntry: SavedRecommendation = {
        recommendation,
        savedAt: new Date(),
        completed: false,
        completionCount: 0,
        streak: 0
      };
      setSavedRecommendations(prev => [newEntry, ...prev]);
      setIsSaved(true);
      setStats(prev => ({
        ...prev,
        totalSaved: prev.totalSaved + 1,
        byType: {
          ...prev.byType,
          [recommendation.type]: {
            ...prev.byType[recommendation.type],
            saved: (prev.byType[recommendation.type]?.saved || 0) + 1
          }
        }
      }));
      toast.success('Ajouté aux favoris');
    }
  };

  const handleComplete = () => {
    const newStreak = currentStreak + 1;
    setIsCompleted(true);
    setShowFeedback(true);
    setCurrentStreak(newStreak);
    
    setSavedRecommendations(prev => 
      prev.map(s => s.recommendation.id === recommendation.id 
        ? { 
            ...s, 
            completed: true, 
            completedAt: new Date(),
            completionCount: (s.completionCount || 0) + 1,
            streak: newStreak
          }
        : s
      )
    );
    
    setStats(prev => ({
      ...prev,
      totalCompleted: prev.totalCompleted + 1,
      longestStreak: Math.max(prev.longestStreak, newStreak),
      byType: {
        ...prev.byType,
        [recommendation.type]: {
          ...prev.byType[recommendation.type],
          completed: (prev.byType[recommendation.type]?.completed || 0) + 1
        }
      }
    }));
    
    toast.success('Bravo ! Activité complétée 🎉');
  };

  const handleFeedback = (type: 'helpful' | 'not_helpful') => {
    setFeedback(type);
    
    setSavedRecommendations(prev => 
      prev.map(s => s.recommendation.id === recommendation.id 
        ? { ...s, feedback: type, notes }
        : s
      )
    );
    
    setStats(prev => ({
      ...prev,
      helpfulCount: type === 'helpful' ? prev.helpfulCount + 1 : prev.helpfulCount,
      notHelpfulCount: type === 'not_helpful' ? prev.notHelpfulCount + 1 : prev.notHelpfulCount
    }));
    
    setShowFeedback(false);
    toast.success('Merci pour votre retour !');
  };

  const handleRate = (rating: number) => {
    setUserRating(rating);
    
    setSavedRecommendations(prev => 
      prev.map(s => s.recommendation.id === recommendation.id 
        ? { ...s, rating }
        : s
      )
    );

    const newTotalRatings = stats.totalRatings + 1;
    const newAvgRating = ((stats.avgRating * stats.totalRatings) + rating) / newTotalRatings;
    
    setStats(prev => ({
      ...prev,
      avgRating: Math.round(newAvgRating * 10) / 10,
      totalRatings: newTotalRatings
    }));
  };

  const toggleReminder = () => {
    setHasReminder(!hasReminder);
    
    setSavedRecommendations(prev => 
      prev.map(s => s.recommendation.id === recommendation.id 
        ? { ...s, reminder: !hasReminder }
        : s
      )
    );
    
    toast.success(hasReminder ? 'Rappel désactivé' : 'Rappel activé');
  };

  const handleShare = async () => {
    const text = `Je recommande "${recommendation.title}" sur EmotionsCare ! ${recommendation.description}`;
    
    if (navigator.share) {
      await navigator.share({ title: recommendation.title, text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Copié dans le presse-papier');
    }
  };

  const handleExport = () => {
    const exportData = {
      recommendation,
      stats: {
        completed: isCompleted,
        rating: userRating,
        feedback,
        streak: currentStreak,
        notes
      },
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recommendation-${recommendation.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Exporté !');
  };

  const handleStart = () => {
    recommendation.action?.();
    if (!isSaved) {
      handleSave();
    }
  };

  const completedRecommendations = savedRecommendations.filter(s => s.completed);
  const recentHistory = completedRecommendations.slice(0, 5);

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={className}
      >
        <Card className={cn(
          'cursor-pointer hover:shadow-md transition-all',
          isCompleted && 'border-green-500/50 bg-green-500/5'
        )}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getTypeIcon()}</span>
                  <h4 className="font-medium text-sm">{recommendation.title}</h4>
                  {isCompleted && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {currentStreak > 0 && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Flame className="h-3 w-3 text-orange-500" />
                      {currentStreak}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{recommendation.description}</p>
                <div className="flex gap-1 flex-wrap">
                  <Badge variant="secondary" className={cn("text-xs", getTypeColor())}>
                    {getTypeLabel()}
                  </Badge>
                  {recommendation.duration && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {recommendation.duration}min
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8"
                  onClick={(e) => { e.stopPropagation(); handleSave(); }}
                >
                  <Heart className={cn('h-4 w-4', isSaved && 'fill-red-500 text-red-500')} />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleStart} 
                  aria-label="Voir la recommandation"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      <Card className={cn(
        'h-full cursor-pointer hover:shadow-lg transition-all duration-300',
        isCompleted && 'border-green-500/50 bg-green-500/5'
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getTypeIcon()}</span>
                <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                {isCompleted && (
                  <Badge className="bg-green-500 gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Complété
                  </Badge>
                )}
                {currentStreak > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <Flame className="h-3 w-3 text-orange-500" />
                    {currentStreak} streak
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className={cn("text-xs", getTypeColor())}>
                  {getTypeLabel()}
                </Badge>
                <Badge variant="outline" className={cn("text-xs", getDifficultyColor())}>
                  {getDifficultyLabel()}
                </Badge>
                {recommendation.duration && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {recommendation.duration} min
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {recommendation.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-medium">{recommendation.rating}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={handleSave}
                >
                  <Heart className={cn('h-4 w-4', isSaved && 'fill-red-500 text-red-500')} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={toggleReminder}
                >
                  {hasReminder ? (
                    <Bell className="h-4 w-4 text-primary" />
                  ) : (
                    <BellOff className="h-4 w-4" />
                  )}
                </Button>
                <Dialog open={showStats} onOpenChange={setShowStats}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Statistiques globales
                      </DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="overview">
                      <TabsList className="w-full">
                        <TabsTrigger value="overview" className="flex-1">Aperçu</TabsTrigger>
                        <TabsTrigger value="history" className="flex-1">Historique</TabsTrigger>
                        <TabsTrigger value="types" className="flex-1">Par type</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-muted/50 text-center">
                            <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-500" />
                            <div className="text-2xl font-bold">{stats.totalCompleted}</div>
                            <div className="text-xs text-muted-foreground">Complétées</div>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50 text-center">
                            <Heart className="h-5 w-5 mx-auto mb-1 text-red-500" />
                            <div className="text-2xl font-bold">{stats.totalSaved}</div>
                            <div className="text-xs text-muted-foreground">Favoris</div>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50 text-center">
                            <Star className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                            <div className="text-2xl font-bold">{stats.avgRating || '-'}</div>
                            <div className="text-xs text-muted-foreground">Note moyenne</div>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50 text-center">
                            <Flame className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                            <div className="text-2xl font-bold">{stats.longestStreak}</div>
                            <div className="text-xs text-muted-foreground">Meilleur streak</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              Progression semaine
                            </span>
                            <span className="font-medium">{weeklyStats.total}/7</span>
                          </div>
                          <Progress value={weeklyStats.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/50">
                          <span className="flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4 text-green-500" />
                            Utiles
                          </span>
                          <span className="font-medium">{stats.helpfulCount}</span>
                        </div>
                      </TabsContent>

                      <TabsContent value="history" className="mt-4">
                        <div className="space-y-2">
                          {recentHistory.length > 0 ? (
                            recentHistory.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-2">
                                  <span>{getTypeIcon()}</span>
                                  <div>
                                    <div className="text-sm font-medium">{item.recommendation.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {item.completedAt && new Date(item.completedAt).toLocaleDateString('fr-FR')}
                                    </div>
                                  </div>
                                </div>
                                {item.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                    <span className="text-sm">{item.rating}</span>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              Aucun historique
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="types" className="mt-4">
                        <div className="space-y-2">
                          {['music', 'breathing', 'meditation', 'exercise', 'social'].map(type => (
                            <div key={type} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                              <div className="flex items-center gap-2">
                                <span>{
                                  type === 'music' ? '🎵' :
                                  type === 'breathing' ? '🌬️' :
                                  type === 'meditation' ? '🧘' :
                                  type === 'exercise' ? '💪' : '👥'
                                }</span>
                                <span className="text-sm capitalize">{type}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {stats.byType[type]?.completed || 0} complétées
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <Button variant="outline" onClick={handleExport} className="w-full mt-4">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-4">
          <p className="text-muted-foreground">{recommendation.description}</p>
          <p className="text-sm text-muted-foreground">
            Catégorie: {recommendation.category}
          </p>

          {/* User rating */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Votre note:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      'h-4 w-4',
                      userRating >= star
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-muted-foreground/30'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback section */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3 p-3 bg-muted/30 rounded-lg"
              >
                <p className="text-sm font-medium">Cette recommandation vous a-t-elle aidé ?</p>
                <div className="flex gap-2">
                  <Button
                    variant={feedback === 'helpful' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFeedback('helpful')}
                    className="gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Utile
                  </Button>
                  <Button
                    variant={feedback === 'not_helpful' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => handleFeedback('not_helpful')}
                    className="gap-2"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Pas utile
                  </Button>
                </div>
                <Textarea
                  placeholder="Commentaire optionnel..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-20"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress indicator for saved recommendations */}
          {isSaved && !isCompleted && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progression</span>
                <span>En attente</span>
              </div>
              <Progress value={0} className="h-1.5" />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {!isCompleted ? (
              <>
                <Button 
                  className="flex-1" 
                  onClick={handleStart}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Commencer
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleComplete}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Marquer complété
                </Button>
              </>
            ) : (
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  setIsCompleted(false);
                  handleStart();
                }}
              >
                <History className="mr-2 h-4 w-4" />
                Refaire
              </Button>
            )}
          </div>

          {/* Feedback badge */}
          {feedback && (
            <div className="flex justify-center">
              <Badge variant="outline" className={cn(
                'gap-1',
                feedback === 'helpful' ? 'text-green-600 border-green-500/30' : 'text-red-600 border-red-500/30'
              )}>
                {feedback === 'helpful' ? (
                  <>
                    <ThumbsUp className="h-3 w-3" />
                    Utile
                  </>
                ) : (
                  <>
                    <ThumbsDown className="h-3 w-3" />
                    Pas utile
                  </>
                )}
              </Badge>
            </div>
          )}

          {/* Notes preview */}
          {notes && (
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <MessageSquare className="h-3 w-3" />
                Votre note
              </div>
              <p className="text-sm line-clamp-2">{notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecommendationCard;
