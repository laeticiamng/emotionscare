import { useState, useEffect, useCallback, memo } from 'react';
import { 
  Lightbulb, RefreshCw, Heart, Clock, Star, ChevronDown, ChevronUp, 
  Bookmark, History, Share2, TrendingUp, Filter, Download, Volume2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { journalPromptsService, JournalPrompt } from '@/services/journalPrompts';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS: Record<JournalPrompt['category'], string> = {
  reflection: 'Réflexion',
  gratitude: 'Gratitude',
  goals: 'Objectifs',
  emotions: 'Émotions',
  creativity: 'Créativité',
  mindfulness: 'Pleine conscience',
};

const CATEGORY_COLORS: Record<JournalPrompt['category'], string> = {
  reflection: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  gratitude: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  goals: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  emotions: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
  creativity: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  mindfulness: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
};

const CATEGORY_ICONS: Record<JournalPrompt['category'], string> = {
  reflection: '🪞',
  gratitude: '🙏',
  goals: '🎯',
  emotions: '💭',
  creativity: '🎨',
  mindfulness: '🧘',
};

interface JournalPromptCardProps {
  onUsePrompt?: (prompt: JournalPrompt) => void;
  category?: JournalPrompt['category'];
  showHistory?: boolean;
  showFavorites?: boolean;
}

const FAVORITES_KEY = 'journal-prompt-favorites';
const HISTORY_KEY = 'journal-prompt-history';
const STATS_KEY = 'journal-prompt-stats';

interface PromptStats {
  totalUsed: number;
  byCategory: Record<string, number>;
  favoriteCategory: string | null;
  averageDifficulty: number;
  lastUsedDate: string | null;
  streakDays: number;
}

/**
 * Carte affichant un prompt de journal aléatoire
 * Permet de rafraîchir, favoriser et utiliser le prompt dans le composer
 */
export const JournalPromptCard = memo(({ 
  onUsePrompt, 
  category,
  showHistory = true,
  showFavorites = true,
}: JournalPromptCardProps) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState<JournalPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<JournalPrompt[]>([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [usedToday, setUsedToday] = useState(0);
  const [activeTab, setActiveTab] = useState<'prompt' | 'favorites' | 'stats'>('prompt');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stats, setStats] = useState<PromptStats>({
    totalUsed: 0,
    byCategory: {},
    favoriteCategory: null,
    averageDifficulty: 0,
    lastUsedDate: null,
    streakDays: 0,
  });

  // Load favorites, history and stats from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setHistory(parsed.prompts || []);
      
      // Count prompts used today
      const today = new Date().toDateString();
      const todayCount = (parsed.dates || []).filter((d: string) => d === today).length;
      setUsedToday(todayCount);
    }

    const savedStats = localStorage.getItem(STATS_KEY);
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = useCallback((newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  }, []);

  // Save stats
  const saveStats = useCallback((newStats: PromptStats) => {
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
    setStats(newStats);
  }, []);

  // Save history to localStorage
  const saveToHistory = useCallback((newPrompt: JournalPrompt) => {
    setHistory(prev => {
      const updated = [newPrompt, ...prev.filter(p => p.id !== newPrompt.id)].slice(0, 20);
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      const dates = savedHistory ? JSON.parse(savedHistory).dates || [] : [];
      dates.unshift(new Date().toDateString());
      
      localStorage.setItem(HISTORY_KEY, JSON.stringify({ 
        prompts: updated,
        dates: dates.slice(0, 100)
      }));
      
      return updated;
    });

    // Update stats
    const today = new Date().toDateString();
    const lastDate = stats.lastUsedDate;
    const isConsecutive = lastDate && 
      new Date(lastDate).getTime() === new Date(today).getTime() - 86400000;
    
    const newByCategory = { ...stats.byCategory };
    newByCategory[newPrompt.category] = (newByCategory[newPrompt.category] || 0) + 1;
    
    const favoriteCategory = Object.entries(newByCategory)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const allDifficulties = history.map(p => p.difficulty_level);
    allDifficulties.push(newPrompt.difficulty_level);
    const avgDifficulty = allDifficulties.reduce((a, b) => a + b, 0) / allDifficulties.length;

    saveStats({
      totalUsed: stats.totalUsed + 1,
      byCategory: newByCategory,
      favoriteCategory,
      averageDifficulty: Math.round(avgDifficulty * 10) / 10,
      lastUsedDate: today,
      streakDays: isConsecutive ? stats.streakDays + 1 : 
                  lastDate === today ? stats.streakDays : 1,
    });
  }, [history, stats, saveStats]);

  useEffect(() => {
    loadPrompt();
  }, [category]);

  const loadPrompt = async () => {
    try {
      setLoading(true);
      const cat = categoryFilter !== 'all' ? categoryFilter as JournalPrompt['category'] : category;
      const data = await journalPromptsService.getRandomPrompt(cat);
      setPrompt(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger un prompt.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUsePrompt = async () => {
    if (!prompt) return;

    try {
      // Incrémenter le compteur d'utilisation
      await journalPromptsService.incrementUsage(prompt.id);

      // Save to history
      saveToHistory(prompt);
      setUsedToday(prev => prev + 1);

      // Callback pour remplir le composer
      onUsePrompt?.(prompt);

      toast({
        title: 'Prompt utilisé',
        description: 'Le prompt a été ajouté à votre note.',
      });
    } catch (error) {
      // L'incrémentation peut échouer silencieusement
      onUsePrompt?.(prompt);
    }
  };

  const toggleFavorite = () => {
    if (!prompt) return;
    
    const isFavorite = favorites.includes(prompt.id);
    if (isFavorite) {
      saveFavorites(favorites.filter(id => id !== prompt.id));
      toast({
        title: 'Retiré des favoris',
        description: 'Le prompt a été retiré de vos favoris.',
      });
    } else {
      saveFavorites([...favorites, prompt.id]);
      toast({
        title: 'Ajouté aux favoris',
        description: 'Retrouvez ce prompt dans vos favoris.',
      });
    }
  };

  const selectFromHistory = (historyPrompt: JournalPrompt) => {
    setPrompt(historyPrompt);
    setShowHistoryPanel(false);
    setActiveTab('prompt');
  };

  const handleShare = async () => {
    if (!prompt) return;
    
    const text = `📝 Prompt de journal: "${prompt.prompt_text}" #JournalEmotionnel #BienEtre`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !', description: 'Prompt copié dans le presse-papier' });
    }
  };

  const handleExportHistory = () => {
    const data = history.map(p => ({
      date: new Date().toISOString(),
      category: CATEGORY_LABELS[p.category],
      difficulty: p.difficulty_level,
      prompt: p.prompt_text,
    }));
    
    const csv = [
      'Date,Catégorie,Difficulté,Prompt',
      ...data.map(row => `"${row.date}","${row.category}",${row.difficulty},"${row.prompt}"`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompts-journal-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Exporté !', description: 'Historique téléchargé' });
  };

  const speakPrompt = () => {
    if (!prompt || !('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(prompt.prompt_text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  const isFavorite = prompt ? favorites.includes(prompt.id) : false;

  // Difficulty visualization
  const DifficultyStars = ({ level }: { level: number }) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3 w-3',
            i < level 
              ? 'text-amber-500 fill-amber-500' 
              : 'text-muted-foreground/30'
          )}
        />
      ))}
    </div>
  );

  // Filter favorites from history
  const favoritePrompts = history.filter(p => favorites.includes(p.id));

  return (
    <TooltipProvider>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-primary/10">
                <Lightbulb className="h-4 w-4 text-primary" />
              </div>
              Prompt du jour
              {stats.streakDays >= 3 && (
                <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-600">
                  🔥 {stats.streakDays}j
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-1">
              {showHistory && history.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setActiveTab(activeTab === 'favorites' ? 'prompt' : 'favorites')}
                    >
                      <Bookmark className={cn(
                        'h-4 w-4',
                        activeTab === 'favorites' && 'fill-primary text-primary'
                      )} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Favoris ({favorites.length})</TooltipContent>
                </Tooltip>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowStatsPanel(!showStatsPanel)}
                  >
                    <TrendingUp className={cn(
                      'h-4 w-4',
                      showStatsPanel && 'text-primary'
                    )} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Statistiques</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={loadPrompt}
                    disabled={loading}
                    aria-label="Charger un nouveau prompt"
                  >
                    <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Nouveau prompt</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2 mt-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {CATEGORY_ICONS[key as JournalPrompt['category']]} {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {usedToday > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {usedToday} utilisé{usedToday > 1 ? 's' : ''} aujourd'hui
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stats panel */}
          {showStatsPanel && (
            <div className="p-3 bg-muted/50 rounded-lg space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Vos statistiques</span>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleExportHistory}>
                  <Download className="h-3 w-3 mr-1" />
                  Exporter
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-background rounded">
                  <div className="text-lg font-bold">{stats.totalUsed}</div>
                  <div className="text-xs text-muted-foreground">Utilisés</div>
                </div>
                <div className="p-2 bg-background rounded">
                  <div className="text-lg font-bold">{stats.streakDays}</div>
                  <div className="text-xs text-muted-foreground">Jours série</div>
                </div>
                <div className="p-2 bg-background rounded">
                  <div className="text-lg font-bold">
                    {stats.favoriteCategory ? CATEGORY_ICONS[stats.favoriteCategory as JournalPrompt['category']] : '-'}
                  </div>
                  <div className="text-xs text-muted-foreground">Catégorie fav.</div>
                </div>
              </div>
              
              {/* Category breakdown */}
              <div className="space-y-1">
                {Object.entries(stats.byCategory).slice(0, 3).map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between text-xs">
                    <span>{CATEGORY_ICONS[cat as JournalPrompt['category']]} {CATEGORY_LABELS[cat as JournalPrompt['category']]}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorites tab */}
          {activeTab === 'favorites' && favoritePrompts.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg space-y-2 animate-fade-in">
              <div className="text-xs text-muted-foreground font-medium mb-2">
                Vos prompts favoris ({favoritePrompts.length})
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {favoritePrompts.map((favPrompt) => (
                  <button
                    key={favPrompt.id}
                    onClick={() => selectFromHistory(favPrompt)}
                    className={cn(
                      'w-full text-left p-2 rounded-md text-sm transition-colors',
                      'hover:bg-muted border border-transparent',
                      prompt?.id === favPrompt.id && 'border-primary/50 bg-primary/5'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{CATEGORY_ICONS[favPrompt.category]}</span>
                      <span className="text-xs text-muted-foreground">
                        {CATEGORY_LABELS[favPrompt.category]}
                      </span>
                      <Heart className="h-3 w-3 fill-red-500 text-red-500 ml-auto" />
                    </div>
                    <p className="text-xs line-clamp-2">{favPrompt.prompt_text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* History panel */}
          {showHistoryPanel && history.length > 0 && activeTab === 'prompt' && (
            <div className="p-3 bg-muted/50 rounded-lg space-y-2 animate-fade-in">
              <div className="text-xs text-muted-foreground font-medium mb-2">
                Prompts récents
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {history.slice(0, 5).map((historyPrompt) => (
                  <button
                    key={historyPrompt.id}
                    onClick={() => selectFromHistory(historyPrompt)}
                    className={cn(
                      'w-full text-left p-2 rounded-md text-sm transition-colors',
                      'hover:bg-muted border border-transparent',
                      prompt?.id === historyPrompt.id && 'border-primary/50 bg-primary/5'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{CATEGORY_ICONS[historyPrompt.category]}</span>
                      <span className="text-xs text-muted-foreground">
                        {CATEGORY_LABELS[historyPrompt.category]}
                      </span>
                    </div>
                    <p className="text-xs line-clamp-2">{historyPrompt.prompt_text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main prompt content */}
          {activeTab === 'prompt' && (
            <>
              {loading ? (
                <div className="space-y-3 py-4">
                  <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                </div>
              ) : prompt ? (
                <div className="space-y-4">
                  {/* Category and difficulty */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={CATEGORY_COLORS[prompt.category]}>
                        {CATEGORY_ICONS[prompt.category]} {CATEGORY_LABELS[prompt.category]}
                      </Badge>
                      {isFavorite && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                          <Heart className="h-3 w-3 fill-current" />
                        </Badge>
                      )}
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <DifficultyStars level={prompt.difficulty_level} />
                      </TooltipTrigger>
                      <TooltipContent>
                        Difficulté {prompt.difficulty_level}/5
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Prompt text */}
                  <p className="text-lg leading-relaxed py-2">{prompt.prompt_text}</p>

                  {/* Estimated time based on difficulty */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>~{prompt.difficulty_level * 3} min d'écriture suggérée</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button onClick={handleUsePrompt} className="flex-1">
                      Utiliser ce prompt
                    </Button>
                    
                    {showFavorites && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleFavorite}
                            className={cn(
                              isFavorite && 'text-red-500 border-red-200 hover:bg-red-50'
                            )}
                          >
                            <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        </TooltipContent>
                      </Tooltip>
                    )}
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={speakPrompt}>
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Lire à voix haute</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={handleShare}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Partager</TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Tips collapsible */}
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between">
                        <span className="text-xs text-muted-foreground">Conseils d'écriture</span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground space-y-2 mt-2">
                        <p>💡 Écrivez sans vous censurer pendant les premières minutes</p>
                        <p>✨ Laissez vos pensées couler naturellement</p>
                        <p>🎯 Concentrez-vous sur vos ressentis plutôt que les faits</p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* History toggle */}
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                    >
                      <History className="h-3 w-3 mr-1" />
                      {showHistoryPanel ? 'Masquer l\'historique' : `Voir l'historique (${history.length})`}
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Aucun prompt disponible pour le moment.
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
});

JournalPromptCard.displayName = 'JournalPromptCard';

export default JournalPromptCard;
