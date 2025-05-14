
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { processEmotionForBadges } from '@/lib/gamificationService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface EmotionScanFormProps {
  onComplete?: (result: EmotionResult) => void;
  userId?: string;
  onScanSaved?: () => void;
  onClose?: () => void;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ 
  onComplete,
  userId,
  onScanSaved,
  onClose
}) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Predefined emotion options
  const emotionOptions = [
    { emotion: 'joy', label: 'Joie', emoji: '😊' },
    { emotion: 'sadness', label: 'Tristesse', emoji: '😢' },
    { emotion: 'anger', label: 'Colère', emoji: '😠' },
    { emotion: 'fear', label: 'Peur', emoji: '😨' },
    { emotion: 'disgust', label: 'Dégoût', emoji: '🤢' },
    { emotion: 'surprise', label: 'Surprise', emoji: '😲' },
    { emotion: 'neutral', label: 'Neutre', emoji: '😐' }
  ];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleEmotionSelect = async (emotion: string) => {
    const effectiveUserId = userId || user?.id;
    if (!effectiveUserId) return;
    
    setLoading(true);
    try {
      // Create emotion result
      const result: EmotionResult = {
        id: `emotion-${Date.now()}`,
        emotion,
        score: Math.random() * 0.5 + 0.5, // Random score between 0.5 and 1.0
        date: new Date().toISOString(),
        text,
        user_id: effectiveUserId
      };

      // Process for badges if user is authenticated
      const badgeResult = await processEmotionForBadges(effectiveUserId, result);
      
      if (badgeResult && badgeResult.newBadges && badgeResult.newBadges.length > 0) {
        // Show toast for earned badges
        badgeResult.newBadges.forEach(badge => {
          toast({
            title: `Badge débloqué: ${badge.name}`,
            description: badge.description,
            variant: 'default',
          });
        });
      }
      
      // Complete the scan process
      if (onComplete) onComplete(result);
      if (onScanSaved) onScanSaved();
      
    } catch (error) {
      console.error('Error processing emotion scan:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors du scan émotionnel',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comment vous sentez-vous?</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Décrivez votre état émotionnel actuel..."
            className="mb-4"
            value={text}
            onChange={handleTextChange}
            rows={4}
          />
          
          {text.length > 0 && (
            <Button
              onClick={() => handleEmotionSelect('auto')}
              disabled={loading}
              className="mb-4 w-full"
            >
              {loading ? 'Analyse en cours...' : 'Analyser mon texte'}
            </Button>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Ou sélectionnez une émotion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {emotionOptions.map((option) => (
              <Button
                key={option.emotion}
                variant="outline"
                onClick={() => handleEmotionSelect(option.emotion)}
                disabled={loading}
                className="h-auto py-3 flex flex-col items-center"
              >
                <span className="text-2xl mb-1">{option.emoji}</span>
                <span>{option.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionScanForm;
