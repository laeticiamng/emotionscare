import { memo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

interface JournalQuickTipsProps {
  className?: string;
}

const tips = [
  {
    id: 'consistency',
    title: 'Écrivez régulièrement',
    content: 'Même 5 minutes par jour peuvent faire une grande différence. La régularité est plus importante que la longueur.',
  },
  {
    id: 'tags',
    title: 'Utilisez des tags',
    content: 'Les tags vous aident à identifier des patterns émotionnels et à retrouver facilement vos notes par thème.',
  },
  {
    id: 'voice',
    title: 'Essayez la saisie vocale',
    content: 'Parfait quand vous êtes en déplacement ou préférez parler plutôt qu\'écrire. Activez le micro dans le composer.',
  },
  {
    id: 'prompts',
    title: 'Utilisez les prompts',
    content: 'Besoin d\'inspiration ? Cliquez sur "Obtenir une suggestion" pour des idées d\'écriture guidée.',
  },
  {
    id: 'templates',
    title: 'Gagnez du temps avec les templates',
    content: 'Utilisez les templates pré-définis pour structurer vos réflexions quotidiennes, gratitudes ou objectifs.',
  },
  {
    id: 'backup',
    title: 'Sauvegardez vos données',
    content: 'Créez des backups réguliers de vos notes dans les paramètres pour ne jamais perdre vos réflexions.',
  },
  {
    id: 'coach',
    title: 'Partagez avec votre coach',
    content: 'Les notes partagées permettent à votre coach de mieux vous accompagner tout en gardant le reste privé.',
  },
  {
    id: 'analytics',
    title: 'Consultez vos statistiques',
    content: 'Le tableau de bord analytics vous montre votre progression et vos habitudes d\'écriture au fil du temps.',
  },
];

/**
 * Composant de tips rapides rotatifs pour le journal
 */
export const JournalQuickTips = memo<JournalQuickTipsProps>(({ className = '' }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const currentTip = tips[currentTipIndex];

  const handleNext = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  const handlePrevious = () => {
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <Card className={`border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{currentTip.title}</h4>
                <p className="text-sm text-muted-foreground">{currentTip.content}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={handleDismiss}
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-1">
                {tips.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      index === currentTipIndex ? 'bg-primary w-4' : 'bg-primary/30'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handlePrevious}
                  aria-label="Conseil précédent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleNext}
                  aria-label="Conseil suivant"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

JournalQuickTips.displayName = 'JournalQuickTips';
