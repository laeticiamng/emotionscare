import { useEffect, useState, useCallback } from 'react';
import type { MicroGesture } from '@/features/mood/useSamOrchestration';
import { useAIMicroGestures, type AIMicroGesture } from '@/hooks/useAIMicroGestures';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

interface MicroGestesProps {
  gestures: MicroGesture[];
  summary?: string;
  emotion?: string;
  valence?: number;
  arousal?: number;
}

const icons: Record<MicroGesture['id'], string> = {
  long_exhale: '🌬️',
  drop_shoulders: '🫱',
  soft_movement: '🌀',
  gratitude_prompt: '💛',
};

const MicroGestes: React.FC<MicroGestesProps> = ({ 
  gestures, 
  summary, 
  emotion,
  valence = 50,
  arousal = 50 
}) => {
  const { isLoading, suggestions, generateSuggestions, reset } = useAIMicroGestures();
  const [lastEmotion, setLastEmotion] = useState<string | undefined>(undefined);
  
  const hasGestures = gestures.length > 0;
  const hasAISuggestions = suggestions && suggestions.gestures.length > 0;

  // Régénérer automatiquement quand l'émotion change
  useEffect(() => {
    if (!emotion) {
      return;
    }

    // Si l'émotion a changé, reset et régénérer
    if (emotion !== lastEmotion) {
      setLastEmotion(emotion);
      reset();
      
      // Délai court pour éviter les appels trop rapprochés
      const timer = setTimeout(() => {
        generateSuggestions({ emotion, valence, arousal });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [emotion, valence, arousal, lastEmotion, generateSuggestions, reset]);

  // On n'utilise plus displayGestures - on utilise directement suggestions.gestures ou gestures

  const displaySummary = suggestions?.summary || summary;

  const handleRegenerate = () => {
    if (emotion) {
      reset();
      setTimeout(() => {
        generateSuggestions({ emotion, valence, arousal });
      }, 100);
    }
  };

  return (
    <section id="micro-gestes-section" data-section="micro-gestes" className="rounded-3xl border border-transparent bg-white/5 p-6 shadow-lg backdrop-blur mood-surface dark:bg-slate-800/40">
      <header className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Micro-gestes suggérés</h2>
            {isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Génération en cours...</span>
              </div>
            )}
            {hasAISuggestions && !isLoading && (
              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                <span>IA</span>
              </div>
            )}
          </div>
          
          {/* Bouton Régénérer */}
          {emotion && !isLoading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerate}
              className="gap-1.5 text-xs"
            >
              <Sparkles className="h-3 w-3" />
              Régénérer
            </Button>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground">
          {hasAISuggestions 
            ? 'Suggestions personnalisées générées automatiquement par IA en fonction de votre état'
            : 'Des invitations corporelles légères pour accompagner l\'état perçu.'
          }
        </p>
        
        {displaySummary && (
          <p className="mt-2 rounded-2xl bg-background/60 px-4 py-3 text-sm font-medium text-foreground shadow-inner" aria-live="polite">
            {displaySummary}
          </p>
        )}
      </header>

      <div className="mt-6 space-y-4">
        {hasAISuggestions && suggestions?.gestures ? (
          // Affichage enrichi des suggestions IA
          suggestions.gestures.map((gesture, index) => (
            <div
              key={index}
              className="flex gap-4 rounded-2xl border border-primary/20 bg-background/60 p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <span className="text-3xl flex-shrink-0" aria-hidden>
                {gesture.icon}
              </span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{gesture.label}</p>
                  <span className="text-xs text-muted-foreground">{gesture.duration}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {gesture.description}
                </p>
              </div>
            </div>
          ))
        ) : hasGestures ? (
          // Affichage classique des gestes statiques
          <div className="grid gap-4 md:grid-cols-2">
            {gestures.map((gesture) => (
              <div
                key={gesture.id}
                className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-background/60 p-4 shadow-sm transition-colors hover:border-primary/40"
              >
                <span className="text-2xl" aria-hidden>
                  {icons[gesture.id] ?? '✨'}
                </span>
                <p className="text-sm font-medium text-foreground">{gesture.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-primary/30 bg-background/50 p-4 text-sm text-muted-foreground">
            Ajustez les curseurs ou laissez la caméra capturer un instant pour débloquer des propositions.
          </p>
        )}
      </div>
    </section>
  );
};

export default MicroGestes;
