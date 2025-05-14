
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';

interface AudioProcessorProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  showTitle?: boolean;
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({ 
  onEmotionDetected,
  showTitle = true
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  
  // Simulate start recording
  const startRecording = useCallback(() => {
    setIsRecording(true);
    setAudioUrl(null);
    setTranscript(null);
    
    // Simulate recording for 5 seconds
    setTimeout(() => {
      stopRecording();
    }, 5000);
  }, []);
  
  // Simulate stop recording
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Simulate creating audio URL
    setTimeout(() => {
      setAudioUrl('data:audio/wav;base64,MOCK_AUDIO_DATA');
      setTranscript("Aujourd'hui, je me sens vraiment bien et plein d'énergie.");
      setIsProcessing(false);
    }, 1500);
  }, []);
  
  // Simulate audio playback
  const togglePlay = useCallback(() => {
    if (!audioUrl) return;
    
    setIsPlaying(prev => !prev);
    
    // If we're starting playback, simulate it finishing after 5 seconds
    if (!isPlaying) {
      setTimeout(() => {
        setIsPlaying(false);
      }, 5000);
    }
  }, [audioUrl, isPlaying]);
  
  // Analyze the audio
  const analyzeAudio = useCallback(() => {
    if (!audioUrl || !transcript) return;
    
    setIsProcessing(true);
    
    // Simulate analysis
    setTimeout(() => {
      // Generate a result
      const result: EmotionResult = {
        emotion: "happy",
        dominantEmotion: "happy",
        source: 'voice',
        text: transcript,
        score: 85,
        confidence: 0.85,
        timestamp: new Date().toISOString(),
        feedback: "Vous semblez être dans un état positif et énergique. C'est un excellent moment pour des activités créatives ou des tâches qui demandent de l'enthousiasme.",
        recommendations: [
          "Profitez de cette énergie positive pour avancer sur vos projets créatifs",
          "Partagez votre bonne humeur avec votre équipe",
          "Notez ce qui vous a mis dans cet état pour reproduire ces conditions à l'avenir"
        ]
      };
      
      // Call the callback
      if (onEmotionDetected) {
        onEmotionDetected(result);
      }
      
      setIsProcessing(false);
    }, 2000);
  }, [audioUrl, transcript, onEmotionDetected]);
  
  return (
    <Card className="w-full">
      {showTitle && (
        <CardHeader>
          <CardTitle>Analyse vocale</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-6 pt-4">
        <div className="flex justify-center">
          <Button
            className="h-16 w-16 rounded-full"
            variant={isRecording ? "destructive" : "default"}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing || isPlaying}
          >
            {isRecording ? (
              <Square className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
        </div>
        
        <div className="text-center text-sm">
          {isRecording ? (
            <p className="text-primary animate-pulse">Enregistrement en cours...</p>
          ) : isProcessing ? (
            <p>Traitement en cours...</p>
          ) : audioUrl ? (
            <p>Enregistrement prêt pour analyse</p>
          ) : (
            <p>Cliquez sur le microphone pour commencer à parler</p>
          )}
        </div>
        
        {transcript && (
          <div className="bg-muted p-3 rounded-md">
            <h3 className="text-sm font-medium mb-1">Transcription :</h3>
            <p className="text-sm text-muted-foreground">{transcript}</p>
            
            <div className="flex justify-between mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
                className="text-xs flex items-center gap-1"
                disabled={isProcessing}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3 w-3" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3" /> Écouter
                  </>
                )}
              </Button>
              
              <Button
                size="sm"
                onClick={analyzeAudio}
                className="text-xs"
                disabled={isProcessing || isPlaying}
              >
                Analyser
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioProcessor;
