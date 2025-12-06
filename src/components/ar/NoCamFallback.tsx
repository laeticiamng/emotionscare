// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Smile } from 'lucide-react';
import { type Emotion } from '@/store/ar.store';
import EmotionBubble from './EmotionBubble';
import { useHumeVision } from '@/hooks/useHumeVision';

interface MoodOption {
  emotion: Emotion;
  icon: string;
  label: string;
  description: string;
}

const moodOptions: MoodOption[] = [
  { emotion: 'joy', icon: '😊', label: 'Joyeux', description: 'Je me sens bien' },
  { emotion: 'calm', icon: '😌', label: 'Calme', description: 'Paisible et serein' },
  { emotion: 'surprise', icon: '😲', label: 'Surpris', description: 'Quelque chose d\'inattendu' },
  { emotion: 'neutral', icon: '😐', label: 'Neutre', description: 'Tranquille' },
  { emotion: 'sad', icon: '😔', label: 'Mélancolique', description: 'Un peu triste' },
  { emotion: 'anger', icon: '😤', label: 'Énergique', description: 'Plein d\'énergie' },
];

interface NoCamFallbackProps {
  className?: string;
}

const NoCamFallback: React.FC<NoCamFallbackProps> = ({ className = '' }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [comment, setComment] = useState<string | null>(null);
  const { getEmotionComment, sendMetrics } = useHumeVision();

  const handleMoodSelect = async (option: MoodOption) => {
    setSelectedEmotion(option.emotion);
    
    // Get comment from backend
    try {
      await getEmotionComment(option.emotion);
    } catch (error) {
      // Fallback to local comment
      const fallbackComments = {
        joy: 'Tu rayonnes même sans caméra ✨',
        calm: 'Cette sérénité te va bien',
        surprise: 'Ooh, qu\'est-ce qui t\'étonne ?',
        neutral: 'Parfait pour réfléchir',
        sad: 'Prends soin de toi ❤️',
        anger: 'Canalise cette belle énergie',
      };
      setComment(fallbackComments[option.emotion as keyof typeof fallbackComments]);
    }
    
    // Send metrics
    sendMetrics(option.emotion, 1.0, 'fallback');
  };

  return (
    <div className={`no-cam-fallback ${className}`}>
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <Camera className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Smile className="h-5 w-5" />
            Pas de caméra ? Choisis ton humeur
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sélectionne comment tu te sens maintenant
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Mood selector grid */}
          <div 
            role="radiogroup" 
            aria-label="Sélection d'humeur"
            className="grid grid-cols-2 md:grid-cols-3 gap-3"
          >
            {moodOptions.map((option) => (
              <Button
                key={option.emotion}
                variant={selectedEmotion === option.emotion ? "default" : "outline"}
                className="h-auto p-4 flex-col gap-2"
                onClick={() => handleMoodSelect(option)}
                role="radio"
                aria-checked={selectedEmotion === option.emotion}
                aria-describedby={`mood-${option.emotion}-desc`}
              >
                <div className="text-2xl" aria-hidden="true">
                  {option.icon}
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">
                    {option.label}
                  </div>
                  <div 
                    id={`mood-${option.emotion}-desc`}
                    className="text-xs text-muted-foreground"
                  >
                    {option.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          {/* Emotion feedback */}
          {selectedEmotion && (
            <div className="mt-6">
              <EmotionBubble 
                emotion={selectedEmotion} 
                comment={comment}
              />
            </div>
          )}
          
          {/* Reset button */}
          {selectedEmotion && (
            <div className="text-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedEmotion(null);
                  setComment(null);
                }}
              >
                Choisir une autre humeur
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NoCamFallback;