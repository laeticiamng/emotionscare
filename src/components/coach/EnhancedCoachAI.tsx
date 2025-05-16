
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { analyzeEmotion } from '@/lib/scanService';
import { EmotionResult } from '@/types/emotion';

const EnhancedCoachAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<EmotionResult | null>(null);
  const [userText, setUserText] = useState('');
  const [userEmojis, setUserEmojis] = useState<string[]>([]);

  useEffect(() => {
    // Load initial data or perform other operations when component mounts
  }, []);

  const handleTextChange = (text: string) => {
    setUserText(text);
  };

  const handleEmojiSelect = (emoji: string) => {
    setUserEmojis(prevEmojis => [...prevEmojis, emoji]);
  };

  const handleClearEmojis = () => {
    setUserEmojis([]);
  };

  // Correct handling of emojis to ensure they're always an array
  const ensureArrayEmojis = (emojis: string | string[] | undefined): string[] => {
    if (Array.isArray(emojis)) {
      return emojis;
    }
    if (typeof emojis === 'string') {
      return [emojis];
    }
    return [];
  };

  // Update the function where the error appears
  const handleEmotionDetected = (result: EmotionResult) => {
    if (result) {
      setAnalysisResult(result);
    }
    setIsLoading(false);
    
    // Correct the error with emojis by ensuring they're a valid array
    const safeEmojis = ensureArrayEmojis(result.emojis);
    
    // Use safeEmojis instead of result.emojis
    console.log('Emotion detected:', result.emotion, 'with emojis:', safeEmojis);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const result = await analyzeEmotion(userText);
      if (result) {
        setAnalysisResult(result);
        handleEmotionDetected(result);
      }
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Votre Coach Émotionnel</CardTitle>
        <CardDescription>Recevez des conseils personnalisés basés sur votre état émotionnel.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/images/avatars/coach-ai.png" alt="Coach AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">Coach AI</h3>
            <p className="text-sm text-muted-foreground">Votre assistant émotionnel personnel</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-md font-medium">Comment vous sentez-vous aujourd'hui ?</h4>
          <p className="text-sm text-muted-foreground">Décrivez vos émotions ou utilisez le scanner pour une analyse plus approfondie.</p>
        </div>

        {analysisResult && (
          <div className="rounded-md border p-4">
            <h4 className="text-md font-medium">Analyse émotionnelle :</h4>
            <p className="text-sm text-muted-foreground">
              Émotion détectée : <Badge variant="secondary">{analysisResult.emotion}</Badge>
            </p>
            <p className="text-sm text-muted-foreground">
              Confiance : {Math.round((analysisResult.confidence || 0.5) * 100)}%
            </p>
            {analysisResult.feedback && (
              <div className="mt-2">
                <h5 className="text-sm font-medium">Feedback de l'IA :</h5>
                <p className="text-xs text-muted-foreground">{analysisResult.feedback}</p>
              </div>
            )}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <div className="mt-2">
                <h5 className="text-sm font-medium">Recommandations :</h5>
                <ScrollArea className="h-20">
                  <ul className="list-disc list-inside text-xs text-muted-foreground">
                    {analysisResult.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedCoachAI;
