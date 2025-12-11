// @ts-nocheck
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Smile, Meh, Frown, AngryIcon, Send, Sparkles, TrendingUp, Calendar, Lightbulb } from 'lucide-react';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'emotionscare_checkins';
const MAX_HISTORY = 30;

interface CheckinEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  timestamp: string;
  suggestions?: string[];
}

interface EmotionalCheckinProps {
  onSubmit?: (data: { mood: string; intensity: number; note: string }) => void;
  className?: string;
}

const MOOD_SUGGESTIONS: Record<string, string[]> = {
  'Excellent': [
    'Super ! Profite de cette énergie pour un projet créatif.',
    'C\'est le moment parfait pour aider quelqu\'un autour de toi.',
    'Note ce qui a contribué à cet état pour le reproduire.',
  ],
  'Bien': [
    'Continue sur cette lancée avec une petite activité plaisante.',
    'Un bon moment pour planifier tes objectifs.',
    'Partage cette bonne humeur avec quelqu\'un.',
  ],
  'Neutre': [
    'Une courte marche pourrait booster ton énergie.',
    'Essaie une session de respiration de 3 minutes.',
    'Écoute une musique qui te met de bonne humeur.',
  ],
  'Difficile': [
    'Prends une pause, tu le mérites.',
    'Une session de méditation guidée peut aider.',
    'Parle à quelqu\'un de confiance.',
  ],
  'Très difficile': [
    'Ta santé mentale est prioritaire. Prends soin de toi.',
    'Essaie la technique de respiration 4-7-8.',
    'N\'hésite pas à consulter un professionnel si nécessaire.',
  ],
};

const EmotionalCheckin: React.FC<EmotionalCheckinProps> = ({ 
  onSubmit,
  className 
}) => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<CheckinEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  const moods = [
    { name: 'Excellent', icon: Heart, color: 'text-pink-500', gradient: 'from-pink-500 to-rose-500', emoji: '😊' },
    { name: 'Bien', icon: Smile, color: 'text-green-500', gradient: 'from-green-500 to-emerald-500', emoji: '🙂' },
    { name: 'Neutre', icon: Meh, color: 'text-yellow-500', gradient: 'from-yellow-500 to-amber-500', emoji: '😐' },
    { name: 'Difficile', icon: Frown, color: 'text-orange-500', gradient: 'from-orange-500 to-red-400', emoji: '😔' },
    { name: 'Très difficile', icon: AngryIcon, color: 'text-red-500', gradient: 'from-red-500 to-red-600', emoji: '😢' }
  ];

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        // Invalid data
      }
    }
  }, []);

  // Check if already checked in today
  const hasCheckedInToday = history.some(entry => {
    const entryDate = new Date(entry.timestamp).toDateString();
    return entryDate === new Date().toDateString();
  });

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    const sortedHistory = [...history].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    let currentDate = new Date();
    for (const entry of sortedHistory) {
      const entryDate = new Date(entry.timestamp).toDateString();
      if (entryDate === currentDate.toDateString()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  // Get mood trend
  const getMoodTrend = () => {
    const recentEntries = history.slice(0, 7);
    if (recentEntries.length < 2) return null;
    
    const moodValues: Record<string, number> = {
      'Excellent': 5, 'Bien': 4, 'Neutre': 3, 'Difficile': 2, 'Très difficile': 1
    };
    
    const avgRecent = recentEntries.slice(0, 3).reduce((sum, e) => sum + (moodValues[e.mood] || 3), 0) / Math.min(3, recentEntries.length);
    const avgOlder = recentEntries.slice(3).reduce((sum, e) => sum + (moodValues[e.mood] || 3), 0) / Math.max(1, recentEntries.length - 3);
    
    if (avgRecent > avgOlder + 0.5) return 'up';
    if (avgRecent < avgOlder - 0.5) return 'down';
    return 'stable';
  };

  const handleSubmit = useCallback(async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    
    try {
      const newEntry: CheckinEntry = {
        id: Date.now().toString(),
        mood: selectedMood,
        intensity,
        note,
        timestamp: new Date().toISOString(),
        suggestions: MOOD_SUGGESTIONS[selectedMood]?.slice(0, 2),
      };

      // Save to history
      const newHistory = [newEntry, ...history].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);

      await onSubmit?.({
        mood: selectedMood,
        intensity,
        note
      });
      
      toast({
        title: '✨ Check-in enregistré !',
        description: `Humeur: ${selectedMood} (${intensity}/5)`,
      });
      
      // Reset form
      setSelectedMood('');
      setIntensity(3);
      setNote('');
    } catch (error) {
      logger.error('Erreur lors de l\'envoi:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedMood, intensity, note, onSubmit, history, toast]);

  const streak = calculateStreak();
  const trend = getMoodTrend();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Check-in Émotionnel
          </CardTitle>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                🔥 {streak} jour{streak > 1 ? 's' : ''}
              </Badge>
            )}
            {hasCheckedInToday && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                ✓ Fait aujourd'hui
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Comment vous sentez-vous en ce moment ?
          </p>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Historique
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* History View */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-muted/30 rounded-lg space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">7 derniers jours</h4>
                  {trend && (
                    <Badge variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}>
                      <TrendingUp className={`h-3 w-3 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
                      {trend === 'up' ? 'En hausse' : trend === 'down' ? 'En baisse' : 'Stable'}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - i));
                    const entry = history.find(e => 
                      new Date(e.timestamp).toDateString() === date.toDateString()
                    );
                    const mood = entry ? moods.find(m => m.name === entry.mood) : null;
                    
                    return (
                      <div 
                        key={i}
                        className={`flex-1 h-10 rounded flex items-center justify-center text-lg ${
                          entry ? `bg-gradient-to-br ${mood?.gradient} text-white` : 'bg-muted'
                        }`}
                        title={entry ? `${entry.mood} - ${new Date(entry.timestamp).toLocaleDateString('fr-FR')}` : 'Pas de check-in'}
                      >
                        {entry ? mood?.emoji : '-'}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {history.length} check-ins au total
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sélection d'humeur */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Votre humeur</h4>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMood === mood.name;
              
              return (
                <motion.button
                  key={mood.name}
                  onClick={() => setSelectedMood(mood.name)}
                  className={`
                    relative p-3 rounded-xl border-2 transition-all duration-300
                    ${isSelected 
                      ? 'border-primary shadow-lg scale-105' 
                      : 'border-border hover:border-primary/50 hover:scale-102'
                    }
                  `}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                >
                  <Icon className={`h-6 w-6 mx-auto ${mood.color}`} />
                  <span className="text-xs mt-1 block">{mood.name}</span>
                  
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-10 rounded-xl`}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Intensité */}
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium">Intensité (1-5)</h4>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setIntensity(level)}
                  className={`
                    w-8 h-8 rounded-full border-2 font-medium transition-all
                    ${intensity >= level
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
            <Progress value={(intensity / 5) * 100} className="h-1" />
          </motion.div>
        )}

        {/* Suggestions basées sur l'humeur */}
        {selectedMood && MOOD_SUGGESTIONS[selectedMood] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 bg-primary/5 rounded-lg border border-primary/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Suggestion</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {MOOD_SUGGESTIONS[selectedMood][Math.floor(Math.random() * MOOD_SUGGESTIONS[selectedMood].length)]}
            </p>
          </motion.div>
        )}

        {/* Note optionnelle */}
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium">Note (optionnel)</h4>
            <Textarea
              placeholder="Qu'est-ce qui influence votre humeur aujourd'hui ?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[80px]"
            />
          </motion.div>
        )}

        {/* Bouton de soumission */}
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enregistrement...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Enregistrer mon état
                </div>
              )}
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionalCheckin;
