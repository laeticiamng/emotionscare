// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, X, Clock, ThumbsUp, ThumbsDown, 
  Share2, History, Star, Sparkles, MoreVertical 
} from 'lucide-react';
import { useRouter } from '@/hooks/router';
import { useDashboardStore } from '@/store/dashboard.store';
import { Nudge } from '@/store/dashboard.store';
import { logger } from '@/lib/logger';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

const HISTORY_KEY = 'nudge_history';
const FEEDBACK_KEY = 'nudge_feedback';
const SNOOZED_KEY = 'nudge_snoozed';

interface NudgeHistory {
  id: string;
  text: string;
  emoji?: string;
  deeplink: string;
  timestamp: string;
  action: 'accepted' | 'dismissed' | 'snoozed';
  feedback?: 'helpful' | 'not_helpful';
}

interface NudgeCardProps {
  nudge: Nudge;
}

/**
 * Carte de suggestion contextuelle enrichie
 */
export const NudgeCard: React.FC<NudgeCardProps> = ({ nudge }) => {
  const router = useRouter();
  const { setNudge } = useDashboardStore();
  const { toast } = useToast();
  
  const [history, setHistory] = useState<NudgeHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'helpful' | 'not_helpful' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [snoozeUntil, setSnoozeUntil] = useState<Date | null>(null);

  // Load saved data
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    const savedFeedback = localStorage.getItem(FEEDBACK_KEY);
    const savedSnoozed = localStorage.getItem(SNOOZED_KEY);
    
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedFeedback) {
      const feedback = JSON.parse(savedFeedback);
      if (feedback[nudge.deeplink]) {
        setFeedbackGiven(feedback[nudge.deeplink]);
      }
    }
    if (savedSnoozed) {
      const snoozed = JSON.parse(savedSnoozed);
      if (snoozed[nudge.deeplink] && new Date(snoozed[nudge.deeplink]) > new Date()) {
        setSnoozeUntil(new Date(snoozed[nudge.deeplink]));
      }
    }
  }, [nudge.deeplink]);

  // Check if snoozed
  if (snoozeUntil && snoozeUntil > new Date()) {
    return null;
  }

  const saveToHistory = (action: NudgeHistory['action']) => {
    const entry: NudgeHistory = {
      id: Date.now().toString(),
      text: nudge.text,
      emoji: nudge.emoji,
      deeplink: nudge.deeplink,
      timestamp: new Date().toISOString(),
      action,
      feedback: feedbackGiven || undefined
    };
    
    const newHistory = [entry, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const handleNudgeClick = () => {
    setIsAnimating(true);
    saveToHistory('accepted');
    
    // Analytics tracking
    logger.info('Nudge accepted:', { deeplink: nudge.deeplink });
    
    setTimeout(() => {
      router.push(nudge.deeplink);
      setNudge(null);
    }, 300);
  };

  const handleDismiss = () => {
    saveToHistory('dismissed');
    logger.info('Nudge dismissed');
    setNudge(null);
  };

  const handleSnooze = (minutes: number) => {
    const snoozeTime = new Date(Date.now() + minutes * 60 * 1000);
    
    const savedSnoozed = localStorage.getItem(SNOOZED_KEY);
    const snoozed = savedSnoozed ? JSON.parse(savedSnoozed) : {};
    snoozed[nudge.deeplink] = snoozeTime.toISOString();
    localStorage.setItem(SNOOZED_KEY, JSON.stringify(snoozed));
    
    saveToHistory('snoozed');
    logger.info('Nudge snoozed:', { minutes });
    
    toast({
      title: '⏰ Rappel programmé',
      description: `Cette suggestion reviendra dans ${minutes} minutes`
    });
    
    setNudge(null);
  };

  const handleFeedback = (type: 'helpful' | 'not_helpful') => {
    setFeedbackGiven(type);
    
    const savedFeedback = localStorage.getItem(FEEDBACK_KEY);
    const feedback = savedFeedback ? JSON.parse(savedFeedback) : {};
    feedback[nudge.deeplink] = type;
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
    
    logger.info('Nudge feedback:', { type, deeplink: nudge.deeplink });
    
    toast({
      title: type === 'helpful' ? '👍 Merci !' : '👎 Merci pour le retour',
      description: type === 'helpful' 
        ? 'Nous vous proposerons plus de suggestions similaires'
        : 'Nous améliorerons nos suggestions'
    });
  };

  const handleShare = async () => {
    const shareText = `💡 Suggestion bien-être : ${nudge.text} - EmotionsCare`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // Cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({ title: 'Copié !', description: 'Suggestion copiée' });
    }
  };

  // Stats from history
  const acceptedCount = history.filter(h => h.action === 'accepted').length;
  const helpfulCount = history.filter(h => h.feedback === 'helpful').length;

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ 
          opacity: isAnimating ? 0 : 1, 
          y: isAnimating ? 20 : 0, 
          scale: isAnimating ? 1.05 : 1 
        }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20 overflow-hidden">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-warning/10 border-warning/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Suggestion
                  </Badge>
                  {acceptedCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      {acceptedCount} suivies
                    </Badge>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSnooze(15)}>
                      <Clock className="h-4 w-4 mr-2" />
                      Rappeler dans 15 min
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSnooze(60)}>
                      <Clock className="h-4 w-4 mr-2" />
                      Rappeler dans 1h
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSnooze(240)}>
                      <Clock className="h-4 w-4 mr-2" />
                      Rappeler dans 4h
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowHistory(!showHistory)}>
                      <History className="h-4 w-4 mr-2" />
                      Historique ({history.length})
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Main content */}
              <div className="flex items-center gap-3">
                {nudge.emoji && (
                  <motion.div 
                    className="text-3xl flex-shrink-0"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {nudge.emoji}
                  </motion.div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {nudge.text}
                  </p>
                </div>
              </div>

              {/* Feedback section */}
              {!feedbackGiven && (
                <div className="flex items-center gap-2 pt-2 border-t border-warning/20">
                  <span className="text-xs text-muted-foreground">Cette suggestion est-elle utile ?</span>
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleFeedback('helpful')}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Utile</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleFeedback('not_helpful')}
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Pas utile</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}

              {feedbackGiven && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  {feedbackGiven === 'helpful' ? (
                    <>
                      <ThumbsUp className="h-3 w-3 text-green-500" />
                      Merci pour votre retour positif !
                    </>
                  ) : (
                    <>
                      <ThumbsDown className="h-3 w-3 text-orange-500" />
                      Nous prendrons en compte votre avis
                    </>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleNudgeClick}
                  size="sm"
                  className="flex-1 bg-warning/20 text-warning-foreground hover:bg-warning/30"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Découvrir
                </Button>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDismiss}
                      className="h-8 w-8 hover:bg-warning/20 text-muted-foreground"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ignorer</TooltipContent>
                </Tooltip>
              </div>

              {/* History section */}
              <Collapsible open={showHistory} onOpenChange={setShowHistory}>
                <CollapsibleContent>
                  <AnimatePresence>
                    {showHistory && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-warning/20"
                      >
                        <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
                          <History className="h-3 w-3" />
                          Historique récent
                        </h4>
                        
                        {history.length === 0 ? (
                          <p className="text-xs text-muted-foreground">Aucun historique</p>
                        ) : (
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {history.slice(0, 5).map((item) => (
                              <div 
                                key={item.id}
                                className="flex items-center gap-2 text-xs p-2 bg-background/50 rounded-lg"
                              >
                                <span>{item.emoji || '💡'}</span>
                                <span className="flex-1 line-clamp-1">{item.text}</span>
                                <Badge variant="outline" className="text-[10px]">
                                  {item.action === 'accepted' ? '✓' : item.action === 'snoozed' ? '⏰' : '✗'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Stats */}
                        {history.length > 0 && (
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2 pt-2 border-t border-warning/10">
                            <span>{acceptedCount} acceptées</span>
                            <span>{helpfulCount} utiles</span>
                            <span>{history.length} total</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};
