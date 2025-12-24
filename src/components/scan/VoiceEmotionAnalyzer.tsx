// @ts-nocheck

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  EmotionResult,
  EmotionRecommendation,
  VoiceEmotionAnalyzerProps,
} from '@/types/emotion';

const VoiceEmotionAnalyzer: React.FC<VoiceEmotionAnalyzerProps> = ({ onResult, onStartRecording }) => {
  const [emotion, setEmotion] = useState("calm");
  const [confidence, setConfidence] = useState(0.75);
  const [intensity, setIntensity] = useState(0.6);
  const [showResults, setShowResults] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [recommendations, setRecommendations] = useState<EmotionRecommendation[]>([]);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: recsData } = await supabase
          .from('ai_recommendations')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .limit(5);

        if (recsData && recsData.length > 0) {
          const formattedRecs: EmotionRecommendation[] = recsData.map(r => ({
            id: r.id,
            emotion: r.emotion || 'calm',
            type: r.type || 'activity',
            title: r.title,
            description: r.description,
            content: r.content || '',
            category: r.category || 'wellness'
          }));
          setRecommendations(formattedRecs);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }

    // Fallback recommendations
    setRecommendations([
      {
        id: "rec-voice-1",
        emotion: "calm",
        type: "activity",
        title: "Exercice de respiration",
        description: "3 minutes de respiration profonde",
        content: "Inspirez lentement, retenez, expirez lentement",
        category: "wellness"
      },
      {
        id: "rec-voice-2",
        emotion: "relaxed",
        type: "music",
        title: "Playlist recommandée",
        description: "Musique relaxante pour vous aider à vous détendre",
        content: "Écouter notre playlist zen",
        category: "audio"
      }
    ]);
  };

  const handleCompleted = async () => {
    setProcessing(false);

    // Calculate valence and arousal based on emotion
    const valenceMap: Record<string, number> = { happy: 80, excited: 85, calm: 70, neutral: 50, anxious: 35, sad: 25, angry: 30 };
    const arousalMap: Record<string, number> = { excited: 85, angry: 80, anxious: 70, happy: 65, neutral: 50, calm: 30, sad: 25 };
    const valence = valenceMap[emotion] || 50;
    const arousal = arousalMap[emotion] || 50;

    // Save to Supabase
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.from('emotion_scans').insert({
          user_id: user.id,
          emotion: emotion,
          valence,
          arousal,
          confidence: Math.round(confidence * 100),
          source: 'voice',
          created_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving voice analysis:', error);
    }

    const result: EmotionResult = {
      id: `voice-${Date.now()}`,
      emotion: emotion,
      confidence: confidence,
      intensity: intensity,
      valence,
      arousal,
      recommendations: recommendations,
      timestamp: new Date().toISOString(),
      emojis: ["😌", "🧘‍♀️"],
      emotions: {},
      source: "voice"
    };

    setShowResults(true);

    if (onResult) {
      onResult(result);
    }
  };

  const handleStart = () => {
    setProcessing(true);
    setShowResults(false);
    if (onStartRecording) {
      onStartRecording();
    }
    setTimeout(() => {
      handleCompleted();
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analyse vocale</CardTitle>
        <CardDescription>Simulez une analyse vocale pour détecter les émotions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="emotion">Émotion détectée</Label>
          <Badge variant="secondary">{emotion}</Badge>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confidence">Confiance</Label>
          <Slider
            id="confidence"
            defaultValue={[confidence * 100]}
            max={100}
            step={1}
            onValueChange={(value) => setConfidence(value[0] / 100)}
            aria-label="Niveau de confiance"
          />
          <p className="text-sm text-muted-foreground">
            Niveau de confiance: {Math.round(confidence * 100)}%
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="intensity">Intensité</Label>
          <Slider
            id="intensity"
            defaultValue={[intensity * 100]}
            max={100}
            step={1}
            onValueChange={(value) => setIntensity(value[0] / 100)}
            aria-label="Intensité de l'émotion"
          />
          <p className="text-sm text-muted-foreground">
            Intensité de l'émotion: {Math.round(intensity * 100)}%
          </p>
        </div>
        
        <Button onClick={handleStart} disabled={processing}>
          {processing ? 'Analyse en cours...' : 'Simuler l\'analyse'}
        </Button>
        
        {showResults && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <h4 className="text-sm font-medium">Résultats simulés</h4>
            <p className="text-xs text-muted-foreground">
              Émotion: {emotion}, Confiance: {Math.round(confidence * 100)}%, Intensité: {Math.round(intensity * 100)}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceEmotionAnalyzer;
