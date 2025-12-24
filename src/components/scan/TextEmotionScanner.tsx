// @ts-nocheck

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult, EmotionScannerProps } from '@/types/emotion';
import { FileText, Send } from 'lucide-react';

const TextEmotionScanner: React.FC<EmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [text, setText] = useState('');

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsProcessing(true);

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();

      // Analyze text sentiment using keyword-based analysis
      const textLower = text.toLowerCase();

      // Emotion keywords mapping
      const emotionKeywords = {
        happy: ['heureux', 'content', 'joyeux', 'bien', 'super', 'génial', 'formidable', 'ravi'],
        sad: ['triste', 'malheureux', 'déprimé', 'mal', 'difficile', 'peine', 'pleure'],
        anxious: ['anxieux', 'stressé', 'inquiet', 'nerveux', 'peur', 'angoisse', 'tendu'],
        calm: ['calme', 'serein', 'paisible', 'tranquille', 'détendu', 'relax'],
        angry: ['colère', 'énervé', 'frustré', 'agacé', 'furieux', 'irrité'],
        excited: ['excité', 'enthousiaste', 'motivé', 'impatient', 'exalté']
      };

      let detectedEmotions: { name: string; intensity: number }[] = [];
      let maxEmotion = 'neutral';
      let maxScore = 0;

      Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
        const matches = keywords.filter(kw => textLower.includes(kw)).length;
        if (matches > 0) {
          const intensity = Math.min(100, 50 + matches * 15);
          detectedEmotions.push({ name: emotion, intensity });
          if (matches > maxScore) {
            maxScore = matches;
            maxEmotion = emotion;
          }
        }
      });

      // Default emotion if none detected
      if (detectedEmotions.length === 0) {
        detectedEmotions = [
          { name: 'Neutral', intensity: 60 }
        ];
        maxEmotion = 'neutral';
      }

      // Calculate valence and arousal
      const valenceMap: Record<string, number> = { happy: 80, excited: 85, calm: 70, neutral: 50, anxious: 35, sad: 25, angry: 30 };
      const arousalMap: Record<string, number> = { excited: 85, angry: 80, anxious: 70, happy: 65, neutral: 50, calm: 30, sad: 25 };

      const valence = valenceMap[maxEmotion] || 50;
      const arousal = arousalMap[maxEmotion] || 50;

      // Save scan to Supabase if user is authenticated
      if (user) {
        await supabase.from('emotion_scans').insert({
          user_id: user.id,
          emotion: maxEmotion,
          valence,
          arousal,
          source: 'text',
          notes: text.substring(0, 500),
          created_at: new Date().toISOString()
        });
      }

      const result: EmotionResult = {
        emotions: detectedEmotions,
        emotion: maxEmotion,
        confidence: Math.min(95, 70 + maxScore * 5),
        valence,
        arousal,
        timestamp: new Date(),
        recommendations: generateRecommendation(maxEmotion),
        analysisType: 'text',
        source: 'text'
      };

      onScanComplete(result);
    } catch (error) {
      console.error('Error analyzing text:', error);
      // Fallback result
      const fallbackResult: EmotionResult = {
        emotions: [{ name: 'Neutral', intensity: 60 }],
        confidence: 70,
        timestamp: new Date(),
        recommendations: 'Continuez à exprimer vos émotions régulièrement.',
        analysisType: 'text'
      };
      onScanComplete(fallbackResult);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateRecommendation = (emotion: string): string => {
    const recommendations: Record<string, string> = {
      happy: 'Votre état émotionnel est très positif ! Profitez de ce moment et partagez cette joie.',
      sad: 'Prenez soin de vous. Une promenade ou parler à un proche peut vous aider.',
      anxious: 'Essayez des exercices de respiration profonde pour vous apaiser.',
      calm: 'Votre sérénité est précieuse. Continuez vos bonnes pratiques.',
      angry: 'Accordez-vous un moment pour vous calmer. La méditation peut aider.',
      excited: 'Canalisez cette énergie positive dans une activité créative !',
      neutral: 'État équilibré détecté. Continuez à surveiller vos émotions.'
    };
    return recommendations[emotion] || 'Continuez à prendre soin de votre bien-être émotionnel.';
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Analyse textuelle</h3>
        <p className="text-muted-foreground">
          Décrivez comment vous vous sentez en ce moment
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrivez librement sur vos émotions, votre humeur, ce que vous ressentez..."
          className="min-h-[150px]"
          disabled={isProcessing}
        />

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
            onClick={analyzeText}
            disabled={!text.trim() || isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Analyser
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextEmotionScanner;
