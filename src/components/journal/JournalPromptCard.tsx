import { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { journalPromptsService, JournalPrompt } from '@/services/journalPrompts';
import { useToast } from '@/hooks/use-toast';

const CATEGORY_LABELS: Record<JournalPrompt['category'], string> = {
  reflection: 'Réflexion',
  gratitude: 'Gratitude',
  goals: 'Objectifs',
  emotions: 'Émotions',
  creativity: 'Créativité',
  mindfulness: 'Pleine conscience',
};

const CATEGORY_COLORS: Record<JournalPrompt['category'], string> = {
  reflection: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  gratitude: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  goals: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  emotions: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  creativity: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  mindfulness: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
};

interface JournalPromptCardProps {
  onUsePrompt?: (prompt: JournalPrompt) => void;
  category?: JournalPrompt['category'];
}

/**
 * Carte affichant un prompt de journal aléatoire
 * Permet de rafraîchir et d'utiliser le prompt dans le composer
 */
export function JournalPromptCard({ onUsePrompt, category }: JournalPromptCardProps) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState<JournalPrompt | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Prompt du jour
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadPrompt}
            disabled={loading}
            aria-label="Charger un nouveau prompt"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          </div>
        ) : prompt ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={CATEGORY_COLORS[prompt.category]}>
                {CATEGORY_LABELS[prompt.category]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Niveau {prompt.difficulty_level}/5
              </span>
            </div>
            <p className="text-lg leading-relaxed">{prompt.prompt_text}</p>
            <Button onClick={handleUsePrompt} className="w-full">
              Utiliser ce prompt
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Aucun prompt disponible pour le moment.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
