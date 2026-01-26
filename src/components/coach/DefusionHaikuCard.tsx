// @ts-nocheck
/**
 * Defusion Haiku Card Component
 * Displays therapeutic haikus from the Grimoire collection
 * Enhanced with audio, favorites collection, sharing, daily suggestions
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Book, Sparkles, Heart, RefreshCw, Volume2, VolumeX,
  Share2, Download, Calendar, Star, Copy,
  BookOpen, Bookmark
} from 'lucide-react';
import { DefusionHaiku } from '@/data/defusionHaikus';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DefusionHaikuCardProps {
  haiku: DefusionHaiku;
  onNext?: () => void;
  onSave?: (haiku: DefusionHaiku) => void;
  showControls?: boolean;
  variant?: 'compact' | 'full';
}

interface SavedHaiku {
  haiku: DefusionHaiku;
  savedAt: Date;
  rating?: number;
  notes?: string;
  readCount: number;
}

interface DailyProgress {
  date: string;
  haikuIds: string[];
  reflectionNotes: string;
}

const STORAGE_KEY = 'defusion-haiku-data';

const themeColors = {
  observation: {
    bg: 'from-sky-50 to-blue-100 dark:from-sky-950 dark:to-blue-900',
    border: 'border-sky-300 dark:border-sky-700',
    text: 'text-sky-900 dark:text-sky-100',
    badge: 'bg-sky-200 text-sky-900 dark:bg-sky-800 dark:text-sky-100',
  },
  acceptance: {
    bg: 'from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900',
    border: 'border-emerald-300 dark:border-emerald-700',
    text: 'text-emerald-900 dark:text-emerald-100',
    badge: 'bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100',
  },
  presence: {
    bg: 'from-amber-50 to-yellow-100 dark:from-amber-950 dark:to-yellow-900',
    border: 'border-amber-300 dark:border-amber-700',
    text: 'text-amber-900 dark:text-amber-100',
    badge: 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100',
  },
  letting_go: {
    bg: 'from-violet-50 to-purple-100 dark:from-violet-950 dark:to-purple-900',
    border: 'border-violet-300 dark:border-violet-700',
    text: 'text-violet-900 dark:text-violet-100',
    badge: 'bg-violet-200 text-violet-900 dark:bg-violet-800 dark:text-violet-100',
  },
  values: {
    bg: 'from-rose-50 to-pink-100 dark:from-rose-950 dark:to-pink-900',
    border: 'border-rose-300 dark:border-rose-700',
    text: 'text-rose-900 dark:text-rose-100',
    badge: 'bg-rose-200 text-rose-900 dark:bg-rose-800 dark:text-rose-100',
  },
};

const themeTitles = {
  observation: 'Observer',
  acceptance: 'Accepter',
  presence: 'Présence',
  letting_go: 'Lâcher prise',
  values: 'Valeurs',
};

export const DefusionHaikuCard: React.FC<DefusionHaikuCardProps> = ({
  haiku,
  onNext,
  onSave,
  showControls = true,
  variant = 'full',
}) => {
  const [saved, setSaved] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [activeTab, setActiveTab] = useState('haiku');
  const [savedHaikus, setSavedHaikus] = useState<SavedHaiku[]>([]);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [currentRating, setCurrentRating] = useState(0);
  const [viewHistory, setViewHistory] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalRead: 0,
    streak: 0,
    favoriteTheme: '',
  });

  const colors = themeColors[haiku.theme];

  // Load saved data
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      setSavedHaikus(parsed.saved || []);
      setDailyProgress(parsed.progress || []);
      setViewHistory(parsed.viewHistory || []);
      setStats(parsed.stats || stats);
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      saved: savedHaikus,
      progress: dailyProgress,
      viewHistory,
      stats
    }));
  }, [savedHaikus, dailyProgress, viewHistory, stats]);

  // Check if already saved
  useEffect(() => {
    setSaved(savedHaikus.some(s => s.haiku.id === haiku.id));
    const savedEntry = savedHaikus.find(s => s.haiku.id === haiku.id);
    setCurrentRating(savedEntry?.rating || 0);
  }, [haiku.id, savedHaikus]);

  // Track view
  useEffect(() => {
    if (!viewHistory.includes(haiku.id)) {
      setViewHistory(prev => [haiku.id, ...prev.slice(0, 99)]);
      setStats(prev => ({ ...prev, totalRead: prev.totalRead + 1 }));
    }
  }, [haiku.id]);

  const handleSave = () => {
    if (saved) {
      setSavedHaikus(prev => prev.filter(s => s.haiku.id !== haiku.id));
      setSaved(false);
      toast.info('Retiré des favoris');
    } else {
      const newEntry: SavedHaiku = {
        haiku,
        savedAt: new Date(),
        rating: currentRating,
        readCount: 1,
      };
      setSavedHaikus(prev => [newEntry, ...prev]);
      setSaved(true);
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 2000);
      onSave?.(haiku);
      toast.success('Ajouté aux favoris');
    }
  };

  const handleRate = (rating: number) => {
    setCurrentRating(rating);
    setSavedHaikus(prev => 
      prev.map(s => s.haiku.id === haiku.id ? { ...s, rating } : s)
    );
  };

  const speakHaiku = () => {
    if ('speechSynthesis' in window) {
      if (isReading) {
        window.speechSynthesis.cancel();
        setIsReading(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(haiku.haiku.fr);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.8;
        utterance.onend = () => setIsReading(false);
        window.speechSynthesis.speak(utterance);
        setIsReading(true);
      }
    }
  };

  const handleShare = async () => {
    const text = `🌸 Haiku thérapeutique\n\n${haiku.haiku.fr}\n\n— ${haiku.title}\n\n#ACT #Mindfulness #EmotionsCare`;
    
    if (navigator.share) {
      await navigator.share({ title: haiku.title, text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Copié dans le presse-papier');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(haiku.haiku.fr);
    toast.success('Haiku copié');
  };

  const handleExport = () => {
    const data = savedHaikus.map(s => ({
      title: s.haiku.title,
      haiku: s.haiku.haiku.fr,
      theme: s.haiku.theme,
      savedAt: s.savedAt,
      rating: s.rating,
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mes-haikus-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Collection exportée');
  };

  if (variant === 'compact') {
    return (
      <Card className={cn('border-2', colors.border)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{haiku.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-sm">{haiku.title}</h4>
                <Badge className={cn('text-xs', colors.badge)}>
                  {themeTitles[haiku.theme]}
                </Badge>
              </div>
              <div className={cn('text-sm whitespace-pre-line font-serif italic', colors.text)}>
                {haiku.haiku.fr}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={speakHaiku}>
                  {isReading ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSave}>
                  <Heart className={cn('h-3 w-3', saved && 'fill-current text-red-500')} />
                </Button>
              </div>
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
      <Card className={cn('border-2 overflow-hidden relative', colors.border)}>
        {/* Sparkle animation when saved */}
        <AnimatePresence>
          {showAnimation && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    x: Math.cos((i * Math.PI) / 6) * 100,
                    y: Math.sin((i * Math.PI) / 6) * 100,
                    opacity: 0,
                    scale: 1,
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className={cn('bg-gradient-to-br', colors.bg)}>
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="haiku" className="text-xs">Haiku</TabsTrigger>
                <TabsTrigger value="collection" className="text-xs">
                  Collection ({savedHaikus.length})
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-xs">Stats</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="haiku" className="mt-0 px-6 pb-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-5xl">{haiku.icon}</div>
                  <div>
                    <h3 className={cn('text-xl font-bold', colors.text)}>{haiku.title}</h3>
                    <Badge className={cn('mt-1', colors.badge)}>
                      <Book className="w-3 h-3 mr-1" />
                      {themeTitles[haiku.theme]}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9"
                    onClick={speakHaiku}
                  >
                    {isReading ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Haiku content */}
              <div className="my-8 text-center">
                <motion.div
                  className={cn(
                    'text-xl md:text-2xl font-serif leading-relaxed whitespace-pre-line',
                    colors.text
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  {haiku.haiku.fr}
                </motion.div>

                {/* Decorative separator */}
                <div className="flex items-center justify-center gap-2 my-6">
                  <div className="h-px w-12 bg-current opacity-20" />
                  <Sparkles className="w-4 h-4 opacity-40" />
                  <div className="h-px w-12 bg-current opacity-20" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        'w-5 h-5',
                        currentRating >= star
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-muted-foreground/30'
                      )}
                    />
                  </button>
                ))}
              </div>

              {/* Description */}
              <motion.p
                className={cn('text-sm text-center mb-6 italic', colors.text, 'opacity-80')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {haiku.description}
              </motion.p>

              {/* Controls */}
              {showControls && (
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant={saved ? 'secondary' : 'default'}
                    size="sm"
                    onClick={handleSave}
                    className="gap-2"
                  >
                    <Heart className={cn('w-4 h-4', saved && 'fill-current')} />
                    {saved ? 'Sauvegardé' : 'Sauvegarder'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                    <Copy className="w-4 h-4" />
                    Copier
                  </Button>
                  {onNext && (
                    <Button variant="outline" size="sm" onClick={onNext} className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Autre haiku
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="collection" className="mt-0 px-6 pb-6">
              <ScrollArea className="h-64">
                {savedHaikus.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun haiku sauvegardé</p>
                    <p className="text-sm">Ajoutez vos favoris !</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedHaikus.map((entry, i) => {
                      const entryColors = themeColors[entry.haiku.theme];
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={cn('p-3 rounded-lg border', entryColors.border)}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{entry.haiku.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{entry.haiku.title}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 italic">
                                {entry.haiku.haiku.fr.split('\n')[0]}...
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={cn(
                                        'w-3 h-3',
                                        entry.rating && entry.rating >= star
                                          ? 'fill-yellow-500 text-yellow-500'
                                          : 'text-muted-foreground/30'
                                      )}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(entry.savedAt).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
              
              {savedHaikus.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 gap-2"
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4" />
                  Exporter ma collection
                </Button>
              )}
            </TabsContent>

            <TabsContent value="stats" className="mt-0 px-6 pb-6">
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 bg-background/50">
                  <BookOpen className="h-5 w-5 text-primary mb-1" />
                  <div className="text-2xl font-bold">{stats.totalRead}</div>
                  <p className="text-xs text-muted-foreground">Haikus lus</p>
                </Card>
                <Card className="p-3 bg-background/50">
                  <Heart className="h-5 w-5 text-red-500 mb-1" />
                  <div className="text-2xl font-bold">{savedHaikus.length}</div>
                  <p className="text-xs text-muted-foreground">Favoris</p>
                </Card>
                <Card className="p-3 bg-background/50">
                  <Calendar className="h-5 w-5 text-green-500 mb-1" />
                  <div className="text-2xl font-bold">{stats.streak}</div>
                  <p className="text-xs text-muted-foreground">Jours streak</p>
                </Card>
                <Card className="p-3 bg-background/50">
                  <Star className="h-5 w-5 text-yellow-500 mb-1" />
                  <div className="text-2xl font-bold">
                    {savedHaikus.length > 0 
                      ? (savedHaikus.reduce((sum, s) => sum + (s.rating || 0), 0) / savedHaikus.length).toFixed(1)
                      : '-'
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">Note moyenne</p>
                </Card>
              </div>

              {/* Theme distribution */}
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">Thèmes favoris</h4>
                {Object.entries(
                  savedHaikus.reduce((acc, s) => {
                    acc[s.haiku.theme] = (acc[s.haiku.theme] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([theme, count]) => {
                    const percentage = (count / savedHaikus.length) * 100;
                    return (
                      <div key={theme} className="flex items-center gap-2">
                        <span className="text-xs w-20">{themeTitles[theme as keyof typeof themeTitles]}</span>
                        <Progress value={percentage} className="flex-1 h-1.5" />
                        <span className="text-xs text-muted-foreground w-8">{count}</span>
                      </div>
                    );
                  })}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Grimoire watermark */}
        <div className="absolute bottom-2 right-2 opacity-20">
          <Book className="w-6 h-6" />
        </div>
      </Card>
    </motion.div>
  );
};

/**
 * Haiku Dialog - For displaying haiku in a modal
 */
interface DefusionHaikuDialogProps {
  haiku: DefusionHaiku | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (haiku: DefusionHaiku) => void;
  onNext?: () => void;
}

export const DefusionHaikuDialog: React.FC<DefusionHaikuDialogProps> = ({
  haiku,
  open,
  onOpenChange,
  onSave,
  onNext,
}) => {
  if (!haiku) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            className="w-full max-w-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <DefusionHaikuCard haiku={haiku} onSave={onSave} onNext={onNext} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
