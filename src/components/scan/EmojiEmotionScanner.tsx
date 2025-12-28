// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmotionResult, EmotionScannerProps } from '@/types/emotion';
import { Smile, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { normalizeEmotionResult } from '@/types/emotion-unified';
import { logger } from '@/lib/logger';

const EmojiEmotionScanner: React.FC<EmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const emojiCategories = [
    {
      name: 'Joie',
      emojis: ['😊', '😄', '😁', '🥳', '😆', '🤗', '☺️', '😋']
    },
    {
      name: 'Tristesse',
      emojis: ['😢', '😭', '😔', '😞', '😪', '🥺', '😟', '😣']
    },
    {
      name: 'Colère',
      emojis: ['😠', '😡', '🤬', '😤', '💢', '👿', '😾', '🗯️']
    },
    {
      name: 'Surprise',
      emojis: ['😮', '😯', '😲', '🤯', '😵', '🤩', '😱', '🙄']
    },
    {
      name: 'Peur',
      emojis: ['😨', '😰', '😱', '🫣', '😧', '😦', '😵‍💫', '🥶']
    },
    {
      name: 'Calme',
      emojis: ['😌', '😴', '🧘‍♂️', '🧘‍♀️', '😶', '🙂', '😐', '💆‍♂️']
    },
    {
      name: 'Amour',
      emojis: ['😍', '🥰', '😘', '💕', '❤️', '💖', '🤗', '😚']
    },
    {
      name: 'Fatigue',
      emojis: ['😴', '🥱', '😪', '🤤', '💤', '😑', '🫠', '😵']
    }
  ];

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmojis(prev => {
      if (prev.includes(emoji)) {
        return prev.filter(e => e !== emoji);
      } else {
        return [...prev, emoji];
      }
    });
  };

  const analyzeEmojis = async () => {
    if (selectedEmojis.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Construire une description textuelle des émojis sélectionnés
      const emojiDescription = `L'utilisateur a sélectionné les émojis suivants pour décrire son état émotionnel : ${selectedEmojis.join(' ')}. Analyse les émotions exprimées par ces émojis.`;

      // Appel réel à l'edge function d'analyse textuelle
      const { data, error: invokeError } = await supabase.functions.invoke('emotion-analysis', {
        body: { text: emojiDescription, language: 'fr' }
      });

      if (invokeError) {
        throw new Error(invokeError.message || 'Erreur d\'analyse');
      }

      if (!data) {
        throw new Error('Aucune réponse de l\'analyse');
      }

      const result = normalizeEmotionResult({
        id: `emoji-${Date.now()}`,
        emotion: data.emotion || 'neutre',
        valence: (data.valence ?? 0.5) * 100,
        arousal: (data.arousal ?? 0.5) * 100,
        confidence: (data.confidence ?? 0.7) * 100,
        source: 'emoji',
        timestamp: new Date().toISOString(),
        summary: data.summary || `Émotion ${data.emotion} détectée via émojis`,
        emotions: data.emotions || {},
        recommendations: data.recommendations || []
      });

      onScanComplete(result as any);
    } catch (err) {
      logger.error('[EmojiEmotionScanner] Error:', err, 'COMPONENT');
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'analyse');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mx-auto mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full w-fit">
          <Smile className="h-8 w-8 text-yellow-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Sélection d'émojis</h3>
        <p className="text-muted-foreground">
          Choisissez les émojis qui représentent votre état actuel
        </p>
      </div>

      <div className="space-y-4">
        {/* Émojis sélectionnés */}
        {selectedEmojis.length > 0 && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Émojis sélectionnés:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedEmojis.map((emoji, index) => (
                <span
                  key={index}
                  className="text-2xl cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Grille d'émojis par catégorie */}
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {emojiCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                {category.name}
              </h4>
              <div className="grid grid-cols-8 gap-2">
                {category.emojis.map((emoji, emojiIndex) => (
                  <button
                    key={emojiIndex}
                    onClick={() => handleEmojiClick(emoji)}
                    className={`text-2xl p-2 rounded-lg transition-all hover:scale-110 ${
                      selectedEmojis.includes(emoji)
                        ? 'bg-primary/20 ring-2 ring-primary'
                        : 'hover:bg-muted/50'
                    }`}
                    disabled={isProcessing}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="flex space-x-2">
          <Button 
            onClick={onCancel} 
            variant="outline" 
            disabled={isProcessing}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button 
            onClick={analyzeEmojis}
            disabled={selectedEmojis.length === 0 || isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyser ({selectedEmojis.length})
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmojiEmotionScanner;
