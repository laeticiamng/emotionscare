import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, Lightbulb, AlertCircle, Share2, Download, BarChart3, 
  TrendingUp, Calendar, Star, History, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Sentry } from '@/lib/errors/sentry-compat';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export interface SessionFeedback {
  session_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  felt_calm?: boolean;
  felt_focused?: boolean;
  felt_relaxed?: boolean;
  experience?: string;
  notes?: string;
  timestamp?: string;
}

interface FeedbackStats {
  totalFeedbacks: number;
  averageRating: number;
  calmPercentage: number;
  focusedPercentage: number;
  relaxedPercentage: number;
  weeklyTrend: 'up' | 'down' | 'stable';
  bestDay: string;
}

interface BreathSessionFeedbackProps {
  open: boolean;
  sessionDurationSec: number;
  onClose: () => void;
  onSubmit?: (feedback: SessionFeedback) => void;
}

const STORAGE_KEY = 'breath_feedback_history';

const FeedbackQuestion: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string;
  value: boolean | undefined;
  onChange: (val: boolean) => void;
}> = ({ icon, label, description, value, onChange }) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    onClick={() => onChange(!value)}
    className={cn(
      'relative flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all',
      value
        ? 'border-primary/50 bg-primary/10'
        : 'border-border/50 bg-muted/30 hover:border-border'
    )}
  >
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div className="flex-1">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <div className={cn(
      'flex-shrink-0 h-5 w-5 rounded-full border-2 transition-all',
      value
        ? 'border-primary bg-primary'
        : 'border-muted-foreground/50'
    )}>
      {value && <div className="h-full w-full flex items-center justify-center text-primary-foreground text-xs font-bold">✓</div>}
    </div>
  </motion.button>
);

export const BreathSessionFeedback: React.FC<BreathSessionFeedbackProps> = ({
  open,
  sessionDurationSec,
  onClose,
  onSubmit,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'feedback' | 'history' | 'stats'>('feedback');
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [feltCalm, setFeltCalm] = useState<boolean | undefined>(undefined);
  const [feltFocused, setFeltFocused] = useState<boolean | undefined>(undefined);
  const [feltRelaxed, setFeltRelaxed] = useState<boolean | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState<SessionFeedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const history = JSON.parse(stored) as SessionFeedback[];
        setFeedbackHistory(history);
        calculateStats(history);
      }
    } catch (e) {
      logger.warn('Failed to load feedback history', {}, 'SESSION');
    }
  }, [open]);

  const calculateStats = (history: SessionFeedback[]) => {
    if (history.length === 0) {
      setStats(null);
      return;
    }

    const avgRating = history.reduce((sum, f) => sum + f.rating, 0) / history.length;
    const calmCount = history.filter(f => f.felt_calm).length;
    const focusedCount = history.filter(f => f.felt_focused).length;
    const relaxedCount = history.filter(f => f.felt_relaxed).length;

    // Weekly trend calculation
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
    const thisWeek = history.filter(f => f.timestamp && new Date(f.timestamp).getTime() > oneWeekAgo);
    const lastWeek = history.filter(f => f.timestamp && 
      new Date(f.timestamp).getTime() > twoWeeksAgo && 
      new Date(f.timestamp).getTime() <= oneWeekAgo
    );
    
    const thisWeekAvg = thisWeek.length > 0 
      ? thisWeek.reduce((sum, f) => sum + f.rating, 0) / thisWeek.length 
      : 0;
    const lastWeekAvg = lastWeek.length > 0 
      ? lastWeek.reduce((sum, f) => sum + f.rating, 0) / lastWeek.length 
      : 0;

    let weeklyTrend: 'up' | 'down' | 'stable' = 'stable';
    if (thisWeekAvg > lastWeekAvg + 0.3) weeklyTrend = 'up';
    else if (thisWeekAvg < lastWeekAvg - 0.3) weeklyTrend = 'down';

    // Best day calculation
    const dayStats: Record<string, { count: number; total: number }> = {};
    history.forEach(f => {
      if (f.timestamp) {
        const day = new Date(f.timestamp).toLocaleDateString('fr-FR', { weekday: 'long' });
        if (!dayStats[day]) dayStats[day] = { count: 0, total: 0 };
        dayStats[day].count++;
        dayStats[day].total += f.rating;
      }
    });
    const bestDay = Object.entries(dayStats)
      .map(([day, s]) => ({ day, avg: s.total / s.count }))
      .sort((a, b) => b.avg - a.avg)[0]?.day || 'N/A';

    setStats({
      totalFeedbacks: history.length,
      averageRating: avgRating,
      calmPercentage: Math.round((calmCount / history.length) * 100),
      focusedPercentage: Math.round((focusedCount / history.length) * 100),
      relaxedPercentage: Math.round((relaxedCount / history.length) * 100),
      weeklyTrend,
      bestDay
    });
  };

  const saveFeedbackLocally = (feedback: SessionFeedback) => {
    try {
      const newHistory = [feedback, ...feedbackHistory].slice(0, 100);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setFeedbackHistory(newHistory);
      calculateStats(newHistory);
    } catch (e) {
      logger.warn('Failed to save feedback locally', {}, 'SESSION');
    }
  };

  const handleSubmit = async () => {
    if (rating === null) return;

    setSubmitting(true);

    const feedback: SessionFeedback = {
      session_id: crypto.randomUUID(),
      rating,
      felt_calm: feltCalm,
      felt_focused: feltFocused,
      felt_relaxed: feltRelaxed,
      notes: notes || undefined,
      timestamp: new Date().toISOString()
    };

    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (authSession?.user?.id) {
        const { error } = await supabase
          .from('breath_session_feedback')
          .insert({
            user_id: authSession.user.id,
            rating,
            felt_calm: feltCalm,
            felt_focused: feltFocused,
            felt_relaxed: feltRelaxed,
            notes: notes || null,
          });

        if (error) throw error;
      }

      // Always save locally
      saveFeedbackLocally(feedback);

      logger.info('session:feedback:submitted', { rating }, 'SESSION');

      toast({
        title: 'Merci pour ton retour ! 🙏',
        description: 'Ton feedback nous aide à améliorer l\'expérience.',
      });

      onSubmit?.(feedback);
      onClose();
    } catch (error) {
      logger.error('Failed to submit feedback', error as Error, 'SESSION');
      Sentry.captureException(error);
      // Still save locally even if DB fails
      saveFeedbackLocally(feedback);
      toast({
        title: 'Feedback enregistré localement',
        description: 'La synchronisation se fera plus tard.',
        variant: 'default'
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(feedbackHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breath-feedback-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Export réussi', description: 'Historique téléchargé.' });
  };

  const handleShare = async () => {
    if (!stats) return;
    const text = `🧘 Mes séances de respiration:\n• ${stats.totalFeedbacks} séances\n• Note moyenne: ${stats.averageRating.toFixed(1)}/5\n• ${stats.calmPercentage}% de calme ressenti`;
    
    if (navigator.share) {
      await navigator.share({ title: 'Mes stats Breath', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !', description: 'Stats copiées dans le presse-papier.' });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-zero-number-check="true">
        <DialogHeader>
          <DialogTitle className="text-xl">Merci d'avoir pratiqué ! 🙏</DialogTitle>
          <DialogDescription>
            Partage ton ressenti pour nous aider à personnaliser tes futures sessions
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feedback" className="gap-2">
              <Star className="h-4 w-4" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              Historique
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feedback" className="space-y-6 mt-4">
            {/* Session Duration Info */}
            <div className="rounded-lg bg-slate-900/50 border border-slate-800/50 p-4">
              <p className="text-sm text-slate-400">Durée de ta séance</p>
              <p className="text-2xl font-semibold text-slate-100 mt-1">
                {Math.floor(sessionDurationSec / 60)}min {sessionDurationSec % 60}s
              </p>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-slate-100">Comment tu te sens ?</Label>
              <div className="flex gap-2 justify-center">
                {([1, 2, 3, 4, 5] as const).map((value) => (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRating(value)}
                    className={cn(
                      'flex items-center justify-center h-12 w-12 rounded-lg border-2 transition-all font-semibold text-lg',
                      rating === value
                        ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                        : 'border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-600'
                    )}
                    title={['Mal', 'Pas bien', 'Neutre', 'Bien', 'Excellent'][value - 1]}
                  >
                    {value}
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-500 px-2">
                <span>Mal</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Feelings */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-slate-100">Ce que tu as ressenti</Label>
              <div className="space-y-2">
                <FeedbackQuestion
                  icon={<Heart className="h-5 w-5 text-amber-400/70" />}
                  label="Plus calme"
                  description="Tu t'es senti·e plus apaisé·e et serein·e"
                  value={feltCalm}
                  onChange={setFeltCalm}
                />
                <FeedbackQuestion
                  icon={<Lightbulb className="h-5 w-5 text-cyan-400/70" />}
                  label="Plus concentré·e"
                  description="Tu as trouvé plus de clarté mentale"
                  value={feltFocused}
                  onChange={setFeltFocused}
                />
                <FeedbackQuestion
                  icon={<AlertCircle className="h-5 w-5 text-emerald-400/70" />}
                  label="Plus détendu·e"
                  description="Les tensions physiques ont diminué"
                  value={feltRelaxed}
                  onChange={setFeltRelaxed}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-slate-100">
                Notes personnelles (optionnel)
              </Label>
              <Textarea
                id="notes"
                placeholder="Partage tes impressions, ce qui t'a marqué, ou toute autre observation..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-20 bg-slate-900/50 border-slate-800/50 text-slate-100 placeholder:text-slate-500"
              />
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-100">Historique des feedbacks</h3>
                <Button variant="outline" size="sm" onClick={handleExport} disabled={feedbackHistory.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>

              {feedbackHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun historique pour le moment</p>
                  <p className="text-sm">Tes feedbacks apparaîtront ici</p>
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {feedbackHistory.slice(0, 20).map((feedback, idx) => (
                    <motion.div
                      key={feedback.session_id || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="rounded-lg bg-slate-900/30 border border-slate-800/50 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'h-4 w-4',
                                  i < feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                                )}
                              />
                            ))}
                          </div>
                          <div className="flex gap-1">
                            {feedback.felt_calm && <Badge variant="secondary" className="text-xs">Calme</Badge>}
                            {feedback.felt_focused && <Badge variant="secondary" className="text-xs">Focus</Badge>}
                            {feedback.felt_relaxed && <Badge variant="secondary" className="text-xs">Détendu</Badge>}
                          </div>
                        </div>
                        <span className="text-xs text-slate-500">
                          {feedback.timestamp ? new Date(feedback.timestamp).toLocaleDateString('fr-FR') : 'N/A'}
                        </span>
                      </div>
                      {feedback.notes && (
                        <p className="text-sm text-slate-400 mt-2 line-clamp-2">{feedback.notes}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            {stats ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-100">Tes statistiques</h3>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-4">
                    <p className="text-xs text-amber-300">Note moyenne</p>
                    <p className="text-2xl font-bold text-amber-400">{stats.averageRating.toFixed(1)}/5</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className={cn(
                        'h-3 w-3',
                        stats.weeklyTrend === 'up' ? 'text-green-400' : 
                        stats.weeklyTrend === 'down' ? 'text-red-400' : 'text-slate-400'
                      )} />
                      <span className="text-xs text-slate-400">
                        {stats.weeklyTrend === 'up' ? 'En hausse' : 
                         stats.weeklyTrend === 'down' ? 'En baisse' : 'Stable'}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-900/50 border border-slate-800/50 p-4">
                    <p className="text-xs text-slate-400">Total sessions</p>
                    <p className="text-2xl font-bold text-slate-100">{stats.totalFeedbacks}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <span className="text-xs text-slate-400">Meilleur: {stats.bestDay}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300">Ressentis les plus fréquents</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-amber-400" />
                        Calme
                      </span>
                      <span className="text-slate-400">{stats.calmPercentage}%</span>
                    </div>
                    <Progress value={stats.calmPercentage} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-cyan-400" />
                        Concentré
                      </span>
                      <span className="text-slate-400">{stats.focusedPercentage}%</span>
                    </div>
                    <Progress value={stats.focusedPercentage} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-emerald-400" />
                        Détendu
                      </span>
                      <span className="text-slate-400">{stats.relaxedPercentage}%</span>
                    </div>
                    <Progress value={stats.relaxedPercentage} className="h-2" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Pas encore de statistiques</p>
                <p className="text-sm">Complète quelques sessions pour voir tes stats</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            Plus tard
          </Button>
          {activeTab === 'feedback' && (
            <Button
              onClick={handleSubmit}
              disabled={rating === null || submitting}
              className="bg-amber-600/80 hover:bg-amber-600 text-amber-50 disabled:opacity-50"
            >
              {submitting ? 'Envoi...' : 'Envoyer mon ressenti'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
