import React, { useState } from 'react';
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
  const [emotion, _setEmotion] = useState("calm");
  const [confidence, setConfidence] = useState(0.75);
  const [intensity, setIntensity] = useState(0.6);
  const [showResults, setShowResults] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const mockRecommendations: EmotionRecommendation[] = [
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
  ];

  // Update the handleCompleted function to include the required source field
  const handleCompleted = () => {
    setProcessing(false);
    // Create mock emotion result
    const result: EmotionResult = {
      id: `voice-${Date.now()}`,
      emotion: emotion,
      confidence: confidence,
      intensity: intensity,
      recommendations: mockRecommendations,
      timestamp: new Date().toISOString(),
      emojis: ["😌", "🧘‍♀️"],
      emotions: {},
      source: "voice-analyzer" // Added required source field
    };
    
    setShowResults(true);
    
    // Pass result to parent component
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
