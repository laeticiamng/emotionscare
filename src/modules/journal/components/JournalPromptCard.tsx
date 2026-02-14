import { memo, useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, Heart, Clock, RefreshCw, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { JournalPrompt } from '@/services/journalPrompts';

interface JournalPromptCardProps {
  prompt: JournalPrompt;
  onUsePrompt: (promptText: string) => void;
  onDismiss?: () => void;
}

const categoryLabels: Record<JournalPrompt['category'], string> = {
  reflection: 'Réflexion',
  gratitude: 'Gratitude',
  goals: 'Objectifs',
  emotions: 'Émotions',
  creativity: 'Créativité',
  mindfulness: 'Pleine conscience',
};

const categoryColors: Record<JournalPrompt['category'], string> = {
  reflection: 'bg-primary/10 text-primary border-primary/20',
  gratitude: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  goals: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  emotions: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  creativity: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  mindfulness: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20',
};

const categoryIcons: Record<JournalPrompt['category'], string> = {
  reflection: '💭',
  gratitude: '🙏',
  goals: '🎯',
  emotions: '💜',
  creativity: '🎨',
  mindfulness: '🧘',
};

const FAVORITES_KEY = 'journal_prompt_favorites';
const HISTORY_KEY = 'journal_prompt_history';

/**
 * Carte d'affichage enrichie d'un prompt de journal avec système de favoris et historique
 */
export const JournalPromptCard = memo<JournalPromptCardProps>(({ 
  prompt, 
  onUsePrompt, 
  onDismiss 
}) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [usedCount, setUsedCount] = useState(0);
  const [lastUsed, setLastUsed] = useState<string | null>(null);

  // Charger l'état depuis localStorage
  useEffect(() => {
    let favorites: string[] = [];
    try {
      favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    } catch {
      // Corrupted localStorage data
    }
    setIsFavorite(favorites.includes(prompt.id));

    let history: Record<string, { count?: number; lastUsed?: string }> = {};
    try {
      history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
    } catch {
      // Corrupted localStorage data
    }
    const promptHistory = history[prompt.id];
    if (promptHistory) {
      setUsedCount(promptHistory.count || 0);
      setLastUsed(promptHistory.lastUsed || null);
    }
  }, [prompt.id]);

  const handleFavorite = useCallback(() => {
    const newState = !isFavorite;
    setIsFavorite(newState);

    let favorites: string[] = [];
    try {
      favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    } catch {
      // Corrupted localStorage data
    }
    if (newState) {
      favorites.push(prompt.id);
    } else {
      const index = favorites.indexOf(prompt.id);
      if (index > -1) favorites.splice(index, 1);
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

    toast({
      title: newState ? 'Prompt favori ajouté' : 'Prompt retiré des favoris',
      duration: 2000,
    });
  }, [isFavorite, prompt.id, toast]);

  const handleUsePrompt = useCallback(() => {
    // Mettre à jour l'historique
    let history: Record<string, { count?: number; lastUsed?: string }> = {};
    try {
      history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
    } catch {
      // Corrupted localStorage data
    }
    const now = new Date().toISOString();
    history[prompt.id] = {
      count: (history[prompt.id]?.count || 0) + 1,
      lastUsed: now,
    };
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    setUsedCount(history[prompt.id].count);
    setLastUsed(now);

    onUsePrompt(prompt.prompt_text);
  }, [prompt.id, prompt.prompt_text, onUsePrompt]);

  const formatLastUsed = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const difficultyStars = '⭐'.repeat(prompt.difficulty_level);
  const estimatedTime = prompt.difficulty_level * 3; // Minutes estimées

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-muted/20 hover:border-primary/40 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl" role="img" aria-label={categoryLabels[prompt.category]}>
              {categoryIcons[prompt.category]}
            </span>
            <Badge variant="outline" className={categoryColors[prompt.category]}>
              {categoryLabels[prompt.category]}
            </Badge>
            {isFavorite && (
              <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                ❤️ Favori
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm cursor-help" title={`Niveau ${prompt.difficulty_level}`}>
                  {difficultyStars}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Niveau {prompt.difficulty_level}/5 • ~{estimatedTime} min
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFavorite}
                  className={`h-8 w-8 p-0 ${isFavorite ? 'text-red-500' : ''}`}
                  aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4 space-y-3">
        <p className="text-base leading-relaxed text-foreground/90">
          {prompt.prompt_text}
        </p>
        
        {/* Statistiques d'utilisation */}
        {(usedCount > 0 || lastUsed) && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/50">
            {usedCount > 0 && (
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" aria-hidden="true" />
                Utilisé {usedCount} fois
              </span>
            )}
            {lastUsed && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {formatLastUsed(lastUsed)}
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button 
          onClick={handleUsePrompt}
          className="flex-1 gap-2"
          size="sm"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Utiliser ce prompt
        </Button>
        {onDismiss && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onDismiss}
                variant="ghost"
                size="sm"
                className="gap-1"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Autre
              </Button>
            </TooltipTrigger>
            <TooltipContent>Obtenir une autre suggestion</TooltipContent>
          </Tooltip>
        )}
      </CardFooter>
    </Card>
  );
});

JournalPromptCard.displayName = 'JournalPromptCard';
