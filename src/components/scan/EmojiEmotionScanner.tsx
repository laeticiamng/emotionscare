
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmotionResult, EmotionScannerProps } from '@/types/emotion';
import { Smile, Sparkles } from 'lucide-react';

const EmojiEmotionScanner: React.FC<EmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);

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

    // Simuler l'analyse des émojis
    setTimeout(() => {
      // Logique simple d'analyse basée sur les émojis sélectionnés
      const emotionMapping: Record<string, { name: string; intensity: number }[]> = {
        '😊': [{ name: 'Joie', intensity: 85 }],
        '😄': [{ name: 'Enthousiasme', intensity: 90 }],
        '😢': [{ name: 'Tristesse', intensity: 75 }],
        '😠': [{ name: 'Colère', intensity: 80 }],
        '😌': [{ name: 'Calme', intensity: 70 }],
        '😍': [{ name: 'Amour', intensity: 88 }],
        '😴': [{ name: 'Fatigue', intensity: 60 }],
        '😮': [{ name: 'Surprise', intensity: 75 }]
      };

      const detectedEmotions = selectedEmojis.flatMap(emoji => 
        emotionMapping[emoji] || [{ name: 'Émotion complexe', intensity: 65 }]
      );

      // Grouper et moyenner les émotions similaires
      const emotionGroups = detectedEmotions.reduce((acc, emotion) => {
        if (acc[emotion.name]) {
          acc[emotion.name].push(emotion.intensity);
        } else {
          acc[emotion.name] = [emotion.intensity];
        }
        return acc;
      }, {} as Record<string, number[]>);

      const finalEmotions = Object.entries(emotionGroups).map(([name, intensities]) => ({
        name,
        intensity: Math.round(intensities.reduce((a, b) => a + b, 0) / intensities.length)
      }));

      const mockResult: EmotionResult = {
        emotions: finalEmotions.slice(0, 3), // Prendre les 3 principales
        confidence: 85,
        timestamp: new Date(),
        recommendations: `Basé sur vos émojis sélectionnés, vous semblez exprimer ${finalEmotions[0]?.name.toLowerCase()}. C'est parfaitement normal !`,
        analysisType: 'emoji'
      };

      onScanComplete(mockResult);
      setIsProcessing(false);
    }, 2000);
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
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
