
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmotionResult, EmotionScannerProps } from '@/types/emotion';
import { Smile, CheckCircle } from 'lucide-react';

const EmojiEmotionScanner: React.FC<EmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);

  const emojiGroups = [
    {
      category: 'Bonheur',
      emojis: ['😊', '😄', '😁', '🥰', '😍', '🤗', '😌', '🙂']
    },
    {
      category: 'Tristesse',
      emojis: ['😢', '😭', '😞', '😔', '😟', '😿', '💔', '😪']
    },
    {
      category: 'Colère',
      emojis: ['😠', '😡', '🤬', '😤', '🙄', '😒', '🔥', '💢']
    },
    {
      category: 'Peur/Anxiété',
      emojis: ['😰', '😨', '😱', '😬', '😓', '🥺', '😵‍💫', '🫨']
    },
    {
      category: 'Surprise',
      emojis: ['😲', '😯', '🤯', '😮', '🫢', '😦', '🙀', '✨']
    },
    {
      category: 'Fatigue',
      emojis: ['😴', '🥱', '😫', '😩', '🤤', '💤', '🫠', '😶‍🌫️']
    }
  ];

  const handleEmojiSelect = (emoji: string) => {
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

    // Simulate API call delay
    setTimeout(() => {
      // Mock emotion analysis based on selected emojis
      const mockResult: EmotionResult = {
        emotions: [
          { name: 'Bien-être', intensity: 80 },
          { name: 'Satisfaction', intensity: 75 },
          { name: 'Équilibre', intensity: 85 }
        ],
        confidence: 91,
        timestamp: new Date(),
        recommendations: 'Vos émojis reflètent un état émotionnel positif. Profitez de ce moment !',
        analysisType: 'emoji'
      };

      onScanComplete(mockResult);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit">
          <Smile className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Sélection d'émojis</h3>
        <p className="text-muted-foreground">
          Choisissez les émojis qui représentent le mieux vos émotions actuelles
        </p>
      </div>

      {/* Selected Emojis */}
      {selectedEmojis.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Émojis sélectionnés :</p>
          <div className="flex justify-center space-x-2 mb-4">
            {selectedEmojis.map((emoji, index) => (
              <span key={index} className="text-2xl">
                {emoji}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Emoji Groups */}
      <div className="space-y-4">
        {emojiGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">
              {group.category}
            </h4>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {group.emojis.map((emoji, emojiIndex) => (
                <Button
                  key={emojiIndex}
                  variant={selectedEmojis.includes(emoji) ? "default" : "outline"}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="h-12 w-12 text-2xl p-0 relative"
                  disabled={isProcessing}
                >
                  {emoji}
                  {selectedEmojis.includes(emoji) && (
                    <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                      <CheckCircle className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
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
              <Smile className="mr-2 h-4 w-4" />
              Analyser ({selectedEmojis.length})
            </>
          )}
        </Button>
      </div>

      {/* Tips */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Comment bien utiliser cette analyse :</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Sélectionnez plusieurs émojis pour plus de précision</li>
          <li>• Choisissez des émotions de différentes catégories si nécessaire</li>
          <li>• Fiez-vous à votre ressenti du moment présent</li>
          <li>• N'hésitez pas à mélanger émotions positives et négatives</li>
        </ul>
      </div>
    </div>
  );
};

export default EmojiEmotionScanner;
