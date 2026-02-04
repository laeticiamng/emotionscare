/**
 * EmpathicReplySuggestions - Suggestions de réponses empathiques IA
 * Génère des réponses bienveillantes pour la communauté
 */

import { memo, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Sparkles, Copy, Check, RefreshCw, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SuggestedReply {
  id: string;
  text: string;
  tone: 'supportive' | 'encouraging' | 'validating' | 'curious';
  confidence: number;
}

interface EmpathicReplySuggestionsProps {
  originalMessage: string;
  authorName?: string;
  onSelectReply?: (reply: string) => void;
  className?: string;
}

const TONE_LABELS: Record<string, { label: string; color: string }> = {
  supportive: { label: 'Soutien', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  encouraging: { label: 'Encouragement', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  validating: { label: 'Validation', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  curious: { label: 'Curiosité', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
};

const EMPATHIC_TEMPLATES: Record<string, string[]> = {
  supportive: [
    "Je comprends ce que tu traverses, et je veux que tu saches que tu n'es pas seul(e).",
    "Merci de partager ça avec nous. C'est courageux de s'ouvrir ainsi.",
    "Je suis là pour toi. Ce que tu ressens est valide et important.",
  ],
  encouraging: [
    "Tu as déjà fait tellement de chemin ! Continue, tu es sur la bonne voie.",
    "Chaque petit pas compte. Je crois en toi et en ta capacité à avancer.",
    "C'est inspirant de te voir persévérer. Tu es plus fort(e) que tu ne le penses.",
  ],
  validating: [
    "Ce que tu ressens est tout à fait normal dans cette situation.",
    "Tes émotions sont légitimes. Prends le temps dont tu as besoin.",
    "Il n'y a pas de bonne ou mauvaise façon de traverser ça.",
  ],
  curious: [
    "Comment te sens-tu maintenant que tu as partagé ça ?",
    "Qu'est-ce qui t'aiderait le plus en ce moment ?",
    "As-tu déjà essayé d'en parler avec quelqu'un de confiance ?",
  ],
};

export const EmpathicReplySuggestions = memo(function EmpathicReplySuggestions({
  originalMessage,
  authorName = 'cette personne',
  onSelectReply,
  className = '',
}: EmpathicReplySuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SuggestedReply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customReply, setCustomReply] = useState('');

  const generateSuggestions = useCallback(() => {
    setIsLoading(true);
    
    // Simulation IA - en production, appel à un LLM
    setTimeout(() => {
      const tones: Array<'supportive' | 'encouraging' | 'validating' | 'curious'> = [
        'supportive', 'encouraging', 'validating', 'curious'
      ];
      
      const newSuggestions: SuggestedReply[] = tones.map((tone, idx) => {
        const templates = EMPATHIC_TEMPLATES[tone];
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        
        return {
          id: `reply-${Date.now()}-${idx}`,
          text: randomTemplate,
          tone,
          confidence: 0.75 + Math.random() * 0.2,
        };
      });
      
      setSuggestions(newSuggestions);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleCopy = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Réponse copiée');
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleSelect = useCallback((text: string) => {
    onSelectReply?.(text);
    toast.success('Réponse sélectionnée');
  }, [onSelectReply]);

  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="h-5 w-5 text-rose-500" />
          Suggestions empathiques
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Réponses bienveillantes pour soutenir {authorName}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Message original (aperçu) */}
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            "{originalMessage}"
          </p>
        </div>

        {/* Bouton générer */}
        <Button
          onClick={generateSuggestions}
          disabled={isLoading}
          className="w-full gap-2"
          variant="outline"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {suggestions.length > 0 ? 'Régénérer' : 'Générer des suggestions'}
        </Button>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="rounded-lg border bg-card p-3 space-y-2 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <Badge className={TONE_LABELS[suggestion.tone].color}>
                    {TONE_LABELS[suggestion.tone].label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(suggestion.confidence * 100)}% pertinent
                  </span>
                </div>
                
                <p className="text-sm">{suggestion.text}</p>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(suggestion.id, suggestion.text)}
                    className="h-8"
                  >
                    {copiedId === suggestion.id ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : (
                      <Copy className="h-3 w-3 mr-1" />
                    )}
                    Copier
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleSelect(suggestion.text)}
                    className="h-8"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Utiliser
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Réponse personnalisée */}
        <div className="pt-2 border-t">
          <label className="text-sm font-medium mb-2 block">
            Ou écrivez votre réponse
          </label>
          <Textarea
            value={customReply}
            onChange={(e) => setCustomReply(e.target.value)}
            placeholder="Votre message bienveillant..."
            className="min-h-[80px]"
          />
          <Button
            className="mt-2 w-full"
            disabled={!customReply.trim()}
            onClick={() => handleSelect(customReply)}
          >
            Envoyer ma réponse
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

export default EmpathicReplySuggestions;
