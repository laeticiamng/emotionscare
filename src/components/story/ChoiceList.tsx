import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Sparkles } from 'lucide-react';
import { type StoryChoice } from '@/store/story.store';

interface ChoiceListProps {
  items: StoryChoice[];
  onSelect: (choiceId: string) => void;
  disabled?: boolean;
  className?: string;
}

const ChoiceList: React.FC<ChoiceListProps> = ({ 
  items, 
  onSelect, 
  disabled = false,
  className = '' 
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  // Gestion clavier (1-4 + Enter)
  useEffect(() => {
    if (disabled || items.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si on est dans un input
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || 
          (e.target as HTMLElement)?.tagName === 'TEXTAREA') {
        return;
      }

      const key = e.key;
      
      // Chiffres 1-4
      if (key >= '1' && key <= '4') {
        const index = parseInt(key) - 1;
        if (index < items.length) {
          e.preventDefault();
          onSelect(items[index].id);
        }
      }
      
      // Flèches + Enter pour navigation
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        e.preventDefault();
        const buttons = listRef.current?.querySelectorAll('button');
        if (buttons && buttons.length > 0) {
          const focused = document.activeElement as HTMLButtonElement;
          let index = Array.from(buttons).indexOf(focused);
          
          if (key === 'ArrowDown') {
            index = index < 0 ? 0 : Math.min(index + 1, buttons.length - 1);
          } else {
            index = index < 0 ? buttons.length - 1 : Math.max(index - 1, 0);
          }
          
          buttons[index]?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [items, onSelect, disabled]);

  // Auto-focus sur le premier élément quand les choix arrivent
  useEffect(() => {
    if (items.length > 0 && !disabled) {
      const firstButton = listRef.current?.querySelector('button');
      if (firstButton && document.activeElement === document.body) {
        // Délai pour laisser le temps au screen reader d'annoncer les choix
        setTimeout(() => {
          firstButton.focus();
        }, 500);
      }
    }
  }, [items.length, disabled]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div 
      ref={listRef}
      className={`choice-list space-y-3 ${className}`}
      role="radiogroup"
      aria-label="Choix d'histoire"
    >
      <div 
        className="text-sm text-muted-foreground text-center mb-4"
        aria-live="polite"
        aria-atomic="true"
      >
        {items.length === 1 ? 
          "Une voie s'ouvre..." : 
          `${items.length} voies s'offrent à toi`
        }
      </div>

      {items.map((choice, index) => {
        const shortcut = index + 1;
        const isGritChoice = choice.label.toLowerCase().includes('courage') || 
                           choice.label.toLowerCase().includes('persévér') ||
                           choice.label.toLowerCase().includes('résist');

        return (
          <Button
            key={choice.id}
            variant="outline"
            size="lg"
            disabled={disabled}
            onClick={() => onSelect(choice.id)}
            className={`
              w-full text-left justify-start p-6 h-auto
              hover:bg-primary/5 hover:border-primary/30
              focus:ring-2 focus:ring-primary focus:border-primary
              transition-all duration-200
              ${isGritChoice ? 'border-primary/20 bg-primary/5' : ''}
            `}
            role="radio"
            aria-checked="false"
            aria-describedby={`choice-shortcut-${choice.id}`}
          >
            <div className="flex items-start justify-between w-full gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className="text-xs font-mono bg-muted"
                  >
                    {shortcut}
                  </Badge>
                  {isGritChoice && (
                    <div className="flex items-center gap-1 text-primary">
                      <Sparkles className="h-3 w-3" />
                      <span className="text-xs">Moment clé</span>
                    </div>
                  )}
                </div>
                <p className="text-sm leading-relaxed font-medium">
                  {choice.label}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
            </div>
            
            <span 
              id={`choice-shortcut-${choice.id}`}
              className="sr-only"
            >
              Raccourci clavier : {shortcut}
            </span>
          </Button>
        );
      })}

      {/* Instructions clavier */}
      <div className="text-xs text-muted-foreground text-center mt-4 space-y-1">
        <p>💡 Utilisez les touches 1-{items.length} ou les flèches + Entrée</p>
        {items.some((choice, i) => 
          choice.label.toLowerCase().includes('courage') || 
          choice.label.toLowerCase().includes('persévér')
        ) && (
          <p className="flex items-center justify-center gap-1 text-primary/80">
            <Sparkles className="h-3 w-3" />
            <span>Les moments clés développent ta résilience</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ChoiceList;