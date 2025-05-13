
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, Square, AlertCircle } from 'lucide-react';
import { VoiceEmotionAnalyzerProps } from '@/types/emotion';

const VoiceEmotionAnalyzer: React.FC<VoiceEmotionAnalyzerProps> = ({ 
  onEmotionDetected,
  compact = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processAudioEmotion(audioBlob);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Impossible d\'accéder au microphone. Veuillez vérifier les permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioEmotion = async (audioBlob: Blob) => {
    try {
      // In a real app, you would send this audio to an API for analysis
      // For demo purposes, we'll simulate a response after a short delay
      
      setTimeout(() => {
        // Mock emotion detection result
        const mockResult = {
          emotion: 'calme',
          score: 85,
          confidence: 0.82,
          transcript: 'Je me sens plutôt détendu aujourd\'hui.'
        };
        
        onEmotionDetected(mockResult);
      }, 1500);
    } catch (err) {
      console.error('Error processing audio:', err);
      setError('Une erreur est survenue lors de l\'analyse vocale.');
    }
  };

  return (
    <Card className={compact ? 'border-0 shadow-none' : ''}>
      <CardContent className={compact ? 'p-2' : 'p-4'}>
        {!compact && (
          <h3 className="font-medium mb-3">Détection d'émotions par la voix</h3>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-center">
          {!isRecording ? (
            <Button 
              onClick={startRecording} 
              className="flex items-center gap-2"
              variant={compact ? "outline" : "default"}
            >
              <Mic className="h-4 w-4" />
              <span>Commencer l'enregistrement</span>
            </Button>
          ) : (
            <Button 
              onClick={stopRecording}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              <span>Arrêter</span>
            </Button>
          )}
        </div>
        
        {isRecording && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <div className="animate-pulse">Enregistrement en cours...</div>
            <p className="mt-1">Parlez de votre journée ou de comment vous vous sentez</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceEmotionAnalyzer;
