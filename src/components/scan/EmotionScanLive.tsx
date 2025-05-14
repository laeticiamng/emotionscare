
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeEmotion } from '@/lib/scanService';
import EmotionResultDisplay from './live/EmotionResult';
import { Slider } from "@/components/ui/slider"
import { Label } from '@/components/ui/label';
import { EmotionResult } from '@/types/types';

const EmotionScanLive = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [emojis, setEmojis] = useState<string[]>([]);
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleEmotionAnalysis = () => {
    if (!text && !audioUrl) {
      toast({
        title: "Avertissement",
        description: "Veuillez entrer du texte ou enregistrer votre voix.",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    // Convert string to array if needed
    const emojiArray = typeof emojis === 'string' ? emojis.split('') : emojis;

    analyzeEmotion(text, emojiArray, audioUrl)
      .then(data => {
        if (data.confidence && data.confidence >= confidenceThreshold) {
          setResult(data);
        } else {
          setResult({
            ...data,
            emotion: 'Non détectée',
            confidence: 0
          });
          toast({
            title: "Confiance faible",
            description: `La confiance de l'analyse est inférieure au seuil de ${confidenceThreshold * 100}%.`,
          });
        }
      })
      .catch(error => {
        console.error('Error analyzing emotion:', error);
        toast({
          title: "Erreur d'analyse",
          description: "Impossible d'analyser votre émotion.",
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Fonction pour démarrer l'enregistrement
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Erreur d'enregistrement",
        description: "Impossible de démarrer l'enregistrement. Veuillez vérifier les permissions du microphone.",
        variant: "destructive"
      });
    }
  };

  // Fonction pour arrêter l'enregistrement
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analyse en direct</CardTitle>
        <CardDescription>
          Exprimez-vous et voyez votre émotion en temps réel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text">Votre texte</Label>
          <textarea
            id="text"
            className="w-full border rounded-md p-2"
            placeholder="Je me sens..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Enregistrement vocal</Label>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
            >
              {isRecording ? (
                <>
                  <StopCircle className="h-4 w-4 mr-2" />
                  Arrêter
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
            {audioUrl && (
              <audio src={audioUrl} controls className="w-64" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confidence">Seuil de confiance ({confidenceThreshold * 100}%)</Label>
          <Slider
            id="confidence"
            defaultValue={[confidenceThreshold * 100]}
            max={100}
            step={5}
            onValueChange={(value) => setConfidenceThreshold(value[0] / 100)}
          />
        </div>

        <Button onClick={handleEmotionAnalysis} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            "Analyser"
          )}
        </Button>

        {result && (
          <div className="mt-4">
            <EmotionResultDisplay
              emotion={result.emotion}
              confidence={result.confidence || 0}
              transcript={result.transcript || ''}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionScanLive;
