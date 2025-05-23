
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Smile } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';

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
    'Joie & Bonheur': ['😊', '😀', '😁', '😄', '🥰', '😍', '🤗', '😆', '😂', '🥳'],
    'Tristesse & Mélancolie': ['😢', '😭', '😞', '😔', '😕', '🥺', '😪', '😌', '😴', '💔'],
    'Colère & Frustration': ['😠', '😡', '🤬', '😤', '😾', '👿', '💢', '🔥', '😒', '🙄'],
    'Peur & Anxiété': ['😨', '😰', '😱', '🥶', '😵', '🤯', '😖', '😓', '😷', '🤒'],
    'Surprise & Émerveillement': ['😮', '😯', '😲', '🤩', '😍', '🤔', '🧐', '💭', '✨', '🌟'],
    'Calme & Sérénité': ['😌', '😊', '🙂', '😇', '🧘', '🕯️', '🌸', '🍃', '💆', '🛀']
  };

  const toggleEmoji = (emoji: string) => {
    setSelectedEmojis(prev => 
      prev.includes(emoji) 
        ? prev.filter(e => e !== emoji)
        : [...prev, emoji]
    );
  };

  const analyzeEmojis = async () => {
    if (selectedEmojis.length === 0) {
      toast.error('Veuillez sélectionner au moins un emoji');
      return;
    }

    try {
      setIsProcessing(true);
      
      const { data, error } = await supabase.functions.invoke('emotion-analysis', {
        body: { emojis: selectedEmojis.join(' '), type: 'emoji' }
      });

      if (error) throw error;

      const result: EmotionResult = {
        id: crypto.randomUUID(),
        user_id: '',
        emojis: selectedEmojis.join(' '),
        score: data.score || 50,
        date: new Date().toISOString(),
        ai_feedback: data.feedback || 'Analyse des émojis complétée'
      };

      onScanComplete(result);
      toast.success('Analyse des émojis terminée !');
    } catch (error) {
      console.error('Error analyzing emojis:', error);
      toast.error('Erreur lors de l\'analyse des émojis');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">
          Sélectionnez les émojis qui représentent votre état actuel
        </Label>
        <p className="text-sm text-muted-foreground mt-1">
          Vous pouvez choisir plusieurs émojis pour une analyse plus précise
        </p>
      </div>

      {selectedEmojis.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h4 className="font-medium text-blue-900 mb-2">Émojis sélectionnés :</h4>
          <div className="text-3xl space-x-2">
            {selectedEmojis.map((emoji, index) => (
              <span key={index}>{emoji}</span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(emojiCategories).map(([category, emojis]) => (
          <div key={category}>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">
              {category}
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {emojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant={selectedEmojis.includes(emoji) ? "default" : "outline"}
                  className={`h-12 w-12 text-2xl p-0 ${
                    selectedEmojis.includes(emoji) 
                      ? 'bg-blue-500 hover:bg-blue-600 scale-110' 
                      : 'hover:scale-105'
                  } transition-transform`}
                  onClick={() => toggleEmoji(emoji)}
                  disabled={isProcessing}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <Button 
          onClick={analyzeEmojis}
          disabled={selectedEmojis.length === 0 || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Smile className="h-4 w-4 mr-2" />
          )}
          Analyser les émojis ({selectedEmojis.length})
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default EmojiEmotionScanner;
