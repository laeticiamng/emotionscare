
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { analyzeEmotion, saveEmotion } from '@/lib/scanService';
import { Emotion, EmotionResult } from '@/types';
import EmotionScanner from './EmotionScanner';
import EnhancedCoachAI from '../coach/EnhancedCoachAI';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmotionScanLiveProps {
  userId: string;
  isConfidential?: boolean;
  onScanComplete?: () => void;
  onResultSaved?: () => Promise<void>;
}

const EmotionScanLive: React.FC<EmotionScanLiveProps> = ({
  userId,
  isConfidential = false,
  onScanComplete = () => {},
  onResultSaved = async () => {}
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [emojis, setEmojis] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const resetScan = () => {
    setText('');
    setEmojis('');
    setAudioUrl(null);
    setEmotionResult(null);
    setError(null);
  };

  const handleRequestNewScan = () => {
    resetScan();
  };
  
  const handleAnalyze = async () => {
    if (!text && !emojis && !audioUrl) {
      toast({
        title: "Données insuffisantes",
        description: "Veuillez fournir du texte, des emojis ou un enregistrement audio pour l'analyse.",
        variant: "destructive"
      });
      return;
    }
    
    if (!userId) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour analyser vos émotions.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Analyser l'émotion
      const result = await analyzeEmotion({
        user_id: userId,
        text,
        emojis,
        audio_url: audioUrl || undefined,
        is_confidential: isConfidential,
        share_with_coach: true
      });
      
      setEmotionResult(result);
      
      if (result) {
        // Sauvegarder l'émotion
        await saveEmotion({
          user_id: userId,
          date: new Date().toISOString(),
          emotion: result.emotion,
          score: result.score,
          text: text || result.text || undefined,
          emojis: emojis || result.emojis || undefined,
          audio_url: audioUrl || undefined,
          ai_feedback: result.feedback || result.ai_feedback
        });
        
        toast({
          title: "Analyse complétée",
          description: `Votre émotion dominante : ${result.emotion}`,
        });
        
        if (onResultSaved) {
          await onResultSaved();
        }
      }
      
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue s'est produite";
      
      setError(errorMessage);
      
      toast({
        title: "Erreur d'analyse",
        description: "Une erreur s'est produite lors de l'analyse. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Card className="overflow-hidden shadow-md">
      <CardHeader>
        <CardTitle>{emotionResult ? "Résultat de l'analyse" : "Scanner mon émotion actuelle"}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
            <p className="text-muted-foreground">Analyse de votre état émotionnel en cours...</p>
          </div>
        )}
        
        {!isAnalyzing && !emotionResult && (
          <EmotionScanner
            text={text}
            emojis={emojis}
            audioUrl={audioUrl}
            onTextChange={setText}
            onEmojiChange={setEmojis}
            onAudioChange={setAudioUrl}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        )}
        
        {!isAnalyzing && emotionResult && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">
                  {emotionResult.emojis || (emotionResult.emotion === 'joy' ? '😊' : 
                  emotionResult.emotion === 'sadness' ? '😔' : 
                  emotionResult.emotion === 'anger' ? '😡' : 
                  emotionResult.emotion === 'fear' ? '😨' : 
                  emotionResult.emotion === 'calm' ? '😌' : '😐')}
                </div>
                <div>
                  <h3 className="text-xl font-semibold capitalize">{emotionResult.emotion}</h3>
                  <p className="text-muted-foreground">
                    Intensité: {emotionResult.score}/10
                  </p>
                </div>
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  onScanComplete && onScanComplete();
                  resetScan();
                }}
              >
                Terminer
              </Button>
            </div>
            
            <EnhancedCoachAI 
              emotionResult={emotionResult}
              onRequestNewScan={handleRequestNewScan}
            />
            
            {text && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-1">Votre texte analysé:</p>
                <p className="text-sm italic text-muted-foreground">"{text}"</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionScanLive;
