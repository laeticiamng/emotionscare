import { memo } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
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
  reflection: 'bg-primary/10 text-primary',
  gratitude: 'bg-green-500/10 text-green-700 dark:text-green-400',
  goals: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  emotions: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  creativity: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  mindfulness: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
};

/**
 * Carte d'affichage d'un prompt de journal avec suggestion d'écriture
 */
export const JournalPromptCard = memo<JournalPromptCardProps>(({ 
  prompt, 
  onUsePrompt, 
  onDismiss 
}) => {
  const difficultyStars = '⭐'.repeat(prompt.difficulty_level);

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className={categoryColors[prompt.category]}>
              {categoryLabels[prompt.category]}
            </Badge>
          </div>
          <span className="text-sm" title={`Niveau ${prompt.difficulty_level}`}>
            {difficultyStars}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-base leading-relaxed text-foreground/90">
          {prompt.prompt_text}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button 
          onClick={() => onUsePrompt(prompt.prompt_text)}
          className="flex-1"
          size="sm"
        >
          Utiliser ce prompt
        </Button>
        {onDismiss && (
          <Button 
            onClick={onDismiss}
            variant="ghost"
            size="sm"
          >
            Autre suggestion
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});

JournalPromptCard.displayName = 'JournalPromptCard';
