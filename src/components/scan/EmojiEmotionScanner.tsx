
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionResult } from '@/types/emotion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EmojiEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const EmojiEmotionScanner: React.FC<EmojiEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  
  const emojiCategories = {
    joy: {
      label: 'Joie & Bonheur',
      emojis: ['😊', '😃', '😄', '😁', '🥰', '😍', '🤗', '🎉', '✨', '🌟']
    },
    calm: {
      label: 'Calme & Sérénité',
      emojis: ['😌', '😇', '🧘‍♀️', '🧘‍♂️', '😴', '💤', '🌸', '🍃', '☁️', '🕊️']
    },
    sadness: {
      label: 'Tristesse',
      emojis: ['😢', '😭', '😞', '😔', '😟', '🥺', '💔', '😥', '😪', '🌧️']
    },
    anger: {
      label: 'Colère & Frustration',
      emojis: ['😠', '😡', '🤬', '😤', '💢', '🔥', '⚡', '😾', '👿', '🌪️']
    },
    fear: {
      label: 'Peur & Anxiété',
      emojis: ['😰', '😨', '😱', '🫨', '😧', '😦', '🙈', '💊', '🌀', '❗']
    },
    surprise: {
      label: 'Surprise',
      emojis: ['😮', '😯', '😲', '🤯', '😳', '🫢', '🎊', '💥', '✨', '🎁']
    },
    love: {
      label: 'Amour & Affection',
      emojis: ['❤️', '💕', '💖', '💗', '💝', '😘', '🥰', '💑', '👨‍❤️‍👩', '🌹']
    }
  };
  
  const handleEmojiClick = (emoji: string) => {
    setSelectedEmojis(prev => {
      if (prev.includes(emoji)) {
        return prev.filter(e => e !== emoji);
      } else if (prev.length < 5) {
        return [...prev, emoji];
      } else {
        toast.error('Maximum 5 émojis sélectionnés');
        return prev;
      }
    });
  };
  
  const analyzeEmojis = async () => {
    if (selectedEmojis.length === 0) {
      toast.error('Veuillez sélectionner au moins un émoji');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Analyser les émojis sélectionnés
      const emotionMapping = {
        '😊': 'joy', '😃': 'joy', '😄': 'joy', '😁': 'joy', '🥰': 'love', '😍': 'love',
        '😌': 'calm', '😇': 'calm', '🧘‍♀️': 'calm', '🧘‍♂️': 'calm',
        '😢': 'sadness', '😭': 'sadness', '😞': 'sadness', '😔': 'sadness',
        '😠': 'anger', '😡': 'anger', '🤬': 'anger', '😤': 'anger',
        '😰': 'fear', '😨': 'fear', '😱': 'fear', '😧': 'fear',
        '😮': 'surprise', '😯': 'surprise', '😲': 'surprise', '🤯': 'surprise'
      };
      
      // Compter les émotions
      const emotionCounts = {};
      selectedEmojis.forEach(emoji => {
        const emotion = emotionMapping[emoji] || 'calm';
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
      
      // Trouver l'émotion dominante
      const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => 
        emotionCounts[a] > emotionCounts[b] ? a : b
      );
      
      const intensity = Math.min(selectedEmojis.length / 5, 1);
      
      const result: EmotionResult = {
        emotion: dominantEmotion,
        intensity,
        source: 'emoji',
        score: Math.floor(intensity * 100),
        ai_feedback: generateEmojiFeedback(dominantEmotion, selectedEmojis),
        date: new Date().toISOString()
      };
      
      onScanComplete(result);
      toast.success('Analyse des émojis terminée');
    } catch (error) {
      console.error('Erreur lors de l\'analyse des émojis:', error);
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const generateEmojiFeedback = (emotion: string, emojis: string[]): string => {
    const messages = {
      joy: 'Vos émojis reflètent un état de joie et de bonheur ! C\'est merveilleux de vous sentir ainsi.',
      calm: 'Vos émojis expriment un état de calme et de sérénité. Vous semblez en paix avec vous-même.',
      sadness: 'Vos émojis reflètent de la tristesse. C\'est important de reconnaître et d\'accepter ces sentiments.',
      anger: 'Vos émojis expriment de la colère ou de la frustration. Prenez le temps de respirer profondément.',
      fear: 'Vos émojis montrent de l\'anxiété ou de la peur. Rappelez-vous que ces sentiments sont temporaires.',
      love: 'Vos émojis débordent d\'amour et d\'affection. Continuez à cultiver ces sentiments positifs.',
      surprise: 'Vos émojis expriment de la surprise ! Vous vivez peut-être quelque chose d\'inattendu.'
    };
    
    return messages[emotion] || 'Vos émojis révèlent un mélange intéressant d\'émotions.';
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sélection d'émojis</CardTitle>
          <CardDescription>
            Choisissez jusqu'à 5 émojis qui représentent le mieux votre état émotionnel actuel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedEmojis.length > 0 && (
            <div className="p-4 bg-muted/20 rounded-md">
              <div className="text-sm font-medium mb-2">Émojis sélectionnés ({selectedEmojis.length}/5) :</div>
              <div className="flex flex-wrap gap-2">
                {selectedEmojis.map((emoji, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleEmojiClick(emoji)}
                    className="text-2xl p-2 h-auto"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {Object.entries(emojiCategories).map(([category, data]) => (
              <div key={category}>
                <h3 className="text-sm font-medium mb-2">{data.label}</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {data.emojis.map((emoji, index) => (
                    <Button
                      key={index}
                      variant={selectedEmojis.includes(emoji) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleEmojiClick(emoji)}
                      className="text-2xl p-2 h-auto aspect-square"
                      disabled={isProcessing}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Annuler
        </Button>
        <Button 
          onClick={analyzeEmojis} 
          disabled={isProcessing || selectedEmojis.length === 0}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            'Analyser mes émojis'
          )}
        </Button>
      </div>
    </div>
  );
};

export default EmojiEmotionScanner;
