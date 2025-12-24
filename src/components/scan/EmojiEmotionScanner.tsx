// @ts-nocheck

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

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();

      // Logique d'analyse basée sur les émojis sélectionnés
      const emotionMapping: Record<string, { name: string; intensity: number; valence: number; arousal: number }> = {
        '😊': { name: 'Joie', intensity: 85, valence: 85, arousal: 60 },
        '😄': { name: 'Enthousiasme', intensity: 90, valence: 90, arousal: 80 },
        '😢': { name: 'Tristesse', intensity: 75, valence: 25, arousal: 30 },
        '😠': { name: 'Colère', intensity: 80, valence: 30, arousal: 85 },
        '😌': { name: 'Calme', intensity: 70, valence: 70, arousal: 25 },
        '😍': { name: 'Amour', intensity: 88, valence: 95, arousal: 70 },
        '😴': { name: 'Fatigue', intensity: 60, valence: 45, arousal: 15 },
        '😮': { name: 'Surprise', intensity: 75, valence: 60, arousal: 80 },
        '😰': { name: 'Anxiété', intensity: 70, valence: 30, arousal: 75 },
        '😔': { name: 'Tristesse', intensity: 65, valence: 30, arousal: 25 }
      };

      const detectedEmotions = selectedEmojis.map(emoji =>
        emotionMapping[emoji] || { name: 'Émotion complexe', intensity: 65, valence: 50, arousal: 50 }
      );

      // Grouper et moyenner les émotions
      const emotionGroups = detectedEmotions.reduce((acc, emotion) => {
        if (acc[emotion.name]) {
          acc[emotion.name].intensities.push(emotion.intensity);
          acc[emotion.name].valences.push(emotion.valence);
          acc[emotion.name].arousals.push(emotion.arousal);
        } else {
          acc[emotion.name] = {
            intensities: [emotion.intensity],
            valences: [emotion.valence],
            arousals: [emotion.arousal]
          };
        }
        return acc;
      }, {} as Record<string, { intensities: number[]; valences: number[]; arousals: number[] }>);

      const finalEmotions = Object.entries(emotionGroups).map(([name, data]) => ({
        name,
        intensity: Math.round(data.intensities.reduce((a, b) => a + b, 0) / data.intensities.length)
      }));

      // Calculate overall valence and arousal
      const avgValence = Math.round(detectedEmotions.reduce((a, e) => a + e.valence, 0) / detectedEmotions.length);
      const avgArousal = Math.round(detectedEmotions.reduce((a, e) => a + e.arousal, 0) / detectedEmotions.length);
      const mainEmotion = finalEmotions[0]?.name.toLowerCase() || 'neutral';

      // Save to Supabase
      if (user) {
        await supabase.from('emotion_scans').insert({
          user_id: user.id,
          emotion: mainEmotion,
          valence: avgValence,
          arousal: avgArousal,
          confidence: 85,
          source: 'emoji',
          notes: `Émojis: ${selectedEmojis.join(' ')}`,
          created_at: new Date().toISOString()
        });
      }

      const result: EmotionResult = {
        emotions: finalEmotions.slice(0, 3),
        emotion: mainEmotion,
        confidence: 85,
        valence: avgValence,
        arousal: avgArousal,
        timestamp: new Date(),
        recommendations: `Basé sur vos émojis sélectionnés, vous semblez exprimer ${mainEmotion}. C'est parfaitement normal !`,
        analysisType: 'emoji',
        source: 'emoji'
      };

      onScanComplete(result);
    } catch (error) {
      console.error('Error analyzing emojis:', error);
      // Fallback result
      const fallbackResult: EmotionResult = {
        emotions: [{ name: 'Neutral', intensity: 60 }],
        confidence: 70,
        timestamp: new Date(),
        recommendations: 'Analyse terminée.',
        analysisType: 'emoji'
      };
      onScanComplete(fallbackResult);
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
