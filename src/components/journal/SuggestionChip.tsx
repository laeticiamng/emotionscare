import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  Bookmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type SuggestionCategory = 'relaxation' | 'energy' | 'creativity' | 'mindfulness' | 'emotion' | 'default';

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
    
    if (lowerSuggestion.includes('silk') || lowerSuggestion.includes('écran')) {
      navigate('/app/screen-silk');
    } else if (lowerSuggestion.includes('glow') || lowerSuggestion.includes('flash')) {
      navigate('/app/flash-glow');
    } else if (lowerSuggestion.includes('vr') || lowerSuggestion.includes('galaxy')) {
      navigate('/app/vr-galaxy');
    } else if (lowerSuggestion.includes('respir') || lowerSuggestion.includes('breath')) {
      navigate('/app/breath');
    } else if (lowerSuggestion.includes('méditat') || lowerSuggestion.includes('mindful')) {
      navigate('/app/mindfulness');
    } else if (lowerSuggestion.includes('music') || lowerSuggestion.includes('musiqu')) {
      navigate('/app/music');
    } else if (lowerSuggestion.includes('journal')) {
      navigate('/app/journal');
    } else {
      navigate('/app/consumer/home');
    }

    setIsAccepted(true);
    onAccept?.();
    
    toast({
      title: 'Suggestion acceptée',
      description: 'Redirection vers le module suggéré...',
    });
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.();
    
    toast({
      title: isSaved ? 'Suggestion retirée' : 'Suggestion sauvegardée',
      description: isSaved 
        ? 'La suggestion a été retirée de vos favoris'
        : 'Retrouvez cette suggestion dans vos favoris',
    });
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
              </div>
              
              {/* Suggestion text */}
              <p className={cn(
                'text-sm text-foreground leading-relaxed',
                isAccepted && 'line-through'
              )}>
                {suggestion}
              </p>
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
    </TooltipProvider>
  );
};

export default SuggestionChip;
