
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Emotion } from '@/types/emotion';

// Sample emotions for demonstration
const EMOTIONS = [
  { id: 'joy', name: 'Joie', emoji: '😊' },
  { id: 'calm', name: 'Calme', emoji: '😌' },
  { id: 'sad', name: 'Tristesse', emoji: '😢' },
  { id: 'angry', name: 'Colère', emoji: '😠' },
  { id: 'fearful', name: 'Peur', emoji: '😨' },
  { id: 'tired', name: 'Fatigue', emoji: '😴' }
];

interface EmotionalCheckInProps {
  onEmotionSelected?: (emotion: string, intensity: number) => void;
  compact?: boolean;
}

const EmotionalCheckIn: React.FC<EmotionalCheckInProps> = ({ 
  onEmotionSelected,
  compact = false
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(3);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!selectedEmotion) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une émotion",
        variant: "destructive"
      });
      return;
    }

    if (onEmotionSelected) {
      onEmotionSelected(selectedEmotion, intensity);
    }

    // Show success toast
    toast({
      title: "Check-in émotionnel enregistré",
      description: `Vous vous sentez: ${EMOTIONS.find(e => e.id === selectedEmotion)?.name} (intensité: ${intensity}/5)`
      // Remove the duration property as it's not part of the Toast type
    });

    // Reset state after submission
    setSelectedEmotion(null);
    setIntensity(3);
  };

  return (
    <Card className={compact ? 'shadow-sm' : 'shadow'}>
      <CardHeader className={compact ? 'pb-2 pt-4' : 'pb-2'}>
        <CardTitle className={compact ? 'text-lg' : 'text-xl'}>Comment vous sentez-vous ?</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {EMOTIONS.map((emotion) => (
            <Button
              key={emotion.id}
              variant={selectedEmotion === emotion.id ? "default" : "outline"}
              className="h-auto py-3 flex flex-col gap-1"
              onClick={() => setSelectedEmotion(emotion.id)}
            >
              <span className="text-2xl">{emotion.emoji}</span>
              <span className="text-xs font-normal">{emotion.name}</span>
            </Button>
          ))}
        </div>
        
        {selectedEmotion && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Intensité</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <Button
                  key={level}
                  variant={intensity === level ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setIntensity(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={!selectedEmotion}
        >
          Enregistrer mon humeur
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmotionalCheckIn;
