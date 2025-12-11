import { useState, useEffect, useCallback } from 'react';
import { Lightbulb, RefreshCw, Heart, Clock, Star, ChevronDown, ChevronUp, Bookmark, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

/**
 * Carte affichant un prompt de journal aléatoire
 * Permet de rafraîchir, favoriser et utiliser le prompt dans le composer
 */
export function JournalPromptCard({ 
  onUsePrompt, 
  category,
  showHistory = true,
  showFavorites = true,
}: JournalPromptCardProps) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState<JournalPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<JournalPrompt[]>([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [usedToday, setUsedToday] = useState(0);

  // Load favorites and history from localStorage
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
  }, []);

  // Save favorites to localStorage
  const saveFavorites = useCallback((newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  }, []);

  // Save history to localStorage
  const saveToHistory = useCallback((newPrompt: JournalPrompt) => {
    setHistory(prev => {
      const updated = [newPrompt, ...prev.filter(p => p.id !== newPrompt.id)].slice(0, 10);
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      const dates = savedHistory ? JSON.parse(savedHistory).dates || [] : [];
      dates.unshift(new Date().toDateString());
      
      localStorage.setItem(HISTORY_KEY, JSON.stringify({ 
        prompts: updated,
        dates: dates.slice(0, 100)
      }));
      
      return updated;
    });
  }, []);

  useEffect(() => {
    loadPrompt();
  }, [category]);

  const loadPrompt = async () => {
    try {
      setLoading(true);
      const data = await journalPromptsService.getRandomPrompt(category);
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

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-primary/10">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            Prompt du jour
          </CardTitle>
          <div className="flex items-center gap-1">
            {showHistory && history.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Historique</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <TooltipProvider>
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
            </TooltipProvider>
          </div>
        </div>

        {/* Daily usage indicator */}
        {usedToday > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {usedToday} utilisé{usedToday > 1 ? 's' : ''} aujourd'hui
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* History panel */}
        {showHistoryPanel && history.length > 0 && (
          <div className="p-3 bg-muted/50 rounded-lg space-y-2 animate-fade-in">
            <div className="text-xs text-muted-foreground font-medium mb-2">
              Prompts récents
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {history.map((historyPrompt) => (
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <DifficultyStars level={prompt.difficulty_level} />
                  </TooltipTrigger>
                  <TooltipContent>
                    Difficulté {prompt.difficulty_level}/5
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                <TooltipProvider>
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
                </TooltipProvider>
              )}
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
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Aucun prompt disponible pour le moment.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default JournalPromptCard;
