import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Zap, 
  Brain,
  Palette,
  Wind,
  Star,
  Check,
  Bookmark,
  History,
  MessageSquare,
  TrendingUp,
  Clock,
  MoreHorizontal,
  Share2,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type SuggestionCategory = 'relaxation' | 'energy' | 'creativity' | 'mindfulness' | 'emotion' | 'default';

interface SuggestionHistory {
  suggestion: string;
  category: SuggestionCategory;
  acceptedAt?: string;
  savedAt?: string;
  note?: string;
  rating?: number;
}

interface SuggestionChipProps {
  suggestion?: string;
  category?: SuggestionCategory;
  priority?: 'low' | 'medium' | 'high';
  className?: string;
  onAccept?: () => void;
  onSave?: () => void;
}

const CATEGORY_CONFIG: Record<SuggestionCategory, {
  icon: React.ReactNode;
  label: string;
  gradient: string;
  bgClass: string;
}> = {
  relaxation: {
    icon: <Wind className="h-4 w-4" />,
    label: 'Relaxation',
    gradient: 'from-teal-500/10 to-cyan-500/10',
    bgClass: 'bg-teal-500/10 text-teal-700 dark:text-teal-400',
  },
  energy: {
    icon: <Zap className="h-4 w-4" />,
    label: 'Énergie',
    gradient: 'from-orange-500/10 to-amber-500/10',
    bgClass: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  },
  creativity: {
    icon: <Palette className="h-4 w-4" />,
    label: 'Créativité',
    gradient: 'from-purple-500/10 to-pink-500/10',
    bgClass: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  },
  mindfulness: {
    icon: <Brain className="h-4 w-4" />,
    label: 'Pleine conscience',
    gradient: 'from-blue-500/10 to-indigo-500/10',
    bgClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  },
  emotion: {
    icon: <Heart className="h-4 w-4" />,
    label: 'Émotions',
    gradient: 'from-rose-500/10 to-red-500/10',
    bgClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
  },
  default: {
    icon: <Sparkles className="h-4 w-4" />,
    label: 'Suggestion',
    gradient: 'from-primary/10 to-primary/5',
    bgClass: 'bg-primary/10 text-primary',
  },
};

const STORAGE_KEY = 'suggestion-history';
const SAVED_KEY = 'saved-suggestions';

export const SuggestionChip: React.FC<SuggestionChipProps> = ({
  suggestion,
  category = 'default',
  priority = 'medium',
  className,
  onAccept,
  onSave,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(0);
  const [history, setHistory] = useState<SuggestionHistory[]>([]);
  const [stats, setStats] = useState({
    totalAccepted: 0,
    totalSaved: 0,
    categoryBreakdown: {} as Record<SuggestionCategory, number>,
  });

  // Load history and stats
  useEffect(() => {
    const storedHistory = localStorage.getItem(STORAGE_KEY);
    if (storedHistory) {
      const parsed = JSON.parse(storedHistory);
      setHistory(parsed);
      
      // Calculate stats
      const accepted = parsed.filter((h: SuggestionHistory) => h.acceptedAt).length;
      const saved = parsed.filter((h: SuggestionHistory) => h.savedAt).length;
      const breakdown = parsed.reduce((acc: Record<string, number>, h: SuggestionHistory) => {
        acc[h.category] = (acc[h.category] || 0) + 1;
        return acc;
      }, {});
      
      setStats({ totalAccepted: accepted, totalSaved: saved, categoryBreakdown: breakdown });
    }
    
    // Check if current suggestion is saved
    const savedSuggestions = localStorage.getItem(SAVED_KEY);
    if (savedSuggestions && suggestion) {
      const saved = JSON.parse(savedSuggestions);
      setIsSaved(saved.some((s: SuggestionHistory) => s.suggestion === suggestion));
    }
  }, [suggestion]);

  if (!suggestion) return null;

  // Detect category from suggestion text if not provided
  const detectCategory = (): SuggestionCategory => {
    if (category !== 'default') return category;
    
    const lowerSuggestion = suggestion.toLowerCase();
    if (lowerSuggestion.includes('respir') || lowerSuggestion.includes('calme') || lowerSuggestion.includes('détent')) {
      return 'relaxation';
    }
    if (lowerSuggestion.includes('énergi') || lowerSuggestion.includes('activ') || lowerSuggestion.includes('boost')) {
      return 'energy';
    }
    if (lowerSuggestion.includes('créati') || lowerSuggestion.includes('imagin') || lowerSuggestion.includes('art')) {
      return 'creativity';
    }
    if (lowerSuggestion.includes('méditat') || lowerSuggestion.includes('conscience') || lowerSuggestion.includes('présent')) {
      return 'mindfulness';
    }
    if (lowerSuggestion.includes('émotion') || lowerSuggestion.includes('sentiment') || lowerSuggestion.includes('ressent')) {
      return 'emotion';
    }
    return 'default';
  };

  const detectedCategory = detectCategory();
  const config = CATEGORY_CONFIG[detectedCategory];

  const handleClick = () => {
    // Parse suggestion to route to appropriate module
    const lowerSuggestion = suggestion.toLowerCase();
    
    let targetRoute = '/app/consumer/home';
    
    if (lowerSuggestion.includes('silk') || lowerSuggestion.includes('écran')) {
      targetRoute = '/app/screen-silk';
    } else if (lowerSuggestion.includes('glow') || lowerSuggestion.includes('flash')) {
      targetRoute = '/app/flash-glow';
    } else if (lowerSuggestion.includes('vr') || lowerSuggestion.includes('galaxy')) {
      targetRoute = '/app/vr-galaxy';
    } else if (lowerSuggestion.includes('respir') || lowerSuggestion.includes('breath')) {
      targetRoute = '/app/breath';
    } else if (lowerSuggestion.includes('méditat') || lowerSuggestion.includes('mindful')) {
      targetRoute = '/app/mindfulness';
    } else if (lowerSuggestion.includes('music') || lowerSuggestion.includes('musiqu')) {
      targetRoute = '/app/music';
    } else if (lowerSuggestion.includes('journal')) {
      targetRoute = '/app/journal';
    }

    // Save to history
    const historyEntry: SuggestionHistory = {
      suggestion,
      category: detectedCategory,
      acceptedAt: new Date().toISOString(),
      rating,
      note,
    };
    
    const stored = localStorage.getItem(STORAGE_KEY);
    const existing = stored ? JSON.parse(stored) : [];
    const updated = [...existing, historyEntry].slice(-50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setIsAccepted(true);
    onAccept?.();
    
    toast({
      title: 'Suggestion acceptée',
      description: 'Redirection vers le module suggéré...',
    });
    
    navigate(targetRoute);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const stored = localStorage.getItem(SAVED_KEY);
    const saved = stored ? JSON.parse(stored) : [];
    
    if (isSaved) {
      const updated = saved.filter((s: SuggestionHistory) => s.suggestion !== suggestion);
      localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    } else {
      const newEntry: SuggestionHistory = {
        suggestion,
        category: detectedCategory,
        savedAt: new Date().toISOString(),
        note,
        rating,
      };
      saved.push(newEntry);
      localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
    }
    
    setIsSaved(!isSaved);
    onSave?.();
    
    toast({
      title: isSaved ? 'Suggestion retirée' : 'Suggestion sauvegardée',
      description: isSaved 
        ? 'La suggestion a été retirée de vos favoris'
        : 'Retrouvez cette suggestion dans vos favoris',
    });
  };

  const handleShare = async () => {
    const shareText = `Suggestion EmotionsCare: ${suggestion}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'EmotionsCare', text: shareText });
      } catch (err) { logger.warn('Navigator share failed', err instanceof Error ? err : undefined, 'UI'); }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: 'Copié !',
        description: 'Suggestion copiée dans le presse-papier',
      });
    }
  };

  const handleRating = (newRating: number) => {
    setRating(newRating);
    
    // Update in saved if exists
    if (isSaved) {
      const stored = localStorage.getItem(SAVED_KEY);
      if (stored) {
        const saved = JSON.parse(stored);
        const updated = saved.map((s: SuggestionHistory) => 
          s.suggestion === suggestion ? { ...s, rating: newRating } : s
        );
        localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
      }
    }
  };

  const priorityIndicator = {
    low: null,
    medium: <Star className="h-3 w-3 text-amber-500" />,
    high: (
      <div className="flex">
        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
        <Star className="h-3 w-3 text-amber-500 fill-amber-500 -ml-1" />
      </div>
    ),
  };

  return (
    <TooltipProvider>
      <Popover open={showDetails} onOpenChange={setShowDetails}>
        <div 
          className={cn(
            'group relative transition-all duration-300',
            isHovered && 'scale-[1.02]',
            className
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={cn(
            'flex items-center justify-between p-4 rounded-lg border transition-all duration-300',
            `bg-gradient-to-r ${config.gradient}`,
            'hover:shadow-md hover:border-primary/30',
            isAccepted && 'opacity-60'
          )}>
            <div className="flex items-start gap-3 flex-1">
              {/* Category icon */}
              <div className={cn(
                'p-2 rounded-full transition-all duration-300',
                config.bgClass,
                isHovered && 'scale-110'
              )}>
                {config.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Header with category and priority */}
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className={cn('text-xs', config.bgClass)}>
                    {config.label}
                  </Badge>
                  {priorityIndicator[priority]}
                  {rating > 0 && (
                    <div className="flex items-center gap-0.5">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Suggestion text */}
                <p className={cn(
                  'text-sm text-foreground leading-relaxed',
                  isAccepted && 'line-through'
                )}>
                  {suggestion}
                </p>

                {/* Note preview */}
                {note && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    <MessageSquare className="h-3 w-3 inline mr-1" />
                    {note.length > 50 ? `${note.slice(0, 50)}...` : note}
                  </p>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1 ml-3">
              {/* Save button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-8 w-8 transition-all',
                      isSaved && 'text-amber-500'
                    )}
                    onClick={handleSave}
                    aria-label={isSaved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    <Bookmark className={cn(
                      'h-4 w-4',
                      isSaved && 'fill-current'
                    )} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isSaved ? 'Retirer des favoris' : 'Sauvegarder'}
                </TooltipContent>
              </Tooltip>

              {/* More actions */}
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Plus d'options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>

              {/* Accept button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={isAccepted ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={handleClick}
                    disabled={isAccepted}
                    className={cn(
                      'h-8 w-8 transition-all',
                      !isAccepted && 'text-primary hover:text-primary/80 hover:bg-primary/10'
                    )}
                    aria-label={`Suivre la suggestion: ${suggestion}`}
                  >
                    {isAccepted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <ArrowRight className={cn(
                        'h-4 w-4 transition-transform',
                        isHovered && 'translate-x-0.5'
                      )} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isAccepted ? 'Acceptée' : 'Suivre cette suggestion'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Animated border on hover */}
          {isHovered && !isAccepted && (
            <div className="absolute inset-0 rounded-lg border-2 border-primary/30 animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Details popover */}
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {config.icon}
                <span className="font-medium">{config.label}</span>
              </div>
              <Badge variant="outline" className={config.bgClass}>
                {priority === 'high' ? 'Haute priorité' : priority === 'medium' ? 'Moyenne' : 'Basse'}
              </Badge>
            </div>

            {/* Suggestion text */}
            <p className="text-sm">{suggestion}</p>

            {/* Rating */}
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Pertinence</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={cn(
                        'h-5 w-5 transition-colors',
                        star <= rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Note personnelle</span>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ajouter une note..."
                className="min-h-[60px] text-sm"
              />
            </div>

            {/* Stats */}
            {(stats.totalAccepted > 0 || stats.totalSaved > 0) && (
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <TrendingUp className="h-3 w-3" />
                  Vos statistiques
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div>
                    <div className="font-bold text-primary">{stats.totalAccepted}</div>
                    <div className="text-muted-foreground">Acceptées</div>
                  </div>
                  <div>
                    <div className="font-bold text-primary">{stats.totalSaved}</div>
                    <div className="text-muted-foreground">Sauvegardées</div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Partager
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={handleClick}
                disabled={isAccepted}
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                {isAccepted ? 'Acceptée' : 'Accepter'}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default SuggestionChip;
